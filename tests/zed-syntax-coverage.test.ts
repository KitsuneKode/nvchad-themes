import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildZedSyntax } from "../src/builders/zed.ts";
import { getThemeById } from "../src/index.ts";
import { REFERENCE_THEME_IDS } from "../src/references/hero-themes.ts";

type OfficialReference = {
  $themeId: string;
  syntax?: Record<string, string>;
};

const loadOfficialSyntaxKeys = (id: string): string[] => {
  const path = resolve("src/references/official", `${id}.json`);
  const reference = JSON.parse(readFileSync(path, "utf8")) as OfficialReference;
  return Object.keys(reference.syntax ?? {});
};

describe("zed syntax coverage vs upstream references", () => {
  for (const id of REFERENCE_THEME_IDS) {
    test(`${id} includes all upstream syntax keys`, () => {
      const keys = loadOfficialSyntaxKeys(id);
      if (keys.length === 0) {
        return;
      }

      const theme = getThemeById(id)!;
      const built = buildZedSyntax(theme);

      for (const key of keys) {
        expect(built[key]).toBeDefined();
        expect(built[key]!.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  }
});
