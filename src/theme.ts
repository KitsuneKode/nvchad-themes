type TokenColorSettings = {
  foreground?: string;
  fontStyle?: string;
};

type TokenColorRule = {
  name: string;
  scope: string | string[];
  settings: TokenColorSettings;
};

type SemanticTokenRule =
  | string
  | {
      foreground: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
    };

type ThemeDefinition = {
  $schema: string;
  name: string;
  type: "dark";
  semanticHighlighting: true;
  colors: Record<string, string>;
  tokenColors: TokenColorRule[];
  semanticTokenColors: Record<string, SemanticTokenRule>;
};

type Base30Palette = {
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

type Base16Palette = {
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
  base30: Base30Palette;
  base16: Base16Palette;
};

type ZedSyntaxRule = {
  color: string;
  font_style: "italic" | "normal" | null;
  font_weight: number | null;
};

type ZedThemeDefinition = {
  $schema: string;
  name: string;
  author: string;
  themes: Array<{
    name: string;
    appearance: "dark";
    style: Record<string, string | string[] | null | ZedSyntaxRule | Record<string, ZedSyntaxRule> | Array<Record<string, string>>>;
  }>;
};

const alpha = (hex: string, opacity: number) => {
  const clamped = Math.max(0, Math.min(1, opacity));
  const channel = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0");

  return `${hex}${channel}`;
};

export const themeCatalog: ThemeSpec[] = [
  {
    id: "rxyhn",
    displayName: "NvChad Rxyhn Theme",
    author: "kitsunekode",
    base30: {
      white: "#D9D7D6",
      darkerBlack: "#000a0e",
      black: "#061115",
      black2: "#0d181c",
      oneBg: "#131e22",
      oneBg2: "#1c272b",
      oneBg3: "#242f33",
      grey: "#313c40",
      greyFg: "#3b464a",
      greyFg2: "#455054",
      lightGrey: "#4f5a5e",
      red: "#DF5B61",
      babyPink: "#EE6A70",
      pink: "#F16269",
      line: "#222d31",
      green: "#78B892",
      vibrantGreen: "#8CD7AA",
      nordBlue: "#5A84BC",
      blue: "#6791C9",
      yellow: "#ecd28b",
      sun: "#f6dc95",
      purple: "#C488EC",
      darkPurple: "#BC83E3",
      teal: "#7ACFE4",
      orange: "#E89982",
      cyan: "#67AFC1",
      statuslineBg: "#0A1519",
      lightBg: "#1a2529",
      pmenuBg: "#78B892",
      folderBg: "#6791C9"
    },
    base16: {
      base00: "#061115",
      base01: "#0C171B",
      base02: "#101B1F",
      base03: "#192428",
      base04: "#212C30",
      base05: "#D9D7D6",
      base06: "#E3E1E0",
      base07: "#EDEBEA",
      base08: "#f26e74",
      base09: "#ecd28b",
      base0A: "#E9967E",
      base0B: "#82c29c",
      base0C: "#6791C9",
      base0D: "#79AAEB",
      base0E: "#C488EC",
      base0F: "#F16269"
    }
  }
];

const buildTokenColors = (theme: ThemeSpec): TokenColorRule[] => {
  const base = theme.base30;
  const syntax = theme.base16;

  return [
  {
    name: "Comments",
    scope: ["comment", "punctuation.definition.comment"],
    settings: { foreground: base.greyFg }
  },
  {
    name: "Strings",
    scope: [
      "string",
      "string.quoted",
      "string.template",
      "string.interpolated",
      "meta.embedded.assembly"
    ],
    settings: { foreground: syntax.base0B }
  },
  {
    name: "Regular Expressions",
    scope: ["string.regexp", "constant.other.character-class.regexp"],
    settings: { foreground: syntax.base0C }
  },
  {
    name: "Numbers And Booleans",
    scope: [
      "constant.numeric",
      "constant.language.boolean",
      "constant.language.null",
      "constant.character.escape"
    ],
    settings: { foreground: syntax.base09 }
  },
  {
    name: "Constants",
    scope: ["constant", "constant.other", "support.constant"],
    settings: { foreground: syntax.base09 }
  },
  {
    name: "Variables",
    scope: ["variable", "meta.definition.variable", "support.variable"],
    settings: { foreground: syntax.base05 }
  },
  {
    name: "Builtin Variables And Parameters",
    scope: [
      "variable.language",
      "variable.parameter",
      "variable.other.readwrite.alias",
      "meta.parameter"
    ],
    settings: { foreground: syntax.base08 }
  },
  {
    name: "Properties And Keys",
    scope: [
      "variable.other.property",
      "meta.object-literal.key",
      "support.type.property-name",
      "entity.other.attribute-name"
    ],
    settings: { foreground: syntax.base08 }
  },
  {
    name: "Functions And Methods",
    scope: [
      "entity.name.function",
      "support.function",
      "meta.function-call",
      "variable.function",
      "meta.method-call",
      "entity.name.method"
    ],
    settings: { foreground: syntax.base0D }
  },
  {
    name: "Keywords",
    scope: [
      "keyword",
      "keyword.control",
      "keyword.operator.expression",
      "storage",
      "storage.modifier",
      "keyword.other.unit"
    ],
    settings: { foreground: syntax.base0E }
  },
  {
    name: "Types",
    scope: [
      "storage.type",
      "support.type",
      "entity.name.type",
      "entity.name.class",
      "entity.name.namespace",
      "entity.name.scope-resolution"
    ],
    settings: { foreground: syntax.base0A }
  },
  {
    name: "Constructors And Specials",
    scope: [
      "meta.function-call.constructor",
      "support.class",
      "support.type.builtin",
      "constant.other.symbol"
    ],
    settings: { foreground: syntax.base0C }
  },
  {
    name: "Tag Names",
    scope: ["entity.name.tag", "meta.tag.sgml", "meta.tag.structure.any.html"],
    settings: { foreground: syntax.base0A }
  },
  {
    name: "Tag Delimiters And Punctuation",
    scope: [
      "punctuation.definition.tag",
      "punctuation.separator.key-value",
      "punctuation.separator.delimiter",
      "punctuation.terminator",
      "meta.brace"
    ],
    settings: { foreground: syntax.base0F }
  },
  {
    name: "Operators",
    scope: ["keyword.operator", "punctuation.accessor", "punctuation.definition.generic"],
    settings: { foreground: syntax.base05 }
  },
  {
    name: "Invalid",
    scope: ["invalid", "invalid.illegal"],
    settings: { foreground: syntax.base08 }
  },
  {
    name: "Markup Headings",
    scope: ["markup.heading", "entity.name.section"],
    settings: { foreground: syntax.base0D }
  },
  {
    name: "Markup Emphasis",
    scope: ["markup.bold", "markup.italic"],
    settings: { foreground: syntax.base09 }
  },
  {
    name: "Markup Links",
    scope: ["markup.underline.link", "string.other.link"],
    settings: { foreground: syntax.base0C, fontStyle: "underline" }
  },
  {
    name: "Diff Inserted",
    scope: ["markup.inserted", "meta.diff.header.from-file"],
    settings: { foreground: base.green }
  },
  {
    name: "Diff Removed",
    scope: ["markup.deleted", "meta.diff.header.to-file"],
    settings: { foreground: base.red }
  },
  {
    name: "Diff Changed",
    scope: ["markup.changed"],
    settings: { foreground: base.lightGrey }
  }
  ];
};

const buildSemanticTokenColors = (theme: ThemeSpec): Record<string, SemanticTokenRule> => {
  const base = theme.base30;
  const syntax = theme.base16;

  return {
    comment: base.greyFg,
    string: syntax.base0B,
    regexp: syntax.base0F,
    number: syntax.base09,
    boolean: syntax.base09,
    keyword: syntax.base0E,
    operator: syntax.base05,
    namespace: syntax.base08,
    type: syntax.base0A,
    typeParameter: syntax.base0A,
    class: syntax.base0E,
    interface: syntax.base0E,
    enum: syntax.base0A,
    enumMember: syntax.base09,
    struct: syntax.base0E,
    function: syntax.base0D,
    method: syntax.base0D,
    decorator: syntax.base0D,
    macro: syntax.base08,
    variable: syntax.base05,
    parameter: syntax.base08,
    property: syntax.base08,
    label: syntax.base0A,
    event: syntax.base08,
    modifier: syntax.base08,
    "variable.defaultLibrary": syntax.base09,
    "variable.readonly.defaultLibrary": syntax.base09,
    "type.defaultLibrary": syntax.base0A
  };
};

const buildVsCodeColors = (theme: ThemeSpec): Record<string, string> => {
  const base = theme.base30;
  const syntax = theme.base16;

  return {
  "foreground": base.white,
  "disabledForeground": base.lightGrey,
  "errorForeground": base.red,
  "focusBorder": base.blue,
  "contrastBorder": base.line,
  "contrastActiveBorder": base.blue,
  "selection.background": alpha(base.blue, 0.24),
  "textLink.foreground": base.teal,
  "textLink.activeForeground": syntax.base0D,
  "textPreformat.foreground": base.sun,
  "textBlockQuote.background": base.black2,
  "textBlockQuote.border": base.line,
  "textCodeBlock.background": base.black2,
  "textSeparator.foreground": base.line,
  "descriptionForeground": base.lightGrey,
  "icon.foreground": base.blue,
  "sash.hoverBorder": base.blue,
  "badge.background": base.blue,
  "badge.foreground": base.black,
  "progressBar.background": base.blue,
  "titleBar.activeBackground": base.black2,
  "titleBar.activeForeground": base.white,
  "titleBar.inactiveBackground": base.statuslineBg,
  "titleBar.inactiveForeground": base.lightGrey,
  "activityBar.background": base.darkerBlack,
  "activityBar.foreground": base.white,
  "activityBar.inactiveForeground": base.lightGrey,
  "activityBar.activeBorder": base.blue,
  "activityBarBadge.background": base.green,
  "activityBarBadge.foreground": base.black,
  "sideBar.background": base.black,
  "sideBar.foreground": base.white,
  "sideBar.border": base.line,
  "sideBarTitle.foreground": base.white,
  "sideBarSectionHeader.background": base.black2,
  "sideBarSectionHeader.foreground": base.white,
  "sideBarSectionHeader.border": base.line,
  "list.activeSelectionBackground": alpha(base.blue, 0.16),
  "list.activeSelectionForeground": base.white,
  "list.inactiveSelectionBackground": alpha(base.oneBg3, 0.84),
  "list.inactiveSelectionForeground": base.white,
  "list.hoverBackground": alpha(base.oneBg2, 0.72),
  "list.hoverForeground": base.white,
  "list.focusBackground": alpha(base.blue, 0.2),
  "list.focusForeground": base.white,
  "list.highlightForeground": base.teal,
  "list.errorForeground": base.red,
  "list.warningForeground": base.yellow,
  "tree.indentGuidesStroke": base.line,
  "editorGroupHeader.tabsBackground": base.statuslineBg,
  "editorGroupHeader.tabsBorder": base.line,
  "tab.border": base.line,
  "tab.activeBackground": base.black,
  "tab.activeForeground": base.white,
  "tab.activeBorderTop": base.blue,
  "tab.inactiveBackground": base.black2,
  "tab.inactiveForeground": base.lightGrey,
  "tab.inactiveModifiedBorder": base.yellow,
  "tab.unfocusedActiveBorderTop": alpha(base.blue, 0.55),
  "tab.unfocusedInactiveForeground": base.greyFg2,
  "editor.background": base.black,
  "editor.foreground": base.white,
  "editorLineNumber.foreground": base.greyFg,
  "editorLineNumber.activeForeground": base.blue,
  "editorCursor.foreground": base.white,
  "editorCursor.background": base.black,
  "editor.selectionBackground": alpha(base.blue, 0.22),
  "editor.selectionHighlightBackground": alpha(base.teal, 0.14),
  "editor.inactiveSelectionBackground": alpha(base.oneBg3, 0.72),
  "editor.wordHighlightBackground": alpha(base.yellow, 0.14),
  "editor.wordHighlightStrongBackground": alpha(base.orange, 0.18),
  "editor.findMatchBackground": alpha(base.green, 0.32),
  "editor.findMatchBorder": base.green,
  "editor.findMatchHighlightBackground": alpha(base.teal, 0.14),
  "editor.findRangeHighlightBackground": alpha(base.oneBg3, 0.55),
  "editor.hoverHighlightBackground": alpha(base.oneBg2, 0.45),
  "editor.lineHighlightBackground": alpha(base.white, 0.03),
  "editor.lineHighlightBorder": alpha(base.white, 0.05),
  "editorLink.activeForeground": base.teal,
  "editorWhitespace.foreground": alpha(base.grey, 0.65),
  "editorIndentGuide.background1": base.line,
  "editorIndentGuide.activeBackground1": base.lightGrey,
  "editorRuler.foreground": base.line,
  "editorBracketMatch.background": alpha(base.oneBg3, 0.85),
  "editorBracketMatch.border": base.teal,
  "editorBracketHighlight.foreground1": base.blue,
  "editorBracketHighlight.foreground2": base.green,
  "editorBracketHighlight.foreground3": base.yellow,
  "editorBracketHighlight.foreground4": base.purple,
  "editorBracketHighlight.foreground5": base.orange,
  "editorBracketHighlight.foreground6": base.teal,
  "editorBracketPairGuide.background1": alpha(base.blue, 0.26),
  "editorBracketPairGuide.background2": alpha(base.green, 0.26),
  "editorBracketPairGuide.background3": alpha(base.yellow, 0.26),
  "editorBracketPairGuide.background4": alpha(base.purple, 0.26),
  "editorBracketPairGuide.background5": alpha(base.orange, 0.26),
  "editorBracketPairGuide.background6": alpha(base.teal, 0.26),
  "editorBracketPairGuide.activeBackground1": base.blue,
  "editorBracketPairGuide.activeBackground2": base.green,
  "editorBracketPairGuide.activeBackground3": base.yellow,
  "editorBracketPairGuide.activeBackground4": base.purple,
  "editorBracketPairGuide.activeBackground5": base.orange,
  "editorBracketPairGuide.activeBackground6": base.teal,
  "editorGutter.background": base.black,
  "editorGutter.modifiedBackground": base.blue,
  "editorGutter.addedBackground": base.green,
  "editorGutter.deletedBackground": base.red,
  "editorError.foreground": base.red,
  "editorWarning.foreground": base.yellow,
  "editorInfo.foreground": base.green,
  "editorHint.foreground": base.purple,
  "editorOverviewRuler.errorForeground": alpha(base.red, 0.8),
  "editorOverviewRuler.warningForeground": alpha(base.yellow, 0.8),
  "editorOverviewRuler.infoForeground": alpha(base.green, 0.8),
  "editorOverviewRuler.bracketMatchForeground": alpha(base.teal, 0.8),
  "editorOverviewRuler.modifiedForeground": alpha(base.blue, 0.8),
  "editorOverviewRuler.addedForeground": alpha(base.green, 0.8),
  "editorOverviewRuler.deletedForeground": alpha(base.red, 0.8),
  "editorWidget.background": base.black2,
  "editorWidget.foreground": base.white,
  "editorWidget.border": base.line,
  "editorSuggestWidget.background": base.black2,
  "editorSuggestWidget.border": base.line,
  "editorSuggestWidget.foreground": base.white,
  "editorSuggestWidget.highlightForeground": base.teal,
  "editorSuggestWidget.selectedBackground": alpha(base.oneBg3, 0.92),
  "editorHoverWidget.background": base.black2,
  "editorHoverWidget.foreground": base.white,
  "editorHoverWidget.border": base.line,
  "editorMarkerNavigation.background": base.black2,
  "peekView.border": base.line,
  "peekViewEditor.background": base.black,
  "peekViewEditor.matchHighlightBackground": alpha(base.green, 0.22),
  "peekViewResult.background": base.black2,
  "peekViewResult.selectionBackground": alpha(base.blue, 0.18),
  "peekViewResult.matchHighlightBackground": alpha(base.teal, 0.16),
  "peekViewTitle.background": base.statuslineBg,
  "peekViewTitleLabel.foreground": base.white,
  "peekViewTitleDescription.foreground": base.lightGrey,
  "panel.background": base.black2,
  "panel.border": base.line,
  "panelTitle.activeBorder": base.blue,
  "panelTitle.activeForeground": base.white,
  "panelTitle.inactiveForeground": base.lightGrey,
  "statusBar.background": base.statuslineBg,
  "statusBar.foreground": base.white,
  "statusBar.border": base.line,
  "statusBar.debuggingBackground": base.orange,
  "statusBar.debuggingForeground": base.black,
  "statusBar.noFolderBackground": base.black2,
  "statusBarItem.hoverBackground": alpha(base.oneBg3, 0.9),
  "statusBarItem.prominentBackground": alpha(base.oneBg2, 0.9),
  "statusBarItem.remoteBackground": base.blue,
  "statusBarItem.remoteForeground": base.black,
  "terminal.background": base.black,
  "terminal.foreground": base.white,
  "terminal.selectionBackground": alpha(base.blue, 0.24),
  "terminal.border": base.line,
  "terminalCursor.foreground": base.white,
  "terminalCursor.background": base.black,
  "terminal.ansiBlack": base.black2,
  "terminal.ansiRed": base.red,
  "terminal.ansiGreen": base.green,
  "terminal.ansiYellow": base.yellow,
  "terminal.ansiBlue": base.blue,
  "terminal.ansiMagenta": base.purple,
  "terminal.ansiCyan": base.cyan,
  "terminal.ansiWhite": base.white,
  "terminal.ansiBrightBlack": base.greyFg,
  "terminal.ansiBrightRed": base.babyPink,
  "terminal.ansiBrightGreen": base.vibrantGreen,
  "terminal.ansiBrightYellow": base.sun,
  "terminal.ansiBrightBlue": syntax.base0D,
  "terminal.ansiBrightMagenta": base.darkPurple,
  "terminal.ansiBrightCyan": base.teal,
  "terminal.ansiBrightWhite": syntax.base07,
  "input.background": base.black2,
  "input.foreground": base.white,
  "input.border": base.line,
  "input.placeholderForeground": base.lightGrey,
  "inputOption.activeBorder": base.blue,
  "inputValidation.errorBackground": alpha(base.red, 0.1),
  "inputValidation.errorBorder": base.red,
  "inputValidation.warningBackground": alpha(base.yellow, 0.1),
  "inputValidation.warningBorder": base.yellow,
  "inputValidation.infoBackground": alpha(base.blue, 0.1),
  "inputValidation.infoBorder": base.blue,
  "dropdown.background": base.black2,
  "dropdown.foreground": base.white,
  "dropdown.border": base.line,
  "checkbox.background": base.black2,
  "checkbox.border": base.line,
  "checkbox.foreground": base.white,
  "button.background": base.blue,
  "button.foreground": base.black,
  "button.hoverBackground": syntax.base0D,
  "button.secondaryBackground": base.oneBg2,
  "button.secondaryForeground": base.white,
  "button.secondaryHoverBackground": base.oneBg3,
  "quickInput.background": base.black2,
  "quickInput.foreground": base.white,
  "quickInputList.focusBackground": alpha(base.oneBg3, 0.92),
  "pickerGroup.border": base.line,
  "pickerGroup.foreground": base.teal,
  "menu.background": base.black2,
  "menu.foreground": base.white,
  "menu.selectionBackground": alpha(base.oneBg3, 0.92),
  "menu.selectionForeground": base.white,
  "menu.border": base.line,
  "notificationCenterHeader.background": base.statuslineBg,
  "notificationCenterHeader.foreground": base.white,
  "notifications.background": base.black2,
  "notifications.foreground": base.white,
  "notifications.border": base.line,
  "scrollbar.shadow": alpha(base.black, 0.45),
  "scrollbarSlider.background": alpha(base.oneBg3, 0.65),
  "scrollbarSlider.hoverBackground": alpha(base.grey, 0.7),
  "scrollbarSlider.activeBackground": alpha(base.greyFg2, 0.82),
  "breadcrumb.background": base.black,
  "breadcrumb.foreground": base.lightGrey,
  "breadcrumb.activeSelectionForeground": base.white,
  "breadcrumb.focusForeground": base.teal,
  "commandCenter.background": alpha(base.oneBg2, 0.7),
  "commandCenter.foreground": base.white,
  "commandCenter.border": base.line,
  "minimap.background": base.black,
  "minimap.selectionHighlight": alpha(base.blue, 0.18),
  "minimap.findMatchHighlight": alpha(base.green, 0.3),
  "minimap.errorHighlight": alpha(base.red, 0.45),
  "minimap.warningHighlight": alpha(base.yellow, 0.45),
  "minimapGutter.addedBackground": base.green,
  "minimapGutter.modifiedBackground": base.blue,
  "minimapGutter.deletedBackground": base.red,
  "gitDecoration.addedResourceForeground": base.green,
  "gitDecoration.modifiedResourceForeground": base.blue,
  "gitDecoration.deletedResourceForeground": base.red,
  "gitDecoration.renamedResourceForeground": base.teal,
  "gitDecoration.untrackedResourceForeground": base.green,
  "gitDecoration.ignoredResourceForeground": base.lightGrey,
  "diffEditor.insertedTextBackground": alpha(base.green, 0.16),
  "diffEditor.removedTextBackground": alpha(base.red, 0.14),
  "diffEditor.insertedLineBackground": alpha(base.green, 0.08),
  "diffEditor.removedLineBackground": alpha(base.red, 0.08),
  "diffEditor.diagonalFill": base.line,
  "diffEditor.border": base.line,
  "diffEditorOverview.insertedForeground": alpha(base.green, 0.8),
  "diffEditorOverview.removedForeground": alpha(base.red, 0.8),
  "merge.currentHeaderBackground": alpha(base.blue, 0.2),
  "merge.currentContentBackground": alpha(base.blue, 0.08),
  "merge.incomingHeaderBackground": alpha(base.green, 0.2),
  "merge.incomingContentBackground": alpha(base.green, 0.08),
  "problemsErrorIcon.foreground": base.red,
  "problemsWarningIcon.foreground": base.yellow,
  "problemsInfoIcon.foreground": base.green,
  "debugIcon.breakpointForeground": base.red,
  "debugIcon.breakpointDisabledForeground": base.lightGrey,
  "debugIcon.startForeground": base.green,
  "debugIcon.pauseForeground": base.yellow,
  "debugIcon.stopForeground": base.red,
  "debugTokenExpression.string": syntax.base0B,
  "debugTokenExpression.number": syntax.base09,
  "debugTokenExpression.boolean": syntax.base09,
  "debugTokenExpression.name": syntax.base0D,
  "settings.headerForeground": base.white,
  "settings.modifiedItemIndicator": base.green,
  "settings.dropdownBackground": base.black2,
  "settings.dropdownForeground": base.white,
  "settings.dropdownBorder": base.line,
  "settings.numberInputBackground": base.black2,
  "settings.numberInputForeground": base.white,
  "settings.numberInputBorder": base.line,
  "settings.textInputBackground": base.black2,
  "settings.textInputForeground": base.white,
    "settings.textInputBorder": base.line
  };
};

const buildZedSyntax = (theme: ThemeSpec): Record<string, ZedSyntaxRule> => {
  const base = theme.base30;
  const syntax = theme.base16;

  return {
    "attribute": { color: syntax.base0A, font_style: null, font_weight: null },
  "boolean": { color: syntax.base09, font_style: null, font_weight: null },
  "character": { color: syntax.base0C, font_style: null, font_weight: null },
  "character.special": { color: syntax.base0F, font_style: null, font_weight: null },
  "comment": { color: base.greyFg, font_style: null, font_weight: null },
  "comment.doc": { color: base.greyFg2, font_style: null, font_weight: null },
  "constant": { color: syntax.base09, font_style: null, font_weight: null },
  "constant.builtin": { color: syntax.base09, font_style: null, font_weight: null },
  "constructor": { color: syntax.base0C, font_style: null, font_weight: null },
  "embedded": { color: syntax.base05, font_style: null, font_weight: null },
  "emphasis": { color: syntax.base09, font_style: "italic", font_weight: null },
  "function": { color: syntax.base0D, font_style: null, font_weight: null },
  "function.builtin": { color: syntax.base0D, font_style: null, font_weight: null },
  "function.call": { color: syntax.base0D, font_style: null, font_weight: null },
  "function.macro": { color: syntax.base08, font_style: null, font_weight: null },
  "function.method": { color: syntax.base0D, font_style: null, font_weight: null },
  "function.method.call": { color: syntax.base0D, font_style: null, font_weight: null },
  "hint": { color: base.purple, font_style: null, font_weight: null },
  "keyword": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.conditional": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.control": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.directive": { color: syntax.base0A, font_style: null, font_weight: null },
  "keyword.exception": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.function": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.import": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.operator": { color: syntax.base0E, font_style: null, font_weight: null },
  "keyword.repeat": { color: syntax.base0A, font_style: null, font_weight: null },
  "keyword.return": { color: syntax.base0E, font_style: null, font_weight: null },
  "label": { color: syntax.base0A, font_style: null, font_weight: null },
  "link_text": { color: base.teal, font_style: null, font_weight: null },
  "link_uri": { color: base.teal, font_style: "italic", font_weight: null },
  "module": { color: syntax.base08, font_style: null, font_weight: null },
  "number": { color: syntax.base09, font_style: null, font_weight: null },
  "number.float": { color: syntax.base09, font_style: null, font_weight: null },
  "operator": { color: syntax.base05, font_style: null, font_weight: null },
  "property": { color: syntax.base08, font_style: null, font_weight: null },
  "property.json": { color: syntax.base08, font_style: null, font_weight: null },
  "punctuation": { color: syntax.base0F, font_style: null, font_weight: null },
  "punctuation.bracket": { color: syntax.base0F, font_style: null, font_weight: null },
  "punctuation.delimiter": { color: syntax.base0F, font_style: null, font_weight: null },
  "punctuation.list_marker": { color: syntax.base08, font_style: null, font_weight: null },
  "string": { color: syntax.base0B, font_style: null, font_weight: null },
  "string.documentation": { color: base.teal, font_style: null, font_weight: null },
  "string.escape": { color: syntax.base0C, font_style: null, font_weight: null },
  "string.regexp": { color: syntax.base0C, font_style: null, font_weight: null },
  "string.special": { color: syntax.base0F, font_style: null, font_weight: null },
  "string.special.symbol": { color: syntax.base09, font_style: null, font_weight: null },
  "string.special.url": { color: base.teal, font_style: "italic", font_weight: null },
  "tag": { color: syntax.base0A, font_style: null, font_weight: null },
  "tag.attribute": { color: syntax.base08, font_style: null, font_weight: null },
  "tag.doctype": { color: syntax.base0E, font_style: null, font_weight: null },
  "tag.delimiter": { color: syntax.base0F, font_style: null, font_weight: null },
  "text.literal": { color: syntax.base05, font_style: null, font_weight: null },
  "title": { color: syntax.base0D, font_style: null, font_weight: 700 },
  "type": { color: syntax.base0A, font_style: null, font_weight: null },
  "type.builtin": { color: syntax.base0A, font_style: null, font_weight: null },
  "type.definition": { color: syntax.base0A, font_style: null, font_weight: null },
  "type.interface": { color: syntax.base0E, font_style: null, font_weight: null },
  "type.super": { color: syntax.base0A, font_style: null, font_weight: null },
  "variable": { color: syntax.base05, font_style: null, font_weight: null },
  "variable.builtin": { color: syntax.base09, font_style: null, font_weight: null },
  "variable.member": { color: syntax.base08, font_style: null, font_weight: null },
  "variable.parameter": { color: syntax.base08, font_style: null, font_weight: null },
  "variable.special": { color: syntax.base08, font_style: "italic", font_weight: null },
    "variant": { color: syntax.base0C, font_style: null, font_weight: null }
  };
};

export const buildTheme = (theme: ThemeSpec = themeCatalog[0]): ThemeDefinition => ({
  $schema: "vscode://schemas/color-theme",
  name: theme.displayName,
  type: "dark",
  semanticHighlighting: true,
  colors: buildVsCodeColors(theme),
  tokenColors: buildTokenColors(theme),
  semanticTokenColors: buildSemanticTokenColors(theme)
});

export const buildZedTheme = (theme: ThemeSpec = themeCatalog[0]): ZedThemeDefinition => {
  const base = theme.base30;
  const syntax = theme.base16;

  return ({
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: theme.displayName,
  author: theme.author,
  themes: [
    {
      name: theme.displayName,
      appearance: "dark",
      style: {
        "accents": [base.blue, base.green, base.teal, base.yellow, base.orange, base.purple, base.red],
        "background.appearance": "opaque",
        "background": base.black,
        "border": base.line,
        "border.disabled": base.greyFg2,
        "border.focused": base.blue,
        "border.selected": base.purple,
        "border.transparent": alpha(base.black, 0),
        "border.variant": base.oneBg3,
        "conflict": base.orange,
        "conflict.background": alpha(base.orange, 0.16),
        "conflict.border": base.orange,
        "created": base.green,
        "created.background": alpha(base.green, 0.16),
        "created.border": base.green,
        "debugger.accent": base.red,
        "deleted": base.red,
        "deleted.background": alpha(base.red, 0.15),
        "deleted.border": base.red,
        "drop_target.background": alpha(base.blue, 0.2),
        "editor.active_line.background": alpha(base.white, 0.03),
        "editor.active_line_number": base.blue,
        "editor.active_wrap_guide": base.lightGrey,
        "editor.background": base.black,
        "editor.debugger_active_line.background": alpha(base.orange, 0.12),
        "editor.document_highlight.bracket_background": alpha(base.purple, 0.1),
        "editor.document_highlight.read_background": alpha(base.oneBg3, 0.55),
        "editor.document_highlight.write_background": alpha(base.oneBg3, 0.55),
        "editor.foreground": base.white,
        "editor.gutter.background": base.black,
        "editor.highlighted_line.background": alpha(base.blue, 0.08),
        "editor.indent_guide": alpha(base.line, 0.8),
        "editor.indent_guide_active": base.lightGrey,
        "editor.invisible": alpha(base.grey, 0.6),
        "editor.line_number": base.greyFg,
        "editor.subheader.background": base.black2,
        "editor.wrap_guide": base.line,
        "elevated_surface.background": base.black2,
        "element.active": alpha(base.oneBg3, 0.7),
        "element.background": base.oneBg,
        "element.disabled": base.greyFg2,
        "element.hover": base.oneBg2,
        "element.selected": alpha(base.blue, 0.16),
        "error": base.red,
        "error.background": alpha(base.red, 0.14),
        "error.border": base.red,
        "ghost_element.active": alpha(base.oneBg3, 0.55),
        "ghost_element.background": alpha(base.black, 0),
        "ghost_element.disabled": base.greyFg2,
        "ghost_element.hover": alpha(base.oneBg2, 0.5),
        "ghost_element.selected": alpha(base.oneBg3, 0.4),
        "hidden": base.lightGrey,
        "hidden.background": base.black2,
        "hidden.border": base.lightGrey,
        "hint": base.purple,
        "hint.background": alpha(base.purple, 0.14),
        "hint.border": base.purple,
        "icon": base.white,
        "icon.accent": base.teal,
        "icon.disabled": base.greyFg2,
        "icon.muted": base.lightGrey,
        "icon.placeholder": base.greyFg,
        "ignored": base.lightGrey,
        "ignored.background": alpha(base.lightGrey, 0.08),
        "ignored.border": base.lightGrey,
        "info": base.blue,
        "info.background": alpha(base.blue, 0.14),
        "info.border": base.blue,
        "link_text.hover": base.teal,
        "minimap.thumb.active_background": alpha(base.blue, 0.45),
        "minimap.thumb.background": alpha(base.blue, 0.2),
        "minimap.thumb.border": null,
        "minimap.thumb.hover_background": alpha(base.blue, 0.3),
        "modified": base.yellow,
        "modified.background": alpha(base.yellow, 0.14),
        "modified.border": base.yellow,
        "pane.focused_border": base.blue,
        "pane_group.border": base.line,
        "panel.background": base.black2,
        "panel.focused_border": base.blue,
        "panel.indent_guide": alpha(base.line, 0.8),
        "panel.indent_guide_active": base.lightGrey,
        "panel.indent_guide_hover": base.teal,
        "panel.overlay_background": base.black2,
        "players": [
          { "background": base.blue, "cursor": base.blue, "selection": alpha(base.blue, 0.3) },
          { "background": base.green, "cursor": base.green, "selection": alpha(base.green, 0.3) },
          { "background": base.teal, "cursor": base.teal, "selection": alpha(base.teal, 0.3) },
          { "background": base.yellow, "cursor": base.yellow, "selection": alpha(base.yellow, 0.3) },
          { "background": base.orange, "cursor": base.orange, "selection": alpha(base.orange, 0.3) },
          { "background": base.purple, "cursor": base.purple, "selection": alpha(base.purple, 0.3) },
          { "background": base.red, "cursor": base.red, "selection": alpha(base.red, 0.3) }
        ],
        "predictive": base.lightGrey,
        "predictive.background": alpha(base.oneBg3, 0.2),
        "predictive.border": base.blue,
        "renamed": base.teal,
        "renamed.background": alpha(base.teal, 0.14),
        "renamed.border": base.teal,
        "scrollbar.thumb.active_background": alpha(base.greyFg2, 0.82),
        "scrollbar.thumb.background": alpha(base.oneBg3, 0.65),
        "scrollbar.thumb.border": null,
        "scrollbar.thumb.hover_background": alpha(base.grey, 0.7),
        "scrollbar.track.background": base.black2,
        "scrollbar.track.border": alpha(base.black, 0),
        "search.active_match_background": alpha(base.green, 0.24),
        "search.match_background": alpha(base.teal, 0.14),
        "status_bar.background": base.statuslineBg,
        "success": base.green,
        "success.background": alpha(base.green, 0.14),
        "success.border": base.green,
        "surface.background": base.black2,
        "syntax": buildZedSyntax(theme),
        "tab.active_background": base.black,
        "tab.inactive_background": base.black2,
        "tab_bar.background": base.statuslineBg,
        "terminal.ansi.background": base.black,
        "terminal.ansi.black": base.black2,
        "terminal.ansi.blue": base.blue,
        "terminal.ansi.bright_black": base.greyFg,
        "terminal.ansi.bright_blue": syntax.base0D,
        "terminal.ansi.bright_cyan": base.teal,
        "terminal.ansi.bright_green": base.vibrantGreen,
        "terminal.ansi.bright_magenta": base.darkPurple,
        "terminal.ansi.bright_red": base.babyPink,
        "terminal.ansi.bright_white": syntax.base07,
        "terminal.ansi.bright_yellow": base.sun,
        "terminal.ansi.cyan": base.cyan,
        "terminal.ansi.dim_black": base.black2,
        "terminal.ansi.dim_blue": base.nordBlue,
        "terminal.ansi.dim_cyan": base.cyan,
        "terminal.ansi.dim_green": base.green,
        "terminal.ansi.dim_magenta": base.purple,
        "terminal.ansi.dim_red": base.red,
        "terminal.ansi.dim_white": base.lightGrey,
        "terminal.ansi.dim_yellow": base.yellow,
        "terminal.ansi.green": base.green,
        "terminal.ansi.magenta": base.purple,
        "terminal.ansi.red": base.red,
        "terminal.ansi.white": base.white,
        "terminal.ansi.yellow": base.yellow,
        "terminal.background": base.black,
        "terminal.bright_foreground": syntax.base07,
        "terminal.dim_foreground": base.lightGrey,
        "terminal.foreground": base.white,
        "text": base.white,
        "text.accent": base.teal,
        "text.disabled": base.greyFg2,
        "text.muted": base.lightGrey,
        "text.placeholder": base.greyFg,
        "title_bar.background": base.black2,
        "title_bar.inactive_background": base.statuslineBg,
        "toolbar.background": base.black2,
        "unreachable": base.red,
        "unreachable.background": alpha(base.red, 0.14),
        "unreachable.border": base.red,
        "version_control.added": base.green,
        "version_control.conflict": base.orange,
        "version_control.conflict_marker.ours": alpha(base.green, 0.2),
        "version_control.conflict_marker.theirs": alpha(base.blue, 0.2),
        "version_control.deleted": base.red,
        "version_control.ignored": base.lightGrey,
        "version_control.modified": base.yellow,
        "version_control.renamed": base.teal,
        "vim.helix_normal.background": base.blue,
        "vim.helix_normal.foreground": base.black,
        "vim.helix_select.background": base.teal,
        "vim.helix_select.foreground": base.black,
        "vim.insert.background": base.green,
        "vim.insert.foreground": base.black,
        "vim.mode.text": base.white,
        "vim.normal.background": base.blue,
        "vim.normal.foreground": base.black,
        "vim.replace.background": base.red,
        "vim.replace.foreground": base.black,
        "vim.visual.background": base.purple,
        "vim.visual.foreground": base.black,
        "vim.visual_block.background": base.orange,
        "vim.visual_block.foreground": base.black,
        "vim.visual_line.background": base.yellow,
        "vim.visual_line.foreground": base.black,
        "warning": base.yellow,
        "warning.background": alpha(base.yellow, 0.14),
        "warning.border": base.yellow
      }
    }
  ]
  });
};
