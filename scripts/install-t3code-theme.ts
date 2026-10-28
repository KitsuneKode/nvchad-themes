import { copyFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { T3CODE_CURATION, t3codeThemeId } from "../src/index.ts";

// T3 Code ignores published themes past this many files.
const MAX_THEME_FILES = 32;

const rootDir = resolve(".");
const t3Home = process.env.T3CODE_HOME?.trim() || resolve(homedir(), ".t3");
const targetDir = resolve(t3Home.replace(/^~(?=$|\/)/, homedir()), "userdata", "themes");
const requested = process.argv.slice(2);

const entries = requested.length === 0
  ? T3CODE_CURATION
  : T3CODE_CURATION.filter((entry) => requested.includes(entry.id) || requested.includes(t3codeThemeId(entry.id)));

if (entries.length === 0) {
  console.error(`Unknown theme id(s): ${requested.join(", ")}`);
  console.error(`Available: ${T3CODE_CURATION.map((entry) => entry.id).join(", ")}`);
  process.exit(1);
}

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

// A full install owns every nv-* file: drop ones that left the curation.
const wanted = new Set(entries.map((entry) => `${t3codeThemeId(entry.id)}.json`));
if (requested.length === 0) {
  for (const fileName of readdirSync(targetDir)) {
    if (fileName.startsWith("nv-") && fileName.endsWith(".json") && !wanted.has(fileName)) {
      rmSync(resolve(targetDir, fileName));
      console.log(`Removed ${fileName}`);
    }
  }
}

for (const fileName of wanted) {
  copyFileSync(resolve(rootDir, "t3code", fileName), resolve(targetDir, fileName));
}

const published = readdirSync(targetDir).filter((fileName) => fileName.endsWith(".json"));
console.log(`Installed ${wanted.size} theme(s) into ${targetDir}`);
if (published.length > MAX_THEME_FILES) {
  console.warn(`Warning: ${published.length} theme files exceed T3 Code's limit of ${MAX_THEME_FILES}; extras are ignored.`);
}
