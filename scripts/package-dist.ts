import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import {
  artifactNames,
  readPackageMeta,
  releaseDownloadUrl,
  rawRepoFile,
  REPO_URL,
  RELEASES_LATEST
} from "./lib/release-urls.ts";
import { validateZedExtensionDir, ZED_EXTENSION_BUNDLE } from "./lib/validate-zed.ts";

const run = (cmd: string[], cwd = resolve(".")) => {
  const result = Bun.spawnSync({
    cmd,
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    env: process.env
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode ?? 1);
  }
};

const rootDir = resolve(".");
const distDir = resolve(rootDir, "dist");
const packageJson = readPackageMeta(rootDir);

const version = packageJson.version;
const { vsix: vsixName, zedExtensionZip: zedExtensionZipName, zedUserTheme: zedUserThemeName } =
  artifactNames(version, packageJson.name);

const hashFile = (filePath: string): string => {
  const hash = createHash("sha256");
  hash.update(readFileSync(filePath));
  return hash.digest("hex");
};

const packageVsix = () => {
  const tempDir = mkdtempSync(resolve(tmpdir(), "nvchad-themes-"));
  const unpackDir = resolve(tempDir, "vsix");
  const extensionDir = resolve(unpackDir, "extension");
  const vsixPath = resolve(rootDir, vsixName);

  run(["bunx", "@vscode/vsce", "package", "--allow-missing-repository"]);

  mkdirSync(extensionDir, { recursive: true });
  run(["unzip", "-oq", vsixPath, "-d", unpackDir]);

  for (const entry of readdirSync(extensionDir)) {
    rmSync(resolve(extensionDir, entry), { recursive: true, force: true });
  }

  copyFileSync(resolve(rootDir, "package.json"), resolve(extensionDir, "package.json"));
  copyFileSync(resolve(rootDir, "README.md"), resolve(extensionDir, "readme.md"));
  copyFileSync(resolve(rootDir, "LICENSE"), resolve(extensionDir, "LICENSE"));
  cpSync(resolve(rootDir, "themes"), resolve(extensionDir, "themes"), { recursive: true });
  const iconPath = resolve(rootDir, "assets", "icon.png");
  if (existsSync(iconPath)) {
    mkdirSync(resolve(extensionDir, "assets"), { recursive: true });
    copyFileSync(iconPath, resolve(extensionDir, "assets", "icon.png"));
  }

  const rebuiltVsixPath = resolve(tempDir, vsixName);
  run(["zip", "-qr", rebuiltVsixPath, "[Content_Types].xml", "extension.vsixmanifest", "extension"], unpackDir);
  rmSync(resolve(rootDir, vsixName), { force: true });

  return { rebuiltVsixPath, tempDir };
};

mkdirSync(distDir, { recursive: true });

const currentArtifacts = new Set([vsixName, zedExtensionZipName, zedUserThemeName]);
for (const entry of readdirSync(distDir)) {
  if (!/^nvchad-themes/.test(entry) || currentArtifacts.has(entry)) {
    continue;
  }
  if (/\.(vsix|zip|json)$/.test(entry)) {
    rmSync(resolve(distDir, entry), { force: true });
    console.log(`Removed stale dist artifact: ${entry}`);
  }
}

for (const entry of readdirSync(rootDir)) {
  if (/^nvchad.*\.vsix$/.test(entry) && entry !== vsixName) {
    rmSync(resolve(rootDir, entry), { force: true });
    console.log(`Removed stray VSIX at repo root: ${entry}`);
  }
}

run(["bun", "run", "build"]);

// Hero previews: manual Zed screenshots + syntax fallbacks (bundled in dist zip)
run(["bun", "run", "scripts/generate-previews.ts", "--heroes-only"]);
run(["bun", "run", "scripts/sync-editor-screenshots.ts"]);
run(["bun", "run", "scripts/render-preview-raster.ts"]);

const zedExtensionDir = resolve(rootDir, "zed-extension");
const zedValidation = validateZedExtensionDir(zedExtensionDir);
if (!zedValidation.ok) {
  console.error("Zed extension validation failed:");
  for (const error of zedValidation.errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

const { rebuiltVsixPath, tempDir } = packageVsix();
const distVsixPath = resolve(distDir, vsixName);
copyFileSync(rebuiltVsixPath, distVsixPath);
rmSync(tempDir, { recursive: true, force: true });

const zedExtensionZipPath = resolve(distDir, zedExtensionZipName);
run(
  ["zip", "-qr", zedExtensionZipPath, "extension.toml", "LICENSE", "README.md", "themes", "screenshots"],
  zedExtensionDir
);

const zedUserThemePath = resolve(distDir, zedUserThemeName);
copyFileSync(resolve(rootDir, "zed", ZED_EXTENSION_BUNDLE), zedUserThemePath);

const installMd = `# NvChad Themes — Install Guide

Version **${version}**. All **94** NvChad base46 themes.

**Repository:** ${REPO_URL} · **Latest release:** [${RELEASES_LATEST}](${RELEASES_LATEST})

Each platform below has **automated** steps (download + one command) and **manual** steps (GUI or copy files yourself).

## What is on GitHub Releases vs repo only

| Platform | Release asset? | Where to get it |
|----------|----------------|-----------------|
| VS Code / Cursor | Yes — \`.vsix\` | [Release download](${releaseDownloadUrl(vsixName)}) |
| Zed (extension) | Yes — \`.zip\` | [Release download](${releaseDownloadUrl(zedExtensionZipName)}) |
| Zed (user JSON) | Yes — \`.json\` | [Release download](${releaseDownloadUrl(zedUserThemeName)}) |
| OpenCode | No — use repo | [\`opencode/\`](${REPO_URL}/tree/main/opencode) or [raw files](${rawRepoFile("opencode")}) |
| Gemini CLI | No — use repo | [\`gemini/\`](${REPO_URL}/tree/main/gemini) or [raw files](${rawRepoFile("gemini")}) |
| Codex | No — use repo | [\`codex/\`](${REPO_URL}/tree/main/codex) or [raw files](${rawRepoFile("codex")}) |

Release checksums: [\`checksums.sha256\`](${releaseDownloadUrl("checksums.sha256")})

## Try these themes first

| Theme | ID | Zed search | VS Code label |
|-------|-----|------------|---------------|
| Tokyonight | \`tokyonight\` | \`tokyonight\` | NvChad Tokyonight |
| Kanagawa | \`kanagawa\` | \`kanagawa\` | NvChad Kanagawa |
| Nord | \`nord\` | \`nord\` | NvChad Nord |
| Catppuccin | \`catppuccin\` | \`catppuccin\` | NvChad Catppuccin |
| Rxyhn | \`rxyhn\` | \`rxyhn\` | NvChad Rxyhn |

Replace \`nord\` in the CLI examples below with any theme ID from the [full list](${REPO_URL}#full-theme-list).

---

## VS Code / Cursor / Devin Desktop

### Automated (release + CLI)

\`\`\`bash
curl -LO ${releaseDownloadUrl(vsixName)}
code --install-extension ${vsixName}
cursor --install-extension ${vsixName}
\`\`\`

The downloaded \`.vsix\` can stay in your current folder. The editor **extracts** it into its extensions directory — you do not need to copy the VSIX there manually.

| Editor | Installed extension (Linux) |
|--------|-----------------------------|
| Cursor | \`~/.cursor/extensions/kitsunekode.nvchad-themes-${version}/\` |
| VS Code | \`~/.vscode/extensions/kitsunekode.nvchad-themes-${version}/\` |

macOS uses the same paths under your home directory. After install: **Preferences: Color Theme** → search **NvChad**.

### Manual (GUI)

1. Download [\`${vsixName}\`](${releaseDownloadUrl(vsixName)}) from the release page.
2. Command palette → **Extensions: Install from VSIX...** → select the file.
3. **Preferences: Color Theme** → search **NvChad** → pick a variant (e.g. **NvChad Tokyonight**).
4. Reload the window if themes do not appear.

---

## Zed — Dev extension (all 94 themes, recommended)

### Automated (release + CLI)

\`\`\`bash
curl -LO ${releaseDownloadUrl(zedExtensionZipName)}
curl -LO ${releaseDownloadUrl("checksums.sha256")}
unzip ${zedExtensionZipName}
sha256sum -c checksums.sha256
\`\`\`

Then in Zed: **zed: install dev extension** → select the **extracted folder** (must contain \`extension.toml\`) → **zed: reload** → theme picker → **NvChad**.

### Manual (GUI)

1. Download [\`${zedExtensionZipName}\`](${releaseDownloadUrl(zedExtensionZipName)}) and extract it.
2. Confirm the folder layout:

   \`\`\`
   nvchad-themes-zed-extension-${version}/
     extension.toml
     themes/
       nvchad-themes.json
     screenshots/
   \`\`\`

3. **zed: install dev extension** → select that folder (not \`themes/\` alone).
4. **zed: reload** → search **NvChad** in the theme picker.

Git status colors in the project panel need \`project_panel.git_colors\`: \`true\` (default).

### From a git clone (contributors)

\`\`\`bash
git clone ${REPO_URL}.git
cd nvchad-themes
bun install
bun run install:zed-dev
# Zed: zed: install dev extension → select zed-extension/
\`\`\`

---

## Zed — User theme file (no extension.toml)

### Automated (release + CLI)

\`\`\`bash
curl -LO ${releaseDownloadUrl(zedUserThemeName)}
mkdir -p ~/.config/zed/themes
cp ${zedUserThemeName} ~/.config/zed/themes/
\`\`\`

macOS: \`~/Library/Application Support/Zed/themes/\`

### Manual

1. Download [\`${zedUserThemeName}\`](${releaseDownloadUrl(zedUserThemeName)}).
2. Copy into \`~/.config/zed/themes/\` (macOS path above).
3. Restart Zed or **zed: reload** → pick an **NvChad** variant.

### From a git clone

\`\`\`bash
bun run install:zed --all      # all 94 variants in one JSON
bun run install:zed nord       # single-theme JSON only
\`\`\`

---

## OpenCode (repo only — not a release asset)

Theme files live in [\`opencode/\`](${REPO_URL}/tree/main/opencode) (\`opencode/<id>.json\`, 94 themes).

### Automated (clone + install script)

\`\`\`bash
git clone ${REPO_URL}.git
cd nvchad-themes
bun install
bun run install:opencode nord
\`\`\`

Installs to \`~/.config/opencode/themes/nord.json\`. Repeat with another ID or install multiple files manually.

### Manual (download from repo, no Bun)

\`\`\`bash
mkdir -p ~/.config/opencode/themes
curl -fsSL -o ~/.config/opencode/themes/nord.json \\
  ${rawRepoFile("opencode/nord.json")}
\`\`\`

Browse all themes: [opencode folder on GitHub](${REPO_URL}/tree/main/opencode). Select the theme in OpenCode's theme settings.

---

## Gemini CLI (repo only — not a release asset)

Theme files live in [\`gemini/\`](${REPO_URL}/tree/main/gemini) (\`gemini/<id>.json\`).

### Automated (clone + install script)

\`\`\`bash
git clone ${REPO_URL}.git
cd nvchad-themes
bun install
bun run install:gemini nord
\`\`\`

Copies the theme to \`~/.gemini/themes/\` and updates \`~/.gemini/settings.json\` (\`ui.theme\` + \`ui.customThemes\`).

### Manual (download from repo, no Bun)

\`\`\`bash
mkdir -p ~/.gemini/themes
curl -fsSL -o ~/.gemini/themes/nord.json \\
  ${rawRepoFile("gemini/nord.json")}
\`\`\`

Then edit \`~/.gemini/settings.json\`:

\`\`\`json
{
  "ui": {
    "theme": "NvChad Nord",
    "customThemes": {
      "NvChad Nord": { }
    }
  }
}
\`\`\`

Paste the full contents of \`nord.json\` as the value for \`"NvChad Nord"\` (the \`name\` field inside the file). Browse themes: [gemini folder on GitHub](${REPO_URL}/tree/main/gemini).

---

## Codex (repo only — not a release asset)

Theme files live in [\`codex/\`](${REPO_URL}/tree/main/codex) (\`codex/<id>.tmTheme\`).

### Automated (clone + install script)

\`\`\`bash
git clone ${REPO_URL}.git
cd nvchad-themes
bun install
bun run install:codex nord
\`\`\`

Copies to \`~/.codex/themes/nord.tmTheme\` and sets \`theme = "nord"\` under \`[tui]\` in \`~/.codex/config.toml\` (backs up existing config).

### Manual (download from repo, no Bun)

\`\`\`bash
mkdir -p ~/.codex/themes
curl -fsSL -o ~/.codex/themes/nord.tmTheme \\
  ${rawRepoFile("codex/nord.tmTheme")}
\`\`\`

Add or update \`~/.codex/config.toml\`:

\`\`\`toml
[tui]
theme = "nord"
\`\`\`

Use the filename stem (\`nord\`, not the display name) as the theme value. Browse themes: [codex folder on GitHub](${REPO_URL}/tree/main/codex).

---

## Verify release downloads

\`\`\`bash
curl -LO ${releaseDownloadUrl("checksums.sha256")}
curl -LO ${releaseDownloadUrl(vsixName)}
curl -LO ${releaseDownloadUrl(zedExtensionZipName)}
curl -LO ${releaseDownloadUrl(zedUserThemeName)}
sha256sum -c checksums.sha256
\`\`\`

## Rebuild release artifacts (contributors)

Requires [Bun](https://bun.sh). \`dist/\` is gitignored — rebuild locally or push a \`v*\` tag for CI to publish.

\`\`\`bash
# bump package.json + zed-extension/extension.toml version first
bun run build
bun run previews:nvchad   # optional: assets/previews/nvchad-official/*.webp
bun run previews
bun run package           # dist/nvchad-themes-<version>.{vsix,zip,json} + INSTALL.md
bun run verify

git tag vX.Y.Z
git push origin vX.Y.Z    # Release workflow uploads dist/* to GitHub
\`\`\`

PR builds: download the \`nvchad-themes-dist\` artifact from GitHub Actions (same files as \`dist/\`).
`;

writeFileSync(resolve(distDir, "INSTALL.md"), installMd);
writeFileSync(resolve(rootDir, "INSTALL.md"), installMd);

const artifacts = [vsixName, zedExtensionZipName, zedUserThemeName];
const checksumLines = artifacts.map((name) => {
  const filePath = resolve(distDir, name);
  return `${hashFile(filePath)}  ${name}`;
});

writeFileSync(resolve(distDir, "checksums.sha256"), `${checksumLines.join("\n")}\n`);

console.log("");
console.log(`Distribution packages written to ${distDir}/`);
for (const name of artifacts) {
  const filePath = resolve(distDir, name);
  const sizeKb = Math.round(statSync(filePath).size / 1024);
  console.log(`  - ${name} (${sizeKb} KB)`);
}
console.log("  - INSTALL.md");
console.log("  - checksums.sha256");
