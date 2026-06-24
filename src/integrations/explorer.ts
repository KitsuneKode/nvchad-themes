import type { ThemeSpec } from "../types.ts";
import type { SeparatorColors } from "../separators.ts";
import type { VsCodeSurfaceLadder } from "../surfaces.ts";
import { separatorColors } from "../separators.ts";
import { vscodeLadder } from "../surfaces.ts";

export const explorerIntegration = (
  theme: ThemeSpec,
  surfaces?: { vscode?: VsCodeSurfaceLadder },
  ui?: SeparatorColors
): {
  sidebarBg: string;
  folderColor: string;
  indentGuideColor: string;
} => {
  const ladder = surfaces?.vscode ?? vscodeLadder(theme);
  const sep = ui ?? separatorColors(theme);

  return {
    sidebarBg: ladder.sidebar,
    folderColor: theme.base30.folderBg,
    indentGuideColor: sep.treeIndent
  };
};
