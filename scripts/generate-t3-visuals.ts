import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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
/** Real T3 Code captures (manual drop zone; never written by this script). */
const LIVE_DIR = resolve(SHOT_DIR, "live");

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
  sidebarMutedForeground: "#a3a3a3",
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
  const row = (bg: string, label: string, ink: string, weight: number) =>
    `<div style="padding:5px 8px;border-radius:6px;background:${esc(bg)};color:${esc(ink)};font-weight:${weight};white-space:nowrap;overflow:hidden">${label}</div>`;
  return `<section style="width:340px;border:1px solid #333;border-radius:10px;overflow:hidden;background:${esc(c.canvas)};font-family:-apple-system,BlinkMacSystemFont,'Inter Variable','Segoe UI',system-ui,sans-serif">
  <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:${esc(c.toolbar)};color:${esc(c.toolbarForeground)};border-bottom:1px solid ${esc(c.toolbarBorder)};font-size:12px;font-weight:560">
    <span style="flex:1">${title}</span>
    <span style="padding:3px 8px;border-radius:6px;background:${esc(c.toolbarControl)};color:${esc(c.toolbarControlForeground)};border:1px solid ${esc(c.border)};font-weight:500">New</span>
  </div>
  <div style="display:flex;height:248px">
    <div style="width:118px;background:${esc(c.sidebar)};border-right:1px solid ${esc(c.sidebarBorder)};padding:8px;display:flex;flex-direction:column;gap:4px;font-size:11px">
      ${row(c.sidebarRowActive, "Active thread", c.sidebarForeground, 560)}
      ${row(c.sidebarRowHover, "Hover", c.sidebarForeground, 450)}
      ${row(c.sidebarRowSelected, "Selected", c.sidebarForeground, 450)}
      <div style="padding:5px 8px;color:${esc(c.sidebarMutedForeground)};font-weight:400">Idle row</div>
    </div>
    <div style="flex:1;background:${esc(c.canvas)};padding:10px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:${esc(c.text)}">
      <div style="align-self:flex-end;max-width:88%;padding:7px 10px;background:${esc(c.messageSurface)};color:${esc(c.messageForeground)};border-radius:12px;font-weight:450">User message</div>
      <div style="padding:6px 8px;background:${esc(c.codeBackground)};border:1px solid ${esc(c.border)};color:${esc(c.codeForeground)};font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;border-radius:8px">const ok = true;</div>
      <div style="padding:5px 8px;background:${esc(c.errorSurface)};color:${esc(c.errorForeground)};border-radius:6px;font-size:11px">Error banner</div>
      <div style="margin-top:auto;display:flex;flex-direction:column;gap:6px">
        <div style="padding:7px 8px;background:${esc(c.input)};color:${esc(c.placeholder)};border:1px solid ${esc(c.border)};border-radius:8px;font-weight:400">Ask anything</div>
        <div style="display:flex;gap:6px;align-items:center">
          <span style="padding:4px 8px;background:${esc(c.accent)};color:${esc(c.accentForeground)};border-radius:999px;font-weight:560;font-size:11px">Send</span>
          <span style="padding:4px 8px;background:${esc(c.surfaceOverlay)};border-radius:8px;font-size:11px">
            <span style="display:inline-block;padding:2px 6px;border-radius:4px;background:${esc(c.accentSurface)};color:${esc(c.accentSurfaceForeground)}">Model</span>
          </span>
        </div>
      </div>
    </div>
  </div></section>`;
};

const buildColorsForId = (id: string): { title: string; colors: T3CodeColors } => {
  const entry = T3CODE_CURATION.find((e) => e.id === id)!;
  const file = buildT3CodeTheme(entry, resolveTheme);
  return { title: file.name, colors: file.colors };
};

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Gallery of real captures in `live/`, linked relative to `assets/`. Empty when none exist. */
const liveGalleryHtml = (): string => {
  const shots = [
    { id: "t3-native-dark", title: "T3 Code dark (built-in)" },
    ...COMPARISON_IDS.map((id) => ({ id, title: `NvChad ${buildColorsForId(id).title}` }))
  ].filter(({ id }) => existsSync(resolve(LIVE_DIR, `${id}.png`)));
  if (shots.length === 0) return "";
  const figures = shots
    .map(
      ({ id, title }) => `<figure style="margin:0;width:460px">
  <a href="screenshots/t3/live/${id}.png"><img src="screenshots/t3/live/${id}.png" alt="${escHtml(title)} — live T3 Code" loading="lazy" style="width:100%;border-radius:8px;display:block"></a>
  <figcaption style="font:12px system-ui,sans-serif;color:#bbb;padding:6px 2px">${escHtml(title)}</figcaption></figure>`
    )
    .join("");
  return `<h2 style="font:600 15px system-ui,sans-serif;color:#eee;max-width:1420px;margin:28px auto 12px">Live T3 Code captures</h2>
<div style="display:flex;flex-wrap:wrap;gap:12px;max-width:1420px;margin:0 auto">${figures}</div>`;
};

const comparisonHtml = (withLive = false): string => {
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
<div style="display:flex;flex-wrap:wrap;gap:12px;max-width:1420px;margin:0 auto">${sections.join("")}</div>
${withLive ? liveGalleryHtml() : ""}
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
  writeFileSync(OUT_HTML, comparisonHtml(true), "utf8");
  const html = comparisonHtml();
  console.log(`Wrote ${OUT_HTML}`);

  mkdirSync(SHOT_DIR, { recursive: true });
  const tmpDir = resolve(ROOT, ".cache/t3-shots");
  mkdirSync(tmpDir, { recursive: true });

  const overviewHtml = resolve(tmpDir, "overview.html");
  writeFileSync(overviewHtml, html, "utf8");
  await capturePng(overviewHtml, resolve(SHOT_DIR, "overview.png"), 1440, 920);

  for (const id of COMPARISON_IDS) {
    const { title, colors } = buildColorsForId(id);
    const page = resolve(tmpDir, `${id}.html`);
    writeFileSync(page, singleShotHtml(`NvChad ${title}`, colors), "utf8");
    await capturePng(page, resolve(SHOT_DIR, `${id}.png`), 380, 320);
  }

  const nativePage = resolve(tmpDir, "t3-native-dark.html");
  writeFileSync(nativePage, singleShotHtml("T3 Code dark (reference)", T3_NATIVE_DARK), "utf8");
  await capturePng(nativePage, resolve(SHOT_DIR, "t3-native-dark.png"), 380, 320);
};

run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
