import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { README_HERO_THEME_IDS } from "../src/references/hero-themes.ts";
import { findEditorScreenshot } from "../scripts/lib/editor-screenshot-paths.ts";

const readPngDimensions = (filePath: string): { width: number; height: number } => {
  const header = readFileSync(filePath).subarray(0, 24);
  expect(header.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    width: header.readUInt32BE(16),
    height: header.readUInt32BE(20)
  };
};

describe("release readiness", () => {
  test("all README hero screenshots exist for both editors at 1280x800", () => {
    for (const themeId of README_HERO_THEME_IDS) {
      for (const kind of ["cursor", "zed"] as const) {
        const screenshot = findEditorScreenshot(kind, themeId);
        expect(screenshot, `${kind}/${themeId} screenshot`).toBeDefined();
        const dimensions = readPngDimensions(screenshot!);
        expect(dimensions, `${kind}/${themeId} dimensions`).toEqual({ width: 1280, height: 800 });
      }
    }
  });

  test("evergreen docs do not pin the current release asset version", () => {
    for (const file of ["README.md", "PUBLISHING.md", "zed-extension/README.md"]) {
      const contents = readFileSync(resolve(file), "utf8");
      expect(contents).not.toMatch(/releases\/latest\/download\/[^\n]*-1\.0\.1\./);
    }
  });

  test("publishing docs describe the registry subdirectory layout", () => {
    const publishing = readFileSync(resolve("PUBLISHING.md"), "utf8");
    expect(publishing).toContain('path = "zed-extension"');
    expect(publishing).toContain("pnpm sort-extensions");
    expect(publishing).toContain("public Git submodule");
    expect(publishing).toContain("HTTPS");
  });

  test("release documentation targets exist", () => {
    for (const file of ["README.md", "INSTALL.md", "PUBLISHING.md", "zed-extension/README.md"]) {
      expect(existsSync(resolve(file))).toBe(true);
    }
  });
});
