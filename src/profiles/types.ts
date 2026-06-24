export type ZedReferenceProfile =
  | "tokyo-night"
  | "catppuccin"
  | "kanagawa"
  | "nord"
  | "gruvbox"
  | "default-dark"
  | "default-light";

export type ZedProfileOverride = {
  id: ZedReferenceProfile;
  surfaces?: Partial<{
    surface: string;
    raised: string;
    elevated: string;
  }>;
  zedSurfaces?: Partial<{
    surface: string;
    raised: string;
    elevated: string;
  }>;
  syntax?: Record<string, string>;
  ui?: Partial<{
    punctuation: string;
    comment: string;
    indentGuide: string;
  }>;
};
