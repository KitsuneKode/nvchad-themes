import type { ZedProfileOverride, ZedReferenceProfile } from "./types.ts";
import { tokyoNightProfile } from "./tokyo-night.ts";
import { kanagawaProfile } from "./kanagawa.ts";
import { defaultDarkProfile, defaultLightProfile } from "./default.ts";

const PROFILES: Record<ZedReferenceProfile, ZedProfileOverride> = {
  "tokyo-night": tokyoNightProfile,
  catppuccin: defaultDarkProfile,
  kanagawa: kanagawaProfile,
  nord: defaultDarkProfile,
  gruvbox: defaultDarkProfile,
  "default-dark": defaultDarkProfile,
  "default-light": defaultLightProfile
};

export const loadProfile = (id: ZedReferenceProfile): ZedProfileOverride => PROFILES[id];

export { profileForTheme } from "./registry.ts";
export type { ZedProfileOverride, ZedReferenceProfile } from "./types.ts";
