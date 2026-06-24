import { resolve } from "node:path";
import {
  printZedValidationResult,
  validateZedExtensionDir
} from "./lib/validate-zed.ts";

const rootDir = resolve(".");
const zedExtensionDir = resolve(rootDir, "zed-extension");

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

const validation = validateZedExtensionDir(zedExtensionDir);
printZedValidationResult("Zed dev extension", validation);

if (!validation.ok) {
  process.exit(1);
}

console.log("");
console.log("Zed dev extension is ready.");
console.log(`Path: ${zedExtensionDir}`);
console.log("");
console.log("Install in Zed (theme-only extension, no Rust required):");
console.log("  1. Open the command palette");
console.log("  2. Run: zed: install dev extension");
console.log("  3. Select the zed-extension/ directory (not the repo root)");
console.log("");
console.log("After install, open the theme picker and search for \"NvChad\".");
console.log("All 94 variants live in one theme family: NvChad Themes.");
console.log("");
console.log("Troubleshooting:");
console.log("  - zed: open log");
console.log("  - zed --foreground (verbose logs from terminal)");
console.log("");
console.log("Docs:");
console.log("  - https://zed.dev/docs/extensions/themes");
console.log("  - https://zed.dev/docs/extensions/developing-extensions");
