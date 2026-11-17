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
  // The hue swap can land back on the canvas. Step toward a neutral gray until the wash reads.
  if (Math.abs(lum(sel) - lum(canvas)) < need) {
    const ceiling = isLight ? "#6e6e6e" : "#a3a3a3";
    for (let t = 0.08; t <= 0.72; t += 0.04) {
      const candidate = greySnap(mixColors(canvas, ceiling, t));
      if (Math.abs(lum(candidate) - lum(canvas)) >= need) {
        sel = candidate;
        break;
      }
    }
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

const srgbToLinear = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const linearToSrgb = (channel: number): number =>
  channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;

/** OKLCH lightness, chroma, and hue. Lightness matches the T3 Code ink targets. */
const oklchOf = (hex: string): { l: number; c: number; h: number } => {
  const [r, g, b] = [1, 3, 5].map((i) => srgbToLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(A, B), h: (Math.atan2(B, A) * 180) / Math.PI };
};

const inGamut = (l: number, c: number, h: number): [number, number, number] | null => {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l_ = l + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = l - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = l - 0.0894841775 * A - 1.291485548 * B;
  const ll = l_ ** 3;
  const mm = m_ ** 3;
  const ss = s_ ** 3;
  const rgb: [number, number, number] = [
    4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss,
    -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss,
    -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss
  ];
  return rgb.every((channel) => channel >= -0.0005 && channel <= 1.0005) ? rgb : null;
};

const hexFromOklch = (l: number, c: number, h: number): string => {
  const lightness = Math.min(1, Math.max(0, l));
  let lo = 0;
  let hi = Math.max(0, c);
  let rgb = inGamut(lightness, 0, h) ?? [lightness, lightness, lightness];
  for (let step = 0; step < 24; step += 1) {
    const mid = (lo + hi) / 2;
    const hit = inGamut(lightness, mid, h);
    if (hit) {
      lo = mid;
      rgb = hit;
    } else hi = mid;
  }
  const hex = rgb
    .map((channel) =>
      Math.round(Math.min(1, Math.max(0, linearToSrgb(channel))) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
  return `#${hex}`;
};

/**
 * T3 paints sidebar timestamps at 55%, settled titles at 70%, and idle rows at 75%.
 * The stored token has to be the pre-fade gray (neutral-400 / #8f8f8f / #737373),
 * with only a trace of the surface hue. Capping lightness here makes the second fade unreadable.
 */
const whisper = (reference: string, hint: string): string => {
  const tone = oklchOf(reference);
  const surface = oklchOf(hint);
  const chroma = surface.c >= 0.004 ? 0.006 : 0;
  return hexFromOklch(tone.l, chroma, surface.h);
};

const over = (fg: string, bg: string, alpha: number): string => {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [fr, fgG, fb] = channels(fg);
  const [br, bgG, bb] = channels(bg);
  const mix = (front: number, back: number) => Math.round(front * alpha + back * (1 - alpha));
  return `#${[mix(fr, br), mix(fgG, bgG), mix(fb, bb)]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
};

/** Raise lightness until the faded paint still clears `minContrast` on `background`. */
const holdFade = (color: string, background: string, alpha: number, minContrast: number): string => {
  let current = color;
  for (let step = 0; step < 16; step += 1) {
    if (contrastRatio(over(current, background, alpha), background) >= minContrast) return current;
    const tone = oklchOf(current);
    current = hexFromOklch(Math.min(0.9, tone.l + 0.02), tone.c, tone.h);
  }
  return current;
};

/** Near-white UI ink. Editor base05 is too dim for 14px titles; leave ink that is already there. */
const liftDarkInk = (color: string): string => {
  const tone = oklchOf(color);
  if (tone.l >= 0.945) return color;
  return hexFromOklch(0.96, Math.min(0.01, tone.c), tone.h);
};

/**
 * Dark action color, pulled toward T3's button (lightness 0.55–0.62, chroma
 * toward 0.19) so the label stays light. Hue stays. A step that leaves the
 * palette, collides with red, or cannot hold light ink is refused.
 */
const settleDarkAccent = (
  accent: string,
  identity: string,
  canvas: string,
  red: string,
  lightInk: string
): string => {
  const tone = oklchOf(accent);
  const aimC = Math.min(0.2, Math.max(tone.c, Math.min(0.19, tone.c + 0.08)));
  const targets: number[] = [];
  const push = (l: number) => {
    const next = Math.round(Math.min(tone.l, Math.max(0.5, l)) * 1000) / 1000;
    if (targets.some((existing) => Math.abs(existing - next) < 0.007)) return;
    targets.push(next);
  };
  if (tone.l > 0.62) {
    for (const l of [0.58, 0.6, 0.56, 0.55]) push(l);
    for (let l = 0.64; l <= tone.l + 0.001; l += 0.02) push(l);
  } else if (tone.l > 0.55) {
    push(tone.l);
    for (let l = tone.l - 0.02; l >= 0.55; l -= 0.02) push(l);
  } else {
    push(tone.l);
  }

  const accepts = (candidate: string, minInk: number): boolean => {
    if (contrastRatio(candidate, canvas) < 3) return false;
    if (hueGapHex(candidate, red) < 12) return false;
    if (!(hueGapHex(candidate, red) >= 15 || lum(candidate) - lum(red) > 0.05)) return false;
    if (hueGapHex(candidate, identity) > 42) return false;
    // Light ink has to clear the button. It does not have to beat near-black ink:
    // a green at the same lightness is brighter to WCAG than a blue, and black would
    // otherwise win while the label is still readable.
    return contrastRatio(lightInk, candidate) >= minInk;
  };

  const chromaSteps = [aimC, Math.max(tone.c, aimC - 0.04), tone.c];
  for (const l of targets) {
    for (const c of chromaSteps) {
      const candidate = hexFromOklch(l, c, tone.h);
      if (accepts(candidate, 3)) return candidate;
    }
  }

  if (tone.c >= 0.16) return accent;
  const nudged = hexFromOklch(tone.l, Math.min(0.16, tone.c + 0.08), tone.h);
  if (
    contrastRatio(nudged, canvas) >= 3 &&
    hueGapHex(nudged, red) >= 12 &&
    hueGapHex(nudged, identity) <= 45
  ) {
    return nudged;
  }
  return accent;
};

/** White wash on a dark surface. Starts at T3's 8% line and stops at the first mix that reads. */
const darkHairline = (base: string, minContrast = 1.18): string => {
  let chosen = mixColors(base, "#ffffff", 0.08);
  for (let amount = 0.08; amount <= 0.2; amount += 0.005) {
    chosen = mixColors(base, "#ffffff", Number(amount.toFixed(3)));
    if (contrastRatio(chosen, base) >= minContrast) return chosen;
  }
  return chosen;
};

/**
 * White wash that stays inside a contrast band on `base` and clears each neighbor.
 * The composer field, the user bubble, and the header button all sit in one column.
 * A wash that only clears the canvas lands on the bubble and reads as a second message.
 */
const washClear = (
  base: string,
  neighbors: ReadonlyArray<readonly [string, number]>,
  minOnBase: number,
  maxOnBase: number
): string => {
  let best = mixColors(base, "#ffffff", 0.12);
  let bestRank = -1;
  for (let amount = 0.08; amount <= 0.42; amount += 0.005) {
    const candidate = mixColors(base, "#ffffff", Number(amount.toFixed(3)));
    const onBase = contrastRatio(candidate, base);
    if (onBase < minOnBase) continue;
    if (onBase > maxOnBase) break;
    const cleared = neighbors.filter(([color, min]) => contrastRatio(candidate, color) >= min).length;
    const rank = cleared * 100 + onBase;
    if (rank > bestRank) {
      best = candidate;
      bestRank = rank;
    }
    if (cleared === neighbors.length) return candidate;
  }
  return best;
};

/** Axis-neutral fill — grey-forward mix so hue stays off the accent on blue/cyan palettes. */
const neutralRaised = (canvas: string, isLight: boolean): string =>
  toAchromaticNeutral(canvas, isLight, 0.014);

const isNeutralFill = (hex: string): boolean => hueOf(hex).chroma < 0.045;

/** Neutral chat bubble. A tinted fill can carry the palette; a grey floor uses T3's quiet 8% white step.
 * The mid-grey snap sat on the menu selection and read as a second highlight. */
const messageBubbleSurface = (
  accentSurface: string,
  accent: string,
  canvas: string,
  isLight: boolean
): string => {
  if (!isNeutralFill(accentSurface) && hueGapHex(accentSurface, accent) >= 12) {
    return accentSurface;
  }
  if (isLight) {
    // On a white canvas the raised neutral is white too and the bubble vanished.
    // T3 light seats its bubble one quiet grey step below the page.
    const raised = neutralRaised(canvas, true);
    return contrastRatio(raised, canvas) >= 1.06 ? raised : mixColors(canvas, "#000000", 0.045);
  }
  return mixColors(canvas, "#ffffff", 0.08);
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
  const accentSource = pickAccent(b, accentKey);
  let accent = readable(accentSource, canvas, isLight ? 3 : 4, ink);
  if (!isLight) {
    accent = settleDarkAccent(accent, accentSource, canvas, b.red, liftDarkInk(text));
  }
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

  // Dark selection is replaced once the cards are final. This first value only feeds the chat bubble.
  let accentSurface = isLight
    ? deepenFrom(canvas, b.oneBg2, 0.012, b.oneBg3)
    : liftFrom(surface, b.lightBg, 0.005, b.oneBg);

  let hairlineBase = hairline(b.line, canvas, ink);
  if (contrastRatio(hairlineBase, canvas) < 1.18) {
    hairlineBase = hairline(mixColors(b.line, ink, isLight ? 0.25 : 0.35), canvas, ink);
  }
  const border = hairline(b.oneBg2, canvas, ink);
  let borderFinal = contrastRatio(border, canvas) >= 1.15 ? border : hairlineBase;

  const textMutedRaw = readable(b.lightGrey, canvas, 4.5, text);
  const quietRaw = readable(b.greyFg2, canvas, 3, text);

  // Tinted fills: a whisper of the status color over the canvas, ink kept legible.
  // Dark banners keep climbing until the wash clears the canvas. Solarized's red
  // at 14% sat at 1.05:1 and the banner disappeared into the teal floor.
  const statusTint = (color: string, start: number): string => {
    let chosen = mixColors(canvas, color, start);
    if (isLight) return chosen;
    for (let amount = start; amount <= 0.4; amount += 0.02) {
      chosen = mixColors(canvas, color, Number(amount.toFixed(2)));
      if (contrastRatio(chosen, canvas) >= 1.16) return chosen;
    }
    return chosen;
  };
  const errorSurface = statusTint(b.red, isLight ? 0.1 : 0.14);
  const warningSurface = statusTint(b.yellow, isLight ? 0.14 : 0.12);
  const updateSurface = statusTint(accent, isLight ? 0.1 : 0.14);
  // Pale palette yellows (Oceanic light) washed out at 40%; climb until the hit clears the page.
  let searchMatch = mixColors(canvas, b.yellow, isLight ? 0.4 : 0.32);
  for (let amount = isLight ? 0.4 : 0.32; contrastRatio(searchMatch, canvas) < 1.3 && amount <= 0.8; amount += 0.05) {
    searchMatch = mixColors(canvas, b.yellow, amount);
  }
  if (contrastRatio(searchMatch, canvas) < 1.3) searchMatch = readable(searchMatch, canvas, 1.3, ink);
  // Light rows stay a rising ladder. Dark rows are rewritten once the sidebar is final.
  let sidebarRowHover = isLight
    ? liftFrom(sidebar, mixColors(sidebar, "#ffffff", 0.45), 0.003, "#ffffff")
    : liftFrom(sidebar, b.black2, 0.003, b.oneBg);

  const sidebarRowActive = isLight
    ? liftFrom(sidebarRowHover, mixColors(canvas, "#ffffff", 0.92), 0.003, "#ffffff")
    : liftFrom(sidebarRowHover, b.oneBg, 0.003, b.lightBg);

  let sidebarRowSelected = isLight
    ? liftFrom(sidebarRowActive, mixColors(sidebarRowActive, "#ffffff", 0.08), 0.003, "#ffffff")
    : sidebarRowActive;

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
    if (lum(canvas) - lum(sidebarFinal) < 0.0035) {
      sidebarFinal = mixColors(canvas, "#000000", 0.72);
    }
    // T3's own stack: selected 7% white, hover 8%, active 11%. Selected sits under the active row.
    sidebarRowHover = mixColors(sidebarFinal, "#ffffff", 0.08);
    sidebarRowSelected = mixColors(sidebarFinal, "#ffffff", 0.07);
    rowActiveFinal = mixColors(sidebarFinal, "#ffffff", 0.11);
    borderFinal = darkHairline(canvas);
    hairlineBase = borderFinal;
  }

  const messageSurface = messageBubbleSurface(accentSurface, accent, canvas, isLight);
  if (!isLight) {
    const seat = lum(overlay) >= lum(raisedFinal) ? overlay : raisedFinal;
    // Menus, the model list, and hovers all paint this fill. A 7% white step on the
    // lightest card matches a selected sidebar row, and stays above the card itself.
    accentSurface = mixColors(seat, "#ffffff", 0.07);
  }
  const terminalSelection = readable(terminalSelectionColor(canvas, accent, isLight, b), canvas, 1.2, ink);
  const secondaryFinal = isLight ? deepenFrom(surfaceFinal, secondary, 0.006, b.oneBg3) : surfaceFinal;
  const codeBg = surfaceFinal;
  const uiText = isLight ? text : liftDarkInk(text);
  const textMuted = isLight
    ? textMutedRaw
    : holdFade(whisper("#a3a3a3", sidebarFinal), sidebarFinal, 0.55, 3);
  const secondaryLabel = isLight
    ? textMuted
    : holdFade(whisper("#8f8f8f", sidebarFinal), sidebarFinal, 0.7, 3.45);
  const sidebarMuted = isLight
    ? readable(b.lightGrey, sidebarFinal, 4.5, text)
    : holdFade(whisper("#a3a3a3", sidebarFinal), sidebarFinal, 0.75, 4.5);
  const quiet = isLight ? quietRaw : holdFade(whisper("#737373", sidebarFinal), canvas, 1, 3);
  const input = isLight
    ? hairline(b.oneBg3, canvas, ink)
    : washClear(
        canvas,
        [
          [messageSurface, 1.14],
          [accentSurface, 1.12],
          [control, 1.1]
        ],
        1.22,
        1.7
      );
  // Placeholder sits inside the field, so it is measured there (T3: 3.5:1 on its input).
  const placeholder = readable(quiet, input, 3, isLight ? text : uiText);
  const mutedForeground = readable(textMuted, muted, 4.5, isLight ? text : uiText);
  // A pale yellow dot on a light page disappeared; keep the warning glyph at 3:1.
  const warningTone = isLight ? readable(b.yellow, canvas, 3, ink) : b.yellow;
  const lightLabel = !isLight && contrastRatio(uiText, accent) >= 3;
  accentInk = lightLabel
    ? uiText
    : onFill(accent, isLight ? b.black : uiText, isLight ? uiText : b.darkerBlack);

  return {
    canvas,
    chrome: canvas,
    toolbar: canvas,
    toolbarForeground: uiText,
    toolbarBorder: hairlineBase,
    toolbarControl: control,
    toolbarControlForeground: uiText,
    toolbarControlHover: controlHover,
    surface: surfaceFinal,
    surfaceRaised: raisedFinal,
    surfaceOverlay: overlay,
    text: uiText,
    textMuted,
    border: borderFinal,
    input,
    focus: accent,
    accent,
    accentForeground: accentInk,
    secondary: secondaryFinal,
    secondaryForeground: uiText,
    muted,
    mutedForeground,
    placeholder,
    secondaryLabel,
    iconMuted: quiet,
    error: b.red,
    errorForeground: statusForeground(b.red, errorSurface, isLight, ink),
    errorSurface,
    warning: warningTone,
    warningForeground: statusForeground(b.yellow, warningSurface, isLight, ink),
    warningSurface,
    update: accent,
    updateForeground: statusForeground(accent, updateSurface, isLight, ink),
    updateSurface,
    accentSurface,
    accentSurfaceForeground: readable(uiText, accentSurface, 7, ink),
    messageSurface,
    messageForeground: uiText,
    messageAction: accent,
    messageActionForeground: accentInk,
    // Hover moves away from the label, like T3's blue-600 hover. Lightening under a
    // white label dropped it to ~2.7:1 on every dark theme.
    messageActionHover: mixColors(accent, lum(accentInk) > lum(accent) ? "#000000" : "#ffffff", 0.14),
    codeBackground: codeBg,
    codeForeground: uiText,
    searchMatchBackground: searchMatch,
    searchMatchForeground: readable(uiText, searchMatch, 4.5, ink),
    searchMatchActiveBackground: b.yellow,
    searchMatchActiveForeground: readable(
      onFill(b.yellow, isLight ? b.black : text, isLight ? text : b.darkerBlack),
      b.yellow,
      4.5,
      ink
    ),
    sidebar: sidebarFinal,
    sidebarForeground: readable(uiText, sidebarFinal, 7, isLight ? ink : "#ffffff"),
    sidebarMutedForeground: sidebarMuted,
    sidebarControlSurface: isLight ? accentSurface : canvas,
    sidebarRowHover,
    sidebarRowActive: rowActiveFinal,
    sidebarRowSelected,
    sidebarBorder: isLight ? hairline(b.line, sidebarFinal, ink) : darkHairline(sidebarFinal),
    terminalBackground: canvas,
    terminalForeground: uiText,
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
