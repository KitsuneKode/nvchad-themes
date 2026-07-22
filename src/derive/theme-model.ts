import type { ThemeSpec } from "../types.ts";
import type { SyntaxRule } from "../syntax/index.ts";
import { applyPolishHl, treesitterTemplate } from "../syntax/index.ts";
import {
  applySurfaceModel,
  vscodeLadder,
  zedLadder,
  type VsCodeSurfaceLadder,
  type ZedSurfaceLadder
} from "../surfaces.ts";
import {
  activeGuideForInactive,
  separatorColors,
  zedIndentGuide,
  zedLineNumber
} from "../separators.ts";
import { zedUiTokens } from "../zed-ui.ts";
import { integrationHints } from "../integrations/index.ts";
import { vscodeEnhancements, zedEnhancements } from "../enhancements.ts";
import { loadProfile, profileForTheme } from "../profiles/index.ts";
import type { ZedProfileOverride, ZedSurfaceModel } from "../profiles/types.ts";
import type { DerivationOptions, ResolvedThemeModel } from "./types.ts";
import { resolveThemeColorOr } from "../resolve-color.ts";
import { relativeLuminance } from "../utils.ts";

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

const hasSeparatorContrast = (
  theme: ThemeSpec,
  color: string,
  background: string,
  minSeparatorDelta = 0.02
): boolean => {
  const delta = relativeLuminance(color) - relativeLuminance(background);
  return theme.type === "dark" ? delta >= minSeparatorDelta : delta <= -minSeparatorDelta;
};

export const deriveThemeModel = (
  theme: ThemeSpec,
  options?: DerivationOptions
): ResolvedThemeModel => {
  const profileId = options?.profileId ?? profileForTheme(theme.id, theme.type);
  const profile = loadProfile(profileId);
  const surfaceModel: ZedSurfaceModel = profile.surfaceModel ?? "tokyo-well";

  let zedSurfaces = applyProfileSurfaces(zedLadder(theme), profile);
  zedSurfaces = applySurfaceModel(zedSurfaces, theme, surfaceModel);

  const surfaces = {
    vscode: vscodeLadder(theme),
    zed: zedSurfaces
  };

  const ui = separatorColors(theme, {
    editorWell: zedSurfaces.background,
    panelBg: zedSurfaces.panel
  });

  let zedUi = zedUiTokens(theme, zedSurfaces);

  const lineNumberStyle = profile.ui?.lineNumberStyle ?? "default";
  const indentGuideStyle = profile.ui?.indentGuideStyle ?? "default";
  const editorBg = zedSurfaces.background;
  const panelBg = zedSurfaces.panel;

  if (lineNumberStyle !== "default") {
    const lineNumber = zedLineNumber(theme, editorBg, lineNumberStyle);
    if (hasSeparatorContrast(theme, lineNumber, editorBg)) {
      zedUi = { ...zedUi, lineNumber };
    }
  }

  if (indentGuideStyle !== "default") {
    const indentGuide = zedIndentGuide(theme, editorBg, indentGuideStyle);
    const panelIndentGuide =
      indentGuideStyle === "tokyo-muted"
        ? indentGuide
        : zedIndentGuide(theme, panelBg, indentGuideStyle);
    if (hasSeparatorContrast(theme, indentGuide, editorBg)) {
      zedUi = {
        ...zedUi,
        indentGuide,
        indentGuideActive: activeGuideForInactive(theme, indentGuide),
        panelIndentGuide,
        panelIndentGuideActive: activeGuideForInactive(theme, panelIndentGuide)
      };
    }
  }

  if (profile.ui?.indentGuide || profile.ui?.indentGuideActive || profile.ui?.lineNumber) {
    const indentGuide =
      profile.ui.indentGuide && hasSeparatorContrast(theme, profile.ui.indentGuide, editorBg)
        ? profile.ui.indentGuide
        : undefined;
    const lineNumber =
      profile.ui.lineNumber && hasSeparatorContrast(theme, profile.ui.lineNumber, editorBg)
        ? profile.ui.lineNumber
        : indentGuide;

    zedUi = {
      ...zedUi,
      ...(indentGuide
        ? {
            indentGuide,
            panelIndentGuide: indentGuide,
            indentGuideActive: activeGuideForInactive(theme, indentGuide),
            panelIndentGuideActive: activeGuideForInactive(theme, indentGuide)
          }
        : {}),
      ...(profile.ui.indentGuideActive
        ? {
            indentGuideActive: profile.ui.indentGuideActive,
            panelIndentGuideActive: profile.ui.indentGuideActive
          }
        : {}),
      ...(lineNumber ? { lineNumber } : {})
    };
  }

  const integrations = integrationHints(theme, surfaces);

  if (profile.git?.textMuted) {
    zedUi = {
      ...zedUi,
      textMuted: profile.git.textMuted,
      textPlaceholder: profile.git.textMuted,
      iconMuted: profile.git.textMuted
    };
  }
  if (profile.git?.icon) {
    zedUi = { ...zedUi, icon: profile.git.icon };
  }
  if (profile.git?.textMuted || profile.git?.statusIgnored) {
    integrations.git = {
      ...integrations.git,
      ...(profile.git.textMuted ? { ignored: profile.git.textMuted } : {}),
      ...(profile.git.statusIgnored ? { statusIgnored: profile.git.statusIgnored } : {})
    };
  }

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
    surfaceModel,
    surfaces,
    ui,
    zedUi,
    integrations,
    syntax,
    vscodeExtras,
    zedExtras
  };
};
