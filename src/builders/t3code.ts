import type { ThemeSpec } from "../types.ts";
import { mixColors, relativeLuminance } from "../utils.ts";

const lum = (hex: string) => relativeLuminance(hex);

const deepenFrom = (canvas: string, preferred: string, minBelow: number, floor: string): string => {
  const need = Math.min(minBelow, Math.max(0.002, lum(canvas) * 0.38));
  if (lum(preferred) < lum(canvas) && lum(canvas) - lum(preferred) >= need) return preferred;
  for (let t = 0.08; t <= 1; t += 0.04) {
    const candidate = mixColors(canvas, floor, t);
    if (lum(canvas) - lum(candidate) >= need) return candidate;
  }
  return mixColors(canvas, floor, 0.92);
};

const liftFrom = (anchor: string, preferred: string, minAbove: number, ceiling: string): string => {
  const need = Math.min(minAbove, Math.max(0.002, (1 - lum(anchor)) * 0.12));
  if (lum(preferred) - lum(anchor) >= need) return preferred;
  for (let t = 0.08; t <= 1; t += 0.04) {
    const candidate = mixColors(anchor, ceiling, t);
    if (lum(candidate) - lum(anchor) >= need) return candidate;
  }
  return mixColors(anchor, ceiling, 0.72);
};

/**
 * T3 Code reads published themes from `<T3CODE_HOME>/userdata/themes/<id>.json`
 * (hot-reloaded) and caps the folder at 32 files / 32 KiB each / 192 KiB total,
 * so this target ships a short curated set — the themes that hold up as a whole
 * app, not just as editor syntax — rather than the whole catalog. Dark/light
 * siblings are merged into one theme with a `variants` entry so "Follow system"
 * flips between them.
 */
export type T3CodeCuration = {
  /** Palette id of the base (usually dark) theme */
  id: string;
  /** Card label in T3 Code — the theme's own name, no "NvChad" prefix (it truncates) */
  name: string;
  /** Palette id of the opposite-appearance sibling */
  variant?: string;
  /**
   * base30 key for the accent. Defaults to `pmenuBg` — NvChad's own selection
   * color, the hue each theme is recognised by in the NvChad gallery. Override
   * only where the upstream theme's identity is a different hue.
   */
  accent?: keyof ThemeSpec["base30"];
};

export const T3CODE_CURATION: readonly T3CodeCuration[] = [
  // Paired: one card, follows the system appearance
  { id: "rosepine", name: "Rosé Pine", variant: "rosepine-dawn" },
  { id: "catppuccin", name: "Catppuccin", variant: "catppuccin-latte", accent: "purple" },
  { id: "everforest", name: "Everforest", variant: "everforest_light" },
  { id: "gruvbox", name: "Gruvbox", variant: "gruvbox_light" },
  { id: "flexoki", name: "Flexoki", variant: "flexoki-light" },
  { id: "github_dark", name: "GitHub", variant: "github_light" },
  { id: "onedark", name: "One", variant: "one_light" },
  { id: "nord", name: "Nord", variant: "onenord_light", accent: "blue" },
  { id: "ayu_dark", name: "Ayu", variant: "ayu_light" },
  { id: "oceanic-next", name: "Oceanic", variant: "oceanic-light" },
  // Dark only
  { id: "tokyodark", name: "Tokyo Dark" },
  { id: "tokyonight", name: "Tokyo Night" },
  { id: "yoru", name: "Yoru", accent: "green" },
  { id: "everblush", name: "Everblush" },
  { id: "kanagawa", name: "Kanagawa" },
  { id: "kanagawa-dragon", name: "Kanagawa Dragon" },
  { id: "rxyhn", name: "Rxyhn", accent: "blue" },
  { id: "vesper", name: "Vesper" },
  { id: "poimandres", name: "Poimandres" },
  { id: "nightfox", name: "Nightfox" },
  { id: "chadracula", name: "Dracula" },
  // Famous names people expect (VS Code / IDE classics)
  { id: "palenight", name: "Palenight" },
  { id: "nightowl", name: "Night Owl", accent: "blue" },
  { id: "solarized_dark", name: "Solarized", variant: "solarized_light" },
  { id: "zenburn", name: "Zenburn" },
  { id: "darcula-dark", name: "Darcula", accent: "blue" },
  { id: "material-darker", name: "Material Dark" },
  { id: "jellybeans", name: "Jellybeans" },
  { id: "penumbra_dark", name: "Penumbra" },
  { id: "tomorrow_night", name: "Tomorrow Night" },
  { id: "wombat", name: "Wombat" },
  { id: "vscode_dark", name: "VS Code", variant: "vscode_light" },
];

/** Prefix keeps published ids clear of built-ins (`ocean`, `ember`…) and older imports. */
export const t3codeThemeId = (paletteId: string): string =>
  `nv-${paletteId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export type T3CodeColors = Record<string, string>;

/** Must stay in sync with T3 Code `THEME_COLOR_ROLES` in @t3tools/shared/themePalettes. */
export const T3CODE_COLOR_ROLES = [
  "canvas",
  "chrome",
  "toolbar",
  "toolbarForeground",
  "toolbarBorder",
  "toolbarControl",
  "toolbarControlForeground",
  "toolbarControlHover",
  "surface",
  "surfaceRaised",
  "surfaceOverlay",
  "text",
  "textMuted",
  "border",
  "input",
  "focus",
  "accent",
  "accentForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "placeholder",
  "secondaryLabel",
  "iconMuted",
  "error",
  "errorForeground",
  "errorSurface",
  "warning",
  "warningForeground",
  "warningSurface",
  "update",
  "updateForeground",
  "updateSurface",
  "accentSurface",
  "accentSurfaceForeground",
  "messageSurface",
  "messageForeground",
  "messageAction",
  "messageActionForeground",
  "messageActionHover",
  "codeBackground",
  "codeForeground",
  "searchMatchBackground",
  "searchMatchForeground",
  "searchMatchActiveBackground",
  "searchMatchActiveForeground",
  "sidebar",
  "sidebarForeground",
  "sidebarMutedForeground",
  "sidebarControlSurface",
  "sidebarRowHover",
  "sidebarRowActive",
  "sidebarRowSelected",
  "sidebarBorder",
  "terminalBackground",
  "terminalForeground",
  "terminalCursor",
  "terminalSelection",
  "terminalScrollbar",
  "terminalScrollbarHover"
] as const satisfies ReadonlyArray<keyof T3CodeColors>;

export type T3CodeThemeFile = {
  version: 1;
  name: string;
  appearance: "light" | "dark";
  colors: T3CodeColors;
  variants?: { light?: T3CodeColors; dark?: T3CodeColors };
};

const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

/** Pull `color` toward `toward` until it reads at `ratio` on `background`. */
const readable = (color: string, background: string, ratio: number, toward: string): string => {
  for (let step = 0; step <= 1; step += 0.05) {
    const candidate = step === 0 ? color : mixColors(color, toward, step);
    if (contrastRatio(candidate, background) >= ratio) return candidate;
  }
  return toward;
};

/** Ink for text sitting on a filled accent: whichever of the theme's extremes reads best. */
const onFill = (fill: string, light: string, dark: string): string =>
  contrastRatio(fill, light) >= contrastRatio(fill, dark) ? light : dark;

/** Nudge a hairline until it is just visible against `background` (≥1.25:1). */
const hairline = (color: string, background: string, toward: string): string =>
  readable(color, background, 1.25, toward);

/** Status copy/icons on tinted surfaces — T3 separates base hue from foreground (brighter on dark). */
const statusForeground = (
  tone: string,
  surface: string,
  isLight: boolean,
  ink: string
): string => {
  const toward = isLight ? ink : "#ffffff";
  const emphasis = mixColors(tone, toward, isLight ? 0.4 : 0.22);
  return readable(emphasis, surface, 4.5, isLight ? mixColors(tone, ink, 0.55) : toward);
};

/** Terminal cursor: readable on canvas, hue-linked but not a flat copy of `accent`. */
const terminalCursorColor = (
  accent: string,
  canvas: string,
  isLight: boolean,
  b: ThemeSpec["base30"]
): string => {
  const seed = isLight
    ? mixColors(mixColors(b.oneBg3, b.blue, 0.55), "#000000", 0.35)
    : mixColors(accent, "#ffffff", 0.32);
  return readable(seed, canvas, isLight ? 2.5 : 3, isLight ? b.blue : accent);
};

/** Neutral selection wash — small accent hint, not a full tint (green-on-green themes). */
const terminalSelectionColor = (
  canvas: string,
  accent: string,
  isLight: boolean,
  b: ThemeSpec["base30"]
): string => {
  const need = Math.min(0.045, Math.max(0.014, lum(canvas) * 0.5 + 0.01));
  let sel = isLight
    ? mixColors(canvas, b.oneBg3, 0.42)
    : mixColors(canvas, b.oneBg2, 0.55);
  if (hueGapHex(sel, accent) < 18) {
    sel = neutralRaised(canvas, isLight);
  } else {
    sel = mixColors(sel, accent, 0.06);
  }
  if (Math.abs(lum(sel) - lum(canvas)) < need) {
    const lift = isLight ? mixColors(canvas, b.oneBg3, 0.62) : mixColors(sel, b.oneBg2, 0.35);
    sel = hueGapHex(lift, accent) < 18 ? mixColors(sel, isLight ? "#ffffff" : b.lightBg, 0.22) : lift;
    if (hueGapHex(sel, accent) >= 18) {
      sel = mixColors(sel, accent, 0.06);
    }
  }
  if (isLight && Math.abs(lum(sel) - lum(canvas)) < need) {
    sel = mixColors(canvas, b.oneBg3, 0.72);
  }
  sel = greySnap(sel);
  if (hueGapHex(sel, accent) < 15) {
    sel = greySnap(toAchromaticNeutral(canvas, isLight, need));
  }
  return sel;
};

const rgbDistance = (a: string, b: string): number => {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [channels(a), channels(b)];
  return Math.hypot(...x.map((c, i) => c - y[i]!));
};

const hueOfHex = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  if (chroma === 0) return 0;
  const hue =
    max === r ? ((g - b) / chroma) % 6 : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4;
  return ((hue * 60 + 360) % 360);
};

const hueGapHex = (a: string, b: string): number => {
  const d = Math.abs(hueOfHex(a) - hueOfHex(b));
  return Math.min(d, 360 - d);
};

const greySnap = (hex: string): string => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const m = Math.round((r + g + b) / 3);
  const h = m.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
};

/** Pull a fill toward true grey so hue checks don't track blue-tinted NvChad UI layers. */
const toAchromaticNeutral = (canvas: string, isLight: boolean, minLift = 0.012): string => {
  let c = greySnap(isLight ? mixColors(canvas, "#ffffff", 0.88) : mixColors("#848484", canvas, 0.72));
  if (!isLight && lum(c) - lum(canvas) < minLift) {
    c = greySnap(mixColors(c, "#aaaaaa", 0.35));
  }
  return c;
};

/** Keep muted labels from washing out on very dark canvases (still ≥4.5:1). */
const capDarkMuted = (muted: string, canvas: string, text: string): string => {
  const ceiling = lum(canvas) + 0.14;
  let target = greySnap(mixColors(toAchromaticNeutral(canvas, false, 0.01), muted, 0.18));
  while (lum(target) > ceiling) {
    const next = greySnap(mixColors(target, canvas, 0.12));
    if (contrastRatio(next, canvas) < 3) break;
    target = next;
  }
  if (contrastRatio(target, canvas) < 3) {
    target = greySnap(readable(target, canvas, 3, text));
  }
  if (lum(target) - lum(canvas) > 0.15) {
    const tighter = greySnap(mixColors(target, canvas, 0.1));
    if (contrastRatio(tighter, canvas) >= 3) target = tighter;
  }
  if (contrastRatio(target, canvas) < 3) {
    target = greySnap(readable(target, canvas, 3, text));
  }
  return target;
};

/** Axis-neutral fill — grey-forward mix so hue stays off the accent on blue/cyan palettes. */
const neutralRaised = (canvas: string, isLight: boolean): string =>
  toAchromaticNeutral(canvas, isLight, 0.014);

const isNeutralFill = (hex: string): boolean => hueOf(hex).chroma < 0.045;

/** Neutral chat bubble — palette identity lives in accent/syntax, not a hazy accent wash. */
const messageBubbleSurface = (
  accentSurface: string,
  accent: string,
  canvas: string,
  isLight: boolean
): string => {
  if (!isNeutralFill(accentSurface) && hueGapHex(accentSurface, accent) >= 12) {
    return accentSurface;
  }
  return neutralRaised(canvas, isLight);
};

/**
 * Some palettes (tokyodark, tundra) select with their red, so the send button
 * would read as an error. Fall back to the next signature hue in that case.
 */
const pickAccent = (b: ThemeSpec["base30"], accentKey?: keyof ThemeSpec["base30"]): string => {
  const candidates = [b[accentKey ?? "pmenuBg"], b.purple, b.blue];
  return candidates.find((color) => rgbDistance(color, b.red) > 60) ?? b.blue;
};

export { pickAccent };

const HUE_KEYS = [
  "blue", "nordBlue", "purple", "darkPurple", "teal", "cyan",
  "green", "vibrantGreen", "orange", "yellow", "pink", "babyPink"
] as const satisfies ReadonlyArray<keyof ThemeSpec["base30"]>;

const hueOf = (hex: string): { hue: number; chroma: number } => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  if (chroma === 0) return { hue: 0, chroma };
  const hue = max === r ? ((g - b) / chroma) % 6 : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4;
  return { hue: (hue * 60 + 360) % 360, chroma };
};

/** The light half keeps the dark half's hue, using the light palette's own tuned shade of it. */
const matchingHueKey = (theme: ThemeSpec, target: string): keyof ThemeSpec["base30"] => {
  const want = hueOf(target).hue;
  const gap = (key: (typeof HUE_KEYS)[number]) => {
    const { hue, chroma } = hueOf(theme.base30[key]);
    const delta = Math.abs(hue - want);
    return chroma < 0.15 ? Infinity : Math.min(delta, 360 - delta);
  };
  return HUE_KEYS.reduce((best, key) => (gap(key) < gap(best) ? key : best));
};

export const buildT3CodeColors = (theme: ThemeSpec, accentKey?: keyof ThemeSpec["base30"]): T3CodeColors => {
  const b = theme.base30;
  const isLight = theme.type === "light";
  const ink = isLight ? "#000000" : "#ffffff";

  const canvas = b.black;
  const text = readable(theme.base16.base05, canvas, 7, ink);
  let accent = readable(pickAccent(b, accentKey), canvas, isLight ? 3 : 4, ink);
  let accentInk = onFill(accent, isLight ? b.black : text, isLight ? text : b.darkerBlack);

  // Map NvChad base30 UI layers (statusline → oneBg → lightBg) onto T3 Code roles.
  const sidebar = isLight
    ? deepenFrom(canvas, b.darkerBlack, 0.008, b.oneBg3)
    : deepenFrom(canvas, b.darkerBlack, 0.006, "#000000");

  const surface = isLight
    ? liftFrom(canvas, mixColors(canvas, "#ffffff", 0.78), 0.01, "#ffffff")
    : liftFrom(canvas, b.black2, 0.006, b.oneBg);

  const surfaceRaised = isLight
    ? liftFrom(surface, mixColors(canvas, "#ffffff", 0.9), 0.006, "#ffffff")
    : liftFrom(surface, b.oneBg, 0.006, b.lightBg);
  const surfaceRaisedFinal =
    isLight || lum(surfaceRaised) - lum(surface) >= 0.0035
      ? surfaceRaised
      : liftFrom(surface, b.lightBg, 0.005, b.oneBg2);

  const overlay = isLight
    ? "#ffffff"
    : liftFrom(surfaceRaised, b.oneBg2, 0.004, b.oneBg3);

  const secondary = isLight ? deepenFrom(surface, b.oneBg2, 0.006, b.oneBg3) : surface;
  const muted = isLight ? deepenFrom(surface, b.oneBg3, 0.004, b.grey) : surface;

  const control = isLight
    ? liftFrom(canvas, mixColors(canvas, "#ffffff", 0.94), 0.012, "#ffffff")
    : liftFrom(surface, b.oneBg, 0.006, b.oneBg2);

  const controlHover = isLight
    ? deepenFrom(canvas, b.oneBg2, 0.006, b.oneBg3)
    : liftFrom(surface, b.oneBg2, 0.008, b.lightBg);

  const accentSurface = isLight
    ? deepenFrom(canvas, b.oneBg2, 0.012, b.oneBg3)
    : liftFrom(surface, b.lightBg, 0.005, b.oneBg);

  let hairlineBase = hairline(b.line, canvas, ink);
  if (contrastRatio(hairlineBase, canvas) < 1.18) {
    hairlineBase = hairline(mixColors(b.line, ink, isLight ? 0.25 : 0.35), canvas, ink);
  }
  const border = hairline(b.oneBg2, canvas, ink);
  let borderFinal = contrastRatio(border, canvas) >= 1.15 ? border : hairlineBase;

  const textMutedRaw = readable(b.lightGrey, canvas, 4.5, text);
  const textMuted = isLight ? textMutedRaw : capDarkMuted(textMutedRaw, canvas, text);
  const quiet = isLight
    ? readable(b.greyFg2, canvas, 3, text)
    : capDarkMuted(readable(b.greyFg2, canvas, 3, text), canvas, text);

  // Tinted fills: a whisper of the status color over the canvas, ink kept legible.
  const tint = (color: string, amount: number) => mixColors(canvas, color, amount);
  const errorSurface = tint(b.red, isLight ? 0.1 : 0.14);
  const warningSurface = tint(b.yellow, isLight ? 0.14 : 0.12);
  const updateSurface = tint(accent, isLight ? 0.1 : 0.14);
  const searchMatch = tint(b.yellow, isLight ? 0.4 : 0.32);
  const sidebarRowHover = isLight
    ? liftFrom(sidebar, mixColors(sidebar, "#ffffff", 0.45), 0.003, "#ffffff")
    : liftFrom(sidebar, b.black2, 0.003, b.oneBg);

  const sidebarRowActive = isLight
    ? liftFrom(sidebarRowHover, mixColors(canvas, "#ffffff", 0.92), 0.003, "#ffffff")
    : liftFrom(sidebarRowHover, b.oneBg, 0.003, b.lightBg);

  const sidebarRowSelected = isLight
    ? liftFrom(sidebarRowActive, mixColors(sidebarRowActive, accent, 0.06), 0.003, "#ffffff")
    : liftFrom(sidebarRowActive, mixColors(sidebarRowActive, accent, 0.06), 0.003, "#ffffff");

  const secondaryFg = text;
  const mutedFg = textMuted;
  const accentSurfaceFg = readable(text, accentSurface, 7, ink);

  let sidebarFinal = sidebar;
  let surfaceFinal = surface;
  let raisedFinal = surfaceRaisedFinal;
  let rowActiveFinal = sidebarRowActive;

  if (isLight) {
    sidebarFinal = deepenFrom(canvas, sidebar, 0.008, b.oneBg3);
    surfaceFinal = liftFrom(canvas, surface, 0.01, "#ffffff");
    raisedFinal = liftFrom(surfaceFinal, surfaceRaisedFinal, 0.006, "#ffffff");
  } else {
    sidebarFinal = deepenFrom(canvas, sidebar, 0.006, "#000000");
    surfaceFinal = liftFrom(canvas, surface, 0.006, b.oneBg);
    raisedFinal = liftFrom(surfaceFinal, surfaceRaisedFinal, 0.004, b.lightBg);
    rowActiveFinal = liftFrom(sidebarFinal, sidebarRowActive, 0.004, b.oneBg);
    if (lum(canvas) - lum(sidebarFinal) < 0.0035) {
      sidebarFinal = mixColors(canvas, "#000000", 0.72);
    }
  }

  const messageSurface = messageBubbleSurface(accentSurface, accent, canvas, isLight);
  const terminalSelection = terminalSelectionColor(canvas, accent, isLight, b);
  const secondaryFinal = isLight ? deepenFrom(surfaceFinal, secondary, 0.006, b.oneBg3) : surfaceFinal;
  const codeBg = surfaceFinal;
  const sidebarMuted = readable(b.lightGrey, sidebarFinal, 4.5, text);
  accentInk = onFill(accent, isLight ? b.black : text, isLight ? text : b.darkerBlack);

  return {
    canvas,
    chrome: canvas,
    toolbar: canvas,
    toolbarForeground: text,
    toolbarBorder: hairlineBase,
    toolbarControl: control,
    toolbarControlForeground: text,
    toolbarControlHover: controlHover,
    surface: surfaceFinal,
    surfaceRaised: raisedFinal,
    surfaceOverlay: overlay,
    text,
    textMuted,
    border: borderFinal,
    input: hairline(b.oneBg3, canvas, ink),
    focus: accent,
    accent,
    accentForeground: accentInk,
    secondary: secondaryFinal,
    secondaryForeground: secondaryFg,
    muted,
    mutedForeground: mutedFg,
    placeholder: quiet,
    secondaryLabel: textMuted,
    iconMuted: quiet,
    error: b.red,
    errorForeground: statusForeground(b.red, errorSurface, isLight, ink),
    errorSurface,
    warning: b.yellow,
    warningForeground: statusForeground(b.yellow, warningSurface, isLight, ink),
    warningSurface,
    update: accent,
    updateForeground: statusForeground(accent, updateSurface, isLight, ink),
    updateSurface,
    accentSurface,
    accentSurfaceForeground: accentSurfaceFg,
    messageSurface,
    messageForeground: text,
    messageAction: accent,
    messageActionForeground: accentInk,
    messageActionHover: mixColors(accent, isLight ? "#000000" : "#ffffff", isLight ? 0.14 : 0.16),
    codeBackground: codeBg,
    codeForeground: text,
    searchMatchBackground: searchMatch,
    searchMatchForeground: readable(text, searchMatch, 4.5, ink),
    searchMatchActiveBackground: b.yellow,
    searchMatchActiveForeground: readable(
      onFill(b.yellow, isLight ? b.black : text, isLight ? text : b.darkerBlack),
      b.yellow,
      4.5,
      ink
    ),
    sidebar: sidebarFinal,
    sidebarForeground: readable(text, sidebarFinal, 7, ink),
    sidebarMutedForeground: sidebarMuted,
    sidebarControlSurface: isLight ? accentSurface : canvas,
    sidebarRowHover,
    sidebarRowActive: rowActiveFinal,
    sidebarRowSelected,
    sidebarBorder: hairline(b.line, sidebarFinal, ink),
    terminalBackground: canvas,
    terminalForeground: text,
    terminalCursor: terminalCursorColor(accent, canvas, isLight, b),
    terminalSelection,
    terminalScrollbar: readable(b.oneBg2, canvas, 1.25, isLight ? b.grey : ink),
    terminalScrollbarHover: readable(b.grey, canvas, 1.35, isLight ? b.lightGrey : ink)
  };
};

export const buildT3CodeTheme = (
  entry: T3CodeCuration,
  resolve: (id: string) => ThemeSpec
): T3CodeThemeFile => {
  const base = resolve(entry.id);
  const file: T3CodeThemeFile = {
    version: 1,
    name: entry.name,
    appearance: base.type,
    colors: buildT3CodeColors(base, entry.accent)
  };
  if (entry.variant) {
    const sibling = resolve(entry.variant);
    if (sibling.type === base.type) {
      throw new Error(`${entry.variant} must be the opposite appearance of ${entry.id}`);
    }
    const siblingAccent = matchingHueKey(sibling, pickAccent(base.base30, entry.accent));
    file.variants = { [sibling.type]: buildT3CodeColors(sibling, siblingAccent) };
  }
  return file;
};
