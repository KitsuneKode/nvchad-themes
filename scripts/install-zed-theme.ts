import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const rootDir = resolve(".");
const sourcePath = resolve(rootDir, "zed", "rxyhn-theme.json");
const targetDir = resolve(homedir(), ".config", "zed", "themes");
const targetPath = resolve(targetDir, "rxyhn-theme.json");
const legacyTargetPath = resolve(targetDir, "nvchad-rxyhn.json");

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
}
copyFileSync(sourcePath, targetPath);

console.log(`Installed ${targetPath}`);
