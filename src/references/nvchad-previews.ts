import { HERO_THEME_IDS } from "./hero-themes.ts";

/** Official Neovim UI previews from the NvChad theme gallery (same base46 palettes). */
export const NVCHAD_THEME_GALLERY = "https://nvchad.com/themes";

export const nvchadThemePreviewUrl = (themeId: string): string =>
  `${NVCHAD_THEME_GALLERY}/${themeId}.webp`;

/** Hero theme IDs shown in README with official NvChad gallery images. */
export const README_NVCHAD_PREVIEW_IDS = [...HERO_THEME_IDS, "onedark"] as const;
