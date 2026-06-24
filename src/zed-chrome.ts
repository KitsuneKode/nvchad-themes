import type { ThemeSpec } from "./types.ts";
import { mixColors } from "./utils.ts";

/**
 * Zed project panel: unselected rows use Color::Muted → text.muted.
 * Gitignored rows use Color::Ignored → status.ignored (must be darker than text.muted).
 *
 * Reference gaps (luminance): Tokyo Night ~0.11, Kanagawa ~0.08 between the two tiers.
 */
export const zedChromeMuted = (theme: ThemeSpec): string => {
  const b16 = theme.base16;
  const well = theme.base30.black;
  return theme.type === "light"
    ? mixColors(b16.base05, well, 0.35)
    : mixColors(b16.base05, well, 0.45);
};

export const zedStatusIgnoredColor = (theme: ThemeSpec): string => {
  const b16 = theme.base16;
  const well = theme.base30.black;
  return theme.type === "light"
    ? mixColors(b16.base05, well, 0.55)
    : mixColors(b16.base05, well, 0.75);
};
