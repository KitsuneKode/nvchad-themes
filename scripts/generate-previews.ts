import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createHighlighter, type ThemeRegistration } from "shiki";
import { themeCatalog } from "../src/index.ts";
import { CODE_SAMPLE } from "../samples/code-sample.ts";
import { HERO_THEME_IDS } from "../src/references/hero-themes.ts";

const EXTRA_HEROES = ["onedark", "gruvbox", "everforest"] as const;
const HERO_IDS = [...new Set([...HERO_THEME_IDS, ...EXTRA_HEROES])];
const LANG = "typescript";

const heroesOnly = process.argv.includes("--heroes-only");

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");

const wrapSvg = (plain: string, width = 720, height = 420): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#111318"/>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:ui-monospace,monospace;font-size:13px;line-height:1.5;padding:16px;background:#111318;color:#e6e6e6;overflow:hidden;">
      <pre style="margin:0;white-space:pre-wrap;">${escapeHtml(plain)}</pre>
    </div>
  </foreignObject>
</svg>`;

const loadVsCodeTheme = (id: string): ThemeRegistration => {
  const themeJson = JSON.parse(
    readFileSync(resolve("themes", `${id}-color-theme.json`), "utf8")
  ) as ThemeRegistration;
  return themeJson;
};

const run = async () => {
  const highlighter = await createHighlighter({ themes: [], langs: [LANG] });

  const renderTheme = async (id: string, outputPath: string) => {
    const theme = loadVsCodeTheme(id);
    const html = highlighter.codeToHtml(CODE_SAMPLE, { lang: LANG, theme });
    const plain = html.replace(/<[^>]+>/g, "");

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html);
    writeFileSync(outputPath.replace(/\.html$/, ".svg"), wrapSvg(plain));
    console.log(`Wrote ${outputPath}`);
  };

  if (!heroesOnly) {
    for (const theme of themeCatalog) {
      await renderTheme(theme.id, resolve("assets", "gallery", "vscode", `${theme.id}.html`));
    }
  }

  for (const id of HERO_IDS) {
    await renderTheme(id, resolve("assets", "previews", `${id}.html`));
    await renderTheme(id, resolve("zed-extension", "screenshots", `${id}.html`));
  }

  const galleryCount = heroesOnly ? 0 : themeCatalog.length;
  const suffix = heroesOnly ? " (--heroes-only)" : "";
  console.log(`Generated previews for ${galleryCount} gallery themes and ${HERO_IDS.length} heroes${suffix}.`);
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
