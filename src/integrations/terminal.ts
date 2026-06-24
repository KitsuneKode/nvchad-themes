import type { ThemeSpec } from "../types.ts";

export type TerminalAnsiTable = {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
};

export const terminalIntegration = (theme: ThemeSpec): TerminalAnsiTable => {
  const base = theme.base30;
  const syntax = theme.base16;

  return {
    black: base.black2,
    red: base.red,
    green: base.green,
    yellow: base.yellow,
    blue: base.blue,
    magenta: base.purple,
    cyan: base.cyan,
    white: base.white,
    brightBlack: base.greyFg,
    brightRed: base.babyPink,
    brightGreen: base.vibrantGreen,
    brightYellow: base.sun,
    brightBlue: syntax.base0D,
    brightMagenta: base.darkPurple,
    brightCyan: base.teal,
    brightWhite: syntax.base07
  };
};
