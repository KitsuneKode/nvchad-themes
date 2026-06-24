import { describe, expect, test } from "bun:test";
import { deriveThemeModel } from "../src/derive/theme-model.ts";
import { buildVsCodeColorsFromModel } from "../src/builders/vscode.ts";
import { buildZedThemeVariantFromModel } from "../src/builders/zed.ts";
import { getThemeById } from "../src/catalog.ts";
import { HERO_THEME_IDS } from "../src/references/hero-themes.ts";

const heroIds = [...HERO_THEME_IDS, "tokyonight"] as const;

describe("parity heroes", () => {
  for (const id of heroIds) {
    test(`${id}: git added hue matches across platforms`, () => {
      const theme = getThemeById(id);
      expect(theme).toBeDefined();
      const model = deriveThemeModel(theme!);
      const vscode = buildVsCodeColorsFromModel(model);
      const zed = buildZedThemeVariantFromModel(model).style;

      expect(vscode["gitDecoration.addedResourceForeground"]).toBe(model.integrations.git.added);
      expect(zed["version_control.added"]).toBe(model.integrations.git.added);
      expect(vscode["gitDecoration.addedResourceForeground"]).toBe(zed["version_control.added"]);
    });

    test(`${id}: terminal green matches across platforms`, () => {
      const theme = getThemeById(id);
      const model = deriveThemeModel(theme!);
      const vscode = buildVsCodeColorsFromModel(model);
      const zed = buildZedThemeVariantFromModel(model).style;

      expect(vscode["terminal.ansiGreen"]).toBe(model.integrations.terminal.green);
      expect(zed["terminal.ansi.green"]).toBe(model.integrations.terminal.green);
      expect(vscode["terminal.ansiGreen"]).toBe(zed["terminal.ansi.green"]);
    });
  }
});
