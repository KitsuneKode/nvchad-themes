import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import sharp from "sharp";
import { HERO_THEME_IDS } from "../src/references/hero-themes.ts";

const EXTRA_HEROES = ["onedark", "gruvbox", "everforest"] as const;
const ALL_HERO_IDS = [...new Set([...HERO_THEME_IDS, ...EXTRA_HEROES])];

const heroesOnly = process.argv.includes("--heroes-only");
const heroIds = heroesOnly ? [...HERO_THEME_IDS] : ALL_HERO_IDS;

const rasterizeSvg = async (svgPath: string, webpPath: string, pngPath: string): Promise<void> => {
  const svg = readFileSync(svgPath);
  mkdirSync(dirname(webpPath), { recursive: true });
  mkdirSync(dirname(pngPath), { recursive: true });

  await sharp(svg).resize(800).webp({ quality: 85 }).toFile(webpPath);
  await sharp(svg)
    .resize(1280, 800, { fit: "contain", background: "#111318" })
    .png()
    .toFile(pngPath);
  console.log(`Rasterized ${svgPath} → ${webpPath}, ${pngPath}`);
};

const run = async (): Promise<void> => {
  for (const id of heroIds) {
    const svgPath = resolve("zed-extension", "screenshots", `${id}.svg`);
    if (!existsSync(svgPath)) {
      console.warn(`Skip missing ${svgPath} — run generate-previews first`);
      continue;
    }

    await rasterizeSvg(
      svgPath,
      resolve("assets", "previews", `${id}.webp`),
      resolve("zed-extension", "screenshots", `${id}.png`)
    );
  }

  const suffix = heroesOnly ? " (--heroes-only)" : "";
  console.log(`Rasterized ${heroIds.length} hero preview(s)${suffix}.`);
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
