import type { ThemeSpec } from "../types.ts";
import { relativeLuminance } from "../utils.ts";
import type { T3CodeColors } from "./t3code.ts";

const lum = (hex: string) => relativeLuminance(hex);

export const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const hueOf = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const chroma = max - Math.min(r, g, b);
  if (chroma === 0) return 0;
  const hue =
    max === r ? ((g - b) / chroma) % 6 : max === g ? (b - r) / chroma + 2 : (r - g) / chroma + 4;
  return ((hue * 60 + 360) % 360);
};

const hueGap = (a: string, b: string) => {
  const d = Math.abs(hueOf(a) - hueOf(b));
  return Math.min(d, 360 - d);
};

const clamp10 = (x: number) => Math.round(Math.max(0, Math.min(10, x)) * 10) / 10;

/** T3 Code dark reference: relative luminance gaps between roles (not absolute hex). */
const DARK_LUM_GAPS = {
  sidebarBelowCanvas: 0.01,
  surfaceAboveCanvas: 0.008,
  raisedAboveSurface: 0.006,
  sidebarRowStep: 0.004
} as const;

const LIGHT_LUM_GAPS = {
  sidebarBelowCanvas: 0.008,
  surfaceAboveCanvas: 0.01,
  chipBelowSurface: 0.006,
  sidebarRowStep: 0.004
} as const;

export const T3CODE_QUALITY_DIMENSIONS = [
  "depthLadder",
  "contrastSafety",
  "semanticBanners",
  "chatAndCode",
  "sidebarStates",
  "terminal",
  "lightChips",
  "borders",
  "accentSafety",
  "paletteIdentity",
  "searchMatch",
  "actionHover"
] as const;

export type T3CodeQualityDimension = (typeof T3CODE_QUALITY_DIMENSIONS)[number];

export type T3CodeQualityScore = Record<T3CodeQualityDimension, number> & { overall: number };

const adaptiveGap = (canvasLum: number, nominal: number, headroom: number) =>
  Math.min(nominal, Math.max(0.002, headroom));

export const scoreT3CodeColors = (
  colors: T3CodeColors,
  appearance: "light" | "dark",
  options?: { palette?: ThemeSpec; accentReference?: string }
): T3CodeQualityScore => {
  const palette = options?.palette;
  const accentReference = options?.accentReference;
  const isLight = appearance === "light";
  const gaps = isLight ? LIGHT_LUM_GAPS : DARK_LUM_GAPS;
  const canvasL = lum(colors.canvas);
  const rowGap = adaptiveGap(canvasL, gaps.sidebarRowStep, (1 - lum(colors.sidebar)) * 0.08);

  const depthParts: number[] = [];
  if (isLight) {
    depthParts.push(lum(colors.sidebar) <= canvasL ? 1 : 0);
    depthParts.push(lum(colors.surface) >= canvasL ? 1 : 0);
    depthParts.push(lum(colors.secondary) <= lum(colors.surface) ? 1 : 0);
    depthParts.push(lum(colors.surfaceRaised) >= lum(colors.surface) ? 1 : 0);
  } else {
    depthParts.push(lum(colors.sidebar) <= canvasL ? 1 : 0);
    depthParts.push(lum(colors.surface) >= canvasL ? 1 : 0);
    depthParts.push(lum(colors.surfaceRaised) >= lum(colors.surface) ? 1 : 0);
    depthParts.push(lum(colors.sidebarRowActive) >= lum(colors.sidebar) ? 1 : 0);
  }

  const contrastPairs: ReadonlyArray<[string, string, number]> = [
    ["text", "canvas", 4.5],
    ["textMuted", "canvas", 3],
    ["sidebarForeground", "sidebar", 4.5],
    ["errorForeground", "errorSurface", 4.5],
    ["warningForeground", "warningSurface", 4.5],
    ["accentForeground", "accent", 3],
    ["messageForeground", "messageSurface", 4.5]
  ];
  const contrastHits = contrastPairs.filter(([fg, bg, min]) => contrastRatio(colors[fg]!, colors[bg]!) >= min);

  const semanticHits = (["error", "warning", "update"] as const).filter((role) => {
    const fg = colors[`${role}Foreground`];
    const base = colors[role];
    const surf = colors[`${role}Surface`];
    const contrastOk = contrastRatio(fg, surf) >= 4.5;
    return (fg !== base || role === "update") && contrastOk;
  });

  const chatCode =
    (colors.codeBackground === colors.surface ? 1 : 0) +
    (hueGap(colors.messageSurface, colors.accent) >= 4 ||
    Math.abs(lum(colors.messageSurface) - lum(colors.accent)) >= 0.04
      ? 1
      : 0.5);

  const sidebarSteps = (isLight
    ? [
        lum(colors.sidebarRowHover) - lum(colors.sidebar),
        lum(colors.sidebarRowActive) - lum(colors.sidebarRowHover)
      ]
    : [
        lum(colors.sidebarRowHover) - lum(colors.sidebar),
        lum(colors.sidebarRowActive) - lum(colors.sidebarRowHover),
        lum(colors.sidebarRowSelected) - lum(colors.sidebarRowActive)
      ]
  ).filter((step) => step >= rowGap * 0.35);

  const stepTarget = isLight ? 2 : 3;

  const selectionNeed = Math.min(
    0.038,
    Math.max(0.008, isLight ? canvasL * 0.12 + 0.012 : canvasL * 0.4 + 0.006)
  );
  const terminalParts = [
    contrastRatio(colors.terminalCursor, colors.canvas) >= (isLight ? 2.5 : 3) ? 1 : 0,
    colors.terminalBackground === colors.canvas ? 1 : 0,
    Math.abs(lum(colors.terminalSelection) - canvasL) >= selectionNeed ? 1 : 0
  ];

  const lightChips = isLight
    ? colors.secondary !== colors.surface &&
      colors.muted !== colors.surface &&
      colors.sidebar !== colors.canvas
      ? 1
      : 0
    : 1;

  const borderScore = contrastRatio(colors.border, colors.canvas) >= 1.15 ? 1 : 0;

  const accentSafe =
    (contrastRatio(colors.accent, colors.canvas) >= 3 ? 0.5 : 0) +
    (hueGap(colors.accent, colors.error) >= 15 || lum(colors.accent) - lum(colors.error) > 0.05 ? 0.5 : 0);

  const identityRef = accentReference ?? (palette ? palette.base30.pmenuBg : undefined);
  const paletteIdentity = identityRef
    ? hueGap(colors.accent, identityRef) <= 45
      ? 1
      : hueGap(colors.accent, identityRef) <= 70
        ? 0.85
        : 0.65
    : 1;

  const searchMatch =
    contrastRatio(colors.searchMatchForeground, colors.searchMatchBackground) >= 4.5 &&
    contrastRatio(colors.searchMatchActiveForeground, colors.searchMatchActiveBackground) >= 4.5
      ? 1
      : 0.5;

  const actionHover = colors.messageActionHover !== colors.messageAction ? 1 : 0;

  const scores: Record<T3CodeQualityDimension, number> = {
    depthLadder: clamp10((depthParts.reduce((a, b) => a + b, 0) / depthParts.length) * 10),
    contrastSafety: clamp10((contrastHits.length / contrastPairs.length) * 10),
    semanticBanners: clamp10((semanticHits.length / 3) * 10),
    chatAndCode: clamp10((chatCode / 2) * 10),
    sidebarStates: clamp10((sidebarSteps.length / stepTarget) * 10),
    terminal: clamp10((terminalParts.reduce((a, b) => a + b, 0) / terminalParts.length) * 10),
    lightChips: clamp10(lightChips * 10),
    borders: clamp10(borderScore * 10),
    accentSafety: clamp10(accentSafe * 10),
    paletteIdentity: clamp10(paletteIdentity * 10),
    searchMatch: clamp10(searchMatch * 10),
    actionHover: clamp10(actionHover * 10)
  };

  const overall =
    Math.round(
      (T3CODE_QUALITY_DIMENSIONS.reduce((sum, key) => sum + scores[key], 0) /
        T3CODE_QUALITY_DIMENSIONS.length) *
        10
    ) / 10;

  return { ...scores, overall };
};
