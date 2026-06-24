import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { ALL_HERO_THEME_IDS, README_HERO_THEME_IDS } from "../src/references/hero-themes.ts";
import { findEditorScreenshot } from "./lib/editor-screenshot-paths.ts";

const writePng = async (sourcePath: string, destPath: string): Promise<void> => {
  mkdirSync(dirname(destPath), { recursive: true });
  if (sourcePath.endsWith(".png")) {
    copyFileSync(sourcePath, destPath);
    return;
  }
  await sharp(sourcePath).png().toFile(destPath);
};

const run = async (): Promise<void> => {
  let synced = 0;

  for (const id of ALL_HERO_THEME_IDS) {
    const sourcePath = findEditorScreenshot("zed", id);
    if (!sourcePath) {
      continue;
    }

    const destPath = resolve("zed-extension", "screenshots", `${id}.png`);
    await writePng(sourcePath, destPath);
    console.log(`Synced Zed screenshot ${id} → ${destPath}`);
    synced += 1;
  }

  const missingCursor = README_HERO_THEME_IDS.filter((id) => !findEditorScreenshot("cursor", id));
  const missingZed = README_HERO_THEME_IDS.filter((id) => !findEditorScreenshot("zed", id));

  if (missingCursor.length > 0) {
    console.warn(
      `Missing Cursor screenshots (drop into assets/screenshots/cursor/): ${missingCursor.join(", ")}`
    );
  }
  if (missingZed.length > 0) {
    console.warn(
      `Missing Zed screenshots (drop into assets/screenshots/zed/): ${missingZed.join(", ")}`
    );
  }

  console.log(
    `Editor screenshot sync done (${synced} Zed PNG(s) copied to zed-extension/screenshots/).`
  );
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
