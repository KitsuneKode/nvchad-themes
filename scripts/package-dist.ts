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
const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8")) as {
  name: string;
  version: string;
  displayName: string;
};

const version = packageJson.version;
const repoUrl = "https://github.com/KitsuneKode/nvchad-themes";
const releaseUrl = `${repoUrl}/releases/latest/download`;
const vsixName = `${packageJson.name}-${version}.vsix`;
const zedExtensionZipName = `${packageJson.name}-zed-extension-${version}.zip`;
const zedUserThemeName = `${packageJson.name}-zed-user-${version}.json`;

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
  ["zip", "-qr", zedExtensionZipPath, "extension.toml", "LICENSE", "README.md", "themes"],
  zedExtensionDir
);

const zedUserThemePath = resolve(distDir, zedUserThemeName);
copyFileSync(resolve(rootDir, "zed", ZED_EXTENSION_BUNDLE), zedUserThemePath);

const installMd = `# NvChad Themes — Install Packages

Version **${version}**. Pre-built files for VS Code, Cursor, and Zed.

**Repository:** ${repoUrl}

No clone or build tools required — download the artifacts below and install.

## Direct downloads (latest release)

| Platform | Release URL |
|----------|-------------|
| VS Code / Cursor | [\`${vsixName}\`](${releaseUrl}/${vsixName}) |
| Zed extension | [\`${zedExtensionZipName}\`](${releaseUrl}/${zedExtensionZipName}) |
| Zed user theme | [\`${zedUserThemeName}\`](${releaseUrl}/${zedUserThemeName}) |

Files in this \`dist/\` folder match the release assets above.

## Try these themes first

| Theme | Zed search | VS Code label |
|-------|------------|---------------|
| NvChad Tokyonight | \`tokyonight\` | NvChad Tokyonight |
| NvChad Kanagawa | \`kanagawa\` | NvChad Kanagawa |
| NvChad Nord | \`nord\` | NvChad Nord |
| NvChad Catppuccin | \`catppuccin\` | NvChad Catppuccin |
| NvChad Rxyhn | \`rxyhn\` | NvChad Rxyhn |

## VS Code / Cursor / Devin Desktop

**File:** [\`${vsixName}\`](./${vsixName})

1. Download the \`.vsix\`
2. Command palette → **Extensions: Install from VSIX...**
3. **Preferences: Color Theme** → search **NvChad**

\`\`\`bash
code --install-extension ${vsixName}
cursor --install-extension ${vsixName}
\`\`\`

## Zed — Dev extension (all 94 themes)

**File:** [\`${zedExtensionZipName}\`](./${zedExtensionZipName})

1. Download and extract
2. **zed: install dev extension** → select extracted folder (not the repo root)
3. Theme picker → search **NvChad**

\`\`\`bash
# Optional: verify checksum after download
sha256sum -c checksums.sha256
\`\`\`

## Zed — User theme file

**File:** [\`${zedUserThemeName}\`](./${zedUserThemeName})

Copy to \`~/.config/zed/themes/\` (macOS: \`~/Library/Application Support/Zed/themes/\`).

## Verify

\`\`\`bash
sha256sum -c checksums.sha256
\`\`\`

## Rebuild (contributors only)

Requires [Bun](https://bun.sh):

\`\`\`bash
bun run package
\`\`\`
`;

writeFileSync(resolve(distDir, "INSTALL.md"), installMd);

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
