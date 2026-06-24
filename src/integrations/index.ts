import type { ThemeSpec } from "../types.ts";
import type { VsCodeSurfaceLadder, ZedSurfaceLadder } from "../surfaces.ts";
import { completionIntegration } from "./completion.ts";
import { defaultsIntegration } from "./defaults.ts";
import { diagnosticsIntegration } from "./diagnostics.ts";
import { explorerIntegration } from "./explorer.ts";
import { gitIntegration } from "./git.ts";
import { tabsIntegration } from "./tabs.ts";
import { terminalIntegration, type TerminalAnsiTable } from "./terminal.ts";

export type { TerminalAnsiTable };

export type IntegrationHints = {
  commentColor: string;
  lineNumberColor: string;
  cursorLineBg: string;
  pmenuSelBg: string;
  tabActiveBg: string;
  tabInactiveBg: string;
  tabModifiedBorder: string;
  zedTabActive: string;
  zedTabInactive: string;
  sidebarBg: string;
  folderColor: string;
  indentGuideColor: string;
  diffAddedBg: string;
  diffRemovedBg: string;
  suggestKindColors: Record<string, string>;
  git: ReturnType<typeof gitIntegration>;
  terminal: TerminalAnsiTable;
  diagnostics: ReturnType<typeof diagnosticsIntegration>;
};

export const integrationHints = (
  theme: ThemeSpec,
  surfaces?: { vscode: VsCodeSurfaceLadder; zed: ZedSurfaceLadder }
): IntegrationHints => {
  const defaults = defaultsIntegration(theme);
  const tabs = tabsIntegration(theme, surfaces);
  const explorer = explorerIntegration(theme, surfaces ? { vscode: surfaces.vscode } : undefined);
  const git = gitIntegration(theme);
  const completion = completionIntegration(theme);
  const terminal = terminalIntegration(theme);
  const diagnostics = diagnosticsIntegration(theme);

  return {
    ...defaults,
    tabActiveBg: tabs.tabActiveBg,
    tabInactiveBg: tabs.tabInactiveBg,
    tabModifiedBorder: tabs.tabModifiedBorder,
    zedTabActive: tabs.zedTabActive,
    zedTabInactive: tabs.zedTabInactive,
    sidebarBg: explorer.sidebarBg,
    folderColor: explorer.folderColor,
    indentGuideColor: explorer.indentGuideColor,
    diffAddedBg: git.diffAddedBg,
    diffRemovedBg: git.diffRemovedBg,
    suggestKindColors: completion,
    git,
    terminal,
    diagnostics
  };
};
