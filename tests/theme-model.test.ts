import { describe, expect, test } from "bun:test";
import { deriveThemeModel } from "../src/derive/theme-model.ts";
import { getThemeById } from "../src/catalog.ts";

describe("deriveThemeModel", () => {
  test("tokyonight uses tokyo-night profile", () => {
    const theme = getThemeById("tokyonight");
    expect(theme).toBeDefined();
    const model = deriveThemeModel(theme!);
    expect(model.profileId).toBe("tokyo-night");
  });

  test("tokyonight zed surface darker than editor background", () => {
    const theme = getThemeById("tokyonight");
    const model = deriveThemeModel(theme!);
    const { background, surface } = model.surfaces.zed;
    expect(background).toMatch(/^#[0-9a-f]{6}$/i);
    expect(surface).toMatch(/^#[0-9a-f]{6}$/i);
    expect(background).not.toBe(surface);
  });

  test("terminal green matches between integrations slice", () => {
    const theme = getThemeById("tokyonight");
    const model = deriveThemeModel(theme!);
    expect(model.integrations.terminal.green).toBe(theme!.base30.green);
  });

  test("skipPolish option yields baseline syntax", () => {
    const theme = getThemeById("kanagawa");
    const withPolish = deriveThemeModel(theme!);
    const without = deriveThemeModel(theme!, { skipPolish: true });
    expect(withPolish.syntax).not.toEqual(without.syntax);
  });
});
