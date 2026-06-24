import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  formatThemeName,
  isHexColor,
  snakeToCamel
} from "../src/utils.ts";
import {
  REQUIRED_BASE16_KEYS,
  REQUIRED_BASE30_KEYS,
  type Base16Palette,
  type Base30Palette,
  type PaletteFile
} from "../src/types.ts";

const BASE46_REPO = "NvChad/base46";
const BASE46_REF = "v3.0";
const PALETTES_DIR = resolve("src/palettes");
const MANIFEST_PATH = resolve("src/palettes/.base46-manifest.json");

const LUA_KEY_ALIASES: Record<string, keyof Base30Palette> = {
  lightbg: "lightBg",
  lightbg2: "lightBg",
  grey_fg: "greyFg",
  grey_fg2: "greyFg2",
  light_grey: "lightGrey",
  darker_black: "darkerBlack",
  one_bg: "oneBg",
  one_bg2: "oneBg2",
  one_bg3: "oneBg3",
  baby_pink: "babyPink",
  vibrant_green: "vibrantGreen",
  nord_blue: "nordBlue",
  dark_purple: "darkPurple",
  statusline_bg: "statuslineBg",
  pmenu_bg: "pmenuBg",
  folder_bg: "folderBg"
};

const normalizeBase30Key = (key: string): keyof Base30Palette | string => {
  const aliased = LUA_KEY_ALIASES[key] ?? snakeToCamel(key);
  return aliased as keyof Base30Palette | string;
};

const parseLuaTable = (source: string, marker: string): Record<string, string> => {
  const start = source.indexOf(marker);
  if (start === -1) {
    return {};
  }

  const braceStart = source.indexOf("{", start);
  if (braceStart === -1) {
    return {};
  }

  let depth = 0;
  let end = braceStart;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        end = index;
        break;
      }
    }
  }

  const body = source.slice(braceStart + 1, end);
  const entries: Record<string, string> = {};

  for (const rawLine of body.split("\n")) {
    const line = rawLine.replace(/--.*$/, "").trim();
    if (!line) {
      continue;
    }

    const lineMatch = line.match(/^([a-zA-Z0-9_]+)\s*=\s*(.+?),?$/);
    if (!lineMatch) {
      continue;
    }

    const rawKey = lineMatch[1]!;
    const rawValue = lineMatch[2]!.trim();
    entries[rawKey] = rawValue;
  }

  return entries;
};

const resolveValue = (
  rawValue: string,
  base30Raw: Record<string, string>,
  base30Resolved: Partial<Base30Palette>
): string => {
  const trimmed = rawValue.trim();

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }

  const refMatch = trimmed.match(/^M\.base_30\.([a-zA-Z0-9_]+)$/);
  if (refMatch) {
    const key = refMatch[1]!;
    const camel = normalizeBase30Key(key);
    if (typeof camel === "string" && camel in base30Resolved) {
      return base30Resolved[camel as keyof Base30Palette]!;
    }
    const raw = base30Raw[key];
    if (raw) {
      return resolveValue(raw, base30Raw, base30Resolved);
    }
  }

  return trimmed;
};

const buildBase30 = (rawEntries: Record<string, string>): { base30: Base30Palette; extras: Record<string, string> } => {
  const resolved: Partial<Base30Palette> = {};
  const extras: Record<string, string> = {};

  for (const [rawKey, rawValue] of Object.entries(rawEntries)) {
    const key = normalizeBase30Key(rawKey);
    const value = resolveValue(rawValue, rawEntries, resolved);
    if (!isHexColor(value)) {
      continue;
    }

    if ((REQUIRED_BASE30_KEYS as readonly string[]).includes(key)) {
      resolved[key as keyof Base30Palette] = value;
      continue;
    }

    extras[key] = value;
  }

  if (!resolved.vibrantGreen && resolved.green) {
    resolved.vibrantGreen = resolved.green;
  }

  if (!resolved.lightBg && resolved.oneBg2) {
    resolved.lightBg = resolved.oneBg2;
  }

  for (const key of REQUIRED_BASE30_KEYS) {
    if (!resolved[key]) {
      throw new Error(`Missing required base30 key: ${key}`);
    }
  }

  return { base30: resolved as Base30Palette, extras };
};

const buildBase16 = (
  rawEntries: Record<string, string>,
  base30Raw: Record<string, string>,
  base30: Base30Palette
): Base16Palette => {
  const resolved: Partial<Base16Palette> = {};

  for (const key of REQUIRED_BASE16_KEYS) {
    const rawValue = rawEntries[key];
    if (!rawValue) {
      throw new Error(`Missing required base16 key: ${key}`);
    }

    const value = resolveValue(rawValue, base30Raw, base30);
    if (!isHexColor(value)) {
      throw new Error(`Invalid base16 color for ${key}: ${value}`);
    }

    resolved[key] = value;
  }

  return resolved as Base16Palette;
};

const parseThemeFile = (id: string, source: string): PaletteFile => {
  const base30Raw = parseLuaTable(source, "M.base_30");
  const base16Raw = parseLuaTable(source, "M.base_16");
  const { base30, extras } = buildBase30(base30Raw);
  const base16 = buildBase16(base16Raw, base30Raw, base30);

  const typeMatch = source.match(/M\.type\s*=\s*"([^"]+)"/);
  const type = typeMatch?.[1] === "light" ? "light" : "dark";

  const palette: PaletteFile = {
    id,
    displayName: `NvChad ${formatThemeName(id)}`,
    author: "NvChad",
    type,
    base30,
    base16
  };

  if (Object.keys(extras).length > 0) {
    palette.base30Extras = extras;
  }

  return palette;
};

const fetchThemeSources = async (): Promise<Map<string, string>> => {
  const treeResponse = await fetch(
    `https://api.github.com/repos/${BASE46_REPO}/git/trees/${BASE46_REF}?recursive=1`
  );

  if (!treeResponse.ok) {
    throw new Error(`Failed to fetch base46 tree: ${treeResponse.status}`);
  }

  const tree = (await treeResponse.json()) as {
    sha: string;
    tree: Array<{ path: string; type: string }>;
  };

  const themePaths = tree.tree
    .filter((entry) => entry.path.startsWith("lua/base46/themes/") && entry.path.endsWith(".lua"))
    .map((entry) => entry.path);

  const sources = new Map<string, string>();

  for (const path of themePaths) {
    const id = path.replace("lua/base46/themes/", "").replace(".lua", "");
    const rawUrl = `https://raw.githubusercontent.com/${BASE46_REPO}/${BASE46_REF}/${path}`;
    const response = await fetch(rawUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    sources.set(id, await response.text());
  }

  writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify({ ref: BASE46_REF, sha: tree.sha, themeCount: sources.size, importedAt: new Date().toISOString() }, null, 2)}\n`
  );

  return sources;
};

const loadLocalPalettes = (): PaletteFile[] => {
  if (!existsSync(PALETTES_DIR)) {
    return [];
  }

  return readdirSync(PALETTES_DIR)
    .filter((name) => name.endsWith(".json") && !name.startsWith("."))
    .map((name) => JSON.parse(readFileSync(resolve(PALETTES_DIR, name), "utf8")) as PaletteFile)
    .sort((a, b) => a.id.localeCompare(b.id));
};

const run = async () => {
  const checkOnly = process.argv.includes("--check");

  if (checkOnly) {
    const palettes = loadLocalPalettes();
    if (palettes.length === 0) {
      console.error("No palettes found. Run import without --check first.");
      process.exit(1);
    }

    if (!existsSync(MANIFEST_PATH)) {
      console.error("Missing palette manifest. Re-run import.");
      process.exit(1);
    }

    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as { themeCount: number };
    if (palettes.length !== manifest.themeCount) {
      console.error(`Palette count mismatch: files=${palettes.length}, manifest=${manifest.themeCount}`);
      process.exit(1);
    }

    console.log(`Palette check passed (${palettes.length} themes).`);
    return;
  }

  mkdirSync(PALETTES_DIR, { recursive: true });
  const sources = await fetchThemeSources();

  for (const [id, source] of sources) {
    const palette = parseThemeFile(id, source);
    writeFileSync(resolve(PALETTES_DIR, `${id}.json`), `${JSON.stringify(palette, null, 2)}\n`);
    console.log(`Imported ${id}`);
  }

  console.log(`Imported ${sources.size} themes from ${BASE46_REPO}@${BASE46_REF}`);
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
