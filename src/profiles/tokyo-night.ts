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
  }
};

export const kanagawaProfile: ZedProfileOverride = {
  id: "kanagawa",
  syntax: {
    number: undefined as unknown as string
  }
};

export const defaultDarkProfile: ZedProfileOverride = {
  id: "default-dark"
};

export const defaultLightProfile: ZedProfileOverride = {
  id: "default-light"
};
