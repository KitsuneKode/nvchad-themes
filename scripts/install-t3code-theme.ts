import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { T3CODE_CURATION, type T3CodeCuration, t3codeThemeId } from "../src/index.ts";

// T3 Code ignores published themes past this many files.
const MAX_THEME_FILES = 32;

const rootDir = resolve(".");
const defaultConfigPath = resolve(rootDir, "t3code.install.json");

/** Marketplace-famous defaults for `bun run install:t3code:pick -- --init`. */
const FAMOUS_PRESET = new Set([
  "tokyodark",
  "tokyonight",
  "catppuccin",
  "nord",
  "gruvbox",
  "onedark",
  "github_dark",
  "chadracula",
  "nightowl",
  "palenight",
  "ayu_dark",
  "rosepine",
  "kanagawa",
  "yoru",
  "rxyhn",
  "solarized_dark",
  "darcula-dark",
  "everforest",
  "vscode_dark"
]);

type InstallConfig = {
  prune?: boolean;
  themes?: Record<string, boolean>;
};

const parseArgs = (argv: string[]) => {
  let configPath: string | null = null;
  let list = false;
  let init = false;
  let preset: "famous" | null = null;
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--list") list = true;
    else if (arg === "--init") init = true;
    else if (arg === "--preset") {
      const value = argv[++i];
      if (value === "famous") preset = "famous";
      else {
        console.error(`Unknown preset: ${value ?? "(missing)"}. Use: famous`);
        process.exit(1);
      }
    } else if (arg === "--config") {
      const value = argv[++i];
      configPath = value ? resolve(value) : defaultConfigPath;
    } else if (arg.startsWith("-")) {
      console.error(`Unknown flag: ${arg}`);
      process.exit(1);
    } else positional.push(arg);
  }

  return { configPath, list, init, preset, positional };
};

const readInstallConfig = (path: string): InstallConfig => {
  if (!existsSync(path)) {
    console.error(`Config not found: ${path}`);
    console.error("Run: bun run install:t3code:pick -- --init");
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(path, "utf8")) as InstallConfig;
  } catch (error) {
    console.error(`Invalid JSON in ${path}:`, error);
    process.exit(1);
  }
};

const writeDefaultConfig = (path: string, enabled: Set<string>) => {
  const themes: Record<string, boolean> = {};
  for (const entry of T3CODE_CURATION) {
    themes[entry.id] = enabled.has(entry.id);
  }
  const doc = {
    $comment:
      "Set each theme to true to install into $T3CODE_HOME/userdata/themes (max 32). Run: bun run install:t3code:pick",
    prune: true,
    themes
  };
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);
  console.log(`Wrote ${path} (${enabled.size} enabled)`);
};

const resolveEntries = (
  positional: string[],
  configPath: string | null,
  preset: "famous" | null
): { entries: readonly T3CodeCuration[]; prune: boolean } => {
  if (positional.length > 0) {
    const entries = T3CODE_CURATION.filter(
      (entry) => positional.includes(entry.id) || positional.includes(t3codeThemeId(entry.id))
    );
    if (entries.length === 0) {
      console.error(`Unknown theme id(s): ${positional.join(", ")}`);
      console.error(`Available: ${T3CODE_CURATION.map((entry) => entry.id).join(", ")}`);
      process.exit(1);
    }
    return { entries, prune: false };
  }

  if (configPath) {
    const config = readInstallConfig(configPath);
    const toggles = config.themes ?? {};
    const entries = T3CODE_CURATION.filter((entry) => toggles[entry.id] === true);
    if (entries.length === 0) {
      console.error(`No themes enabled in ${configPath}. Set some "themes" entries to true.`);
      process.exit(1);
    }
    return { entries, prune: config.prune !== false };
  }

  if (preset === "famous") {
    return {
      entries: T3CODE_CURATION.filter((entry) => FAMOUS_PRESET.has(entry.id)),
      prune: true
    };
  }

  return { entries: T3CODE_CURATION, prune: true };
};

const { configPath, list, init, preset, positional } = parseArgs(process.argv.slice(2));

if (list) {
  console.log("Palette id → T3 file → card name\n");
  for (const entry of T3CODE_CURATION) {
    console.log(`${entry.id.padEnd(18)} ${t3codeThemeId(entry.id)}.json`.padEnd(44) + entry.name);
  }
  console.log(`\n${T3CODE_CURATION.length} curated themes (max ${MAX_THEME_FILES} in T3 Code).`);
  process.exit(0);
}

if (init) {
  writeDefaultConfig(configPath ?? defaultConfigPath, FAMOUS_PRESET);
  process.exit(0);
}

const t3Home = process.env.T3CODE_HOME?.trim() || resolve(homedir(), ".t3");
const targetDir = resolve(t3Home.replace(/^~(?=$|\/)/, homedir()), "userdata", "themes");

const { entries, prune } = resolveEntries(positional, configPath, preset);

if (entries.length > MAX_THEME_FILES) {
  console.error(
    `${entries.length} themes selected but T3 Code only loads ${MAX_THEME_FILES}. Disable some entries in t3code.install.json.`
  );
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

const wanted = new Set(entries.map((entry) => `${t3codeThemeId(entry.id)}.json`));

if (prune) {
  for (const fileName of readdirSync(targetDir)) {
    if (fileName.startsWith("nv-") && fileName.endsWith(".json") && !wanted.has(fileName)) {
      rmSync(resolve(targetDir, fileName));
      console.log(`Removed ${fileName}`);
    }
  }
}

for (const fileName of wanted) {
  const source = resolve(rootDir, "t3code", fileName);
  if (!existsSync(source)) {
    console.error(`Missing built theme: ${source}. Run bun run build.`);
    process.exit(1);
  }
  copyFileSync(source, resolve(targetDir, fileName));
}

const published = readdirSync(targetDir).filter((fileName) => fileName.endsWith(".json"));
console.log(`Installed ${wanted.size} theme(s) into ${targetDir}`);
if (published.length > MAX_THEME_FILES) {
  console.warn(
    `Warning: ${published.length} theme files in the folder exceed T3 Code's limit of ${MAX_THEME_FILES}; extras are ignored.`
  );
}
