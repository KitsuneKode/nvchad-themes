import type { ThemeSpec } from "../types.ts";
import { mixColors, relativeLuminance } from "../utils.ts";

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
  /** base30 key for the signature accent when `blue` isn't the theme's voice */
  accent?: keyof ThemeSpec["base30"];
};

export const T3CODE_CURATION: readonly T3CodeCuration[] = [
  // Paired: one card, follows the system appearance
  { id: "rosepine", name: "Rosé Pine", variant: "rosepine-dawn", accent: "purple" },
  { id: "catppuccin", name: "Catppuccin", variant: "catppuccin-latte", accent: "purple" },
  { id: "everforest", name: "Everforest", variant: "everforest_light", accent: "green" },
  { id: "gruvbox", name: "Gruvbox", variant: "gruvbox_light", accent: "yellow" },
  { id: "flexoki", name: "Flexoki", variant: "flexoki-light", accent: "orange" },
  { id: "github_dark", name: "GitHub", variant: "github_light" },
  { id: "onedark", name: "One", variant: "one_light" },
  { id: "nord", name: "Nord", variant: "onenord_light" },
  { id: "ayu_dark", name: "Ayu", variant: "ayu_light", accent: "orange" },
  // Dark only
  { id: "kanagawa", name: "Kanagawa" },
  { id: "kanagawa-dragon", name: "Kanagawa Dragon", accent: "orange" },
  { id: "tokyonight", name: "Tokyo Night" },
  { id: "vesper", name: "Vesper", accent: "orange" },
  { id: "rxyhn", name: "Rxyhn" },
  { id: "poimandres", name: "Poimandres", accent: "teal" },
  { id: "oxocarbon", name: "Oxocarbon", accent: "pink" },
  { id: "nightfox", name: "Nightfox" },
  { id: "melange", name: "Melange", accent: "orange" },
  { id: "chadracula", name: "Dracula", accent: "purple" }
];

/** Prefix keeps published ids clear of built-ins (`ocean`, `ember`…) and older imports. */
export const t3codeThemeId = (paletteId: string): string =>
  `nv-${paletteId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export type T3CodeColors = Record<string, string>;

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

export const buildT3CodeColors = (theme: ThemeSpec, accentKey?: keyof ThemeSpec["base30"]): T3CodeColors => {
  const b = theme.base30;
  const isLight = theme.type === "light";
  const ink = isLight ? "#000000" : "#ffffff";

  const canvas = b.black;
  const text = readable(theme.base16.base05, canvas, 7, ink);
  const accent = readable(b[accentKey ?? "blue"], canvas, 3, ink);
  const accentInk = onFill(accent, isLight ? b.black : text, isLight ? text : b.darkerBlack);

  // Depth ladder. Structure (sidebar) is the heavier material; things you act on
  // lift toward the light. Light themes lift toward white instead of darkening,
  // so cards read as raised paper rather than recessed wells.
  // Several palettes (onedark, ayu, yoru, everblush…) ship darkerBlack within a hair
  // of black, which flattens the sidebar into the canvas; deepen it until the split reads.
  const sidebar = readable(b.darkerBlack, canvas, 1.06, "#000000");
  const surface = isLight ? mixColors(canvas, "#ffffff", 0.55) : b.black2;
  const surfaceRaised = isLight ? mixColors(canvas, "#ffffff", 0.75) : mixColors(b.black2, b.oneBg, 0.5);
  const overlay = isLight ? "#ffffff" : mixColors(b.black2, b.oneBg, 0.35);
  const control = isLight ? mixColors(canvas, "#ffffff", 0.6) : b.black2;
  const controlHover = isLight ? b.black2 : b.oneBg;

  const hairlineBase = hairline(b.line, canvas, ink);
  const border = hairline(b.oneBg2, canvas, ink);

  const textMuted = readable(b.lightGrey, canvas, 4.5, text);
  const sidebarMuted = readable(b.lightGrey, sidebar, 4.5, text);
  const quiet = readable(b.greyFg2, canvas, 3, text);

  // Tinted fills: a whisper of the status color over the canvas, ink kept legible.
  const tint = (color: string, amount: number) => mixColors(canvas, color, amount);
  const errorSurface = tint(b.red, isLight ? 0.1 : 0.14);
  const warningSurface = tint(b.yellow, isLight ? 0.14 : 0.12);
  const updateSurface = tint(accent, isLight ? 0.1 : 0.14);
  const searchMatch = tint(b.yellow, isLight ? 0.4 : 0.32);

  return {
    canvas,
    chrome: canvas,
    toolbar: canvas,
    toolbarForeground: text,
    toolbarBorder: hairlineBase,
    toolbarControl: control,
    toolbarControlForeground: text,
    toolbarControlHover: controlHover,
    surface,
    surfaceRaised,
    surfaceOverlay: overlay,
    text,
    textMuted,
    border,
    input: hairline(b.oneBg3, canvas, ink),
    focus: accent,
    accent,
    accentForeground: accentInk,
    secondary: surface,
    secondaryForeground: text,
    muted: surface,
    mutedForeground: textMuted,
    placeholder: quiet,
    secondaryLabel: textMuted,
    iconMuted: quiet,
    error: b.red,
    errorForeground: readable(b.red, errorSurface, 4.5, ink),
    errorSurface,
    warning: b.yellow,
    warningForeground: readable(b.yellow, warningSurface, 4.5, ink),
    warningSurface,
    update: accent,
    updateForeground: readable(accent, updateSurface, 4.5, ink),
    updateSurface,
    accentSurface: controlHover,
    accentSurfaceForeground: text,
    // The user's own bubble carries a breath of the accent — identity without noise.
    messageSurface: mixColors(isLight ? b.black2 : b.oneBg, accent, 0.06),
    messageForeground: text,
    messageAction: accent,
    messageActionForeground: accentInk,
    messageActionHover: mixColors(accent, isLight ? "#000000" : "#ffffff", 0.12),
    codeBackground: b.darkerBlack,
    codeForeground: text,
    searchMatchBackground: searchMatch,
    searchMatchForeground: readable(text, searchMatch, 4.5, ink),
    searchMatchActiveBackground: b.yellow,
    searchMatchActiveForeground: onFill(b.yellow, isLight ? b.black : text, isLight ? text : b.darkerBlack),
    sidebar,
    sidebarForeground: readable(text, sidebar, 7, ink),
    sidebarMutedForeground: sidebarMuted,
    sidebarControlSurface: canvas,
    sidebarRowHover: mixColors(sidebar, isLight ? b.oneBg : b.black2, 0.7),
    sidebarRowActive: isLight ? b.black2 : b.oneBg,
    sidebarRowSelected: isLight ? mixColors(b.black2, accent, 0.08) : mixColors(b.black2, accent, 0.1),
    sidebarBorder: hairline(b.line, sidebar, ink),
    terminalBackground: canvas,
    terminalForeground: text,
    terminalCursor: accent,
    terminalSelection: mixColors(canvas, accent, isLight ? 0.22 : 0.28),
    terminalScrollbar: b.oneBg2,
    terminalScrollbarHover: b.grey
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
    file.variants = { [sibling.type]: buildT3CodeColors(sibling, entry.accent) };
  }
  return file;
};
