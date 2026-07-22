export type ZedReferenceProfile =
  | "tokyo-night"
  | "catppuccin"
  | "kanagawa"
  | "nord"
  | "gruvbox"
  | "default-dark"
  | "default-light";

export type ZedSurfaceModel = "tokyo-well" | "flat-editor";

export type ZedLineNumberStyle = "default" | "kanagawa-teal" | "tokyo-muted";

export type ZedIndentGuideStyle = "default" | "tokyo-muted";

export type ZedProfileOverride = {
  id: ZedReferenceProfile;
  surfaceModel?: ZedSurfaceModel;
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
    indentGuideActive: string;
    lineNumber: string;
    lineNumberStyle: ZedLineNumberStyle;
    indentGuideStyle: ZedIndentGuideStyle;
  }>;
  /** Project-panel chrome: normal rows use text.muted; gitignored rows use status.ignored (darker). */
  git?: Partial<{
    textMuted: string;
    statusIgnored: string;
    icon: string;
  }>;
};
