import type { ThemeSpec } from "../types.ts";
import type { SyntaxRule } from "../syntax/index.ts";
import { applyPolishHl, treesitterTemplate } from "../syntax/index.ts";
import { vscodeLadder, zedLadder, type VsCodeSurfaceLadder, type ZedSurfaceLadder } from "../surfaces.ts";
import { separatorColors } from "../separators.ts";
import { zedUiTokens } from "../zed-ui.ts";
import { integrationHints } from "../integrations/index.ts";
import { vscodeEnhancements, zedEnhancements } from "../enhancements.ts";
import { loadProfile, profileForTheme } from "../profiles/index.ts";
import type { ZedProfileOverride } from "../profiles/types.ts";
import type { DerivationOptions, ResolvedThemeModel } from "./types.ts";
import { resolveThemeColorOr } from "../resolve-color.ts";

const applyProfileSurfaces = (
  zed: ZedSurfaceLadder,
  profile: ZedProfileOverride
): ZedSurfaceLadder => ({
  ...zed,
  ...(profile.zedSurfaces?.surface ? { surface: profile.zedSurfaces.surface } : {}),
  ...(profile.zedSurfaces?.raised ? { raised: profile.zedSurfaces.raised } : {}),
  ...(profile.zedSurfaces?.elevated ? { elevated: profile.zedSurfaces.elevated } : {}),
  ...(profile.surfaces?.surface ? { surface: profile.surfaces.surface } : {}),
  ...(profile.surfaces?.raised ? { raised: profile.surfaces.raised } : {}),
  ...(profile.surfaces?.elevated ? { elevated: profile.surfaces.elevated } : {})
});

const applyProfileSyntax = (
  theme: ThemeSpec,
  rules: Record<string, SyntaxRule>,
  profile: ZedProfileOverride
): Record<string, SyntaxRule> => {
  if (!profile.syntax) {
    return rules;
  }

  const merged = { ...rules };
  for (const [key, color] of Object.entries(profile.syntax)) {
    if (!color) {
      continue;
    }
    const nvimKey = key.startsWith("@") ? key : `@${key}`;
    const existing = merged[nvimKey] ?? { color: theme.base16.base05 };
    merged[nvimKey] = {
      ...existing,
      color: resolveThemeColorOr(theme, color, existing.color)
    };
  }
  return merged;
};

export const deriveThemeModel = (
  theme: ThemeSpec,
  options?: DerivationOptions
): ResolvedThemeModel => {
  const profileId = options?.profileId ?? profileForTheme(theme.id, theme.type);
  const profile = loadProfile(profileId);

  const surfaces = {
    vscode: vscodeLadder(theme),
    zed: applyProfileSurfaces(zedLadder(theme), profile)
  };

  const ui = separatorColors(theme);
  let zedUi = zedUiTokens(theme);
  zedUi = { ...zedUi, ladder: surfaces.zed };

  if (profile.ui?.indentGuide) {
    zedUi = {
      ...zedUi,
      indentGuide: profile.ui.indentGuide,
      indentGuideActive: profile.ui.indentGuide ?? zedUi.indentGuideActive
    };
  }

  const integrations = integrationHints(theme, surfaces);

  let syntax = treesitterTemplate(theme);
  syntax = applyProfileSyntax(theme, syntax, profile);

  if (!options?.skipPolish) {
    syntax = applyPolishHl(theme, syntax, theme.polishHl);
  }

  const vscodeExtras = vscodeEnhancements(theme);
  const zedExtras = zedEnhancements(theme);

  return {
    theme,
    profileId,
    surfaces,
    ui,
    zedUi,
    integrations,
    syntax,
    vscodeExtras,
    zedExtras
  };
};
