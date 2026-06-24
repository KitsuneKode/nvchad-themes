import type { ThemeSpec } from "../types.ts";
import { alpha, mixColors } from "../utils.ts";

export const gitIntegration = (theme: ThemeSpec) => {
  const base = theme.base30.black;

  return {
    diffAddedBg: alpha(mixColors(base, theme.base30.green, 0.1), 1),
    diffRemovedBg: alpha(mixColors(base, theme.base30.red, 0.1), 1),
    added: theme.base30.green,
    modified: theme.base30.blue,
    deleted: theme.base30.red,
    renamed: theme.base30.teal,
    ignored: theme.base30.lightGrey,
    conflict: theme.base30.orange
  };
};
