import type { ThemeSpec, TokenColorRule, SemanticTokenRule, ZedSyntaxRule } from "../types.ts";
import type { PolishHl, PolishHlEntry } from "../types.ts";
import { resolveThemeColorOr } from "../resolve-color.ts";

export type SyntaxRule = {
  color: string;
  italic?: boolean;
  bold?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

/** Maps nvim @group names to Zed tree-sitter highlight keys. */
export const NVIM_TO_ZED: Record<string, string> = {
  "@variable": "variable",
  "@variable.builtin": "variable.builtin",
  "@variable.parameter": "variable.parameter",
  "@variable.member": "variable.member",
  "@variable.member.key": "property",
  "@module": "module",
  "@constant": "constant",
  "@constant.builtin": "constant.builtin",
  "@constant.macro": "function.macro",
  "@string": "string",
  "@string.regex": "string.regex",
  "@string.escape": "string.escape",
  "@character": "character",
  "@number": "number",
  "@number.float": "number.float",
  "@annotation": "attribute",
  "@attribute": "attribute",
  "@error": "tag.doctype",
  "@keyword.exception": "keyword.exception",
  "@keyword": "keyword",
  "@keyword.function": "keyword.function",
  "@keyword.return": "keyword.return",
  "@keyword.operator": "keyword.operator",
  "@keyword.import": "keyword.import",
  "@keyword.conditional": "keyword.conditional",
  "@keyword.repeat": "keyword.repeat",
  "@keyword.storage": "type.builtin",
  "@keyword.directive": "keyword.directive",
  "@function": "function",
  "@function.builtin": "function.builtin",
  "@function.macro": "function.macro",
  "@function.call": "function.call",
  "@function.method": "function.method",
  "@function.method.call": "function.method.call",
  "@constructor": "constructor",
  "@operator": "operator",
  "@punctuation.bracket": "punctuation.bracket",
  "@punctuation.delimiter": "punctuation.delimiter",
  "@symbol": "string.special.symbol",
  "@tag": "tag",
  "@tag.attribute": "tag.attribute",
  "@tag.delimiter": "tag.delimiter",
  "@text": "text.literal",
  "@text.emphasis": "emphasis",
  "@type.builtin": "type.builtin",
  "@property": "property",
  "@markup.heading": "title",
  "@markup.link": "link_text",
  "@markup.link.url": "link_uri",
  "@markup.italic": "emphasis",
  "@markup.strong": "emphasis",
  "@comment": "comment",
  "@comment.doc": "comment.doc",
  "@uri": "string.special.url"
};

/** Maps nvim @group / syntax names to VS Code TextMate scopes. */
export const NVIM_TO_VSCODE_SCOPES: Record<string, string[]> = {
  "@comment": ["comment", "punctuation.definition.comment"],
  "@comment.doc": ["comment.block.documentation", "string.quoted.doc"],
  "@string": ["string", "string.quoted", "string.template", "string.interpolated"],
  "@string.regex": ["string.regexp", "constant.other.character-class.regexp"],
  "@string.escape": ["constant.character.escape"],
  "@character": ["constant.character"],
  "@number": ["constant.numeric", "constant.language.boolean", "constant.language.null"],
  "@number.float": ["constant.numeric.float"],
  "@constant": ["constant", "constant.other", "support.constant"],
  "@constant.builtin": ["constant.language", "support.constant"],
  "@constant.macro": ["entity.name.function.preprocessor"],
  "@variable": ["variable", "meta.definition.variable", "support.variable"],
  "@variable.builtin": ["variable.language"],
  "@variable.parameter": ["variable.parameter", "meta.parameter"],
  "@variable.member": ["variable.other.property", "variable.other.member"],
  "@variable.member.key": ["meta.object-literal.key"],
  "@module": ["entity.name.namespace", "support.module"],
  "@property": ["variable.other.property", "support.type.property-name", "entity.other.attribute-name"],
  "@function": ["entity.name.function", "support.function", "meta.function-call"],
  "@function.builtin": ["support.function"],
  "@function.macro": ["entity.name.function.preprocessor"],
  "@function.call": ["meta.function-call"],
  "@function.method": ["entity.name.method", "meta.method-call"],
  "@function.method.call": ["meta.method-call"],
  "@constructor": ["meta.function-call.constructor", "support.class"],
  "@keyword": ["keyword", "keyword.control", "storage", "storage.modifier"],
  "@keyword.function": ["keyword.other.function"],
  "@keyword.return": ["keyword.control.flow"],
  "@keyword.operator": ["keyword.operator"],
  "@keyword.import": ["keyword.control.import", "keyword.other.import"],
  "@keyword.conditional": ["keyword.control.conditional"],
  "@keyword.repeat": ["keyword.control.loop"],
  "@keyword.storage": ["storage.type"],
  "@keyword.directive": ["keyword.other.important"],
  "@keyword.exception": ["keyword.control.exception"],
  "@type.builtin": ["storage.type", "support.type", "entity.name.type", "entity.name.class"],
  "@annotation": ["storage.type.annotation"],
  "@attribute": ["entity.other.attribute-name"],
  "@operator": ["keyword.operator", "punctuation.accessor"],
  "@punctuation.bracket": ["punctuation.section.brackets", "punctuation.definition.brackets"],
  "@punctuation.delimiter": ["punctuation.separator", "punctuation.terminator"],
  "@symbol": ["constant.other.symbol"],
  "@tag": ["entity.name.tag"],
  "@tag.attribute": ["entity.other.attribute-name"],
  "@tag.delimiter": ["punctuation.definition.tag"],
  "@text": ["string.quoted.other"],
  "@text.emphasis": ["markup.italic"],
  "@markup.heading": ["markup.heading", "entity.name.section"],
  "@markup.link": ["markup.underline.link", "string.other.link"],
  "@markup.link.url": ["markup.underline.link"],
  "@markup.italic": ["markup.italic"],
  "@markup.strong": ["markup.bold"],
  "@uri": ["markup.underline.link", "string.other.link", "meta.link"],
  "@error": ["invalid", "invalid.illegal"],
  Number: ["constant.numeric", "constant.language.boolean"]
};

/** Maps nvim groups to VS Code semantic token types. */
export const NVIM_TO_SEMANTIC: Record<string, string> = {
  "@comment": "comment",
  "@string": "string",
  "@string.regex": "regexp",
  "@number": "number",
  "@constant": "number",
  "@variable": "variable",
  "@variable.parameter": "parameter",
  "@property": "property",
  "@function": "function",
  "@function.method": "method",
  "@keyword": "keyword",
  "@type.builtin": "type",
  "@module": "namespace",
  "@tag": "type",
  Number: "number"
};

const punctuationColor = (theme: ThemeSpec): string =>
  theme.type === "light" ? theme.base30.black : theme.base30.pmenuBg;

/**
 * Base treesitter mapping from base46 integrations/treesitter.lua with quality fixes:
 * punctuation → pmenuBg/white (not base0F), string.regex key, italic comments.
 */
export const treesitterTemplate = (theme: ThemeSpec): Record<string, SyntaxRule> => {
  const base = theme.base30;
  const syntax = theme.base16;
  const punct = punctuationColor(theme);

  return {
    "@variable": { color: syntax.base05 },
    "@variable.builtin": { color: syntax.base09 },
    "@variable.parameter": { color: syntax.base08 },
    "@variable.member": { color: syntax.base08 },
    "@variable.member.key": { color: syntax.base08 },
    "@module": { color: syntax.base08 },
    "@constant": { color: syntax.base09 },
    "@constant.builtin": { color: syntax.base09 },
    "@constant.macro": { color: syntax.base08 },
    "@string": { color: syntax.base0B },
    "@string.regex": { color: syntax.base0C },
    "@string.escape": { color: syntax.base0C },
    "@character": { color: syntax.base08 },
    "@number": { color: syntax.base09 },
    "@number.float": { color: syntax.base09 },
    "@annotation": { color: syntax.base0F },
    "@attribute": { color: syntax.base0A },
    "@keyword.exception": { color: syntax.base08 },
    "@keyword": { color: syntax.base0E },
    "@keyword.function": { color: syntax.base0E },
    "@keyword.return": { color: syntax.base0E },
    "@keyword.operator": { color: syntax.base0E },
    "@keyword.import": { color: syntax.base0E },
    "@keyword.conditional": { color: syntax.base0E },
    "@keyword.repeat": { color: syntax.base0A },
    "@keyword.storage": { color: syntax.base0A },
    "@keyword.directive": { color: syntax.base0A },
    "@function": { color: syntax.base0D, italic: true },
    "@function.builtin": { color: syntax.base0D },
    "@function.macro": { color: syntax.base08 },
    "@function.call": { color: syntax.base0D },
    "@function.method": { color: syntax.base0D },
    "@function.method.call": { color: syntax.base0D },
    "@constructor": { color: syntax.base0C },
    "@operator": { color: syntax.base05 },
    "@punctuation.bracket": { color: punct },
    "@punctuation.delimiter": { color: theme.base30.white },
    "@symbol": { color: syntax.base0B },
    "@tag": { color: syntax.base0A },
    "@tag.attribute": { color: syntax.base08 },
    "@tag.delimiter": { color: punct },
    "@text": { color: syntax.base05 },
    "@text.emphasis": { color: syntax.base09 },
    "@type.builtin": { color: syntax.base0A },
    "@property": { color: syntax.base08 },
    "@markup.heading": { color: syntax.base0D, bold: true },
    "@markup.link": { color: syntax.base08 },
    "@markup.link.url": { color: syntax.base09, underline: true },
    "@markup.italic": { color: syntax.base05, italic: true },
    "@markup.strong": { color: syntax.base09, bold: true },
    "@comment": { color: base.greyFg, italic: true },
    "@comment.doc": { color: base.greyFg2, italic: true },
    Number: { color: syntax.base09 }
  };
};

const mergeEntry = (theme: ThemeSpec, existing: SyntaxRule, entry: PolishHlEntry): SyntaxRule => ({
  color: entry.fg ? resolveThemeColorOr(theme, entry.fg, existing.color) : existing.color,
  italic: entry.italic ?? existing.italic,
  bold: entry.bold ?? existing.bold,
  underline: entry.underline ?? existing.underline,
  strikethrough: entry.strikethrough ?? existing.strikethrough
});

export const applyPolishHl = (
  theme: ThemeSpec,
  rules: Record<string, SyntaxRule>,
  polishHl?: PolishHl
): Record<string, SyntaxRule> => {
  if (!polishHl) {
    return rules;
  }

  const merged = { ...rules };

  for (const [group, entry] of Object.entries(polishHl.treesitter ?? {})) {
    const existing = merged[group] ?? { color: resolveThemeColorOr(theme, entry.fg ?? "#ffffff", theme.base16.base05) };
    merged[group] = mergeEntry(theme, existing, entry);
  }

  for (const [group, entry] of Object.entries(polishHl.syntax ?? {})) {
    const existing = merged[group] ?? { color: resolveThemeColorOr(theme, entry.fg ?? "#ffffff", theme.base16.base05) };
    merged[group] = mergeEntry(theme, existing, entry);
  }

  return merged;
};

export const buildSyntaxRules = (theme: ThemeSpec): Record<string, SyntaxRule> =>
  applyPolishHl(theme, treesitterTemplate(theme), theme.polishHl);

const toZedRule = (rule: SyntaxRule): ZedSyntaxRule => ({
  color: rule.color,
  font_style: rule.italic ? "italic" : null,
  font_weight: rule.bold ? 700 : null
});

export const toZedSyntax = (rules: Record<string, SyntaxRule>): Record<string, ZedSyntaxRule> => {
  const zed: Record<string, ZedSyntaxRule> = {
    hint: { color: "#888888", font_style: "italic", font_weight: null },
    link_text: { color: "#888888", font_style: null, font_weight: null },
    link_uri: { color: "#888888", font_style: "italic", font_weight: null },
    embedded: { color: "#cccccc", font_style: null, font_weight: null },
    variant: { color: "#cccccc", font_style: null, font_weight: null },
    enum: { color: "#cccccc", font_style: null, font_weight: null },
    primary: { color: "#cccccc", font_style: null, font_weight: null },
    "emphasis.strong": { color: "#cccccc", font_style: null, font_weight: 700 },
    "variable.special": { color: "#cccccc", font_style: "italic", font_weight: null },
    "string.documentation": { color: "#888888", font_style: null, font_weight: null },
    "string.special": { color: "#cccccc", font_style: null, font_weight: null },
    "string.special.url": { color: "#888888", font_style: "italic", font_weight: null },
    "type.definition": { color: "#cccccc", font_style: null, font_weight: null },
    "type.interface": { color: "#cccccc", font_style: null, font_weight: null },
    "type.super": { color: "#cccccc", font_style: null, font_weight: null },
    "punctuation": { color: "#cccccc", font_style: null, font_weight: null },
    "punctuation.list_marker": { color: "#cccccc", font_style: null, font_weight: null },
    "keyword.control": { color: "#cccccc", font_style: null, font_weight: null },
    "character.special": { color: "#cccccc", font_style: null, font_weight: null },
    "property.json": { color: "#cccccc", font_style: null, font_weight: null },
    "tag.doctype": { color: "#cccccc", font_style: null, font_weight: null }
  };

  for (const [nvimGroup, rule] of Object.entries(rules)) {
    const zedKey = NVIM_TO_ZED[nvimGroup] ?? nvimGroup.replace(/^@/, "");
    zed[zedKey] = toZedRule(rule);
  }

  return zed;
};

const formatFontStyle = (rule: SyntaxRule): string | undefined => {
  const styles: string[] = [];
  if (rule.italic) styles.push("italic");
  if (rule.bold) styles.push("bold");
  if (rule.underline) styles.push("underline");
  if (rule.strikethrough) styles.push("strikethrough");
  return styles.length > 0 ? styles.join(" ") : undefined;
};

export const toVsCodeTokenColors = (rules: Record<string, SyntaxRule>): TokenColorRule[] => {
  const tokenColors: TokenColorRule[] = [];

  for (const [group, rule] of Object.entries(rules)) {
    const scopes = NVIM_TO_VSCODE_SCOPES[group];
    if (!scopes) {
      continue;
    }
    const fontStyle = formatFontStyle(rule);
    for (const scope of scopes) {
      tokenColors.push({
        name: `${group.replace(/^@/, "")} (${scope})`,
        scope,
        settings: {
          foreground: rule.color,
          ...(fontStyle ? { fontStyle } : {})
        }
      });
    }
  }

  return tokenColors;
};

export const toSemanticTokens = (rules: Record<string, SyntaxRule>): Record<string, SemanticTokenRule> => {
  const semantic: Record<string, SemanticTokenRule> = {};

  for (const [group, rule] of Object.entries(rules)) {
    const tokenType = NVIM_TO_SEMANTIC[group];
    if (!tokenType) {
      continue;
    }
    if (rule.bold || rule.italic) {
      semantic[tokenType] = {
        foreground: rule.color,
        ...(rule.bold ? { bold: true } : {}),
        ...(rule.italic ? { italic: true } : {})
      };
    } else {
      semantic[tokenType] = rule.color;
    }
  }

  return semantic;
};
