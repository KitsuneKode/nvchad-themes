import type { CodexThemeRule, ThemeSpec } from "../types.ts";
import { mixColors, renderPlistValue } from "../utils.ts";
import { buildTokenColors } from "./vscode.ts";

const buildCodexThemeRules = (theme: ThemeSpec): CodexThemeRule[] => {
  const base = theme.base30;

  return [
    {
      settings: {
        background: base.black,
        gutter: base.black2,
        gutterForeground: base.greyFg,
        foreground: base.white,
        caret: base.white,
        invisibles: base.greyFg,
        lineHighlight: mixColors(base.black, base.white, 0.04),
        selection: mixColors(base.black, base.blue, 0.22),
        inactiveSelection: mixColors(base.black, base.oneBg3, 0.68),
        selectionBorder: base.blue,
        guide: base.line,
        activeGuide: base.lightGrey,
        findHighlight: mixColors(base.black, base.green, 0.28),
        highlight: mixColors(base.black, base.teal, 0.16)
      }
    },
    ...buildTokenColors(theme).map((rule) => ({
      name: rule.name,
      scope: Array.isArray(rule.scope) ? rule.scope.join(", ") : rule.scope,
      settings: Object.fromEntries(
        Object.entries(rule.settings).filter(([, value]) => value !== undefined)
      ) as Record<string, string>
    }))
  ];
};

export const buildCodexTheme = (theme: ThemeSpec): string => {
  const plist = {
    name: theme.displayName,
    settings: buildCodexThemeRules(theme)
  };

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    renderPlistValue(plist, 1),
    "</plist>"
  ].join("\n");
};
