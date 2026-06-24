import type { ZedReferenceProfile } from "./types.ts";

const THEME_PROFILE: Record<string, ZedReferenceProfile> = {
  tokyonight: "tokyo-night",
  tokyodark: "tokyo-night",
  kanagawa: "kanagawa",
  "kanagawa-dragon": "kanagawa",
  catppuccin: "catppuccin",
  "catppuccin-latte": "catppuccin",
  nord: "nord",
  gruvbox: "gruvbox",
  gruvchad: "gruvbox",
  onenord: "nord",
  onenord_light: "nord",
  rosepine: "catppuccin",
  "rosepine-dawn": "catppuccin",
  poimandres: "tokyo-night",
  everblush: "kanagawa",
  melange: "kanagawa",
  ayu_dark: "tokyo-night",
  ayu_light: "default-light",
  github_dark: "default-dark",
  github_light: "default-light",
  vscode_dark: "default-dark",
  vscode_light: "default-light",
  onedark: "default-dark",
  one_light: "default-light",
  palenight: "tokyo-night",
  material: "default-dark",
  "material-darker": "default-dark",
  "material-lighter": "default-light",
  "material-deep-ocean": "tokyo-night",
  rxyhn: "default-dark"
};

export const profileForTheme = (id: string, type: "dark" | "light"): ZedReferenceProfile =>
  THEME_PROFILE[id] ?? (type === "light" ? "default-light" : "default-dark");
