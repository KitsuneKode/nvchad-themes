import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildTheme,
  buildZedTheme,
  getThemeById,
  themeCatalog
} from "../src/index.ts";
import { buildSyntaxRules, treesitterTemplate } from "../src/syntax/index.ts";
import { relativeLuminance, zedLadder, vscodeLadder } from "../src/surfaces.ts";
import { buildZedThemeVariantFromModel } from "../src/builders/zed.ts";
import { deriveThemeModel } from "../src/derive/theme-model.ts";
import { HERO_THEME_IDS } from "../src/references/hero-themes.ts";

const heroIds = HERO_THEME_IDS;

describe("hero theme surface hierarchy", () => {
  for (const id of heroIds) {
    test(`${id} zed ladder: surface chrome darker than editor well`, () => {
      const theme = getThemeById(id)!;
      const built = buildZedTheme(theme);
      const style = built.themes[0]!.style as Record<string, string>;

      const lumBg = relativeLuminance(style.background!);
      const lumSurface = relativeLuminance(style["surface.background"]!);

      expect(style.background).toBe(style["editor.background"]);
      expect(lumSurface).toBeLessThan(lumBg);
      expect(style["tab.inactive_background"]).toBe(style["surface.background"]);
      expect(relativeLuminance(style["tab.active_background"]!)).toBeGreaterThan(lumBg);
      expect(style["title_bar.background"]).toBe(style["surface.background"]);
      expect(style["panel.background"]).toBe(style["surface.background"]);
    });

    test(`${id} vscode sidebar is darker than or equal to editor`, () => {
      const theme = getThemeById(id)!;
      const built = buildTheme(theme);
      const sidebarLum = relativeLuminance(built.colors["sideBar.background"]!);
      const editorLum = relativeLuminance(built.colors["editor.background"]!);
      expect(sidebarLum).toBeLessThanOrEqual(editorLum + 0.01);
    });
  }
});

describe("tokyonight zed reference alignment", () => {
  test("matches zed-tokyo-night surface and tab semantics", () => {
    const theme = getThemeById("tokyonight")!;
    const style = buildZedTheme(theme).themes[0]!.style as Record<string, string>;

    expect(style.background).toBe("#1a1b26");
    expect(style["surface.background"]).toBe("#16161e");
    expect(style["tab.active_background"]).toBe("#414868");
    expect(style["tab.inactive_background"]).toBe("#16161e");
    expect(style["editor.foreground"]).toBe("#a9b1d6");
    expect(style.text).toBe("#a9b1d6");
    expect(style["element.selected"]).toBe("#565f89");
  });

  test("syntax resolves polish refs and uses Tokyo Night function colors", () => {
    const theme = getThemeById("tokyonight")!;
    const syntax = buildZedTheme(theme).themes[0]!.style.syntax as Record<string, { color: string }>;

    expect(syntax.variable?.color).toBe("#a9b1d6");
    expect(syntax.function?.color).toBe("#7aa2f7");
    expect(syntax["function.call"]?.color).toBe("#7aa2f7");
    expect(syntax["function.method.call"]?.color).toBe("#f7768e");
    expect(syntax.keyword?.color).toBe("#bb9af7");
    expect(syntax.comment?.color).toBe("#51597d");
  });
});

describe("syntax spot-checks", () => {
  test("kanagawa number uses baby_pink via polish_hl", () => {
    const kanagawa = getThemeById("kanagawa")!;
    const rules = buildSyntaxRules(kanagawa);
    expect(rules.Number?.color.toLowerCase()).toBe(kanagawa.base30.babyPink.toLowerCase());
  });

  test("kanagawa punctuation is not error-red base0F", () => {
    const kanagawa = getThemeById("kanagawa")!;
    const rules = buildSyntaxRules(kanagawa);
    expect(rules["@punctuation.bracket"]?.color.toLowerCase()).toBe(kanagawa.base30.pmenuBg.toLowerCase());
    expect(rules["@punctuation.bracket"]?.color.toLowerCase()).not.toBe(kanagawa.base16.base0F.toLowerCase());
  });

  test("comments are italic in syntax template", () => {
    const kanagawa = getThemeById("kanagawa")!;
    const template = treesitterTemplate(kanagawa);
    expect(template["@comment"]?.italic).toBe(true);
  });
});

describe("polish_hl application", () => {
  test("kanagawa polish overrides Number to baby_pink", () => {
    const kanagawa = getThemeById("kanagawa")!;
    expect(kanagawa.polishHl).toBeDefined();
    const generic = treesitterTemplate(kanagawa);
    const polished = buildSyntaxRules(kanagawa);
    expect(polished.Number?.color.toLowerCase()).toBe(kanagawa.base30.babyPink.toLowerCase());
    expect(polished.Number?.color).not.toBe(generic.Number?.color);
  });

  test("no unresolved M.base_16 refs in built zed syntax", () => {
    for (const theme of themeCatalog) {
      const syntax = buildZedTheme(theme).themes[0]!.style.syntax as Record<string, { color: string }>;
      for (const rule of Object.values(syntax)) {
        expect(rule.color).not.toMatch(/^M\./);
        expect(rule.color.startsWith("#")).toBe(true);
      }
    }
  });
});

describe("selection contrast", () => {
  for (const id of heroIds) {
    test(`${id} element.selected is solid`, () => {
      const theme = getThemeById(id)!;
      const built = buildZedTheme(theme);
      const selected = built.themes[0]!.style["element.selected"] as string;
      expect(selected.length).toBe(7);
    });
  }
});

describe("ladder helpers", () => {
  test("zedLadder uses editor well for background", () => {
    for (const id of heroIds) {
      const theme = getThemeById(id)!;
      expect(zedLadder(theme).background).toBe(theme.base30.black);
    }
  });

  test("vscodeLadder sidebar uses darkerBlack", () => {
    for (const id of heroIds) {
      const theme = getThemeById(id)!;
      expect(vscodeLadder(theme).sidebar).toBe(theme.base30.darkerBlack);
    }
  });
});

describe("separator lines", () => {
  for (const id of heroIds) {
    test(`${id} zed indent guides are solid (no alpha)`, () => {
      const theme = getThemeById(id)!;
      const style = buildZedTheme(theme).themes[0]!.style as Record<string, string>;
      for (const key of ["editor.indent_guide", "panel.indent_guide", "editor.wrap_guide"]) {
        const color = style[key]!;
        expect(color.length).toBe(7);
      }
    });
  }
});

describe("golden style extracts", () => {
  for (const id of heroIds) {
    test(`${id} golden extract matches key surface tokens`, () => {
      const goldenPath = resolve("zed", "golden", `${id}.json`);
      const golden = JSON.parse(readFileSync(goldenPath, "utf8")) as Record<string, string>;
      const theme = getThemeById(id)!;
      const built = buildZedTheme(theme);
      const style = built.themes[0]!.style as Record<string, string>;

      for (const key of [
        "background",
        "surface.background",
        "editor.background",
        "tab.active_background",
        "border",
        "editor.indent_guide",
        "pane_group.border"
      ]) {
        expect(style[key]).toBe(golden[key]);
      }
    });
  }
});

describe("zed project panel git status colors", () => {
  test("status tokens use git integration semantics (not invisible textMuted)", () => {
    const theme = getThemeById("rxyhn")!;
    const model = deriveThemeModel(theme);
    const style = buildZedThemeVariantFromModel(model).style as Record<string, string>;
    const git = model.integrations.git;

    expect(style.modified).toBe(git.modified);
    expect(style.ignored).toBe(git.statusIgnored);
    expect(style["version_control.modified"]).toBe(git.modified);
    expect(style["version_control.ignored"]).toBe(git.ignored);
    expect(style.created).toBe(git.added);
    expect(style.deleted).toBe(git.deleted);

    // ignored must be visibly lighter than the editor well on dark themes
    expect(relativeLuminance(style.ignored!)).toBeGreaterThan(
      relativeLuminance(style.background!) + 0.02
    );
  });

  test("tokyonight uses yellow modified and distinct ignored status", () => {
    const theme = getThemeById("tokyonight")!;
    const style = buildZedTheme(theme).themes[0]!.style as Record<string, string>;

    expect(style.modified).toBe("#e0af68");
    expect(style["version_control.modified"]).toBe("#e0af68");
    expect(style["version_control.added_background"]).toBe("#1a1b26");
    expect(style.ignored).not.toBe(style.text);
    expect(relativeLuminance(style.ignored!)).toBeGreaterThan(
      relativeLuminance(style.background!) + 0.02
    );
  });
});

describe("catalog polish coverage", () => {
  test("themes with upstream polish_hl are imported", () => {
    const withPolish = themeCatalog.filter((theme) => theme.polishHl);
    expect(withPolish.length).toBeGreaterThan(0);
    expect(withPolish.some((theme) => theme.id === "kanagawa")).toBe(true);
  });
});
