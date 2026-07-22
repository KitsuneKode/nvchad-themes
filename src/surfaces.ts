import type { ThemeSpec } from "./types.ts";
import type { ZedSurfaceModel } from "./profiles/types.ts";
import { mixColors, relativeLuminance } from "./utils.ts";

export { relativeLuminance };

export type ZedSurfaceLadder = {
  /** Editor well + window default (`background`, `editor.background`) */
  background: string;
  /** Chrome — `surface.background` in Zed */
  surface: string;
  /** Project panel / sidebar well (`panel.background`) */
  panel: string;
  /** Title bar + status bar (outer crust) */
  crust: string;
  /** Elevated overlays */
  elevated: string;
  /** Active tab fill (Tokyo-well: raised; flat-editor: same as editor) */
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

const ensureDarkerSurface = (background: string, surface: string): string => {
  if (relativeLuminance(surface) >= relativeLuminance(background)) {
    return mixColors(background, "#000000", 0.12);
  }
  if (relativeLuminance(background) - relativeLuminance(surface) < 0.0005) {
    return mixColors(background, "#000000", 0.12);
  }
  return surface;
};

/**
 * Zed-native surface ladder (reference: zed-tokyo-night):
 * dark chrome (surface/panel) is darker than the editor well (background).
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
      panel: surface,
      crust: surface,
      elevated: mixColors(surface, background, 0.35),
      raised,
      element: background,
      selectedAlpha: selectionAlpha(theme)
    };
  }

  const background = base.black;
  const surface = ensureDarkerSurface(background, base.darkerBlack);
  let raised = base.oneBg2;
  if (relativeLuminance(raised) <= relativeLuminance(background) + 0.008) {
    raised = base.oneBg;
  }

  return {
    background,
    surface,
    panel: surface,
    crust: surface,
    elevated: mixColors(surface, "#000000", 0.1),
    raised,
    element: background,
    selectedAlpha: selectionAlpha(theme)
  };
};

/**
 * Kanagawa / flat-editor reference: active tab flush with editor; panel + inactive tabs darker;
 * title/status on outer crust.
 */
export const zedFlatEditorLadder = (theme: ThemeSpec): ZedSurfaceLadder => {
  const base = theme.base30;
  const background = base.black;
  const panel = ensureDarkerSurface(background, base.darkerBlack);
  let crust = mixColors(panel, "#000000", 0.06);
  if (relativeLuminance(crust) >= relativeLuminance(panel) - 0.0002) {
    crust = mixColors(panel, "#000000", 0.1);
  }

  return {
    background,
    surface: background,
    panel,
    crust,
    elevated: mixColors(panel, "#000000", 0.08),
    raised: background,
    element: background,
    selectedAlpha: selectionAlpha(theme)
  };
};

export const applySurfaceModel = (
  ladder: ZedSurfaceLadder,
  theme: ThemeSpec,
  model: ZedSurfaceModel
): ZedSurfaceLadder => {
  if (model === "flat-editor") {
    return zedFlatEditorLadder(theme);
  }
  return ladder;
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
