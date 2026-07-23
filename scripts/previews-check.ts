import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { README_HERO_THEME_IDS } from "../src/references/hero-themes.ts";
import { findEditorScreenshot } from "./lib/editor-screenshot-paths.ts";

const MIN_PNG_BYTES = 5_000;
const heroIds = [...README_HERO_THEME_IDS];

const failures: string[] = [];

const readPngDimensions = (pngPath: string): { width: number; height: number } | undefined => {
  const header = readFileSync(pngPath).subarray(0, 24);
  if (header.length < 24 || header.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    return undefined;
  }

  return {
    width: header.readUInt32BE(16),
    height: header.readUInt32BE(20)
  };
};

for (const id of heroIds) {
  for (const kind of ["cursor", "zed"] as const) {
    const screenshotPath = findEditorScreenshot(kind, id);
    if (!screenshotPath || !screenshotPath.endsWith(".png")) {
      failures.push(`Missing PNG screenshot for ${kind}/${id}: add assets/screenshots/${kind}/${id}.png`);
      continue;
    }

    if (!existsSync(screenshotPath)) {
      failures.push(`Missing screenshot for ${kind}/${id}: ${screenshotPath}`);
      continue;
    }

    const size = statSync(screenshotPath).size;
    if (size < MIN_PNG_BYTES) {
      failures.push(`Screenshot too small (${size} B < ${MIN_PNG_BYTES} B) for ${kind}/${id}: ${screenshotPath}`);
      continue;
    }

    const dimensions = readPngDimensions(screenshotPath);
    if (!dimensions) {
      failures.push(`Invalid PNG signature for ${kind}/${id}: ${screenshotPath}`);
      continue;
    }

    if (dimensions.width !== 1896 || dimensions.height !== 1018) {
      failures.push(
        `Screenshot must be 1896x1018 for ${kind}/${id}, got ${dimensions.width}x${dimensions.height}: ${screenshotPath}`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Preview check failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(`Preview check passed for ${heroIds.length} hero themes (Cursor/VS Code + Zed, 1896x1018 PNGs).`);
