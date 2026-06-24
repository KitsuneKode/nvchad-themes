import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ZedThemeDefinition } from "../../src/types.ts";
import { themeCatalog } from "../../src/index.ts";
import { relativeLuminance } from "../../src/surfaces.ts";

export const alphaFromHex = (hex: string): number => {
  if (hex.length !== 9) {
    return 1;
  }
  return parseInt(hex.slice(7, 9), 16) / 255;
};

export const ZED_THEME_SCHEMA = "https://zed.dev/schema/themes/v0.2.0.json";
export const ZED_EXTENSION_BUNDLE = "nvchad-themes.json";
export const ZED_USER_THEMES_DIR = resolve(process.env.HOME ?? "", ".config", "zed", "themes");

export type ZedValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  bundle?: ZedThemeDefinition;
};

const parseAlpha = alphaFromHex;

const HEX6 = /^#[0-9a-fA-F]{6}$/;
const VALID_FONT_STYLES = new Set<string | null>([
  null,
  "italic",
  "bold",
  "underline",
  "strikethrough"
]);

export const validateSyntaxColors = (themeName: string, syntax: unknown): string[] => {
  const errors: string[] = [];

  if (!syntax || typeof syntax !== "object") {
    errors.push(`Theme "${themeName}" is missing style.syntax`);
    return errors;
  }

  for (const [key, rule] of Object.entries(syntax as Record<string, unknown>)) {
    if (!rule || typeof rule !== "object") {
      continue;
    }

    const entry = rule as { color?: unknown; font_style?: unknown };
    const color = entry.color;

    if (typeof color !== "string") {
      errors.push(`Theme "${themeName}" syntax.${key}.color must be a string`);
      continue;
    }

    if (color.includes("M.")) {
      errors.push(`Theme "${themeName}" syntax.${key}.color contains unresolved palette ref: ${color}`);
    }

    if (!HEX6.test(color)) {
      errors.push(`Theme "${themeName}" syntax.${key}.color must be #rrggbb (got ${color})`);
    }

    if ("font_style" in entry && entry.font_style !== undefined) {
      const fontStyle = entry.font_style;
      if (fontStyle !== null && typeof fontStyle === "string" && !VALID_FONT_STYLES.has(fontStyle)) {
        errors.push(
          `Theme "${themeName}" syntax.${key}.font_style must be null, italic, bold, underline, or strikethrough`
        );
      }
    }
  }

  return errors;
};

const validateThemeStyle = (themeName: string, appearance: string, style: Record<string, unknown>): string[] => {
  const errors: string[] = [];

  const background = style.background;
  const surface = style["surface.background"];
  const editor = style["editor.background"];
  const tabActive = style["tab.active_background"];
  const tabInactive = style["tab.inactive_background"];
  const selected = style["element.selected"];

  if (typeof background === "string" && typeof surface === "string" && typeof editor === "string") {
    const lumBg = relativeLuminance(background);
    const lumSurface = relativeLuminance(surface);
    const lumEditor = relativeLuminance(editor);

    if (background !== editor) {
      errors.push(`Theme "${themeName}" background must equal editor.background`);
    }

    if (appearance === "dark") {
      if (lumSurface >= lumBg - 0.0002) {
        errors.push(
          `Theme "${themeName}" dark hierarchy: surface.background should be darker than background (editor well)`
        );
      }
    } else if (appearance === "light") {
      if (lumSurface >= lumBg - 0.0002) {
        errors.push(
          `Theme "${themeName}" light hierarchy: surface.background should be darker than background (editor well)`
        );
      }
    }
  }

  if (typeof tabInactive === "string" && typeof surface === "string" && tabInactive !== surface) {
    errors.push(`Theme "${themeName}" tab.inactive_background should equal surface.background`);
  }

  if (typeof tabActive === "string" && typeof background === "string") {
    const lumTab = relativeLuminance(tabActive);
    const lumBg = relativeLuminance(background);
    if (appearance === "dark" && lumTab <= lumBg + 0.008) {
      errors.push(`Theme "${themeName}" tab.active_background should be lighter than editor background`);
    }
    if (appearance === "light" && lumTab >= lumBg - 0.008) {
      errors.push(`Theme "${themeName}" tab.active_background should be darker than editor background`);
    }
  }

  if (typeof selected === "string" && selected.length === 9) {
    errors.push(`Theme "${themeName}" element.selected should be a solid color (no alpha)`);
  }

  const indentGuide = style["editor.indent_guide"];
  const panelIndent = style["panel.indent_guide"];
  for (const [key, value] of [
    ["editor.indent_guide", indentGuide],
    ["panel.indent_guide", panelIndent]
  ] as const) {
    if (typeof value === "string" && value.length === 9) {
      errors.push(`Theme "${themeName}" ${key} must be a solid color (no alpha on separator lines)`);
    }
  }

  errors.push(...validateSyntaxColors(themeName, style.syntax));

  return errors;
};

export const parseZedThemeFamily = (filePath: string): ZedThemeDefinition => {
  return JSON.parse(readFileSync(filePath, "utf8")) as ZedThemeDefinition;
};

export const validateZedThemeFamily = (
  bundle: ZedThemeDefinition,
  options: { expectedVariants?: number; checkCatalog?: boolean } = {}
): ZedValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (bundle.$schema && bundle.$schema !== ZED_THEME_SCHEMA) {
    warnings.push(`Unexpected $schema: ${bundle.$schema}`);
  }

  if (!bundle.name?.trim()) {
    errors.push("Theme family is missing `name`");
  }

  if (!bundle.author?.trim()) {
    errors.push("Theme family is missing `author`");
  }

  if (!Array.isArray(bundle.themes) || bundle.themes.length === 0) {
    errors.push("Theme family must include at least one theme in `themes`");
    return { ok: false, errors, warnings, bundle };
  }

  const expectedVariants = options.expectedVariants ?? themeCatalog.length;
  if (bundle.themes.length !== expectedVariants) {
    errors.push(`Expected ${expectedVariants} theme variants, found ${bundle.themes.length}`);
  }

  const names = new Set<string>();
  for (const theme of bundle.themes) {
    if (!theme.name?.trim()) {
      errors.push("A theme variant is missing `name`");
      continue;
    }

    if (names.has(theme.name)) {
      errors.push(`Duplicate theme variant name: ${theme.name}`);
    }
    names.add(theme.name);

    if (theme.appearance !== "light" && theme.appearance !== "dark") {
      errors.push(`Theme "${theme.name}" has invalid appearance: ${String(theme.appearance)}`);
    }

    if (!theme.style || typeof theme.style !== "object") {
      errors.push(`Theme "${theme.name}" is missing \`style\``);
      continue;
    }

    const requiredStyleKeys = ["background", "text", "border", "editor.background", "editor.foreground"];
    for (const key of requiredStyleKeys) {
      if (!(key in theme.style)) {
        errors.push(`Theme "${theme.name}" is missing style.${key}`);
      }
    }

    if (!theme.style.syntax || typeof theme.style.syntax !== "object") {
      errors.push(`Theme "${theme.name}" is missing style.syntax`);
    }

    errors.push(...validateThemeStyle(theme.name, theme.appearance, theme.style as Record<string, unknown>));
  }

  if (options.checkCatalog ?? true) {
    for (const theme of themeCatalog) {
      if (!names.has(theme.displayName)) {
        errors.push(`Missing expected theme variant: ${theme.displayName}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    bundle
  };
};

export const validateZedExtensionDir = (extensionDir: string): ZedValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const extensionToml = resolve(extensionDir, "extension.toml");
  const licensePath = resolve(extensionDir, "LICENSE");
  const bundlePath = resolve(extensionDir, "themes", ZED_EXTENSION_BUNDLE);

  if (!existsSync(extensionToml)) {
    errors.push(`Missing extension.toml at ${extensionToml}`);
  } else {
    const manifest = readFileSync(extensionToml, "utf8");
    if (!manifest.includes('id = "nvchad-themes"')) {
      errors.push('extension.toml must set id = "nvchad-themes"');
    }
    if (!manifest.includes("schema_version = 1")) {
      warnings.push("extension.toml should set schema_version = 1");
    }
  }

  if (!existsSync(licensePath)) {
    errors.push(`Missing LICENSE at ${licensePath}`);
  }

  if (!existsSync(bundlePath)) {
    errors.push(`Missing bundled theme at ${bundlePath}`);
    return { ok: false, errors, warnings };
  }

  const bundle = parseZedThemeFamily(bundlePath);
  const bundleResult = validateZedThemeFamily(bundle);
  errors.push(...bundleResult.errors);
  warnings.push(...bundleResult.warnings);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    bundle
  };
};

export const printZedValidationResult = (
  label: string,
  result: ZedValidationResult
): void => {
  if (result.warnings.length > 0) {
    console.warn(`${label} warnings:`);
    for (const warning of result.warnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (!result.ok) {
    console.error(`${label} failed:`);
    for (const error of result.errors) {
      console.error(`  - ${error}`);
    }
    return;
  }

  const variantCount = result.bundle?.themes.length ?? 0;
  console.log(`${label} passed (${variantCount} theme variants)`);
};
