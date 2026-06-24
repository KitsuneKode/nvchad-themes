import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildTheme, buildZedTheme, getThemeById } from "../../src/index.ts";
import { HERO_THEME_IDS } from "../../src/references/hero-themes.ts";

export const GOLDEN_STYLE_KEYS = [
  "background",
  "surface.background",
  "editor.background",
  "tab.active_background",
  "tab.inactive_background",
  "element.selected",
  "title_bar.background",
  "status_bar.background",
  "border",
  "editor.indent_guide",
  "pane_group.border"
] as const;

export type GoldenStyleKey = (typeof GOLDEN_STYLE_KEYS)[number];
export type GoldenStyleExtract = Record<GoldenStyleKey, string | undefined>;

/** VS Code color keys that correspond to each golden surface token. */
export const VS_CODE_GOLDEN_KEY_MAP: Record<GoldenStyleKey, string> = {
  background: "activityBar.background",
  "surface.background": "sideBar.background",
  "editor.background": "editor.background",
  "tab.active_background": "tab.activeBackground",
  "tab.inactive_background": "tab.inactiveBackground",
  "element.selected": "list.inactiveSelectionBackground",
  "title_bar.background": "titleBar.inactiveBackground",
  "status_bar.background": "statusBar.background",
  border: "sideBar.border",
  "editor.indent_guide": "editorIndentGuide.background1",
  "pane_group.border": "editorGroup.border"
};

export const extractGoldenStyle = (style: Record<string, string>): GoldenStyleExtract =>
  Object.fromEntries(GOLDEN_STYLE_KEYS.map((key) => [key, style[key]])) as GoldenStyleExtract;

export const extractVsCodeGoldenStyle = (colors: Record<string, string>): GoldenStyleExtract =>
  Object.fromEntries(
    GOLDEN_STYLE_KEYS.map((key) => [key, colors[VS_CODE_GOLDEN_KEY_MAP[key]]])
  ) as GoldenStyleExtract;

export const formatGoldenJson = (extract: GoldenStyleExtract): string =>
  `${JSON.stringify(extract, null, 2)}\n`;

const diffGolden = (id: string, path: string, expected: string, actual: string): string[] => {
  const lines: string[] = [`${id}: ${path} is stale`];
  try {
    const expectedObj = JSON.parse(expected) as Record<string, string>;
    const actualObj = JSON.parse(actual) as Record<string, string>;
    for (const key of GOLDEN_STYLE_KEYS) {
      if (expectedObj[key] !== actualObj[key]) {
        lines.push(`  ${key}: on disk ${actualObj[key] ?? "(missing)"} → build ${expectedObj[key] ?? "(missing)"}`);
      }
    }
  } catch {
    lines.push("  (could not parse JSON for field-level diff)");
  }
  return lines;
};

export type GenerateGoldensOptions = {
  check?: boolean;
  tuned?: boolean;
  vscode?: boolean;
  ids?: readonly string[];
};

export const buildZedGolden = (id: string): GoldenStyleExtract | null => {
  const theme = getThemeById(id);
  if (!theme) return null;
  const style = buildZedTheme(theme).themes[0]!.style as Record<string, string>;
  return extractGoldenStyle(style);
};

export const buildVsCodeGolden = (id: string): GoldenStyleExtract | null => {
  const theme = getThemeById(id);
  if (!theme) return null;
  const colors = buildTheme(theme).colors;
  return extractVsCodeGoldenStyle(colors);
};

export const generateHeroGoldens = (options: GenerateGoldensOptions = {}): boolean => {
  const ids = options.ids ?? HERO_THEME_IDS;
  const check = options.check ?? false;
  const mismatches: string[] = [];

  if (!check) {
    mkdirSync(resolve("zed", "golden"), { recursive: true });
    if (options.vscode) {
      mkdirSync(resolve("themes", "golden"), { recursive: true });
    }
  }

  for (const id of ids) {
    const zedExtract = buildZedGolden(id);
    if (!zedExtract) {
      console.warn(`Skipping unknown theme: ${id}`);
      continue;
    }

    const zedPath = resolve("zed", "golden", `${id}.json`);
    const zedContent = formatGoldenJson(zedExtract);

    if (check) {
      if (!existsSync(zedPath)) {
        mismatches.push(`${id}: missing ${zedPath}`);
      } else {
        const onDisk = readFileSync(zedPath, "utf8");
        if (onDisk !== zedContent) {
          mismatches.push(...diffGolden(id, zedPath, zedContent, onDisk));
        }
      }

      if (options.vscode) {
        const vscodeExtract = buildVsCodeGolden(id);
        if (!vscodeExtract) continue;
        const vscodePath = resolve("themes", "golden", `${id}.json`);
        const vscodeContent = formatGoldenJson(vscodeExtract);
        if (!existsSync(vscodePath)) {
          mismatches.push(`${id}: missing ${vscodePath}`);
        } else {
          const onDisk = readFileSync(vscodePath, "utf8");
          if (onDisk !== vscodeContent) {
            mismatches.push(...diffGolden(id, vscodePath, vscodeContent, onDisk));
          }
        }
      }
      continue;
    }

    writeFileSync(zedPath, zedContent);
    console.log(`Wrote zed/golden/${id}.json`);

    if (options.tuned) {
      writeFileSync(
        resolve("zed", "golden", `${id}.tuned.json`),
        `${JSON.stringify({ id, surfaces: zedExtract }, null, 2)}\n`
      );
      console.log(`Wrote zed/golden/${id}.tuned.json`);
    }

    if (options.vscode) {
      const vscodeExtract = buildVsCodeGolden(id);
      if (!vscodeExtract) continue;
      writeFileSync(resolve("themes", "golden", `${id}.json`), formatGoldenJson(vscodeExtract));
      console.log(`Wrote themes/golden/${id}.json`);
    }
  }

  if (check && mismatches.length > 0) {
    console.error("Golden extracts are stale:\n");
    for (const line of mismatches) {
      console.error(line);
    }
    console.error("\nRun `bun run goldens` to refresh committed extracts.");
    return false;
  }

  if (check) {
    console.log(`Golden check passed for ${ids.length} theme(s).`);
  }

  return true;
};
