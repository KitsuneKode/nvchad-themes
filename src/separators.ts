import type { ThemeSpec } from "./types.ts";
import type { ZedIndentGuideStyle, ZedLineNumberStyle } from "./profiles/types.ts";
import { ensureSeparatorContrast, mixColors, pickActiveSeparator, relativeLuminance } from "./utils.ts";

export type SeparatorColors = {
  /** Panel splits, sidebar edge, tab strip — crisp and readable */
  border: string;
  /** Pane groups, editor group splits */
  borderStrong: string;
  /** Inactive indent / wrap guides */
  indentGuide: string;
  /** Active indent column (editor + panel tree) */
  indentGuideActive: string;
  /** Editor wrap column guide */
  wrapGuide: string;
  /** Explorer tree inactive indent */
  treeIndent: string;
  /** Explorer tree active indent (current depth) */
  treeIndentActive: string;
  /** Subtle inner dividers (section headers) */
  borderSubtle: string;
  /** Scrollbar thumb (solid base for alpha suffix) */
  scrollbarThumb: string;
  /** Scrollbar thumb on hover */
  scrollbarThumbHover: string;
};

const activeSeparatorCandidates = (theme: ThemeSpec): string[] => {
  const base = theme.base30;
  return [base.greyFg, base.lightGrey, base.oneBg2, base.oneBg3];
};

export const zedInactiveGuide = (theme: ThemeSpec, background: string): string => {
  const base = theme.base30;
  const mixed =
    theme.type === "light"
      ? mixColors(background, base.greyFg2, 0.55)
      : mixColors(background, base.greyFg2, 0.42);

  return ensureSeparatorContrast(
    mixed,
    background,
    theme.type === "light" ? 0.02 : 0.025,
    theme.type === "light" ? "darker" : "lighter"
  );
};

const deriveActiveGuide = (theme: ThemeSpec, inactive: string): string =>
  pickActiveSeparator(inactive, activeSeparatorCandidates(theme), theme.type === "light" ? 0.04 : 0.05);

/**
 * Solid separator colors — no alpha on lines (alpha causes foggy/blended edges on GPUI).
 * Reference: zed-tokyo-night — inactive guides muted, active guides match element.hover tier.
 */
export const separatorColors = (
  theme: ThemeSpec,
  surfaces?: { editorWell?: string; panelBg?: string }
): SeparatorColors => {
  const base = theme.base30;
  const editorWell = surfaces?.editorWell ?? base.black;
  const panelBg = surfaces?.panelBg ?? base.darkerBlack;

  if (theme.type === "light") {
    const indentGuide = zedInactiveGuide(theme, editorWell);
    const indentGuideActive = deriveActiveGuide(theme, indentGuide);
    const panelIndent = zedInactiveGuide(theme, panelBg);
    const panelIndentActive = deriveActiveGuide(theme, panelIndent);

    return {
      border: mixColors(base.line, base.grey, 0.5),
      borderStrong: base.grey,
      indentGuide,
      indentGuideActive,
      wrapGuide: ensureSeparatorContrast(base.greyFg2, editorWell, 0.02, "darker"),
      treeIndent: panelIndent,
      treeIndentActive: panelIndentActive,
      borderSubtle: base.greyFg2,
      scrollbarThumb: indentGuideActive,
      scrollbarThumbHover: indentGuideActive
    };
  }

  const border = mixColors(base.line, base.grey, 0.62);
  const borderStrong = mixColors(base.grey, base.greyFg, 0.42);
  const indentGuide = zedInactiveGuide(theme, editorWell);
  const indentGuideActive = deriveActiveGuide(theme, indentGuide);
  const panelIndent = zedInactiveGuide(theme, panelBg);
  const panelIndentActive = deriveActiveGuide(theme, panelIndent);

  return {
    border,
    borderStrong,
    indentGuide,
    indentGuideActive,
    wrapGuide: ensureSeparatorContrast(mixColors(base.line, base.grey, 0.48), editorWell, 0.02),
    treeIndent: panelIndent,
    treeIndentActive: panelIndentActive,
    borderSubtle: mixColors(base.line, base.grey, 0.38),
    scrollbarThumb: indentGuideActive,
    scrollbarThumbHover: indentGuideActive
  };
};

/** Recompute active guide after a profile overrides inactive indent (e.g. Tokyo #363b54). */
export const activeGuideForInactive = (theme: ThemeSpec, inactive: string): string =>
  deriveActiveGuide(theme, inactive);

/** Tokyo Night inactive indent tier (~#363b54 on standard Tokyo palettes). */
export const zedTokyoIndent = (well: string, theme: ThemeSpec): string =>
  ensureSeparatorContrast(
    mixColors(well, theme.base30.greyFg, 0.46),
    well,
    theme.type === "light" ? 0.02 : 0.025,
    theme.type === "light" ? "darker" : "lighter"
  );

/** Profile-driven gutter line numbers (default: greyFg2 on dark). */
export const zedLineNumber = (
  theme: ThemeSpec,
  well: string,
  style: ZedLineNumberStyle
): string => {
  const base = theme.base30;
  const b16 = theme.base16;
  if (style === "kanagawa-teal") {
    return ensureSeparatorContrast(mixColors(b16.base04, base.teal, 0.65), well, 0.02);
  }
  if (style === "tokyo-muted") {
    return zedTokyoIndent(well, theme);
  }
  return theme.type === "light" ? zedInactiveGuide(theme, well) : base.greyFg2;
};

/** Profile-driven inactive indent (editor + panel). */
export const zedIndentGuide = (
  theme: ThemeSpec,
  well: string,
  style: ZedIndentGuideStyle
): string => (style === "tokyo-muted" ? zedTokyoIndent(well, theme) : zedInactiveGuide(theme, well));

/** Whitespace / invisible characters in the editor (zed-kanagawa uses muted fg + alpha). */
export const editorInvisibleColor = (theme: ThemeSpec): string => {
  const base = theme.base30;
  const b16 = theme.base16;
  const well = base.black;
  const muted = mixColors(b16.base05, well, theme.type === "light" ? 0.55 : 0.65);
  const channel = Math.round(0.4 * 255)
    .toString(16)
    .padStart(2, "0");
  return `${muted.slice(0, 7)}${channel}`;
};

/** Light-theme panel chrome: keep muted text darker than panel surface. */
export const zedPanelMuted = (theme: ThemeSpec, panelBg: string, fallback: string): string => {
  if (theme.type !== "light") {
    return fallback;
  }
  const b16 = theme.base16;
  let muted = mixColors(b16.base05, panelBg, 0.42);
  if (relativeLuminance(muted) >= relativeLuminance(panelBg) - 0.01) {
    muted = mixColors(b16.base05, panelBg, 0.58);
  }
  return muted;
};
