import type { ZedProfileOverride } from "./types.ts";

/** Kanagawa family — flat editor + git chrome from ethangilmore/zed-kanagawa. */
export const kanagawaProfile: ZedProfileOverride = {
  id: "kanagawa",
  surfaceModel: "flat-editor",
  ui: {
    lineNumberStyle: "kanagawa-teal"
  },
  git: {
    textMuted: "#727169",
    statusIgnored: "#4F4F66",
    icon: "#DCD7BA"
  }
};
