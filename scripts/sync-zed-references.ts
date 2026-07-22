#!/usr/bin/env bun
/**
 * Download upstream Zed reference themes into .reference/zed/ (gitignored).
 * Curated extracts are written to src/references/official/ for CI.
 *
 * Usage: bun run scripts/sync-zed-references.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const REFERENCE_SOURCES = [
  {
    id: "tokyo-night",
    url: "https://raw.githubusercontent.com/ssaunderss/zed-tokyo-night/main/themes/tokyo-night.json",
    officialVariant: "Tokyo Night",
    themeId: "tokyonight"
  },
  {
    id: "kanagawa",
    url: "https://raw.githubusercontent.com/ethangilmore/zed-kanagawa/main/themes/Kanagawa.json",
    officialVariant: "Kanagawa Wave",
    themeId: "kanagawa"
  }
] as const;

const POLISH_KEYS = [
  "background",
  "surface.background",
  "editor.background",
  "panel.background",
  "tab.active_background",
  "tab.inactive_background",
  "title_bar.background",
  "status_bar.background",
  "text",
  "text.muted",
  "editor.foreground",
  "editor.line_number",
  "editor.active_line_number",
  "editor.indent_guide",
  "editor.indent_guide_active",
  "editor.wrap_guide",
  "editor.invisible",
  "panel.indent_guide",
  "panel.indent_guide_active",
  "panel.indent_guide_hover",
  "element.hover",
  "element.selected",
  "border",
  "border.variant",
  "border.focused",
  "scrollbar.thumb.background",
  "scrollbar.thumb.hover_background",
  "pane.focused_border",
  "panel.focused_border",
  "ghost_element.background"
] as const;

const extractSyntax = (style: Record<string, unknown>): Record<string, string> | undefined => {
  const syntax = style.syntax;
  if (!syntax || typeof syntax !== "object") {
    return undefined;
  }
  const extract: Record<string, string> = {};
  for (const [key, rule] of Object.entries(syntax as Record<string, unknown>)) {
    if (!rule || typeof rule !== "object") {
      continue;
    }
    const color = (rule as { color?: unknown }).color;
    if (typeof color === "string") {
      extract[key] = color;
    }
  }
  return Object.keys(extract).length > 0 ? extract : undefined;
};

const extractOfficial = (
  bundle: { themes: Array<{ name: string; style: Record<string, unknown> }> },
  variantName: string,
  themeId: string,
  source: string
): Record<string, unknown> => {
  const theme = bundle.themes.find((t) => t.name === variantName);
  if (!theme) {
    throw new Error(`Variant "${variantName}" not found in ${source}`);
  }
  const style = theme.style;
  const extract: Record<string, string | null> = {};
  for (const key of POLISH_KEYS) {
    const value = style[key];
    extract[key] = typeof value === "string" || value === null ? value : undefined;
  }
  return {
    $source: source,
    $variant: variantName,
    $themeId: themeId,
    style: extract,
    ...(extractSyntax(style) ? { syntax: extractSyntax(style) } : {})
  };
};

const main = async (): Promise<void> => {
  const refDir = resolve(".reference", "zed");
  const officialDir = resolve("src", "references", "official");
  mkdirSync(refDir, { recursive: true });
  mkdirSync(officialDir, { recursive: true });

  for (const source of REFERENCE_SOURCES) {
    console.log(`Fetching ${source.id}…`);
    const response = await fetch(source.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${source.url}: ${response.status}`);
    }
    const raw = await response.text();
    const bundle = JSON.parse(raw) as { themes: Array<{ name: string; style: Record<string, unknown> }> };

    writeFileSync(resolve(refDir, `${source.id}.json`), `${JSON.stringify(bundle, null, 2)}\n`);
    console.log(`  Wrote .reference/zed/${source.id}.json`);

    const official = extractOfficial(bundle, source.officialVariant, source.themeId, source.url);
    writeFileSync(resolve(officialDir, `${source.themeId}.json`), `${JSON.stringify(official, null, 2)}\n`);
    console.log(`  Wrote src/references/official/${source.themeId}.json`);
  }

  console.log("Done. Run `bun run scripts/audit-zed-references.ts` to compare built themes.");
};

await main();
