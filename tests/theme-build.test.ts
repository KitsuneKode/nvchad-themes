import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildTheme,
  buildZedTheme,
  buildZedExtensionBundle,
  themeCatalog
} from "../src/index.ts";
import {
  REQUIRED_BASE16_KEYS,
  REQUIRED_BASE30_KEYS,
  type ThemeSpec
} from "../src/types.ts";
import { isHexColor } from "../src/utils.ts";

const paletteDir = resolve("src/palettes");
const paletteFiles = readdirSync(paletteDir).filter((name) => name.endsWith(".json") && !name.startsWith("."));

const isHexOrAlpha = (value: string): boolean =>
  /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value);

const collectHexValues = (value: unknown, results: string[] = []): string[] => {
  if (typeof value === "string" && value.startsWith("#")) {
    results.push(value);
    return results;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectHexValues(entry, results);
    }
    return results;
  }

  if (value && typeof value === "object") {
    for (const entry of Object.values(value)) {
      collectHexValues(entry, results);
    }
  }

  return results;
};

describe("theme catalog", () => {
  test("loads 94 palettes", () => {
    expect(themeCatalog.length).toBe(94);
    expect(paletteFiles.length).toBe(94);
  });

  test("rxyhn palette matches imported golden values", () => {
    const rxyhn = themeCatalog.find((theme) => theme.id === "rxyhn") as ThemeSpec;
    expect(rxyhn.base30.black).toBe("#061115");
    expect(rxyhn.base16.base00).toBe("#061115");
    expect(rxyhn.type).toBe("dark");
  });
});

describe("palette validation", () => {
  for (const theme of themeCatalog) {
    test(`${theme.id} has required palette keys`, () => {
      for (const key of REQUIRED_BASE30_KEYS) {
        expect(theme.base30[key]).toBeString();
        expect(isHexColor(theme.base30[key])).toBe(true);
      }

      for (const key of REQUIRED_BASE16_KEYS) {
        expect(theme.base16[key]).toBeString();
        expect(isHexColor(theme.base16[key])).toBe(true);
      }
    });
  }
});

describe("generated theme outputs", () => {
  for (const theme of themeCatalog) {
    test(`${theme.id} builds valid VS Code theme`, () => {
      const vscodeTheme = buildTheme(theme);
      expect(vscodeTheme.type).toBe(theme.type);
      expect(vscodeTheme.colors.foreground).toBeString();
      expect(Object.keys(vscodeTheme.colors).length).toBeGreaterThan(100);
      expect(vscodeTheme.tokenColors.length).toBeGreaterThan(10);

      for (const color of collectHexValues(vscodeTheme.colors)) {
        expect(isHexOrAlpha(color)).toBe(true);
      }
    });

    test(`${theme.id} builds valid Zed theme`, () => {
      const zedTheme = buildZedTheme(theme);
      expect(zedTheme.themes[0]?.appearance).toBe(theme.type);
      expect(zedTheme.themes[0]?.style.syntax).toBeObject();
    });
  }
});

describe("build snapshots", () => {
  test("nord VS Code theme is stable", () => {
    const nord = themeCatalog.find((theme) => theme.id === "nord")!;
    const built = buildTheme(nord);
    expect(built.name).toBe("NvChad Nord");
    expect(built.colors["editor.background"]).toBe("#2E3440");
  });

  test("one_light VS Code theme is stable", () => {
    const oneLight = themeCatalog.find((theme) => theme.id === "one_light")!;
    const built = buildTheme(oneLight);
    expect(built.type).toBe("light");
    expect(built.colors["editor.background"]).toBe(oneLight.base30.black);
  });
});

describe("zed extension bundle", () => {
  test("bundles all themes into one family", () => {
    const bundle = buildZedExtensionBundle(themeCatalog);
    expect(bundle.name).toBe("NvChad Themes");
    expect(bundle.themes.length).toBe(94);
    expect(new Set(bundle.themes.map((theme) => theme.name)).size).toBe(94);
  });

  test("zed extension output file contains single bundle", () => {
    const files = readdirSync(resolve("zed-extension", "themes"));
    expect(files).toEqual(["nvchad-themes.json"]);
    const bundle = JSON.parse(readFileSync(resolve("zed-extension", "themes", "nvchad-themes.json"), "utf8"));
    expect(bundle.themes.length).toBe(94);
  });
});

describe("import manifest", () => {
  test("manifest matches palette count", () => {
    const manifest = JSON.parse(readFileSync(resolve("src/palettes/.base46-manifest.json"), "utf8")) as {
      themeCount: number;
    };
    expect(manifest.themeCount).toBe(94);
  });
});
