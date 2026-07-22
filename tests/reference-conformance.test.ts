import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildZedTheme, getThemeById, themeCatalog } from "../src/index.ts";
import { relativeLuminance } from "../src/surfaces.ts";
import { REFERENCE_THEME_IDS } from "../src/references/hero-themes.ts";

type OfficialReference = {
  $themeId: string;
  style: Record<string, string>;
  syntax: Record<string, string>;
};

/** Keys we intentionally diverge from upstream reference extracts. */
const ALLOWED_DELTAS: Partial<Record<string, Record<string, string>>> = {
  tokyonight: {
    "editor.invisible": "#4c506466",
    "border": "#101016",
    "border.variant": "#101016",
    "editor.wrap_guide": "#101016",
    "editor.line_number": "#363a54",
    "editor.indent_guide": "#363a54",
    "panel.indent_guide": "#363a54",
    "panel.indent_guide_active": "#565f89",
    "panel.indent_guide_hover": "#565f89"
  },
  kanagawa: {
    "editor.invisible": "#5a585466",
    "scrollbar.thumb.background": "#66667280",
    "scrollbar.thumb.hover_background": "#666672",
    "panel.background": "#191922",
    "tab.inactive_background": "#191922",
    "editor.line_number": "#6a8885",
    "text": "#c8c3a6",
    "editor.foreground": "#c8c3a6",
    "editor.active_line_number": "#c8c3a6",
    "editor.wrap_guide": "#121218",
    "element.hover": "#4c4c55",
    "element.selected": "#4c4c55",
    "border": "#121218",
    "border.variant": "#121218",
    "border.focused": "#5c5c6533",
    "ghost_element.background": ""
  }
};

const loadOfficialReference = (id: string): OfficialReference => {
  const path = resolve("src/references/official", `${id}.json`);
  return JSON.parse(readFileSync(path, "utf8")) as OfficialReference;
};

const assertStyleMatchesReference = (
  themeId: string,
  built: Record<string, string>,
  reference: Record<string, string>
): void => {
  const deltas = ALLOWED_DELTAS[themeId] ?? {};

  for (const [key, expected] of Object.entries(reference)) {
    const actual = built[key];
    const allowed = deltas[key];
    if (allowed !== undefined) {
      if (allowed === "") {
        expect(actual === null || actual === undefined).toBe(true);
      } else {
        expect(actual?.toLowerCase()).toBe(allowed.toLowerCase());
      }
      continue;
    }
    if (expected === null || expected === undefined) {
      continue;
    }
    expect(actual?.toLowerCase()).toBe(expected.toLowerCase());
  }
};

const assertSyntaxMatchesReference = (
  themeId: string,
  built: Record<string, { color: string }>,
  reference: Record<string, string>
): void => {
  const deltas = ALLOWED_DELTAS[themeId] ?? {};

  for (const [key, expected] of Object.entries(reference)) {
    const actual = built[key]?.color;
    const allowed = deltas[key];
    if (allowed !== undefined) {
      expect(actual?.toLowerCase()).toBe(allowed.toLowerCase());
      continue;
    }
    expect(actual?.toLowerCase()).toBe(expected.toLowerCase());
  }
};

describe("official reference conformance", () => {
  for (const id of REFERENCE_THEME_IDS) {
    test(`${id} built Zed theme matches official extract`, () => {
      const reference = loadOfficialReference(id);
      const theme = getThemeById(id)!;
      const style = buildZedTheme(theme).themes[0]!.style as Record<string, string | object>;
      const syntax = style.syntax as Record<string, { color: string }>;

      assertStyleMatchesReference(id, style as Record<string, string>, reference.style);
    });
  }
});

describe("catalog-wide Zed invariants", () => {
  test("all themes use resolved #rrggbb syntax colors", () => {
    for (const theme of themeCatalog) {
      const syntax = buildZedTheme(theme).themes[0]!.style.syntax as Record<string, { color: string }>;

      for (const [key, rule] of Object.entries(syntax)) {
        expect(rule.color).not.toMatch(/^M\./);
        expect(rule.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(key.length).toBeGreaterThan(0);
      }
    }
  });

  test("dark themes keep surface chrome darker than editor well (tokyo-well only)", () => {
    for (const theme of themeCatalog) {
      if (theme.type !== "dark") {
        continue;
      }

      const style = buildZedTheme(theme).themes[0]!.style as Record<string, string>;
      const isFlatEditor = style["tab.active_background"] === style["editor.background"];
      if (isFlatEditor) {
        continue;
      }

      const lumBg = relativeLuminance(style.background!);
      const lumSurface = relativeLuminance(style["surface.background"]!);

      expect(style.background).toBe(style["editor.background"]);
      expect(lumSurface).toBeLessThanOrEqual(lumBg);
    }
  });

  test("all themes use solid element.selected (no alpha)", () => {
    for (const theme of themeCatalog) {
      const selected = buildZedTheme(theme).themes[0]!.style["element.selected"] as string;
      expect(selected).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
