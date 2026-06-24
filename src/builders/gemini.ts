import type { GeminiThemeDefinition, ThemeSpec } from "../types.ts";
import { mixColors } from "../utils.ts";

export const buildGeminiTheme = (theme: ThemeSpec): GeminiThemeDefinition => {
  const base = theme.base30;
  const syntax = theme.base16;

  const diffAddedBg = mixColors(base.black, base.green, 0.15);
  const diffRemovedBg = mixColors(base.black, base.red, 0.15);

  return {
    name: theme.displayName,
    type: "custom",
    background: {
      primary: base.black,
      diff: {
        added: diffAddedBg,
        removed: diffRemovedBg
      }
    },
    text: {
      primary: base.white,
      secondary: base.lightGrey,
      link: syntax.base0D,
      accent: base.purple
    },
    border: {
      default: base.oneBg3,
      focused: base.blue
    },
    status: {
      success: base.green,
      warning: base.yellow,
      error: base.red
    },
    ui: {
      comment: base.greyFg2,
      symbol: base.teal,
      gradient: [base.blue, base.purple, base.orange]
    }
  };
};
