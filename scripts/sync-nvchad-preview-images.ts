import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import {
  nvchadThemePreviewUrl,
  README_NVCHAD_PREVIEW_IDS
} from "../src/references/nvchad-previews.ts";

const outDir = resolve("assets", "previews", "nvchad-official");
const ids = process.argv.slice(2);
const themeIds = ids.length > 0 ? ids : [...README_NVCHAD_PREVIEW_IDS];

mkdirSync(outDir, { recursive: true });

for (const id of themeIds) {
  const url = nvchadThemePreviewUrl(id);
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch ${url}: ${response.status}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = resolve(outDir, `${id}.webp`);
  writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath} (${buffer.length} bytes) from ${url}`);
}

console.log(`Synced ${themeIds.length} official NvChad preview image(s) to ${outDir}/`);
