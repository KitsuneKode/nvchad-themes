import type { ThemeSpec } from "../types.ts";

export const defaultsIntegration = (
  theme: ThemeSpec
): {
  commentColor: string;
  lineNumberColor: string;
  cursorLineBg: string;
  pmenuSelBg: string;
} => ({
  commentColor: theme.base30.greyFg,
  lineNumberColor: theme.base30.greyFg,
  cursorLineBg: theme.base30.black2,
  pmenuSelBg: theme.base30.pmenuBg
});
