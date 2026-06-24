import { describe, expect, test } from "bun:test";
import { buildZedTheme, themeCatalog } from "../src/index.ts";
import { NVIM_TO_VSCODE_SCOPES, NVIM_TO_ZED } from "../src/syntax/index.ts";

const isMappedPolishKey = (key: string): boolean =>
  key in NVIM_TO_ZED || key in NVIM_TO_VSCODE_SCOPES;

describe("polish_hl mapping coverage", () => {
  test("treesitter keys are mapped or reported; built Zed syntax has no M. refs", () => {
    const unmapped: string[] = [];

    for (const theme of themeCatalog) {
      if (!theme.polishHl) {
        continue;
      }

      for (const key of Object.keys(theme.polishHl.treesitter ?? {})) {
        if (!isMappedPolishKey(key)) {
          unmapped.push(`${theme.id}: ${key}`);
        }
      }

      const syntax = buildZedTheme(theme).themes[0]!.style.syntax as Record<string, { color: string }>;
      for (const [ruleKey, rule] of Object.entries(syntax)) {
        expect(rule.color).not.toMatch(/^M\./);
        expect(rule.color.startsWith("#")).toBe(true);
        if (rule.color.match(/^M\./)) {
          throw new Error(`Unresolved Zed syntax color for ${theme.id}.${ruleKey}: ${rule.color}`);
        }
      }
    }

    if (unmapped.length > 0) {
      console.warn(
        `[polish-mapping] ${unmapped.length} unmapped treesitter keys (nvim-specific groups):\n` +
          unmapped.map((entry) => `  - ${entry}`).join("\n")
      );
    }
  });

  test("polish fg values in palettes are resolved hex", () => {
    for (const theme of themeCatalog) {
      if (!theme.polishHl) {
        continue;
      }

      for (const section of [theme.polishHl.treesitter, theme.polishHl.syntax]) {
        if (!section) {
          continue;
        }

        for (const [group, entry] of Object.entries(section)) {
          if (entry.fg) {
            expect(entry.fg).not.toMatch(/^M\./);
            expect(entry.fg.startsWith("#")).toBe(true);
            if (entry.fg.match(/^M\./)) {
              throw new Error(`Unresolved palette polish fg for ${theme.id} ${group}: ${entry.fg}`);
            }
          }
        }
      }
    }
  });
});
