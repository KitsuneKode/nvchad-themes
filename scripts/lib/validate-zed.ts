import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ZedThemeDefinition } from "../../src/types.ts";
import { themeCatalog } from "../../src/index.ts";

export const ZED_THEME_SCHEMA = "https://zed.dev/schema/themes/v0.2.0.json";
export const ZED_EXTENSION_BUNDLE = "nvchad-themes.json";
export const ZED_USER_THEMES_DIR = resolve(process.env.HOME ?? "", ".config", "zed", "themes");

export type ZedValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  bundle?: ZedThemeDefinition;
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
