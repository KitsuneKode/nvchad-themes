import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PaletteFile, ThemeSpec } from "./types.ts";

const PALETTES_DIR = resolve(import.meta.dir, "palettes");

const loadPalettes = (): PaletteFile[] =>
  readdirSync(PALETTES_DIR)
    .filter((name) => name.endsWith(".json") && !name.startsWith("."))
    .map((name) => JSON.parse(readFileSync(resolve(PALETTES_DIR, name), "utf8")) as PaletteFile)
    .sort((left, right) => left.id.localeCompare(right.id));

export const themeCatalog: ThemeSpec[] = loadPalettes();

export const getThemeById = (id: string): ThemeSpec | undefined =>
  themeCatalog.find((theme) => theme.id === id);
