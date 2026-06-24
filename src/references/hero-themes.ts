/**
 * Zed-native surface ladder (reference: zed-tokyo-night):
 * dark chrome (surface) is darker than the editor well (background).
 * Active tabs use raised `oneBg2`, not the editor well.
 */
export type ReferenceProfile =
  | "tokyo-night"
  | "catppuccin"
  | "kanagawa"
  | "nord"
  | "default-dark";

/** Pinned surface/syntax extracts from official Zed marketplace ports for hero theme QA. */
export const HERO_REFERENCES = {
  tokyonight: {
    darkSurfaceOrder: ["background", "surface.background", "editor.background"] as const,
    tabActiveRaised: true,
    referenceProfile: "tokyo-night" as const
  },
  kanagawa: {
    darkSurfaceOrder: ["background", "surface.background", "editor.background"] as const,
    tabActiveRaised: true,
    referenceProfile: "kanagawa" as const,
    syntax: {
      numberUsesBabyPink: true,
      punctuationNotErrorRed: true
    }
  },
  catppuccin: {
    darkSurfaceOrder: ["background", "surface.background", "editor.background"] as const,
    tabActiveRaised: true,
    referenceProfile: "catppuccin" as const
  },
  nord: {
    darkSurfaceOrder: ["background", "surface.background", "editor.background"] as const,
    tabActiveRaised: true,
    referenceProfile: "nord" as const
  },
  rxyhn: {
    darkSurfaceOrder: ["background", "surface.background", "editor.background"] as const,
    tabActiveRaised: true,
    referenceProfile: "default-dark" as const
  }
} as const;

export const HERO_THEME_IDS = ["tokyonight", "kanagawa", "catppuccin", "nord", "rxyhn"] as const;

/** Extra heroes rasterized for Zed zip / syntax fallbacks (not all shown in README). */
export const EXTRA_HERO_THEME_IDS = ["onedark", "gruvbox", "everforest"] as const;

/** Heroes shown in README preview grids (Cursor + Zed). */
export const README_HERO_THEME_IDS = [...HERO_THEME_IDS, "onedark"] as const;

/** All hero theme ids (README heroes + Zed zip extras). */
export const ALL_HERO_THEME_IDS = [
  ...new Set([...HERO_THEME_IDS, ...EXTRA_HERO_THEME_IDS])
] as readonly string[];

/** Themes with upstream Zed reference extracts in `src/references/official/`. */
export const REFERENCE_THEME_IDS = ["tokyonight"] as const;
