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

  test("dark sidebar type still reads after T3 fades it", () => {
    const over = (fg: string, bg: string, alpha: number): string => {
      const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      const [fr, fgG, fb] = channels(fg);
      const [br, bgG, bb] = channels(bg);
      const mix = (front: number, back: number) => Math.round(front * alpha + back * (1 - alpha));
      const hex = [mix(fr, br), mix(fgG, bgG), mix(fb, bb)]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("");
      return `#${hex}`;
    };

    const failures: string[] = [];
    for (const half of curatedHalves()) {
      if (half.appearance !== "dark") continue;
      const c = half.colors;
      const checks: Array<[string, number, number]> = [
        ["timestamp", contrastRatio(over(c.textMuted!, c.sidebar!, 0.55), c.sidebar!), 2.9],
        ["settled title", contrastRatio(over(c.secondaryLabel!, c.sidebar!, 0.7), c.sidebar!), 3.4],
        ["idle row", contrastRatio(over(c.sidebarMutedForeground!, c.sidebar!, 0.75), c.sidebar!), 4.4],
        // A lighter sidebar cannot reach 12:1 even with white ink. 11.5 still clears the old 7–9:1 titles.
        ["title", contrastRatio(c.sidebarForeground!, c.sidebar!), 11.5]
      ];
      for (const [name, ratio, min] of checks) {
        if (ratio < min) failures.push(`${half.label} ${name} ${ratio.toFixed(2)} < ${min}`);
      }
    }
    expect(failures).toEqual([]);
  });

  test("dark chrome keeps a quiet row under the active one and a light accent label", () => {
    const failures: string[] = [];
    for (const half of curatedHalves()) {
      if (half.appearance !== "dark") continue;
      const c = half.colors;
      const sidebar = relativeLuminance(c.sidebar!);
      const hover = relativeLuminance(c.sidebarRowHover!);
      const active = relativeLuminance(c.sidebarRowActive!);
      const selected = relativeLuminance(c.sidebarRowSelected!);
      if (!(selected > sidebar && hover > selected && active > hover)) {
        failures.push(
          `${half.label} rows sidebar=${sidebar.toFixed(4)} selected=${selected.toFixed(4)} hover=${hover.toFixed(4)} active=${active.toFixed(4)}`
        );
      }
      const border = contrastRatio(c.border!, c.canvas!);
      const sidebarBorder = contrastRatio(c.sidebarBorder!, c.sidebar!);
      if (border < 1.15 || border > 1.45) failures.push(`${half.label} border ${border.toFixed(2)}`);
      if (sidebarBorder < 1.15 || sidebarBorder > 1.45) {
        failures.push(`${half.label} sidebarBorder ${sidebarBorder.toFixed(2)}`);
      }
      if (relativeLuminance(c.accentForeground!) <= relativeLuminance(c.accent!)) {
        failures.push(`${half.label} accent ink ${c.accentForeground} on ${c.accent}`);
      }
      const seat =
        relativeLuminance(c.surfaceOverlay!) >= relativeLuminance(c.surfaceRaised!)
          ? c.surfaceOverlay!
          : c.surfaceRaised!;
      if (!(relativeLuminance(c.accentSurface!) > relativeLuminance(seat))) {
        failures.push(`${half.label} selection sits inside the card`);
      }
      const selection = contrastRatio(c.accentSurface!, seat);
      if (selection < 1.15 || selection > 1.4) {
        failures.push(`${half.label} selection ${selection.toFixed(3)}`);
      }
      const bubbleOnCanvas = contrastRatio(c.messageSurface!, c.canvas!);
      const bubbleOnSelection = contrastRatio(c.messageSurface!, c.accentSurface!);
      if (bubbleOnCanvas < 1.12 || bubbleOnCanvas > 1.55) {
        failures.push(`${half.label} bubble ${bubbleOnCanvas.toFixed(3)} ${c.messageSurface}`);
      }
      if (bubbleOnSelection < 1.15) {
        failures.push(`${half.label} bubble sits on the selection ${bubbleOnSelection.toFixed(3)}`);
      }
      const inputOnBubble = contrastRatio(c.input!, c.messageSurface!);
      const inputOnCanvas = contrastRatio(c.input!, c.canvas!);
      if (inputOnBubble < 1.12) {
        failures.push(`${half.label} input sits on the bubble ${inputOnBubble.toFixed(3)} ${c.input}`);
      }
      if (inputOnCanvas < 1.18 || inputOnCanvas > 1.72) {
        failures.push(`${half.label} input ${inputOnCanvas.toFixed(3)} ${c.input}`);
      }
      for (const role of ["errorSurface", "warningSurface", "updateSurface"] as const) {
        const ratio = contrastRatio(c[role]!, c.canvas!);
        if (ratio < 1.15) failures.push(`${half.label} ${role} ${ratio.toFixed(3)} ${c[role]}`);
      }
    }
    expect(failures).toEqual([]);
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
