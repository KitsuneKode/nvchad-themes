import type { ThemeSpec } from "../types.ts";

export const diagnosticsIntegration = (theme: ThemeSpec) => ({
  error: theme.base30.red,
  warning: theme.base30.yellow,
  info: theme.base30.green,
  hint: theme.base30.purple
});
