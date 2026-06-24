import type { ZedProfileOverride } from "./types.ts";

export const tokyoNightProfile: ZedProfileOverride = {
  id: "tokyo-night",
  syntax: {
    "@punctuation.bracket": "#89ddff",
    "@operator": "#89ddff",
    "@comment": "#51597d"
  },
  ui: {
    punctuation: "#89ddff",
    comment: "#51597d",
    indentGuide: "#363b54"
  },
  git: {
    textMuted: "#787c99",
    statusIgnored: "#515670",
    icon: "#787c99"
  }
};
