import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createHighlighter, type ThemeRegistration, type ThemedToken } from "shiki";
import { themeCatalog } from "../src/index.ts";
import { CODE_SAMPLE } from "../samples/code-sample.ts";
import { HERO_THEME_IDS, ALL_HERO_THEME_IDS } from "../src/references/hero-themes.ts";

const HERO_IDS = [...ALL_HERO_THEME_IDS];
const LANG = "typescript";

const heroesOnly = process.argv.includes("--heroes-only");

const PREVIEW_WIDTH = 720;
const PREVIEW_HEIGHT = 420;
const FONT_SIZE = 13;
const LINE_HEIGHT = 19.5;
const PADDING = 16;

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");

const editorBackground = (theme: ThemeRegistration): string => {
  const colors = theme.colors as Record<string, string> | undefined;
  return colors?.["editor.background"] ?? "#111318";
};

const buildTokenSvg = (tokens: ThemedToken[][], background: string): string => {
  const lineSpans = tokens.map((line, lineIndex) => {
    const dy = lineIndex === 0 ? PADDING + FONT_SIZE : LINE_HEIGHT;
    const tokenSpans = line
      .map((token) => {
        if (!token.content) {
          return "";
        }
        const color = token.color ?? "#e6e6e6";
        return `<tspan fill="${color}">${escapeXml(token.content)}</tspan>`;
      })
      .join("");

    return `<tspan x="${PADDING}" dy="${dy}">${tokenSpans}</tspan>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}">
  <rect width="100%" height="100%" fill="${background}"/>
  <text font-family="ui-monospace,Menlo,Consolas,monospace" font-size="${FONT_SIZE}">
    ${lineSpans.join("\n    ")}
  </text>
</svg>`;
};

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
    const { tokens } = highlighter.codeToTokens(CODE_SAMPLE, { lang: LANG, theme });
    const svg = buildTokenSvg(tokens, editorBackground(theme));

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, html);
    writeFileSync(outputPath.replace(/\.html$/, ".svg"), svg);
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
