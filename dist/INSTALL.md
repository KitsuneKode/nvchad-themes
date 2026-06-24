# NvChad Themes — Install Packages

Version **1.0.0**. Pre-built files for VS Code, Cursor, and Zed.

**Repository:** https://github.com/KitsuneKode/nvchad-themes

No clone or build tools required — download the artifacts below and install.

## Direct downloads (latest release)

| Platform | Release URL |
|----------|-------------|
| VS Code / Cursor | [`nvchad-themes-1.0.0.vsix`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.0.vsix) |
| Zed extension | [`nvchad-themes-zed-extension-1.0.0.zip`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.0.zip) |
| Zed user theme | [`nvchad-themes-zed-user-1.0.0.json`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.0.json) |

Files in this `dist/` folder match the release assets above.

## Try these themes first

| Theme | Zed search | VS Code label |
|-------|------------|---------------|
| NvChad Tokyonight | `tokyonight` | NvChad Tokyonight |
| NvChad Kanagawa | `kanagawa` | NvChad Kanagawa |
| NvChad Nord | `nord` | NvChad Nord |
| NvChad Catppuccin | `catppuccin` | NvChad Catppuccin |
| NvChad Rxyhn | `rxyhn` | NvChad Rxyhn |

## VS Code / Cursor / Devin Desktop

**File:** [`nvchad-themes-1.0.0.vsix`](./nvchad-themes-1.0.0.vsix)

1. Download the `.vsix`
2. Command palette → **Extensions: Install from VSIX...**
3. **Preferences: Color Theme** → search **NvChad**

```bash
code --install-extension nvchad-themes-1.0.0.vsix
cursor --install-extension nvchad-themes-1.0.0.vsix
```

## Zed — Dev extension (all 94 themes, recommended)

**File:** [`nvchad-themes-zed-extension-1.0.0.zip`](./nvchad-themes-zed-extension-1.0.0.zip)

1. Download and extract the zip. You should see `extension.toml` at the top level of the extracted folder (along with `themes/` and `screenshots/`).
2. In Zed: **zed: install dev extension**
3. Select the **extracted folder** — the one that contains `extension.toml`, not the repo root and not only `themes/`.
4. Run **zed: reload** (or restart Zed).
5. Open the theme picker and search **NvChad** (e.g. **NvChad Tokyonight**, **NvChad Kanagawa**).

The project panel colors git status: modified files use yellow/orange labels, gitignored paths are dimmer than normal files. Ensure `project_panel.git_colors` is `true` in Zed settings (default).

```bash
unzip nvchad-themes-zed-extension-1.0.0.zip
# → cd into the folder that contains extension.toml
sha256sum -c checksums.sha256
```

**From a git clone (contributors):**

```bash
bun run install:zed-dev
# Zed: zed: install dev extension → select zed-extension/ in this repo
```

## Zed — User theme file

**File:** [`nvchad-themes-zed-user-1.0.0.json`](./nvchad-themes-zed-user-1.0.0.json)

Copy to `~/.config/zed/themes/` (macOS: `~/Library/Application Support/Zed/themes/`).

## Verify

```bash
sha256sum -c checksums.sha256
```

## Rebuild (contributors only)

Requires [Bun](https://bun.sh):

```bash
bun run package
```
