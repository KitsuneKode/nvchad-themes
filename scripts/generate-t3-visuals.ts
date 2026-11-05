import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { $ } from "bun";
import {
  buildT3CodeTheme,
  T3CODE_CURATION,
  themeCatalog,
  type T3CodeColors
} from "../src/index.ts";

const ROOT = resolve(import.meta.dir, "..");
const OUT_HTML = resolve(ROOT, "assets/t3-theme-comparison.html");
const SHOT_DIR = resolve(ROOT, "assets/screenshots/t3");

/** Reference chrome from T3 Code dark (not NvChad). */
const T3_NATIVE_DARK: T3CodeColors = {
  canvas: "#0a0a0a",
  chrome: "#0a0a0a",
  toolbar: "#0a0a0a",
  toolbarForeground: "#f5f5f5",
  toolbarBorder: "#191919",
  toolbarControl: "#111111",
  toolbarControlForeground: "#f5f5f5",
  toolbarControlHover: "#141414",
  surface: "#111111",
  surfaceRaised: "#141414",
  surfaceOverlay: "#171717",
  text: "#f5f5f5",
  textMuted: "#a3a3a3",
  border: "#191919",
  input: "#1f1f1f",
  focus: "#3b82f6",
  accent: "#3b82f6",
  accentForeground: "#ffffff",
  secondary: "#111111",
  secondaryForeground: "#f5f5f5",
  muted: "#111111",
  mutedForeground: "#a3a3a3",
  placeholder: "#737373",
  secondaryLabel: "#a3a3a3",
  iconMuted: "#737373",
  error: "#ef4444",
  errorForeground: "#fecaca",
  errorSurface: "#301214",
  warning: "#eab308",
  warningForeground: "#fef08a",
  warningSurface: "#2a2408",
  update: "#3b82f6",
  updateForeground: "#bfdbfe",
  updateSurface: "#172554",
  accentSurface: "#141414",
  accentSurfaceForeground: "#f5f5f5",
  messageSurface: "#141414",
  messageForeground: "#f5f5f5",
  messageAction: "#3b82f6",
  messageActionForeground: "#ffffff",
  messageActionHover: "#2563eb",
  codeBackground: "#111111",
  codeForeground: "#f5f5f5",
  searchMatchBackground: "#422006",
  searchMatchForeground: "#fef08a",
  searchMatchActiveBackground: "#713f12",
  searchMatchActiveForeground: "#fef9c3",
  sidebar: "#000000",
  sidebarForeground: "#f5f5f5",
  sidebarBorder: "#141414",
  sidebarMuted: "#737373",
  sidebarRowHover: "#111111",
  sidebarRowActive: "#131313",
  sidebarRowSelected: "#141414",
  terminalBackground: "#0a0a0a",
  terminalForeground: "#f5f5f5",
  terminalCursor: "#3b82f6",
  terminalSelection: "#262626"
};

const COMPARISON_IDS = [
  "everblush",
  "github_dark",
  "gruvbox",
  "nord",
  "rxyhn",
  "yoru",
  "catppuccin",
  "tokyonight"
] as const;

const resolveTheme = (id: string) => themeCatalog.find((t) => t.id === id)!;

const panel = (title: string, c: T3CodeColors): string => {
  const esc = (s: string) => s.replace(/"/g, "&quot;");
  return `<section style="flex:1;min-width:168px;border:1px solid #333;border-radius:8px;overflow:hidden;background:${esc(c.canvas)}">
  <div style="padding:8px 10px;font:600 11px/1.2 system-ui,sans-serif;color:${esc(c.text)};background:${esc(c.surfaceRaised)};border-bottom:1px solid ${esc(c.border)}">${title}</div>
  <div style="display:flex;height:132px">
    <div style="width:28%;background:${esc(c.sidebar)};border-right:1px solid ${esc(c.sidebarBorder)};padding:6px">
      <div style="height:8px;width:78%;background:${esc(c.sidebarRowActive)};border-radius:4px;margin-bottom:4px"></div>
      <div style="height:8px;width:52%;background:${esc(c.sidebarRowHover)};border-radius:4px"></div>
    </div>
    <div style="flex:1;background:${esc(c.canvas)};padding:8px;display:flex;flex-direction:column;gap:5px;font:10px/1.3 system-ui,sans-serif">
      <div style="height:16px;background:${esc(c.toolbarControl)};border:1px solid ${esc(c.border)};border-radius:5px"></div>
      <div style="align-self:flex-end;padding:6px 9px;background:${esc(c.messageSurface)};color:${esc(c.messageForeground)};border-radius:9px">User message</div>
      <div style="padding:5px 6px;background:${esc(c.codeBackground)};border:1px solid ${esc(c.border)};color:${esc(c.codeForeground)};font-family:ui-monospace,monospace;font-size:9px">const ok = true;</div>
      <div style="padding:4px 6px;background:${esc(c.errorSurface)};color:${esc(c.errorForeground)};border-radius:5px">Error banner</div>
      <div style="display:flex;gap:4px">
        <span style="padding:3px 6px;background:${esc(c.accent)};color:${esc(c.accentForeground)};border-radius:4px">Send</span>
        <span style="padding:3px 6px;background:${esc(c.secondary)};color:${esc(c.secondaryForeground)};border:1px solid ${esc(c.border)};border-radius:4px">Chip</span>
      </div>
    </div>
  </div></section>`;
};

const buildColorsForId = (id: string): { title: string; colors: T3CodeColors } => {
  const entry = T3CODE_CURATION.find((e) => e.id === id)!;
  const file = buildT3CodeTheme(entry, resolveTheme);
  return { title: file.name, colors: file.colors };
};

const comparisonHtml = (): string => {
  const sections = [
    panel("T3 Code dark (reference)", T3_NATIVE_DARK),
    ...COMPARISON_IDS.map((id) => {
      const { title, colors } = buildColorsForId(id);
      return panel(`NvChad ${title}`, colors);
    })
  ];
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>T3 Code — NvChad chrome comparison</title></head>
<body style="margin:0;background:#1a1a1a;padding:12px">
<div style="display:flex;flex-wrap:wrap;gap:12px;max-width:1600px;margin:0 auto">${sections.join("")}</div>
</body></html>`;
};

const singleShotHtml = (title: string, c: T3CodeColors): string =>
  `<!DOCTYPE html><html><head><meta charset=utf-8></head><body style="margin:0;background:#111">${panel(title, c)}</body></html>`;

const chromeBin = async (): Promise<string | null> => {
  for (const name of ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser"]) {
    const which = await $`which ${name}`.quiet().nothrow();
    if (which.exitCode === 0) return name;
  }
  return null;
};

const capturePng = async (htmlPath: string, pngPath: string, width: number, height: number) => {
  const bin = await chromeBin();
  if (!bin) {
    console.warn("No Chrome/Chromium — skip PNG capture");
    return false;
  }
  mkdirSync(resolve(pngPath, ".."), { recursive: true });
  const url = `file://${htmlPath}`;
  const result = await $`${bin} --headless=new --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot=${pngPath} ${url}`.quiet().nothrow();
  if (result.exitCode !== 0) {
    console.warn(`Screenshot failed for ${pngPath}`);
    return false;
  }
  console.log(`Captured ${pngPath}`);
  return true;
};

const run = async (): Promise<void> => {
  const html = comparisonHtml();
  writeFileSync(OUT_HTML, html, "utf8");
  console.log(`Wrote ${OUT_HTML}`);

  mkdirSync(SHOT_DIR, { recursive: true });
  const tmpDir = resolve(ROOT, ".cache/t3-shots");
  mkdirSync(tmpDir, { recursive: true });

  const overviewHtml = resolve(tmpDir, "overview.html");
  writeFileSync(overviewHtml, html, "utf8");
  await capturePng(overviewHtml, resolve(SHOT_DIR, "overview.png"), 1600, 520);

  for (const id of COMPARISON_IDS) {
    const { title, colors } = buildColorsForId(id);
    const page = resolve(tmpDir, `${id}.html`);
    writeFileSync(page, singleShotHtml(`NvChad ${title}`, colors), "utf8");
    await capturePng(page, resolve(SHOT_DIR, `${id}.png`), 420, 200);
  }

  const nativePage = resolve(tmpDir, "t3-native-dark.html");
  writeFileSync(nativePage, singleShotHtml("T3 Code dark (reference)", T3_NATIVE_DARK), "utf8");
  await capturePng(nativePage, resolve(SHOT_DIR, "t3-native-dark.png"), 420, 200);
};

run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
