export type TokenColorSettings = {
  foreground?: string;
  fontStyle?: string;
};

export type TokenColorRule = {
  name: string;
  scope: string | string[];
  settings: TokenColorSettings;
};

export type SemanticTokenRule =
  | string
  | {
      foreground: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
    };

export type ThemeDefinition = {
  $schema: string;
  name: string;
  type: "dark" | "light";
  semanticHighlighting: true;
  colors: Record<string, string>;
  tokenColors: TokenColorRule[];
  semanticTokenColors: Record<string, SemanticTokenRule>;
};

export type Base30Palette = {
  white: string;
  darkerBlack: string;
  black: string;
  black2: string;
  oneBg: string;
  oneBg2: string;
  oneBg3: string;
  grey: string;
  greyFg: string;
  greyFg2: string;
  lightGrey: string;
  red: string;
  babyPink: string;
  pink: string;
  line: string;
  green: string;
  vibrantGreen: string;
  nordBlue: string;
  blue: string;
  yellow: string;
  sun: string;
  purple: string;
  darkPurple: string;
  teal: string;
  orange: string;
  cyan: string;
  statuslineBg: string;
  lightBg: string;
  pmenuBg: string;
  folderBg: string;
};

export type Base16Palette = {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
};

export type ThemeSpec = {
  id: string;
  displayName: string;
  author: string;
  type: "dark" | "light";
  base30: Base30Palette;
  base16: Base16Palette;
  base30Extras?: Record<string, string>;
};

export type PaletteFile = ThemeSpec;

export type ZedSyntaxRule = {
  color: string;
  font_style: "italic" | "normal" | null;
  font_weight: number | null;
};

export type ZedThemeDefinition = {
  $schema: string;
  name: string;
  author: string;
  themes: Array<{
    name: string;
    appearance: "dark" | "light";
    style: Record<
      string,
      string | string[] | null | ZedSyntaxRule | Record<string, ZedSyntaxRule> | Array<Record<string, string>>
    >;
  }>;
};

export type OpenCodeThemeDefinition = {
  $schema: string;
  defs: Record<string, string>;
  theme: Record<string, { dark: string; light: string }>;
};

export type GeminiThemeDefinition = {
  name: string;
  type: "custom";
  background: {
    primary: string;
    diff: {
      added: string;
      removed: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    link: string;
    accent: string;
  };
  border: {
    default: string;
    focused: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
  };
  ui: {
    comment: string;
    symbol: string;
    gradient: string[];
  };
};

export type CodexThemeRule = {
  name?: string;
  scope?: string;
  settings: Record<string, string>;
};

export const REQUIRED_BASE30_KEYS = [
  "white",
  "darkerBlack",
  "black",
  "black2",
  "oneBg",
  "oneBg2",
  "oneBg3",
  "grey",
  "greyFg",
  "greyFg2",
  "lightGrey",
  "red",
  "babyPink",
  "pink",
  "line",
  "green",
  "vibrantGreen",
  "nordBlue",
  "blue",
  "yellow",
  "sun",
  "purple",
  "darkPurple",
  "teal",
  "orange",
  "cyan",
  "statuslineBg",
  "lightBg",
  "pmenuBg",
  "folderBg"
] as const satisfies ReadonlyArray<keyof Base30Palette>;

export const REQUIRED_BASE16_KEYS = [
  "base00",
  "base01",
  "base02",
  "base03",
  "base04",
  "base05",
  "base06",
  "base07",
  "base08",
  "base09",
  "base0A",
  "base0B",
  "base0C",
  "base0D",
  "base0E",
  "base0F"
] as const satisfies ReadonlyArray<keyof Base16Palette>;
