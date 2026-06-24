# NvChad Themes — Install Guide

Version **1.0.1**. All **94** NvChad base46 themes.

**Repository:** https://github.com/KitsuneKode/nvchad-themes · **Latest release:** [https://github.com/KitsuneKode/nvchad-themes/releases/latest](https://github.com/KitsuneKode/nvchad-themes/releases/latest)

Each platform below has **automated** steps (download + one command) and **manual** steps (GUI or copy files yourself).

## What is on GitHub Releases vs repo only

| Platform | Release asset? | Where to get it |
|----------|----------------|-----------------|
| VS Code / Cursor | Yes — `.vsix` | [Release download](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.1.vsix) |
| Zed (extension) | Yes — `.zip` | [Release download](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.1.zip) |
| Zed (user JSON) | Yes — `.json` | [Release download](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.1.json) |
| OpenCode | No — use repo | [`opencode/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/opencode) or [raw files](https://raw.githubusercontent.com/KitsuneKode/nvchad-themes/main/opencode) |
| Gemini CLI | No — use repo | [`gemini/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/gemini) or [raw files](https://raw.githubusercontent.com/KitsuneKode/nvchad-themes/main/gemini) |
| Codex | No — use repo | [`codex/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/codex) or [raw files](https://raw.githubusercontent.com/KitsuneKode/nvchad-themes/main/codex) |

Release checksums: [`checksums.sha256`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256)

## Try these themes first

| Theme | ID | Zed search | VS Code label |
|-------|-----|------------|---------------|
| Tokyonight | `tokyonight` | `tokyonight` | NvChad Tokyonight |
| Kanagawa | `kanagawa` | `kanagawa` | NvChad Kanagawa |
| Nord | `nord` | `nord` | NvChad Nord |
| Catppuccin | `catppuccin` | `catppuccin` | NvChad Catppuccin |
| Rxyhn | `rxyhn` | `rxyhn` | NvChad Rxyhn |

Replace `nord` in the CLI examples below with any theme ID from the [full list](https://github.com/KitsuneKode/nvchad-themes#full-theme-list).

---

## VS Code / Cursor / Devin Desktop

### Automated (release + CLI)

```bash
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.1.vsix
code --install-extension nvchad-themes-1.0.1.vsix
cursor --install-extension nvchad-themes-1.0.1.vsix
```

The downloaded `.vsix` can stay wherever you saved it. Cursor/VS Code extract the extension into:

| Editor | Installed extension (Linux) |
|--------|-----------------------------|
| **Cursor** | `~/.cursor/extensions/kitsunekode.nvchad-themes-1.0.1/` |
| **VS Code** | `~/.vscode/extensions/kitsunekode.nvchad-themes-1.0.1/` |

Same paths under your home directory on macOS. Then **Preferences: Color Theme** → search **NvChad**.

### Manual (GUI)

1. Download [`nvchad-themes-1.0.1.vsix`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.1.vsix) from the release page.
2. Command palette → **Extensions: Install from VSIX...** → select the file.
3. **Preferences: Color Theme** → search **NvChad** → pick a variant (e.g. **NvChad Tokyonight**).
4. Reload the window if themes do not appear.

---

## Zed — Dev extension (all 94 themes, recommended)

### Automated (release + CLI)

```bash
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.1.zip
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256
unzip nvchad-themes-zed-extension-1.0.1.zip
sha256sum -c checksums.sha256
```

Then in Zed: **zed: install dev extension** → select the **extracted folder** (must contain `extension.toml`) → **zed: reload** → theme picker → **NvChad**.

### Manual (GUI)

1. Download [`nvchad-themes-zed-extension-1.0.1.zip`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.1.zip) and extract it.
2. Confirm the folder layout:

   ```
   nvchad-themes-zed-extension-1.0.1/
     extension.toml
     themes/
       nvchad-themes.json
     screenshots/
   ```

3. **zed: install dev extension** → select that folder (not `themes/` alone).
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

### Automated (release + CLI)

```bash
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.1.json
mkdir -p ~/.config/zed/themes
cp nvchad-themes-zed-user-1.0.1.json ~/.config/zed/themes/
```

macOS: `~/Library/Application Support/Zed/themes/`

### Manual

1. Download [`nvchad-themes-zed-user-1.0.1.json`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.1.json).
2. Copy into `~/.config/zed/themes/` (macOS path above).
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
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.1.vsix
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.1.zip
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.1.json
sha256sum -c checksums.sha256
```

## Rebuild release artifacts (contributors)

Requires [Bun](https://bun.sh). `dist/` is gitignored — rebuild locally or push a `v*` tag for CI to publish.

```bash
# bump package.json + zed-extension/extension.toml version first
bun run build
bun run previews:nvchad   # optional: assets/previews/nvchad-official/*.webp
bun run previews
bun run package           # dist/nvchad-themes-<version>.* + INSTALL.md
bun run verify

git tag vX.Y.Z
git push origin vX.Y.Z    # Release workflow uploads dist/* to GitHub
```

PR builds: download the `nvchad-themes-dist` artifact from GitHub Actions (same files as `dist/`).
