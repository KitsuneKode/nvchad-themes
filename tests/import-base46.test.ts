import { describe, expect, test } from "bun:test";
import type { Base16Palette, Base30Palette } from "../src/types.ts";
import { resolveValue } from "../scripts/import-base46.ts";

const mockBase30: Base30Palette = {
  white: "#ffffff",
  darkerBlack: "#111111",
  black: "#000000",
  black2: "#0a0a0a",
  oneBg: "#1a1a1a",
  oneBg2: "#222222",
  oneBg3: "#333333",
  grey: "#444444",
  greyFg: "#888888",
  greyFg2: "#999999",
  lightGrey: "#aaaaaa",
  red: "#ff0000",
  babyPink: "#ffb6c1",
  pink: "#ffc0cb",
  line: "#2a2a2a",
  green: "#00ff00",
  vibrantGreen: "#00cc00",
  nordBlue: "#6e98eb",
  blue: "#0000ff",
  yellow: "#ffff00",
  sun: "#ffcc00",
  purple: "#800080",
  darkPurple: "#660066",
  teal: "#008080",
  orange: "#ffa500",
  cyan: "#00ffff",
  statuslineBg: "#1e1e1e",
  lightBg: "#2d2d2d",
  pmenuBg: "#3d3d3d",
  folderBg: "#4d4d4d"
};

const mockBase16: Base16Palette = {
  base00: "#000000",
  base01: "#111111",
  base02: "#222222",
  base03: "#333333",
  base04: "#444444",
  base05: "#c0caf5",
  base06: "#666666",
  base07: "#777777",
  base08: "#888888",
  base09: "#999999",
  base0A: "#aaaaaa",
  base0B: "#bbbbbb",
  base0C: "#cccccc",
  base0D: "#55B4D4",
  base0E: "#dddddd",
  base0F: "#F2AE49"
};

const mockBase30Raw: Record<string, string> = {
  white: '"#ffffff"',
  black: '"#000000"',
  blue: "M.base_30.nord_blue",
  nord_blue: '"#6e98eb"',
  cyclic_a: "M.base_30.cyclic_b",
  cyclic_b: "M.base_30.cyclic_a"
};

describe("import-base46 resolveValue", () => {
  test("M.base_16.base05 resolves to hex from base16", () => {
    const result = resolveValue("M.base_16.base05", mockBase30Raw, mockBase30, mockBase16);
    expect(result).toBe("#c0caf5");
  });

  test("M.base_30.base0D resolves via base16 when referenced through base_30 path", () => {
    const result = resolveValue("M.base_30.base0D", mockBase30Raw, mockBase30, mockBase16);
    expect(result).toBe("#55B4D4");
  });

  test("M.base_30.pale_blue resolves via nordBlue alias (upstream material-darker typo)", () => {
    const result = resolveValue("M.base_30.pale_blue", mockBase30Raw, mockBase30, mockBase16);
    expect(result).toBe("#6e98eb");
  });

  test("quoted hex passes through unchanged", () => {
    expect(resolveValue('"#AABBCC"', mockBase30Raw, mockBase30, mockBase16)).toBe("#AABBCC");
  });

  test("cycle A → B → A throws", () => {
    expect(() => resolveValue("M.base_30.cyclic_a", mockBase30Raw, mockBase30, mockBase16)).toThrow(
      /Cyclic color reference/
    );
  });

  test("unknown M.base_30.foo returns trimmed literal", () => {
    const result = resolveValue("M.base_30.foo", mockBase30Raw, mockBase30, mockBase16);
    expect(result).toBe("M.base_30.foo");
  });
});
