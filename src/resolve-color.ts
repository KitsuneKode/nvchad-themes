import type { Base16Palette, Base30Palette, ThemeSpec } from "./types.ts";
import { snakeToCamel } from "./utils.ts";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const LUA_KEY_ALIASES: Record<string, keyof Base30Palette> = {
  lightbg: "lightBg",
  lightbg2: "lightBg",
  grey_fg: "greyFg",
  grey_fg2: "greyFg2",
  light_grey: "lightGrey",
  darker_black: "darkerBlack",
  one_bg: "oneBg",
  one_bg2: "oneBg2",
  one_bg3: "oneBg3",
  baby_pink: "babyPink",
  vibrant_green: "vibrantGreen",
  nord_blue: "nordBlue",
  dark_purple: "darkPurple",
  statusline_bg: "statuslineBg",
  pmenu_bg: "pmenuBg",
  folder_bg: "folderBg"
};

const normalizeBase30Key = (key: string): keyof Base30Palette | string =>
  LUA_KEY_ALIASES[key] ?? (snakeToCamel(key) as keyof Base30Palette | string);

export const isHexColor = (value: string): boolean => HEX_RE.test(value);

/** Resolve NvChad Lua color refs (M.base_30.*, M.base_16.*) and raw hex. */
export const resolveThemeColor = (
  value: string,
  base30: Base30Palette,
  base16: Base16Palette
): string | undefined => {
  const trimmed = value.trim();

  if (isHexColor(trimmed)) {
    return trimmed;
  }

  const base30Ref = trimmed.match(/^M\.base_30\.([a-zA-Z0-9_]+)$/);
  if (base30Ref) {
    const key = normalizeBase30Key(base30Ref[1]!);
    const resolved = base30[key as keyof Base30Palette];
    return resolved && isHexColor(resolved) ? resolved : undefined;
  }

  const base16Ref = trimmed.match(/^M\.base_16\.(base[0-9A-Fa-f]{2})$/);
  if (base16Ref) {
    const key = base16Ref[1] as keyof Base16Palette;
    const resolved = base16[key];
    return resolved && isHexColor(resolved) ? resolved : undefined;
  }

  return undefined;
};

export const resolveThemeColorOr = (
  theme: ThemeSpec,
  value: string | undefined,
  fallback: string
): string => {
  if (!value) {
    return fallback;
  }
  return resolveThemeColor(value, theme.base30, theme.base16) ?? (isHexColor(value) ? value : fallback);
};
