import type { ThemeSpec } from "../types.ts";

export const completionIntegration = (theme: ThemeSpec) => {
  const syntax = theme.base16;

  return {
    class: syntax.base0A,
    constant: syntax.base09,
    enum: syntax.base0A,
    function: syntax.base0D,
    interface: syntax.base0E,
    keyword: syntax.base0E,
    method: syntax.base0D,
    module: syntax.base08,
    namespace: syntax.base08,
    property: syntax.base08,
    struct: syntax.base0E,
    typeParameter: syntax.base0A,
    variable: syntax.base05
  };
};
