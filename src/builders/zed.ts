import type { ThemeSpec, ZedThemeDefinition, ZedSyntaxRule } from "../types.ts";
import type { ResolvedThemeModel } from "../derive/types.ts";
import { deriveThemeModel } from "../derive/theme-model.ts";
import { alpha } from "../utils.ts";
import { NVIM_TO_ZED } from "../syntax/index.ts";
import { resolveThemeColorOr } from "../resolve-color.ts";

const toZedRule = (
  color: string,
  options: { italic?: boolean; bold?: boolean } = {}
): ZedSyntaxRule => ({
  color,
  font_style: options.italic ? "italic" : null,
  font_weight: options.bold ? 700 : null
});

/** Zed tree-sitter keys not covered by nvim @groups — baseline from palette. */
const zedSyntaxBaseline = (theme: ThemeSpec): Record<string, ZedSyntaxRule> => {
  const base = theme.base30;
  const b16 = theme.base16;
  const punct = theme.type === "light" ? b16.base03 : base.cyan;

  return {
    attribute: toZedRule(b16.base0E),
    boolean: toZedRule(b16.base09),
    character: toZedRule(b16.base0B),
    "character.special": toZedRule(b16.base0E),
    concept: toZedRule(b16.base0E),
    constant: toZedRule(b16.base09),
    "constant.builtin": toZedRule(b16.base09),
    "constant.macro": toZedRule(b16.base0E),
    "comment.documentation": toZedRule(b16.base04),
    emphasis: toZedRule(b16.base08, { italic: true }),
    "emphasis.strong": toZedRule(b16.base08, { bold: true }),
    enum: toZedRule(b16.base0A),
    label: toZedRule(b16.base05),
    number: toZedRule(b16.base09),
    "number.float": toZedRule(b16.base09),
    operator: toZedRule(punct),
    punctuation: toZedRule(punct),
    "punctuation.bracket": toZedRule(punct),
    "punctuation.delimiter": toZedRule(punct),
    "punctuation.list_marker": toZedRule(punct),
    "punctuation.special": toZedRule(punct),
    preproc: toZedRule(b16.base0C),
    property: toZedRule(b16.base08),
    "property.json": toZedRule(b16.base08),
    string: toZedRule(b16.base0B),
    "string.documentation": toZedRule(b16.base04),
    "string.escape": toZedRule(b16.base0E),
    "string.regex": toZedRule(b16.base0B),
    "string.special": toZedRule(b16.base0B),
    "string.special.symbol": toZedRule(b16.base0B),
    "string.special.url": toZedRule(base.teal, { italic: true }),
    tag: toZedRule(b16.base08),
    "tag.doctype": toZedRule(b16.base08),
    "text.literal": toZedRule(b16.base0B),
    title: toZedRule(b16.base0A),
    type: toZedRule(b16.base0A),
    "type.builtin": toZedRule(b16.base0A),
    "type.definition": toZedRule(b16.base0A),
    "type.interface": toZedRule(b16.base0A),
    "type.super": toZedRule(b16.base0A),
    variable: toZedRule(b16.base05),
    "variable.builtin": toZedRule(b16.base09),
    "variable.member": toZedRule(b16.base08),
    "variable.parameter": toZedRule(b16.base08),
    "variable.special": toZedRule(b16.base08),
    hint: toZedRule(b16.base04, { italic: true }),
    link_text: toZedRule(base.teal),
    link_uri: toZedRule(base.teal, { italic: true }),
    embedded: toZedRule(b16.base05),
    variant: toZedRule(b16.base0C),
    primary: toZedRule(base.blue),
    "keyword.control": toZedRule(b16.base0E),
    function: toZedRule(base.blue),
    "function.builtin": toZedRule(base.blue),
    "function.call": toZedRule(base.blue),
    "function.method": toZedRule(base.blue),
    "function.method.call": toZedRule(b16.base08),
    "function.macro": toZedRule(b16.base08),
    constructor: toZedRule(b16.base08),
    keyword: toZedRule(b16.base0E),
    comment: toZedRule(base.greyFg),
    "comment.doc": toZedRule(base.greyFg2, { italic: true })
  };
};

export const buildZedSyntaxFromModel = (model: ResolvedThemeModel) => {
  const theme = model.theme;
  const rules = model.syntax;
  const merged: Record<string, ZedSyntaxRule> = { ...zedSyntaxBaseline(theme) };

  for (const [nvimGroup, rule] of Object.entries(rules)) {
    const zedKey = NVIM_TO_ZED[nvimGroup] ?? nvimGroup.replace(/^@/, "");
    merged[zedKey] = toZedRule(rule.color, { italic: rule.italic, bold: rule.bold });
  }

  for (const key of Object.keys(merged)) {
    const rule = merged[key]!;
    if (key.startsWith("function") && rule.font_style === "italic") {
      merged[key] = { ...rule, font_style: null };
    }
    if (!rule.color.startsWith("#") || rule.color.includes("M.")) {
      merged[key] = {
        ...rule,
        color: resolveThemeColorOr(theme, rule.color, theme.base16.base05)
      };
    }
  }

  const polishedTs = theme.polishHl?.treesitter ?? {};
  if (!("@function" in polishedTs)) {
    merged.function = toZedRule(theme.base30.blue);
    merged["function.method"] = toZedRule(theme.base30.blue);
  }
  if (!("@function.call" in polishedTs)) {
    merged["function.call"] = toZedRule(theme.base30.blue);
  }

  return merged;
};

export const buildZedSyntax = (theme: ThemeSpec) => buildZedSyntaxFromModel(deriveThemeModel(theme));

export const buildZedThemeVariantFromModel = (model: ResolvedThemeModel) => {
  const theme = model.theme;
  const base = theme.base30;
  const syntax = theme.base16;
  const ui = model.zedUi;
  const ladder = model.surfaces.zed;
  const extra = model.zedExtras;
  const hints = model.integrations;
  const term = hints.terminal;
  const git = hints.git;
  const diag = hints.diagnostics;

  return {
    name: theme.displayName,
    appearance: theme.type,
    style: {
      accents: [base.blue, base.green, base.teal, base.yellow, base.orange, base.purple, base.red],
      "background.appearance": "opaque",
      background: ladder.background,
      border: ui.border,
      "border.disabled": ui.border,
      "border.focused": ui.borderFocused,
      "border.selected": ui.border,
      "border.transparent": ui.border,
      "border.variant": ui.border,
      conflict: base.orange,
      "conflict.background": ladder.background,
      "conflict.border": ladder.raised,
      created: base.green,
      "created.background": ladder.background,
      "created.border": ladder.raised,
      "debugger.accent": base.red,
      deleted: base.red,
      "deleted.background": ladder.background,
      "deleted.border": ladder.raised,
      "drop_target.background": ui.elementActive,
      "editor.active_line.background": ui.activeLineBg,
      "editor.active_line_number": ui.activeLineNumber,
      "editor.hover_line_number": extra.hoverLineNumber,
      "editor.active_wrap_guide": ui.wrapGuide,
      "editor.background": ladder.background,
      "editor.debugger_active_line.background": alpha(base.orange, 0.12),
      "editor.document_highlight.bracket_background": ui.bracketHighlight,
      "editor.document_highlight.read_background": ui.documentHighlight,
      "editor.document_highlight.write_background": ui.documentHighlight,
      "editor.foreground": ui.text,
      "editor.gutter.background": ladder.background,
      "editor.highlighted_line.background": ui.highlightedLineBg,
      "editor.indent_guide": ui.indentGuide,
      "editor.indent_guide_active": ui.indentGuideActive,
      "editor.invisible": null,
      "editor.line_number": ui.lineNumber,
      "editor.subheader.background": ladder.background,
      "editor.wrap_guide": ui.wrapGuide,
      "elevated_surface.background": ladder.elevated,
      "element.active": ui.elementActive,
      "element.background": ladder.element,
      "element.disabled": ui.textDisabled,
      "element.hover": ui.elementHover,
      "element.selected": ui.elementSelected,
      error: diag.error,
      "error.background": ladder.background,
      "error.border": ladder.raised,
      "ghost_element.active": ui.ghostActive,
      "ghost_element.background": ladder.element,
      "ghost_element.disabled": ui.textDisabled,
      "ghost_element.hover": ui.ghostHover,
      "ghost_element.selected": ui.ghostSelected,
      hidden: ui.textMuted,
      "hidden.background": ladder.background,
      "hidden.border": ladder.raised,
      hint: diag.hint,
      "hint.background": ladder.background,
      "hint.border": ladder.raised,
      icon: ui.icon,
      "icon.accent": base.teal,
      "icon.disabled": ui.textDisabled,
      "icon.muted": ui.iconMuted,
      "icon.placeholder": ui.iconPlaceholder,
      ignored: ui.textMuted,
      "ignored.background": ladder.background,
      "ignored.border": ladder.raised,
      info: diag.info,
      "info.background": ladder.background,
      "info.border": ladder.raised,
      "link_text.hover": base.teal,
      "minimap.thumb.active_background": alpha(base.blue, 0.45),
      "minimap.thumb.background": alpha(base.blue, 0.2),
      "minimap.thumb.border": null,
      "minimap.thumb.hover_background": alpha(base.blue, 0.3),
      modified: base.yellow,
      "modified.background": ladder.background,
      "modified.border": ladder.raised,
      "pane.focused_border": null,
      "pane_group.border": ui.border,
      "panel.background": ladder.surface,
      "panel.focused_border": null,
      "panel.indent_guide": ui.indentGuide,
      "panel.indent_guide_active": ui.indentGuideActive,
      "panel.indent_guide_hover": ui.elementHover,
      "panel.overlay_background": ladder.elevated,
      players: [
        { background: base.blue, cursor: base.blue, selection: alpha(base.blue, 0.3) },
        { background: base.green, cursor: base.green, selection: alpha(base.green, 0.3) },
        { background: base.teal, cursor: base.teal, selection: alpha(base.teal, 0.3) },
        { background: base.yellow, cursor: base.yellow, selection: alpha(base.yellow, 0.3) },
        { background: base.orange, cursor: base.orange, selection: alpha(base.orange, 0.3) },
        { background: base.purple, cursor: base.purple, selection: alpha(base.purple, 0.3) },
        { background: base.red, cursor: base.red, selection: alpha(base.red, 0.3) }
      ],
      predictive: ui.textMuted,
      "predictive.background": ladder.background,
      "predictive.border": ladder.raised,
      renamed: base.teal,
      "renamed.background": ladder.background,
      "renamed.border": ladder.raised,
      "scrollbar.thumb.background": ui.scrollbarThumb,
      "scrollbar.thumb.hover_background": ui.scrollbarThumbHover,
      "scrollbar.thumb.border": ladder.raised,
      "scrollbar.track.background": ui.scrollbarTrack,
      "scrollbar.track.border": ui.border,
      "search.active_match_background": ui.searchActiveMatch,
      "search.match_background": ui.searchMatch,
      "status_bar.background": ladder.surface,
      success: base.green,
      "success.background": ladder.background,
      "success.border": ladder.raised,
      "surface.background": ladder.surface,
      syntax: buildZedSyntaxFromModel(model),
      "tab.active_background": hints.zedTabActive,
      "tab.active_border_top": base.blue,
      "tab.hover_background": ui.elementHover,
      "tab.inactive_background": hints.zedTabInactive,
      "tab_bar.background": ladder.surface,
      "terminal.ansi.background": ladder.surface,
      "terminal.ansi.black": term.black,
      "terminal.ansi.blue": term.blue,
      "terminal.ansi.bright_black": term.brightBlack,
      "terminal.ansi.bright_blue": term.brightBlue,
      "terminal.ansi.bright_cyan": term.brightCyan,
      "terminal.ansi.bright_green": term.brightGreen,
      "terminal.ansi.bright_magenta": term.brightMagenta,
      "terminal.ansi.bright_red": term.brightRed,
      "terminal.ansi.bright_white": term.brightWhite,
      "terminal.ansi.bright_yellow": term.brightYellow,
      "terminal.ansi.cyan": term.cyan,
      "terminal.ansi.dim_black": base.black2,
      "terminal.ansi.dim_blue": base.nordBlue,
      "terminal.ansi.dim_cyan": base.cyan,
      "terminal.ansi.dim_green": term.green,
      "terminal.ansi.dim_magenta": base.purple,
      "terminal.ansi.dim_red": term.red,
      "terminal.ansi.dim_white": base.lightGrey,
      "terminal.ansi.dim_yellow": term.yellow,
      "terminal.ansi.green": term.green,
      "terminal.ansi.magenta": term.magenta,
      "terminal.ansi.red": term.red,
      "terminal.ansi.white": ui.textMuted,
      "terminal.ansi.yellow": term.yellow,
      "terminal.background": ladder.surface,
      "terminal.bright_foreground": syntax.base07,
      "terminal.dim_foreground": ui.textMuted,
      "terminal.foreground": ui.text,
      text: ui.text,
      "text.accent": base.teal,
      "text.disabled": ui.textDisabled,
      "text.muted": ui.textMuted,
      "text.placeholder": ui.textPlaceholder,
      "title_bar.background": ladder.surface,
      "title_bar.inactive_background": ladder.surface,
      "toolbar.background": ladder.surface,
      "toolbar.hover_background": ui.elementHover,
      unreachable: base.red,
      "unreachable.background": ladder.background,
      "unreachable.border": ladder.raised,
      "version_control.added": git.added,
      "version_control.conflict": git.conflict,
      "version_control.conflict_marker.ours": alpha(git.added, 0.2),
      "version_control.conflict_marker.theirs": alpha(git.modified, 0.2),
      "version_control.deleted": git.deleted,
      "version_control.ignored": git.ignored,
      "version_control.modified": git.modified,
      "version_control.renamed": git.renamed,
      "vim.helix_normal.background": base.blue,
      "vim.helix_normal.foreground": ladder.background,
      "vim.helix_select.background": base.teal,
      "vim.helix_select.foreground": ladder.background,
      "vim.insert.background": base.green,
      "vim.insert.foreground": ladder.background,
      "vim.mode.text": ui.text,
      "vim.normal.background": base.blue,
      "vim.normal.foreground": ladder.background,
      "vim.replace.background": base.red,
      "vim.replace.foreground": ladder.background,
      "vim.visual.background": base.purple,
      "vim.visual.foreground": ladder.background,
      "vim.visual_block.background": base.orange,
      "vim.visual_block.foreground": ladder.background,
      "vim.visual_line.background": base.yellow,
      "vim.visual_line.foreground": ladder.background,
      warning: diag.warning,
      "warning.background": ladder.background,
      "warning.border": ladder.raised
    }
  };
};

export const buildZedThemeVariant = (theme: ThemeSpec) => buildZedThemeVariantFromModel(deriveThemeModel(theme));

export const buildZedThemeFromModel = (model: ResolvedThemeModel): ZedThemeDefinition => ({
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: model.theme.displayName,
  author: model.theme.author,
  themes: [buildZedThemeVariantFromModel(model)]
});

export const buildZedTheme = (theme: ThemeSpec): ZedThemeDefinition => buildZedThemeFromModel(deriveThemeModel(theme));

export const buildZedExtensionBundleFromModels = (models: ResolvedThemeModel[]): ZedThemeDefinition => ({
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: "NvChad Themes",
  author: "NvChad",
  themes: models.map((model) => buildZedThemeVariantFromModel(model))
});

export const buildZedExtensionBundle = (themes: ThemeSpec[]): ZedThemeDefinition =>
  buildZedExtensionBundleFromModels(themes.map((theme) => deriveThemeModel(theme)));
