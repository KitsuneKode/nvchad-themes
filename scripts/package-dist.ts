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

run(["bun", "run", "build"]);

// Hero syntax previews for README + Zed extension screenshots (bundled in dist zip)
run(["bun", "run", "scripts/generate-previews.ts", "--heroes-only"]);
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

const installMd = `# NvChad Themes — Install Packages

Version **${version}**. Pre-built files for VS Code, Cursor, and Zed.

**Repository:** ${REPO_URL} · **Latest release:** [${RELEASES_LATEST}](${RELEASES_LATEST})

No clone or build tools required — download the artifacts below and install.

## Direct downloads (latest release)

| Platform | Release URL |
|----------|-------------|
| VS Code / Cursor | [\`${vsixName}\`](${releaseDownloadUrl(vsixName)}) |
| Zed extension | [\`${zedExtensionZipName}\`](${releaseDownloadUrl(zedExtensionZipName)}) |
| Zed user theme | [\`${zedUserThemeName}\`](${releaseDownloadUrl(zedUserThemeName)}) |
| Checksums | [\`checksums.sha256\`](${releaseDownloadUrl("checksums.sha256")}) |

## Try these themes first

| Theme | Zed search | VS Code label |
|-------|------------|---------------|
| NvChad Tokyonight | \`tokyonight\` | NvChad Tokyonight |
| NvChad Kanagawa | \`kanagawa\` | NvChad Kanagawa |
| NvChad Nord | \`nord\` | NvChad Nord |
| NvChad Catppuccin | \`catppuccin\` | NvChad Catppuccin |
| NvChad Rxyhn | \`rxyhn\` | NvChad Rxyhn |

## VS Code / Cursor / Devin Desktop

**File:** [\`${vsixName}\`](${releaseDownloadUrl(vsixName)})

1. Download the \`.vsix\` from the release page
2. Command palette → **Extensions: Install from VSIX...**
3. **Preferences: Color Theme** → search **NvChad**

\`\`\`bash
curl -LO ${releaseDownloadUrl(vsixName)}
code --install-extension ${vsixName}
cursor --install-extension ${vsixName}
\`\`\`

## Zed — Dev extension (all 94 themes, recommended)

**File:** [\`${zedExtensionZipName}\`](${releaseDownloadUrl(zedExtensionZipName)})

1. Download and extract the zip. You should see \`extension.toml\` at the top level of the extracted folder (along with \`themes/\` and \`screenshots/\`).
2. In Zed: **zed: install dev extension**
3. Select the **extracted folder** — the one that contains \`extension.toml\`, not the repo root and not only \`themes/\`.
4. Run **zed: reload** (or restart Zed).
5. Open the theme picker and search **NvChad** (e.g. **NvChad Tokyonight**, **NvChad Kanagawa**).

The project panel colors git status: modified files use yellow/orange labels, gitignored paths are dimmer than normal files. Ensure \`project_panel.git_colors\` is \`true\` in Zed settings (default).

\`\`\`bash
curl -LO ${releaseDownloadUrl(zedExtensionZipName)}
curl -LO ${releaseDownloadUrl("checksums.sha256")}
unzip ${zedExtensionZipName}
sha256sum -c checksums.sha256
\`\`\`

**From a git clone (contributors):**

\`\`\`bash
bun run install:zed-dev
# Zed: zed: install dev extension → select zed-extension/ in this repo
\`\`\`

## Zed — User theme file

**File:** [\`${zedUserThemeName}\`](${releaseDownloadUrl(zedUserThemeName)})

Copy to \`~/.config/zed/themes/\` (macOS: \`~/Library/Application Support/Zed/themes/\`).

## Verify

\`\`\`bash
curl -LO ${releaseDownloadUrl("checksums.sha256")}
curl -LO ${releaseDownloadUrl(vsixName)}
curl -LO ${releaseDownloadUrl(zedExtensionZipName)}
curl -LO ${releaseDownloadUrl(zedUserThemeName)}
sha256sum -c checksums.sha256
\`\`\`

## Rebuild (contributors only)

Requires [Bun](https://bun.sh):

\`\`\`bash
bun run package
\`\`\`
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
