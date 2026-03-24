import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

const sourcePath = resolve(rootDir, "codex", `${theme.id}.tmTheme`);
const codexDir = resolve(homedir(), ".codex");
const targetDir = resolve(codexDir, "themes");
const targetPath = resolve(targetDir, `${theme.id}.tmTheme`);
const configPath = resolve(codexDir, "config.toml");
const backupConfigPath = resolve(codexDir, "config.toml.bak");

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

const upsertCodexThemeConfig = (existingConfig: string, themeId: string): string => {
  const themeLine = `theme = "${themeId}"`;
  const lines = existingConfig.length > 0 ? existingConfig.split(/\r?\n/) : [];
  const tuiHeaderIndex = lines.findIndex((line) => line.trim() === "[tui]");

  if (tuiHeaderIndex === -1) {
    const trimmed = existingConfig.trimEnd();
    return trimmed.length > 0
      ? `${trimmed}\n\n[tui]\n${themeLine}\n`
      : `[tui]\n${themeLine}\n`;
  }

  let tuiSectionEndIndex = lines.length;
  for (let index = tuiHeaderIndex + 1; index < lines.length; index += 1) {
    if (/^\[.*\]\s*$/.test(lines[index].trim())) {
      tuiSectionEndIndex = index;
      break;
    }
  }

  const nextLines = [...lines];
  let replacedExistingTheme = false;
  for (let index = tuiHeaderIndex + 1; index < tuiSectionEndIndex; index += 1) {
    if (/^\s*theme\s*=/.test(nextLines[index])) {
      if (!replacedExistingTheme) {
        nextLines[index] = themeLine;
        replacedExistingTheme = true;
        continue;
      }

      nextLines.splice(index, 1);
      tuiSectionEndIndex -= 1;
      index -= 1;
    }
  }

  if (!replacedExistingTheme) {
    nextLines.splice(tuiHeaderIndex + 1, 0, themeLine);
  }

  return `${nextLines.join("\n").trimEnd()}\n`;
};

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

const existingConfig = existsSync(configPath) ? readFileSync(configPath, "utf8") : "";
const updatedConfig = upsertCodexThemeConfig(existingConfig, theme.id);

mkdirSync(codexDir, { recursive: true });
if (existsSync(configPath)) {
  copyFileSync(configPath, backupConfigPath);
}
writeFileSync(configPath, updatedConfig);

console.log(`Installed ${targetPath}`);
console.log(`Updated ${configPath} to use theme "${theme.id}".`);
if (existsSync(backupConfigPath)) {
  console.log(`Backed up previous config to ${backupConfigPath}.`);
}
