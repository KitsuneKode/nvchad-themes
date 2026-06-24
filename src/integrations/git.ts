import type { ThemeSpec } from "../types.ts";
import { alpha, mixColors } from "../utils.ts";

/**
 * Git / VCS colors aligned with Zed defaults and zed-tokyo-night:
 * - modified = yellow (project panel uses status.modified, not blue)
 * - ignored = muted but readable on the editor well
 * - statusIgnored = extra-faded tree label for gitignored entries
 */
export const gitIntegration = (theme: ThemeSpec) => {
  const b30 = theme.base30;
  const b16 = theme.base16;
  const well = b30.black;

  const statusIgnored =
    theme.type === "light"
      ? mixColors(b16.base05, b30.white, 0.55)
      : mixColors(b16.base05, well, 0.62);

  return {
    diffAddedBg: alpha(mixColors(well, b30.green, 0.1), 1),
    diffRemovedBg: alpha(mixColors(well, b30.red, 0.1), 1),
    added: b30.green,
    modified: b30.yellow,
    deleted: b30.red,
    renamed: b30.teal,
    /** version_control.ignored — matches text.muted tier (Tokyo: #787c99). */
    ignored: b30.lightGrey,
    /** status.ignored — project panel gitignored filenames (Tokyo: #515670). */
    statusIgnored,
    conflict: b30.purple
  };
};
