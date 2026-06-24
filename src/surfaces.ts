import type { ThemeSpec } from "./types.ts";
import { mixColors, relativeLuminance } from "./utils.ts";

export { relativeLuminance };

export type ZedSurfaceLadder = {
  /** Editor well + window default (`background`, `editor.background`) */
  background: string;
  /** Chrome — sidebars, panels, tab/title bar (`surface.background`) */
  surface: string;
  /** Elevated overlays */
  elevated: string;
  /** Active tab, raised controls */
  raised: string;
  /** `element.background` */
  element: string;
  selectedAlpha: number;
};

export type VsCodeSurfaceLadder = {
  editor: string;
  sidebar: string;
  chrome: string;
  overlay: string;
  raised: string;
  raisedHover: string;
};

const selectionAlpha = (theme: ThemeSpec): number => (theme.type === "light" ? 0.35 : 0.45);

/**
 * Zed-native surface ladder (reference: zed-tokyo-night):
 * dark chrome (surface) is darker than the editor well (background).
 */
export const zedLadder = (theme: ThemeSpec): ZedSurfaceLadder => {
  const base = theme.base30;
  const b16 = theme.base16;

  if (theme.type === "light") {
    const background = base.black;
    let surface = b16.base01;
    if (relativeLuminance(surface) >= relativeLuminance(background) - 0.0002) {
      surface = mixColors(background, base.oneBg3, 0.14);
    }
    const raised = base.greyFg;

    return {
      background,
      surface,
      elevated: mixColors(surface, background, 0.35),
      raised,
      element: background,
      selectedAlpha: selectionAlpha(theme)
    };
  }

  const background = base.black;
  let surface = base.darkerBlack;
  if (relativeLuminance(surface) >= relativeLuminance(background)) {
    surface = mixColors(background, "#000000", 0.12);
  } else if (relativeLuminance(background) - relativeLuminance(surface) < 0.0005) {
    surface = mixColors(background, "#000000", 0.12);
  }

  let raised = base.oneBg2;
  if (relativeLuminance(raised) <= relativeLuminance(background) + 0.008) {
    raised = base.oneBg;
  }

  return {
    background,
    surface,
    elevated: mixColors(surface, "#000000", 0.1),
    raised,
    element: background,
    selectedAlpha: selectionAlpha(theme)
  };
};

/**
 * NvChad Neovim semantics: editor = black, sidebar = darkerBlack, chrome = statuslineBg.
 */
export const vscodeLadder = (theme: ThemeSpec): VsCodeSurfaceLadder => {
  const base = theme.base30;

  return {
    editor: base.black,
    sidebar: base.darkerBlack,
    chrome: base.statuslineBg,
    overlay: base.black2,
    raised: base.oneBg,
    raisedHover: base.oneBg2
  };
};

export const zedSelectedBackground = (theme: ThemeSpec): string => theme.base30.greyFg;
