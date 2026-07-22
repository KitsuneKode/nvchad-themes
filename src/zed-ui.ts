import type { ThemeSpec } from "./types.ts";
import type { ZedSurfaceLadder } from "./surfaces.ts";
import { zedChromeMuted } from "./zed-chrome.ts";
import {
  editorInvisibleColor,
  separatorColors,
  zedPanelMuted
} from "./separators.ts";
import { alpha, ensureSeparatorContrast, mixColors, relativeLuminance } from "./utils.ts";

export type ZedUiTokens = {
  ladder: ZedSurfaceLadder;
  border: string;
  borderFocused: string;
  focusedPaneBorder: string;
  text: string;
  textMuted: string;
  textPlaceholder: string;
  textDisabled: string;
  icon: string;
  iconMuted: string;
  iconPlaceholder: string;
  elementHover: string;
  elementActive: string;
  elementSelected: string;
  ghostHover: string;
  ghostActive: string;
  ghostSelected: string;
  lineNumber: string;
  activeLineNumber: string;
  activeLineBg: string;
  highlightedLineBg: string;
  indentGuide: string;
  indentGuideActive: string;
  panelIndentGuide: string;
  panelIndentGuideActive: string;
  wrapGuide: string;
  documentHighlight: string;
  bracketHighlight: string;
  searchMatch: string;
  searchActiveMatch: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  scrollbarTrack: string;
  editorInvisible: string;
};

const alphaBorder = (hex: string, opacity: number): string => {
  const channel = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex.slice(0, 7)}${channel}`;
};

/** Solid focused pane border — readable on panel chrome (reference: zed-kanagawa). */
export const zedFocusedPaneBorder = (theme: ThemeSpec, surface: string): string =>
  ensureSeparatorContrast(theme.base30.white, surface, 0.03);

const scrollbarThumbBase = (
  theme: ThemeSpec,
  ladder: ZedSurfaceLadder,
  sep: ReturnType<typeof separatorColors>
): string => {
  if (theme.type === "light") {
    return sep.scrollbarThumb;
  }
  const step = relativeLuminance(ladder.raised) - relativeLuminance(ladder.background);
  if (step < 0.02) {
    return sep.indentGuideActive;
  }
  return ladder.raised;
};

/**
 * Zed UI tokens aligned with quality reference themes (e.g. zed-tokyo-night):
 * surface chrome darker than editor well; active tab raised; solid selection/hover.
 */
export const zedUiTokens = (theme: ThemeSpec, ladderOverride?: ZedSurfaceLadder): ZedUiTokens => {
  const base = theme.base30;
  const b16 = theme.base16;
  const ladder = ladderOverride ?? {
    background: base.black,
    surface: base.darkerBlack,
    panel: base.darkerBlack,
    crust: base.darkerBlack,
    elevated: base.darkerBlack,
    raised: base.oneBg2,
    element: base.black,
    selectedAlpha: theme.type === "light" ? 0.35 : 0.45
  };
  const sep = separatorColors(theme, {
    editorWell: ladder.background,
    panelBg: ladder.panel
  });
  const documentHighlight = mixColors(ladder.background, base.oneBg2, 0.55);
  const chromeMuted = zedChromeMuted(theme);
  const panelMuted = zedPanelMuted(theme, ladder.panel, chromeMuted);
  const thumbBase = scrollbarThumbBase(theme, ladder, sep);
  const focusedPaneBorder = zedFocusedPaneBorder(theme, ladder.panel);

  if (theme.type === "light") {
    const border = mixColors(ladder.panel, b16.base00, 0.12);
    return {
      ladder,
      border,
      borderFocused: alphaBorder(base.lightGrey, 0.2),
      focusedPaneBorder,
      text: b16.base05,
      textMuted: panelMuted,
      textPlaceholder: panelMuted,
      textDisabled: b16.base03,
      icon: b16.base04,
      iconMuted: panelMuted,
      iconPlaceholder: base.greyFg,
      elementHover: base.greyFg,
      elementActive: mixColors(ladder.background, base.white, 0.55),
      elementSelected: base.greyFg,
      ghostHover: base.greyFg,
      ghostActive: mixColors(ladder.background, base.white, 0.55),
      ghostSelected: base.greyFg,
      lineNumber: sep.indentGuide,
      activeLineNumber: b16.base05,
      activeLineBg: mixColors(ladder.background, b16.base00, 0.06),
      highlightedLineBg: mixColors(ladder.background, b16.base00, 0.06),
      indentGuide: sep.indentGuide,
      indentGuideActive: sep.indentGuideActive,
      panelIndentGuide: sep.treeIndent,
      panelIndentGuideActive: sep.treeIndentActive,
      wrapGuide: sep.wrapGuide,
      documentHighlight: sep.indentGuide,
      bracketHighlight: base.greyFg,
      searchMatch: base.oneBg2,
      searchActiveMatch: base.oneBg2,
      scrollbarThumb: alpha(thumbBase, 0.5),
      scrollbarThumbHover: thumbBase,
      scrollbarTrack: alpha(ladder.background, 0.5),
      editorInvisible: editorInvisibleColor(theme)
    };
  }

  const border = mixColors(ladder.panel, "#000000", 0.28);

  return {
    ladder,
    border,
    borderFocused: alphaBorder(base.lightGrey, 0.2),
    focusedPaneBorder,
    text: b16.base05,
    textMuted: chromeMuted,
    textPlaceholder: chromeMuted,
    textDisabled: base.greyFg2,
    icon: chromeMuted,
    iconMuted: chromeMuted,
    iconPlaceholder: base.greyFg,
    elementHover: base.greyFg,
    elementActive: base.oneBg3,
    elementSelected: base.greyFg,
    ghostHover: base.greyFg,
    ghostActive: base.oneBg3,
    ghostSelected: base.greyFg,
    lineNumber: base.greyFg2,
    activeLineNumber: b16.base05,
    activeLineBg: base.black2,
    highlightedLineBg: base.black2,
    indentGuide: sep.indentGuide,
    indentGuideActive: sep.indentGuideActive,
    panelIndentGuide: sep.treeIndent,
    panelIndentGuideActive: sep.treeIndentActive,
    wrapGuide: border,
    documentHighlight,
    bracketHighlight: base.oneBg2,
    searchMatch: base.oneBg2,
    searchActiveMatch: base.oneBg2,
    scrollbarThumb: alpha(thumbBase, 0.5),
    scrollbarThumbHover: thumbBase,
    scrollbarTrack: alpha(ladder.background, 0.5),
    editorInvisible: editorInvisibleColor(theme)
  };
};
