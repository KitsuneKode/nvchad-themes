import { describe, expect, test } from "bun:test";
import { deriveThemeModel } from "../src/derive/theme-model.ts";
import { profileForTheme } from "../src/profiles/index.ts";
import { getThemeById, themeCatalog } from "../src/catalog.ts";
import { buildZedSyntaxFromModel } from "../src/builders/zed.ts";

describe("profile overrides", () => {
  test("popular themes resolve a profile", () => {
    expect(profileForTheme("tokyonight", "dark")).toBe("tokyo-night");
    expect(profileForTheme("kanagawa", "dark")).toBe("kanagawa");
    expect(profileForTheme("unknown-theme", "dark")).toBe("default-dark");
    expect(profileForTheme("unknown-theme", "light")).toBe("default-light");
  });

  test("tokyonight comment color from profile", () => {
    const theme = getThemeById("tokyonight")!;
    const model = deriveThemeModel(theme);
    expect(model.profileId).toBe("tokyo-night");
    const syntax = buildZedSyntaxFromModel(model);
    expect(syntax.comment?.color).toBe("#51597d");
  });

  test("kanagawa Number still babyPink with polish", () => {
    const theme = getThemeById("kanagawa")!;
    const model = deriveThemeModel(theme);
    expect(model.syntax.Number?.color.toLowerCase()).toBe(theme.base30.babyPink.toLowerCase());
  });

  test("unmapped theme uses default profile without throw", () => {
    const dark = themeCatalog.find((t) => t.type === "dark" && !profileForTheme(t.id, "dark").includes("tokyo"));
    expect(dark).toBeDefined();
    expect(() => deriveThemeModel(dark!)).not.toThrow();
  });
});
