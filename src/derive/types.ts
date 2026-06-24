import type { IntegrationHints } from "../integrations/index.ts";
import type { VsCodeEnhancements, ZedEnhancements } from "../enhancements.ts";
import type { SeparatorColors } from "../separators.ts";
import type { SyntaxRule } from "../syntax/index.ts";
import type { VsCodeSurfaceLadder, ZedSurfaceLadder } from "../surfaces.ts";
import type { ThemeSpec } from "../types.ts";
import type { ZedUiTokens } from "../zed-ui.ts";
import type { ZedReferenceProfile } from "../profiles/types.ts";

export type DerivationOptions = {
  profileId?: ZedReferenceProfile;
  skipPolish?: boolean;
};

export type ResolvedThemeModel = {
  theme: ThemeSpec;
  profileId: ZedReferenceProfile;
  surfaces: {
    vscode: VsCodeSurfaceLadder;
    zed: ZedSurfaceLadder;
  };
  ui: SeparatorColors;
  zedUi: ZedUiTokens;
  integrations: IntegrationHints;
  syntax: Record<string, SyntaxRule>;
  vscodeExtras: VsCodeEnhancements;
  zedExtras: ZedEnhancements;
};
