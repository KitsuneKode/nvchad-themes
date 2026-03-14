import { copyFileSync, mkdirSync } from "node:fs";
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

const sourcePath = resolve(rootDir, "opencode", `${theme.id}.json`);
const targetDir = resolve(homedir(), ".config", "opencode", "themes");
const targetPath = resolve(targetDir, `${theme.id}.json`);

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

console.log(`Installed ${targetPath}`);
