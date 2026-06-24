import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  buildCodexTheme,
  buildGeminiTheme,
  buildOpenCodeTheme,
  buildTheme,
  buildZedExtensionBundle,
  buildZedTheme,
  themeCatalog
} from "../src/index.ts";

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
  expectedOutputs.set(resolve("opencode", `${theme.id}.json`), "opencode");
  expectedOutputs.set(resolve("gemini", `${theme.id}.json`), "gemini");
  expectedOutputs.set(resolve("codex", `${theme.id}.tmTheme`), "codex");
}

expectedOutputs.set(resolve("zed", ZED_EXTENSION_BUNDLE), "zed-bundle");
expectedOutputs.set(resolve("zed-extension", "themes", ZED_EXTENSION_BUNDLE), "zed-extension");

for (const theme of themeCatalog) {
  const vscodeThemePath = resolve("themes", `${theme.id}-color-theme.json`);
  const zedThemePath = resolve("zed", `${theme.id}-theme.json`);
  const openCodeThemePath = resolve("opencode", `${theme.id}.json`);
  const geminiThemePath = resolve("gemini", `${theme.id}.json`);
  const codexThemePath = resolve("codex", `${theme.id}.tmTheme`);

  for (const path of [vscodeThemePath, zedThemePath, openCodeThemePath, geminiThemePath, codexThemePath]) {
    mkdirSync(dirname(path), { recursive: true });
  }

  await Bun.write(vscodeThemePath, `${JSON.stringify(buildTheme(theme), null, 2)}\n`);
  await Bun.write(zedThemePath, `${JSON.stringify(buildZedTheme(theme), null, 2)}\n`);
  await Bun.write(openCodeThemePath, `${JSON.stringify(buildOpenCodeTheme(theme), null, 2)}\n`);
  await Bun.write(geminiThemePath, `${JSON.stringify(buildGeminiTheme(theme), null, 2)}\n`);
  await Bun.write(codexThemePath, `${buildCodexTheme(theme)}\n`);

  console.log(`Generated ${theme.id}`);
}

const zedBundle = buildZedExtensionBundle(themeCatalog);
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

for (const dir of outputDirs) {
  mkdirSync(dir, { recursive: true });
  for (const fileName of readdirSync(dir)) {
    const filePath = resolve(dir, fileName);
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
