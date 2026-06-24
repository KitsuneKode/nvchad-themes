import type { OpenCodeThemeDefinition, ThemeSpec } from "../types.ts";
import type { ResolvedThemeModel } from "../derive/types.ts";
import { deriveThemeModel } from "../derive/theme-model.ts";

const buildOpenCodeDefsFromModel = (model: ResolvedThemeModel): Record<string, string> => {
  const theme = model.theme;
  const base = theme.base30;
  const syntax = theme.base16;
  const ladder = model.surfaces.vscode;
  const git = model.integrations.git;

  return {
    bg: ladder.editor,
    bg_panel: ladder.overlay,
    bg_element: ladder.raised,
    bg_element_alt: ladder.raisedHover,
    bg_element_strong: base.oneBg3,
    fg: base.white,
    fg_muted: base.lightGrey,
    border: model.ui.border,
    border_active: base.blue,
    border_subtle: model.ui.borderSubtle,
    primary: base.blue,
    secondary: base.nordBlue,
    accent: base.teal,
    error: model.integrations.diagnostics.error,
    warning: model.integrations.diagnostics.warning,
    success: git.added,
    info: model.integrations.diagnostics.info,
    diff_added: git.added,
    diff_removed: git.deleted,
    diff_context: base.greyFg,
    diff_hunk: base.greyFg2,
    diff_bg_added: base.oneBg2,
    diff_bg_removed: base.oneBg2,
    diff_bg_context: base.oneBg,
    markdown_text: base.white,
    markdown_heading: syntax.base0D,
    markdown_link: base.teal,
    markdown_link_text: syntax.base0A,
    markdown_code: syntax.base0B,
    markdown_blockquote: base.oneBg3,
    markdown_emph: syntax.base0E,
    markdown_strong: syntax.base0A,
    markdown_rule: base.line,
    markdown_list_item: syntax.base0A,
    markdown_list_enum: syntax.base0E,
    markdown_image: syntax.base0C,
    markdown_image_text: syntax.base0A,
    markdown_code_block: base.black2,
    syntax_comment: base.greyFg,
    syntax_keyword: model.syntax["@keyword"]?.color ?? syntax.base0E,
    syntax_function: model.syntax["@function"]?.color ?? syntax.base0D,
    syntax_variable: model.syntax["@variable"]?.color ?? syntax.base05,
    syntax_string: model.syntax["@string"]?.color ?? syntax.base0B,
    syntax_number: model.syntax["@number"]?.color ?? syntax.base09,
    syntax_type: model.syntax["@type.builtin"]?.color ?? syntax.base0A,
    syntax_operator: model.syntax["@operator"]?.color ?? syntax.base05,
    syntax_punctuation: model.syntax["@punctuation.bracket"]?.color ?? syntax.base0F
  };
};

const openCodeColor = (name: string): { dark: string; light: string } => ({ dark: name, light: name });

export const buildOpenCodeThemeFromModel = (model: ResolvedThemeModel): OpenCodeThemeDefinition => {
  const defs = buildOpenCodeDefsFromModel(model);
  const theme = model.theme;

  return {
    $schema: "https://opencode.ai/theme.json",
    defs,
    theme: {
      primary: openCodeColor("primary"),
      secondary: openCodeColor("secondary"),
      accent: openCodeColor("accent"),
      error: openCodeColor("error"),
      warning: openCodeColor("warning"),
      success: openCodeColor("success"),
      info: openCodeColor("info"),
      text: openCodeColor("fg"),
      textMuted: openCodeColor("fg_muted"),
      background: openCodeColor("bg"),
      backgroundPanel: openCodeColor("bg_panel"),
      backgroundElement: openCodeColor("bg_element"),
      border: openCodeColor("border"),
      borderActive: openCodeColor("border_active"),
      borderSubtle: openCodeColor("border_subtle"),
      diffAdded: openCodeColor("diff_added"),
      diffRemoved: openCodeColor("diff_removed"),
      diffContext: openCodeColor("diff_context"),
      diffHunkHeader: openCodeColor("diff_hunk"),
      diffHighlightAdded: openCodeColor("diff_added"),
      diffHighlightRemoved: openCodeColor("diff_removed"),
      diffAddedBg: openCodeColor("diff_bg_added"),
      diffRemovedBg: openCodeColor("diff_bg_removed"),
      diffContextBg: openCodeColor("diff_bg_context"),
      diffLineNumber: openCodeColor("diff_context"),
      diffAddedLineNumberBg: openCodeColor("diff_bg_added"),
      diffRemovedLineNumberBg: openCodeColor("diff_bg_removed"),
      markdownText: openCodeColor("markdown_text"),
      markdownHeading: openCodeColor("markdown_heading"),
      markdownLink: openCodeColor("markdown_link"),
      markdownLinkText: openCodeColor("markdown_link_text"),
      markdownCode: openCodeColor("markdown_code"),
      markdownBlockQuote: openCodeColor("markdown_blockquote"),
      markdownEmph: openCodeColor("markdown_emph"),
      markdownStrong: openCodeColor("markdown_strong"),
      markdownHorizontalRule: openCodeColor("markdown_rule"),
      markdownListItem: openCodeColor("markdown_list_item"),
      markdownListEnumeration: openCodeColor("markdown_list_enum"),
      markdownImage: openCodeColor("markdown_image"),
      markdownImageText: openCodeColor("markdown_image_text"),
      markdownCodeBlock: openCodeColor("markdown_code_block"),
      syntaxComment: openCodeColor("syntax_comment"),
      syntaxKeyword: openCodeColor("syntax_keyword"),
      syntaxFunction: openCodeColor("syntax_function"),
      syntaxVariable: openCodeColor("syntax_variable"),
      syntaxString: openCodeColor("syntax_string"),
      syntaxNumber: openCodeColor("syntax_number"),
      syntaxType: openCodeColor("syntax_type"),
      syntaxOperator: openCodeColor("syntax_operator"),
      syntaxPunctuation: openCodeColor("syntax_punctuation")
    }
  };
};

export const buildOpenCodeTheme = (theme: ThemeSpec): OpenCodeThemeDefinition =>
  buildOpenCodeThemeFromModel(deriveThemeModel(theme));
