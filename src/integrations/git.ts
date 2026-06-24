import type { ThemeSpec } from "../types.ts";
import { zedChromeMuted, zedStatusIgnoredColor } from "../zed-chrome.ts";
import { alpha, mixColors } from "../utils.ts";

/**
 * Git / VCS colors aligned with Zed defaults and zed-tokyo-night:
 * - modified = yellow (project panel uses status.modified, not blue)
 * - ignored / hidden / version_control.ignored = text.muted tier (normal tree rows)
 * - statusIgnored = darker status.ignored (gitignored filenames only)
 */
export const gitIntegration = (theme: ThemeSpec) => {
  const b30 = theme.base30;
  const well = b30.black;
  const chromeMuted = zedChromeMuted(theme);
  const statusIgnored = zedStatusIgnoredColor(theme);

  return {
    diffAddedBg: alpha(mixColors(well, b30.green, 0.1), 1),
    diffRemovedBg: alpha(mixColors(well, b30.red, 0.1), 1),
    added: b30.green,
    modified: b30.yellow,
    deleted: b30.red,
    renamed: b30.teal,
    /** version_control.ignored, hidden — same tier as text.muted (unselected rows). */
    ignored: chromeMuted,
    /** status.ignored — gitignored entries; must be darker than text.muted. */
    statusIgnored,
    conflict: b30.purple
  };
};
