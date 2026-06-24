import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import {
  parseZedThemeFamily,
  printZedValidationResult,
  validateZedThemeFamily,
  ZED_EXTENSION_BUNDLE,
  ZED_USER_THEMES_DIR
} from "./lib/validate-zed.ts";

const rootDir = resolve(".");
const targetDir = resolve(homedir(), ".config", "zed", "themes");
const legacyTargetPath = resolve(targetDir, "nvchad-rxyhn.json");
const args = process.argv.slice(2);
const installAll = args.includes("--all");
const requestedThemeId = args.find((arg) => !arg.startsWith("-") && !arg.endsWith(".ts"));

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

if (existsSync(legacyTargetPath)) {
  rmSync(legacyTargetPath);
  console.log(`Removed legacy theme file: ${legacyTargetPath}`);
}

if (installAll || !requestedThemeId) {
  const sourcePath = resolve(rootDir, "zed", ZED_EXTENSION_BUNDLE);
  const targetPath = resolve(targetDir, ZED_EXTENSION_BUNDLE);

  const bundle = parseZedThemeFamily(sourcePath);
  const validation = validateZedThemeFamily(bundle);
  printZedValidationResult("Zed theme bundle", validation);

  if (!validation.ok) {
    process.exit(1);
  }

  copyFileSync(sourcePath, targetPath);
  console.log(`Installed bundled Zed theme to ${targetPath}`);
  console.log(`All ${bundle.themes.length} NvChad variants are in one theme family file.`);
  console.log("");
  console.log("Zed watches ~/.config/zed/themes/ and reloads themes automatically.");
  console.log("Open the theme picker and search for \"NvChad\".");
  console.log("");
  console.log("This is the manual install path (no dev extension).");
  console.log("For extension-style install with updates, use: bun run install:zed-dev");
  process.exit(0);
}

const sourcePath = resolve(rootDir, "zed", `${requestedThemeId}-theme.json`);
const targetPath = resolve(targetDir, `${requestedThemeId}-theme.json`);

if (!existsSync(sourcePath)) {
  console.error(`Unknown theme id: ${requestedThemeId}`);
  console.error(`Expected file: ${sourcePath}`);
  process.exit(1);
}

const bundle = parseZedThemeFamily(sourcePath);
const validation = validateZedThemeFamily(bundle, {
  expectedVariants: 1,
  checkCatalog: false
});
printZedValidationResult(`Zed theme (${requestedThemeId})`, validation);

if (!validation.ok) {
  process.exit(1);
}

copyFileSync(sourcePath, targetPath);
console.log(`Installed ${targetPath}`);
console.log(`Theme family: ${bundle.name}`);
console.log(`Variant: ${bundle.themes[0]?.name ?? requestedThemeId}`);
console.log("");
console.log(`User themes directory: ${ZED_USER_THEMES_DIR}`);
