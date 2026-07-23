import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { themeCatalog, buildZedTheme, getThemeById } from "../src/index.ts";
import { HERO_THEME_IDS } from "../src/references/hero-themes.ts";
import { relativeLuminance } from "../src/surfaces.ts";
import {
  validateZedExtensionDir,
  ZED_EXTENSION_BUNDLE
} from "./lib/validate-zed.ts";

const rootDir = resolve(".");

const failures: string[] = [];

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    failures.push(message);
  }
};

const vscodeThemesDir = resolve(rootDir, "themes");
const vscodeThemeFiles = readdirSync(vscodeThemesDir).filter((name) => name.endsWith("-color-theme.json"));
assert(vscodeThemeFiles.length === 94, `Expected 94 VS Code themes, found ${vscodeThemeFiles.length}`);

const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8")) as {
  name: string;
  version: string;
  contributes: { themes: Array<{ label: string; path: string }> };
};

assert(packageJson.name === "nvchad-themes", "package.json name should be nvchad-themes");
assert(packageJson.contributes.themes.length === 94, "package.json should contribute 94 themes");

const vsixName = `${packageJson.name}-${packageJson.version}.vsix`;
const vsixPath = existsSync(resolve(rootDir, "dist", vsixName))
  ? resolve(rootDir, "dist", vsixName)
  : resolve(rootDir, vsixName);
if (existsSync(vsixPath)) {
  const list = Bun.spawnSync({ cmd: ["unzip", "-l", vsixPath], stdout: "pipe" });
  const output = list.stdout.toString();
  const themeCount = (output.match(/color-theme\.json/g) ?? []).length;
  assert(themeCount === 94, `VSIX should contain 94 color themes, found ${themeCount}`);
} else {
  failures.push(`VSIX not found at ${vsixPath}. Run bun run package first.`);
}

const zedValidation = validateZedExtensionDir(resolve(rootDir, "zed-extension"));
if (!zedValidation.ok) {
  failures.push(...zedValidation.errors);
}

const zedExtensionThemeFiles = readdirSync(resolve(rootDir, "zed-extension", "themes"));
assert(
  zedExtensionThemeFiles.length === 1 && zedExtensionThemeFiles[0] === ZED_EXTENSION_BUNDLE,
  `Zed extension themes dir should contain only ${ZED_EXTENSION_BUNDLE}, found ${zedExtensionThemeFiles.join(", ")}`
);

const zedBundlePath = resolve(rootDir, "zed", ZED_EXTENSION_BUNDLE);
assert(existsSync(zedBundlePath), "Local Zed bundle missing at zed/nvchad-themes.json");

for (const platform of ["opencode", "gemini", "codex"] as const) {
  const dir = resolve(rootDir, platform);
  const files = readdirSync(dir);
  assert(files.length === 94, `Expected 94 ${platform} outputs, found ${files.length}`);
}

const distDir = resolve(rootDir, "dist");
const zedZipName = `${packageJson.name}-zed-extension-${packageJson.version}.zip`;
const zedUserName = `${packageJson.name}-zed-user-${packageJson.version}.json`;
assert(existsSync(resolve(distDir, zedZipName)), `Missing Zed extension zip at dist/${zedZipName}. Run bun run package.`);
assert(existsSync(resolve(distDir, zedUserName)), `Missing Zed user theme at dist/${zedUserName}. Run bun run package.`);
assert(existsSync(resolve(distDir, "INSTALL.md")), "Missing dist/INSTALL.md. Run bun run package.");
assert(existsSync(resolve(distDir, "checksums.sha256")), "Missing dist/checksums.sha256. Run bun run package.");

for (const id of HERO_THEME_IDS) {
  const theme = getThemeById(id);
  if (!theme) {
    failures.push(`Hero theme missing from catalog: ${id}`);
    continue;
  }
  const style = buildZedTheme(theme).themes[0]!.style as Record<string, string | null>;
  const panelIndent = style["panel.indent_guide"];
  const panelIndentActive = style["panel.indent_guide_active"];
  if (typeof panelIndent === "string" && typeof panelIndentActive === "string" && theme.type === "dark") {
    const step = relativeLuminance(panelIndentActive) - relativeLuminance(panelIndent);
    if (step < 0.04) {
      failures.push(
        `Hero ${id}: panel.indent_guide_active should be brighter than panel.indent_guide (explorer depth)`
      );
    }
  }
  if (id === "kanagawa") {
    if (style["tab.active_background"] !== style["editor.background"]) {
      failures.push("Hero kanagawa: flat-editor tab.active_background must equal editor.background");
    }
    if (style["ghost_element.background"] !== null) {
      failures.push("Hero kanagawa: ghost_element.background must be null");
    }
  }
}

if (failures.length > 0) {
  console.error("Verification failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("All extension verifications passed:");
console.log("- VS Code/Cursor: 94 themes in package.json and themes/");
console.log("- VSIX: 94 color themes packaged");
console.log(`- Zed: dev extension with ${themeCatalog.length} variants in ${ZED_EXTENSION_BUNDLE}`);
console.log("- Zed distribution: dist zip + user theme JSON");
console.log("- dist/: VSIX, Zed zip, user theme JSON, INSTALL.md, checksums");
