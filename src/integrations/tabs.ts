import type { ThemeSpec } from "../types.ts";
import type { VsCodeSurfaceLadder, ZedSurfaceLadder } from "../surfaces.ts";
import { vscodeLadder, zedLadder } from "../surfaces.ts";

export const tabsIntegration = (
  theme: ThemeSpec,
  surfaces?: { vscode?: VsCodeSurfaceLadder; zed?: ZedSurfaceLadder }
): {
  tabActiveBg: string;
  tabInactiveBg: string;
  tabModifiedBorder: string;
  zedTabActive: string;
  zedTabInactive: string;
} => {
  const vscode = surfaces?.vscode ?? vscodeLadder(theme);
  const zed = surfaces?.zed ?? zedLadder(theme);

  return {
    tabActiveBg: vscode.editor,
    tabInactiveBg: vscode.overlay,
    tabModifiedBorder: theme.base30.yellow,
    zedTabActive: zed.raised,
    zedTabInactive: zed.surface
  };
};
