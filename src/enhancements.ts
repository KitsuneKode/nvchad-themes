import type { ThemeSpec } from "./types.ts";
import { alpha, mixColors } from "./utils.ts";
import { integrationHints } from "./integrations/index.ts";
import { vscodeLadder, zedLadder } from "./surfaces.ts";

export type ZedEnhancements = {
  folderIconAccent: string;
  panelErrorBg: string;
  panelWarningBg: string;
  panelInfoBg: string;
  hoverLineNumber: string;
};

export type VsCodeEnhancements = Record<string, string>;

export const zedEnhancements = (theme: ThemeSpec): ZedEnhancements => {
  const base = theme.base30;
  const ladder = zedLadder(theme);

  return {
    folderIconAccent: base.folderBg,
    panelErrorBg: alpha(mixColors(ladder.background, base.red, 0.08), 1),
    panelWarningBg: alpha(mixColors(ladder.background, base.yellow, 0.08), 1),
    panelInfoBg: alpha(mixColors(ladder.background, base.blue, 0.08), 1),
    hoverLineNumber: base.blue
  };
};

export const vscodeEnhancements = (theme: ThemeSpec): VsCodeEnhancements => {
  const base = theme.base30;
  const hints = integrationHints(theme);
  const ladder = vscodeLadder(theme);

  return {
    "editorGroup.border": base.line,
    "widget.shadow": alpha(base.black, 0.45),
    "editorInlayHint.background": alpha(ladder.overlay, 0.9),
    "editorInlayHint.foreground": base.lightGrey,
    "editorInlayHint.typeForeground": theme.base16.base0A,
    "editorInlayHint.parameterForeground": theme.base16.base08,
    "testing.iconFailed": base.red,
    "testing.iconErrored": base.red,
    "testing.iconPassed": base.green,
    "testing.iconQueued": base.yellow,
    "testing.iconSkipped": base.lightGrey,
    "testing.iconUnset": base.greyFg,
    "testing.peekBorder": base.line,
    "testing.message.error.decorationForeground": base.red,
    "testing.message.info.decorationForeground": base.blue,
    "testing.runAction": base.green,
    "symbolIcon.folderForeground": hints.folderColor,
    "symbolIcon.classForeground": hints.suggestKindColors.class ?? theme.base16.base0A,
    "symbolIcon.functionForeground": hints.suggestKindColors.function ?? theme.base16.base0D,
    "symbolIcon.variableForeground": hints.suggestKindColors.variable ?? theme.base16.base05,
    "symbolIcon.methodForeground": hints.suggestKindColors.method ?? theme.base16.base0D,
    "symbolIcon.propertyForeground": hints.suggestKindColors.property ?? theme.base16.base08,
    "symbolIcon.interfaceForeground": hints.suggestKindColors.interface ?? theme.base16.base0E,
    "symbolIcon.enumForeground": hints.suggestKindColors.enum ?? theme.base16.base0A,
    "symbolIcon.constantForeground": hints.suggestKindColors.constant ?? theme.base16.base09,
    "symbolIcon.namespaceForeground": hints.suggestKindColors.namespace ?? theme.base16.base08,
    "symbolIcon.moduleForeground": hints.suggestKindColors.module ?? theme.base16.base08,
    "symbolIcon.structForeground": hints.suggestKindColors.struct ?? theme.base16.base0E
  };
};
