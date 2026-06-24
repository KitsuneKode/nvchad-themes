import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { README_HERO_THEME_IDS } from "../src/references/hero-themes.ts";
import { findEditorScreenshot } from "./lib/editor-screenshot-paths.ts";

const MIN_PNG_BYTES = 5_000;
const heroIds = [...README_HERO_THEME_IDS];

const failures: string[] = [];

for (const id of heroIds) {
  const manualPath = findEditorScreenshot("cursor", id);
  const fallbackPath = resolve("assets", "previews", `${id}.png`);
  const pngPath = manualPath ?? fallbackPath;
  const source = manualPath ? "cursor screenshot" : "generated syntax preview";

  if (!existsSync(pngPath)) {
    failures.push(
      `Missing preview for ${id}: add assets/screenshots/cursor/${id}.png or run bun run previews`
    );
    continue;
  }

  const size = statSync(pngPath).size;
  if (size < MIN_PNG_BYTES) {
    failures.push(`Preview too small (${size} B < ${MIN_PNG_BYTES} B) for ${id} (${source}): ${pngPath}`);
  }
}

if (failures.length > 0) {
  console.error("Preview check failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

const manualCount = heroIds.filter((id) => findEditorScreenshot("cursor", id)).length;
console.log(
  `Preview check passed for ${heroIds.length} hero image(s) (${manualCount} manual Cursor, ${heroIds.length - manualCount} generated fallback).`
);
