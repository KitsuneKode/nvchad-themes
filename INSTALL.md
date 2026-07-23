# NvChad Themes — Install Guide

Version **1.0.2**. All **94** NvChad base46 themes.

**Repository:** https://github.com/KitsuneKode/nvchad-themes · **Latest release:** [https://github.com/KitsuneKode/nvchad-themes/releases/latest](https://github.com/KitsuneKode/nvchad-themes/releases/latest)

Each platform below has a clear user install path. Zed has two different manual options: install the whole `zed-extension/` folder as a dev extension, or copy one generated JSON file into Zed’s themes directory. The gallery path applies after the registry PR is merged.

## What is on GitHub Releases vs repo only

| Platform | What you install | Source |
|----------|----------------|-----------------|
| VS Code / Cursor | Yes — `.vsix` | [Latest release](https://github.com/KitsuneKode/nvchad-themes/releases/latest) |
| Zed (published extension) | After registry publication | [Zed Extensions gallery](https://zed.dev/extensions) |
| Zed (manual dev extension) | The complete extension folder, with `extension.toml` | [Latest release ZIP](https://github.com/KitsuneKode/nvchad-themes/releases/latest) or cloned repo `zed-extension/` |
| Zed (user theme) | One JSON file copied into Zed’s themes folder | [Latest user JSON](https://github.com/KitsuneKode/nvchad-themes/releases/latest) |
| OpenCode | No — use repo | [`opencode/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/opencode) |
| Gemini CLI | No — use repo | [`gemini/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/gemini) |
| Codex | No — use repo | [`codex/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/codex) |

Release checksums: [`checksums.sha256`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256)

## Try these themes first

| Theme | ID | Zed search | VS Code label |
|-------|-----|------------|---------------|
| Tokyonight | `tokyonight` | `tokyonight` | NvChad Tokyonight |
| Kanagawa | `kanagawa` | `kanagawa` | NvChad Kanagawa |
| Nord | `nord` | `nord` | NvChad Nord |
| Catppuccin | `catppuccin` | `catppuccin` | NvChad Catppuccin |
| Rxyhn | `rxyhn` | `rxyhn` | NvChad Rxyhn |

Replace `nord` in the CLI examples below with any theme ID from the [full list](https://github.com/KitsuneKode/nvchad-themes#theme-list).

---

## VS Code / Cursor / Devin Desktop

### Automated (release + CLI)

```bash
gh release download --repo KitsuneKode/nvchad-themes --pattern 'nvchad-themes-*.vsix'
code --install-extension nvchad-themes-1.0.2.vsix
cursor --install-extension nvchad-themes-1.0.2.vsix
```

The downloaded `.vsix` can stay in your current folder. The editor **extracts** it into its extensions directory — you do not need to copy the VSIX there manually.

| Editor | Installed extension (Linux) |
|--------|-----------------------------|
| Cursor | `~/.cursor/extensions/kitsunekode.nvchad-themes-1.0.2/` |
| VS Code | `~/.vscode/extensions/kitsunekode.nvchad-themes-1.0.2/` |

macOS uses the same paths under your home directory. After install: **Preferences: Color Theme** → search **NvChad**.

### Manual (GUI)

1. Download the VSIX from the [latest release](https://github.com/KitsuneKode/nvchad-themes/releases/latest).
2. Command palette → **Extensions: Install from VSIX...** → select the file.
3. **Preferences: Color Theme** → search **NvChad** → pick a variant (e.g. **NvChad Tokyonight**).
4. Reload the window if themes do not appear.

---

## Zed — Published extension (after registry publication)

Open Zed’s Extensions view, search **NvChad Themes**, and choose **Install**. Then open the theme picker and select any **NvChad** variant.

Until the registry PR is merged, use the manual dev-extension path below.

## Zed — Dev extension fallback (all 94 themes)

This installs the complete Zed extension bundle. Select the folder containing `extension.toml`; do not select a single theme JSON or the `themes/` subfolder.

### From the latest release

```bash
gh release download --repo KitsuneKode/nvchad-themes --pattern 'nvchad-themes-zed-extension-*.zip'
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256
mkdir -p nvchad-themes-zed-extension-1.0.2
unzip nvchad-themes-zed-extension-1.0.2.zip -d nvchad-themes-zed-extension-1.0.2
sha256sum --ignore-missing -c checksums.sha256
```

Then in Zed: **zed: install dev extension** → select the extracted folder containing `extension.toml` → **zed: reload** → theme picker → **NvChad**.

### Manual (GUI)

1. Download the Zed extension ZIP from the [latest release](https://github.com/KitsuneKode/nvchad-themes/releases/latest) and extract it.
2. Confirm the folder layout:

   ```
   nvchad-themes-zed-extension-1.0.2/
     extension.toml
     themes/
       nvchad-themes.json
     screenshots/
   ```

3. **zed: install dev extension** → select that extracted folder (not `themes/` alone and not a JSON file).
4. **zed: reload** → search **NvChad** in the theme picker.

Git status colors in the project panel need `project_panel.git_colors`: `true` (default).

### From a git clone (contributors)

```bash
git clone https://github.com/KitsuneKode/nvchad-themes.git
cd nvchad-themes
bun install
bun run install:zed-dev
# Zed: zed: install dev extension → select zed-extension/
```

---

## Zed — User theme file (no extension.toml)

This is the lightweight alternative. It installs theme data directly and does not install a Zed extension. The release JSON contains all 94 variants; copy that one file into Zed’s themes directory.

### Automated (release + CLI)

```bash
gh release download --repo KitsuneKode/nvchad-themes --pattern 'nvchad-themes-zed-user-*.json'
mkdir -p ~/.config/zed/themes
cp nvchad-themes-zed-user-1.0.2.json ~/.config/zed/themes/
```

macOS: `~/Library/Application Support/Zed/themes/`

### Manual (GUI/download)

1. Download the user theme JSON from the [latest release](https://github.com/KitsuneKode/nvchad-themes/releases/latest).
2. Copy that single JSON file into `~/.config/zed/themes/` (macOS path above). Do not copy the ZIP or the `zed-extension/` directory here.
3. Restart Zed or **zed: reload** → pick an **NvChad** variant.

### From a git clone

```bash
bun run install:zed --all      # all 94 variants in one JSON
bun run install:zed nord       # single-theme JSON only
```

---

## OpenCode (repo only — not a release asset)

Theme files live in [`opencode/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/opencode) (`opencode/<id>.json`, 94 themes).

### Automated (clone + install script)

```bash
git clone https://github.com/KitsuneKode/nvchad-themes.git
cd nvchad-themes
bun install
bun run install:opencode nord
```

Installs to `~/.config/opencode/themes/nord.json`. Repeat with another ID or install multiple files manually.

### Manual (download from repo, no Bun)

```bash
mkdir -p ~/.config/opencode/themes
curl -fsSL -o ~/.config/opencode/themes/nord.json \
  https://raw.githubusercontent.com/KitsuneKode/nvchad-themes/main/opencode/nord.json
```

Browse all themes: [opencode folder on GitHub](https://github.com/KitsuneKode/nvchad-themes/tree/main/opencode). Select the theme in OpenCode's theme settings.

---

## Gemini CLI (repo only — not a release asset)

Theme files live in [`gemini/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/gemini) (`gemini/<id>.json`).

### Automated (clone + install script)

```bash
git clone https://github.com/KitsuneKode/nvchad-themes.git
cd nvchad-themes
bun install
bun run install:gemini nord
```

Copies the theme to `~/.gemini/themes/` and updates `~/.gemini/settings.json` (`ui.theme` + `ui.customThemes`).

### Manual (download from repo, no Bun)

```bash
mkdir -p ~/.gemini/themes
curl -fsSL -o ~/.gemini/themes/nord.json \
  https://raw.githubusercontent.com/KitsuneKode/nvchad-themes/main/gemini/nord.json
```

Then edit `~/.gemini/settings.json`:

```json
{
  "ui": {
    "theme": "NvChad Nord",
    "customThemes": {
      "NvChad Nord": { }
    }
  }
}
```

Paste the full contents of `nord.json` as the value for `"NvChad Nord"` (the `name` field inside the file). Browse themes: [gemini folder on GitHub](https://github.com/KitsuneKode/nvchad-themes/tree/main/gemini).

---

## Codex (repo only — not a release asset)

Theme files live in [`codex/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/codex) (`codex/<id>.tmTheme`).

### Automated (clone + install script)

```bash
git clone https://github.com/KitsuneKode/nvchad-themes.git
cd nvchad-themes
bun install
bun run install:codex nord
```

Copies to `~/.codex/themes/nord.tmTheme` and sets `theme = "nord"` under `[tui]` in `~/.codex/config.toml` (backs up existing config).

### Manual (download from repo, no Bun)

```bash
mkdir -p ~/.codex/themes
curl -fsSL -o ~/.codex/themes/nord.tmTheme \
  https://raw.githubusercontent.com/KitsuneKode/nvchad-themes/main/codex/nord.tmTheme
```

Add or update `~/.codex/config.toml`:

```toml
[tui]
theme = "nord"
```

Use the filename stem (`nord`, not the display name) as the theme value. Browse themes: [codex folder on GitHub](https://github.com/KitsuneKode/nvchad-themes/tree/main/codex).

---

## Verify release downloads

```bash
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256
gh release download --repo KitsuneKode/nvchad-themes --pattern 'nvchad-themes-*.vsix'
gh release download --repo KitsuneKode/nvchad-themes --pattern 'nvchad-themes-zed-extension-*.zip'
gh release download --repo KitsuneKode/nvchad-themes --pattern 'nvchad-themes-zed-user-*.json'
sha256sum -c checksums.sha256
```

## Rebuild release artifacts (contributors)

Requires [Bun](https://bun.sh). `dist/` is gitignored — rebuild locally or push a `v*` tag for CI to publish.

```bash
# bump package.json + zed-extension/extension.toml version first
bun run build
bun run previews:nvchad   # optional: assets/previews/nvchad-official/*.webp
bun run previews
bun run package           # dist/nvchad-themes-<version>.{vsix,zip,json} + INSTALL.md
bun run verify

git tag vX.Y.Z
git push origin vX.Y.Z    # Release workflow uploads dist/* to GitHub
```

PR builds: download the `nvchad-themes-dist` artifact from GitHub Actions (same files as `dist/`).
