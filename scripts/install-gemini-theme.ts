import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { themeCatalog } from "../src/theme.ts";

const rootDir = resolve(".");
const requestedThemeId = process.argv[2] ?? themeCatalog[0].id;
const theme = themeCatalog.find((entry) => entry.id === requestedThemeId);

if (!theme) {
  console.error(`Unknown theme id: ${requestedThemeId}`);
  process.exit(1);
}

const sourcePath = resolve(rootDir, "gemini", `${theme.id}.json`);
const targetDir = resolve(homedir(), ".gemini", "themes");
const targetPath = resolve(targetDir, `${theme.id}.json`);
const settingsPath = resolve(homedir(), ".gemini", "settings.json");

const buildResult = Bun.spawnSync({
  cmd: ["bun", "run", "build"],
  cwd: rootDir,
  stdout: "inherit",
  stderr: "inherit",
  env: process.env
});

if (buildResult.exitCode !== 0) {
  process.exit(buildResult.exitCode ?? 1);
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

let settings: Record<string, unknown> = {};
try {
  settings = JSON.parse(readFileSync(settingsPath, "utf8")) as Record<string, unknown>;
} catch {
  settings = {};
}

const themeJson = JSON.parse(readFileSync(targetPath, "utf8")) as Record<string, unknown>;
const themeName = themeJson.name as string;

const ui = (settings.ui ?? {}) as Record<string, unknown>;
const customThemes = (ui.customThemes ?? {}) as Record<string, unknown>;
customThemes[themeName] = themeJson;
ui.customThemes = customThemes;
ui.theme = themeName;
settings.ui = ui;
writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
console.log(`Updated ${settingsPath} with custom theme "${themeName}".`);

console.log(`Installed ${targetPath}`);
