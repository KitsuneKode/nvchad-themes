import { describe, expect, test } from "bun:test";
import {
  T3CODE_COLOR_ROLES,
  T3CODE_CURATION,
  T3CODE_QUALITY_DIMENSIONS,
  buildT3CodeTheme,
  pickAccent,
  scoreT3CodeColors,
  themeCatalog
} from "../src/index.ts";
import { relativeLuminance } from "../src/utils.ts";

const resolveTheme = (id: string) => themeCatalog.find((theme) => theme.id === id)!;

const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

type Half = {
  label: string;
  paletteId: string;
  accentKey?: keyof import("../src/types.ts").ThemeSpec["base30"];
  appearance: "light" | "dark";
  colors: Record<string, string>;
};

const curatedHalves = (): Half[] => {
  const halves: Half[] = [];
  for (const entry of T3CODE_CURATION) {
    const file = buildT3CodeTheme(entry, resolveTheme);
    halves.push({
      label: entry.id,
      paletteId: entry.id,
      accentKey: entry.accent,
      appearance: file.appearance,
      colors: file.colors
    });
    if (file.variants) {
      for (const [appearance, colors] of Object.entries(file.variants)) {
        const variantId = entry.variant!;
      halves.push({
          label: `${entry.id}/${appearance}`,
          paletteId: variantId,
          accentKey: entry.accent,
          appearance: appearance as "light" | "dark",
          colors: colors!
        });
      }
    }
  }
  return halves;
};

/** Curated themes must meet this bar on every quality dimension (0–10). */
const MIN_DIMENSION = 9;
const MIN_OVERALL = 9.2;

describe("T3 Code theme quality", () => {
  test("every curated half defines all color roles", () => {
    for (const half of curatedHalves()) {
      for (const role of T3CODE_COLOR_ROLES) {
        expect(half.colors[role], `${half.label} missing ${role}`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  test("readable pairs meet minimum contrast", () => {
    const pairs: ReadonlyArray<[fg: string, bg: string, min: number]> = [
      ["text", "canvas", 4.5],
      ["textMuted", "canvas", 3],
      ["sidebarForeground", "sidebar", 4.5],
      ["errorForeground", "errorSurface", 4.5],
      ["warningForeground", "warningSurface", 4.5],
      ["accentForeground", "accent", 3],
      ["codeForeground", "codeBackground", 4.5],
      ["messageForeground", "messageSurface", 4.5],
      ["toolbarForeground", "toolbar", 4.5],
      ["accentSurfaceForeground", "accentSurface", 4.5],
      ["searchMatchForeground", "searchMatchBackground", 4.5]
    ];

    for (const half of curatedHalves()) {
      const c = half.colors;
      for (const [fg, bg, min] of pairs) {
        expect(
          contrastRatio(c[fg]!, c[bg]!),
          `${half.label} ${fg} on ${bg}`
        ).toBeGreaterThanOrEqual(min);
      }
    }
  });

  test("light halves separate chip surfaces from cards (T3 pattern)", () => {
    for (const half of curatedHalves()) {
      if (half.appearance !== "light") continue;
      expect(half.colors.secondary).not.toBe(half.colors.surface);
      expect(half.colors.muted).not.toBe(half.colors.surface);
      expect(half.colors.sidebar).not.toBe(half.colors.canvas);
    }
  });

  test("dark halves keep code blocks on the surface layer", () => {
    for (const half of curatedHalves()) {
      if (half.appearance !== "dark") continue;
      expect(half.colors.codeBackground).toBe(half.colors.surface);
    }
  });

  test("quality dimensions meet polish bar on every curated half", () => {
    const failures: string[] = [];
    for (const half of curatedHalves()) {
      const palette = resolveTheme(half.paletteId);
      const accentReference = half.label.includes("/")
        ? half.colors.accent
        : pickAccent(palette.base30, half.accentKey);
      const score = scoreT3CodeColors(half.colors, half.appearance, { palette, accentReference });
      if (score.overall < MIN_OVERALL) {
        failures.push(`${half.label} overall ${score.overall}`);
      }
      for (const dim of T3CODE_QUALITY_DIMENSIONS) {
        if (score[dim] < MIN_DIMENSION) {
          failures.push(`${half.label} ${dim}=${score[dim]}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
