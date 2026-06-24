import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { HERO_THEME_IDS } from "../src/references/hero-themes.ts";

const MIN_PNG_BYTES = 5_000;
const README_HERO_IDS = [...HERO_THEME_IDS, "onedark"] as const;
const heroIds = [...README_HERO_IDS];

const failures: string[] = [];

for (const id of heroIds) {
  const pngPath = resolve("assets", "previews", `${id}.png`);
  if (!existsSync(pngPath)) {
    failures.push(`Missing preview PNG: ${pngPath}`);
    continue;
  }

  const size = statSync(pngPath).size;
  if (size < MIN_PNG_BYTES) {
    failures.push(`Preview PNG too small (${size} B < ${MIN_PNG_BYTES} B): ${pngPath}`);
  }
}

if (failures.length > 0) {
  console.error("Preview check failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(`Preview check passed for ${heroIds.length} hero PNG(s).`);
