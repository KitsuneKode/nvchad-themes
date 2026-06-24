import type { ThemeSpec } from "./types.ts";
import { mixColors } from "./utils.ts";

export type SeparatorColors = {
  /** Panel splits, sidebar edge, tab strip — crisp and readable */
  border: string;
  /** Pane groups, editor group splits */
  borderStrong: string;
  /** Inactive indent / wrap guides */
  indentGuide: string;
  /** Active indent column */
  indentGuideActive: string;
  /** Editor wrap column guide */
  wrapGuide: string;
  /** Explorer tree indent */
  treeIndent: string;
  /** Subtle inner dividers (section headers) */
  borderSubtle: string;
};

/**
 * Solid separator colors — no alpha on lines (alpha causes foggy/blended edges on GPUI/VS Code).
 * NvChad `line` is often too close to `black`/`black2`; mix toward `grey` for contrast.
 */
export const separatorColors = (theme: ThemeSpec): SeparatorColors => {
  const base = theme.base30;

  if (theme.type === "light") {
    return {
      border: mixColors(base.line, base.grey, 0.5),
      borderStrong: base.grey,
      indentGuide: base.greyFg2,
      indentGuideActive: base.greyFg,
      wrapGuide: base.greyFg2,
      treeIndent: base.greyFg2,
      borderSubtle: base.greyFg2
    };
  }

  const border = mixColors(base.line, base.grey, 0.62);
  const borderStrong = mixColors(base.grey, base.greyFg, 0.42);

  return {
    border,
    borderStrong,
    indentGuide: base.grey,
    indentGuideActive: base.greyFg,
    wrapGuide: mixColors(base.line, base.grey, 0.48),
    treeIndent: base.grey,
    borderSubtle: mixColors(base.line, base.grey, 0.38)
  };
};
