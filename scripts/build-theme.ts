import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  buildCodexTheme,
  buildGeminiTheme,
  buildOpenCodeThemeFromModel,
  buildThemeFromModel,
  buildZedExtensionBundleFromModels,
  buildZedThemeFromModel,
  themeCatalog
} from "../src/index.ts";
import { deriveThemeModel } from "../src/derive/index.ts";

const ZED_EXTENSION_BUNDLE = "nvchad-themes.json";

const outputDirs = [
  resolve("themes"),
  resolve("zed"),
  resolve("opencode"),
  resolve("gemini"),
  resolve("codex"),
  resolve("zed-extension", "themes")
];

const expectedOutputs = new Map<string, string>();

for (const theme of themeCatalog) {
  expectedOutputs.set(resolve("themes", `${theme.id}-color-theme.json`), "vscode");
  expectedOutputs.set(resolve("zed", `${theme.id}-theme.json`), "zed");
  expectedOutputs.set(resolve("zed-extension", "themes", `${theme.id}-theme.json`), "zed-extension-per-theme");
  expectedOutputs.set(resolve("opencode", `${theme.id}.json`), "opencode");
  expectedOutputs.set(resolve("gemini", `${theme.id}.json`), "gemini");
  expectedOutputs.set(resolve("codex", `${theme.id}.tmTheme`), "codex");
}

expectedOutputs.set(resolve("zed", ZED_EXTENSION_BUNDLE), "zed-bundle");
expectedOutputs.set(resolve("zed-extension", "themes", ZED_EXTENSION_BUNDLE), "zed-extension");

const models = themeCatalog.map((theme) => deriveThemeModel(theme));

for (const model of models) {
  const theme = model.theme;
  const vscodeThemePath = resolve("themes", `${theme.id}-color-theme.json`);
  const zedThemePath = resolve("zed", `${theme.id}-theme.json`);
  const openCodeThemePath = resolve("opencode", `${theme.id}.json`);
  const geminiThemePath = resolve("gemini", `${theme.id}.json`);
  const codexThemePath = resolve("codex", `${theme.id}.tmTheme`);

  for (const path of [
    vscodeThemePath,
    zedThemePath,
    resolve("zed-extension", "themes", `${theme.id}-theme.json`),
    openCodeThemePath,
    geminiThemePath,
    codexThemePath
  ]) {
    mkdirSync(dirname(path), { recursive: true });
  }

  await Bun.write(vscodeThemePath, `${JSON.stringify(buildThemeFromModel(model), null, 2)}\n`);
  const zedTheme = buildZedThemeFromModel(model);
  const zedThemeJson = `${JSON.stringify(zedTheme, null, 2)}\n`;
  await Bun.write(zedThemePath, zedThemeJson);
  await Bun.write(resolve("zed-extension", "themes", `${theme.id}-theme.json`), zedThemeJson);
  await Bun.write(openCodeThemePath, `${JSON.stringify(buildOpenCodeThemeFromModel(model), null, 2)}\n`);
  await Bun.write(geminiThemePath, `${JSON.stringify(buildGeminiTheme(theme), null, 2)}\n`);
  await Bun.write(codexThemePath, `${buildCodexTheme(theme)}\n`);

  console.log(`Generated ${theme.id}`);
}

const zedBundle = buildZedExtensionBundleFromModels(models);
const zedBundleOutput = `${JSON.stringify(zedBundle, null, 2)}\n`;
const zedBundlePaths = [
  resolve("zed", ZED_EXTENSION_BUNDLE),
  resolve("zed-extension", "themes", ZED_EXTENSION_BUNDLE)
];

for (const path of zedBundlePaths) {
  mkdirSync(dirname(path), { recursive: true });
  await Bun.write(path, zedBundleOutput);
}

console.log(`Generated Zed extension bundle with ${zedBundle.themes.length} themes`);

const PRESERVE_PATHS = new Set([
  resolve("zed", "golden")
]);

for (const dir of outputDirs) {
  mkdirSync(dir, { recursive: true });
  for (const fileName of readdirSync(dir)) {
    const filePath = resolve(dir, fileName);
    if (PRESERVE_PATHS.has(filePath)) {
      continue;
    }
    if (statSync(filePath).isDirectory()) {
      continue;
    }
    if (!expectedOutputs.has(filePath)) {
      rmSync(filePath);
      console.log(`Removed stale ${filePath}`);
    }
  }
}

const packagePath = resolve("package.json");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
const contributes = (packageJson.contributes ?? {}) as Record<string, unknown>;

contributes.themes = themeCatalog.map((theme) => ({
  label: theme.displayName,
  uiTheme: theme.type === "light" ? "vs" : "vs-dark",
  path: `./themes/${theme.id}-color-theme.json`
}));

packageJson.contributes = contributes;

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`Synced ${packagePath} (${themeCatalog.length} themes)`);

copyFileSync(resolve("LICENSE"), resolve("zed-extension", "LICENSE"));
