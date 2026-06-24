import type { ThemeSpec } from "./types.ts";
import { mixColors } from "./utils.ts";
import { zedLadder } from "./surfaces.ts";

export type ZedUiTokens = {
  ladder: ReturnType<typeof zedLadder>;
  border: string;
  borderFocused: string;
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
  wrapGuide: string;
  documentHighlight: string;
  bracketHighlight: string;
  searchMatch: string;
  searchActiveMatch: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  scrollbarTrack: string;
};

/**
 * Zed UI tokens aligned with quality reference themes (e.g. zed-tokyo-night):
 * surface chrome darker than editor well; active tab raised; solid selection/hover.
 */
export const zedUiTokens = (theme: ThemeSpec): ZedUiTokens => {
  const base = theme.base30;
  const b16 = theme.base16;
  const ladder = zedLadder(theme);

  if (theme.type === "light") {
    const border = mixColors(ladder.surface, b16.base00, 0.12);
    const indentGuide = mixColors(ladder.background, ladder.surface, 0.45);
    return {
      ladder,
      border,
      borderFocused: alphaBorder(base.lightGrey, 0.2),
      text: b16.base05,
      textMuted: b16.base04,
      textPlaceholder: b16.base04,
      textDisabled: b16.base03,
      icon: b16.base04,
      iconMuted: b16.base04,
      iconPlaceholder: base.greyFg,
      elementHover: base.greyFg,
      elementActive: mixColors(ladder.background, base.white, 0.55),
      elementSelected: base.greyFg,
      ghostHover: base.greyFg,
      ghostActive: mixColors(ladder.background, base.white, 0.55),
      ghostSelected: base.greyFg,
      lineNumber: indentGuide,
      activeLineNumber: b16.base05,
      activeLineBg: mixColors(ladder.background, b16.base00, 0.06),
      highlightedLineBg: mixColors(ladder.background, b16.base00, 0.06),
      indentGuide,
      indentGuideActive: base.greyFg,
      wrapGuide: border,
      documentHighlight: indentGuide,
      bracketHighlight: base.greyFg,
      searchMatch: base.greyFg,
      searchActiveMatch: base.greyFg,
      scrollbarThumb: `${base.greyFg}80`,
      scrollbarThumbHover: base.greyFg,
      scrollbarTrack: `${ladder.background}80`
    };
  }

  const border = mixColors(ladder.surface, "#000000", 0.28);
  const indentGuide = mixColors(ladder.background, ladder.surface, 0.62);
  const documentHighlight = mixColors(ladder.background, base.oneBg2, 0.55);

  return {
    ladder,
    border,
    borderFocused: alphaBorder(base.lightGrey, 0.2),
    text: b16.base05,
    // base04 is often too dark on the editor well; Tokyo Night uses ~#787c99 for text.muted.
    textMuted: base.lightGrey,
    textPlaceholder: base.lightGrey,
    textDisabled: base.greyFg2,
    icon: b16.base04,
    iconMuted: base.lightGrey,
    iconPlaceholder: base.greyFg,
    elementHover: base.greyFg,
    elementActive: base.oneBg3,
    elementSelected: base.greyFg,
    ghostHover: base.greyFg,
    ghostActive: base.oneBg3,
    ghostSelected: base.greyFg,
    lineNumber: indentGuide,
    activeLineNumber: b16.base05,
    activeLineBg: base.black2,
    highlightedLineBg: base.black2,
    indentGuide,
    indentGuideActive: base.greyFg,
    wrapGuide: border,
    documentHighlight,
    bracketHighlight: base.oneBg2,
    searchMatch: base.oneBg2,
    searchActiveMatch: base.oneBg2,
    scrollbarThumb: `${base.oneBg2}80`,
    scrollbarThumbHover: base.oneBg2,
    scrollbarTrack: `${ladder.background}80`
  };
};

const alphaBorder = (hex: string, opacity: number): string => {
  const channel = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex.slice(0, 7)}${channel}`;
};
