#!/usr/bin/env bun
/**
 * Compare built NvChad Zed themes against .reference/zed/ upstream ports.
 * Usage: bun run scripts/audit-zed-references.ts [themeId]
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildZedTheme, getThemeById } from "../src/index.ts";
import { relativeLuminance } from "../src/utils.ts";

const REF_MAP: Record<string, { file: string; variant: string }> = {
  tokyonight: { file: "tokyo-night.json", variant: "Tokyo Night" },
  kanagawa: { file: "kanagawa.json", variant: "Kanagawa Wave" }
};

const POLISH_KEYS = [
  "editor.line_number",
  "editor.indent_guide",
  "editor.indent_guide_active",
  "panel.indent_guide",
  "panel.indent_guide_active",
  "panel.indent_guide_hover",
  "editor.wrap_guide",
  "editor.invisible",
  "element.hover",
  "element.selected",
  "scrollbar.thumb.background",
  "scrollbar.thumb.hover_background",
  "border",
  "border.variant",
  "pane.focused_border",
  "panel.focused_border"
] as const;

const main = (): void => {
  const targetId = process.argv[2];
  const ids = targetId ? [targetId] : Object.keys(REF_MAP);

  for (const id of ids) {
    const mapping = REF_MAP[id];
    if (!mapping) {
      console.error(`No reference mapping for ${id}`);
      continue;
    }

    const refPath = resolve(".reference", "zed", mapping.file);
    if (!existsSync(refPath)) {
      console.warn(`Missing ${refPath} — run: bun run scripts/sync-zed-references.ts`);
      continue;
    }

    const theme = getThemeById(id);
    if (!theme) {
      console.error(`Unknown theme: ${id}`);
      continue;
    }

    const bundle = JSON.parse(readFileSync(refPath, "utf8")) as {
      themes: Array<{ name: string; style: Record<string, string | null> }>;
    };
    const refTheme = bundle.themes.find((t) => t.name === mapping.variant);
    if (!refTheme) {
      console.error(`Variant ${mapping.variant} not in ${refPath}`);
      continue;
    }

    const built = buildZedTheme(theme).themes[0]!.style as Record<string, string | null>;
    const ref = refTheme.style;

    console.log(`\n=== ${id} vs ${mapping.file} ===`);

    let mismatches = 0;
    for (const key of POLISH_KEYS) {
      const builtVal = built[key];
      const refVal = ref[key];
      if (builtVal === refVal) {
        continue;
      }
      if (refVal === null && builtVal !== null && builtVal !== undefined) {
        console.log(`  + ${key}: we set ${builtVal} (ref null)`);
        continue;
      }
      if (refVal !== null && refVal !== undefined) {
        console.log(`  ≠ ${key}: built ${builtVal ?? "(null)"}  ref ${refVal}`);
        mismatches++;
      }
    }

    const inactive = built["panel.indent_guide"];
    const active = built["panel.indent_guide_active"];
    if (typeof inactive === "string" && typeof active === "string") {
      const step = relativeLuminance(active) - relativeLuminance(inactive);
      console.log(`  panel indent active step: ${step.toFixed(4)} (Tokyo ref ~0.074)`);
    }

    console.log(mismatches === 0 ? "  Key polish tokens aligned." : `  ${mismatches} value mismatch(es).`);
  }
};

main();
