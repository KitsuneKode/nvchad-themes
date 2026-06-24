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

/** Intentional divergences from upstream reference extracts (must be commented). */
const ALLOWED_DELTAS: Partial<Record<string, Record<string, string>>> = {};

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
      expect(actual).toBe(allowed);
      continue;
    }
    expect(actual).toBe(expected);
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
      expect(actual).toBe(allowed);
      continue;
    }
    expect(actual).toBe(expected);
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
      assertSyntaxMatchesReference(id, syntax, reference.syntax);
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

  test("dark themes keep surface chrome darker than editor well", () => {
    for (const theme of themeCatalog) {
      if (theme.type !== "dark") {
        continue;
      }

      const style = buildZedTheme(theme).themes[0]!.style as Record<string, string>;
      const lumBg = relativeLuminance(style.background!);
      const lumSurface = relativeLuminance(style["surface.background"]!);

      expect(style.background).toBe(style["editor.background"]);
      expect(lumSurface).toBeLessThan(lumBg);
    }
  });

  test("all themes use solid element.selected (no alpha)", () => {
    for (const theme of themeCatalog) {
      const selected = buildZedTheme(theme).themes[0]!.style["element.selected"] as string;
      expect(selected).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
