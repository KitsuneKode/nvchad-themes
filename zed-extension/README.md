# NvChad Themes — Zed Extension

All 94 [NvChad base46](https://github.com/NvChad/base46) themes in one Zed theme extension.

## Screenshots

Real editor screenshots are kept in [`assets/screenshots/zed/`](https://github.com/KitsuneKode/nvchad-themes/tree/main/assets/screenshots/zed/) and synced here via `bun run previews` (see the [capture matrix](https://github.com/KitsuneKode/nvchad-themes/blob/main/assets/screenshots/README.md)).

| Tokyonight | Kanagawa |
| :---: | :---: |
| ![NvChad Tokyonight](../assets/screenshots/zed/tokyonight.png) | ![NvChad Kanagawa](../assets/screenshots/zed/kanagawa.png) |

| Nord | Catppuccin |
| :---: | :---: |
| ![NvChad Nord](../assets/screenshots/zed/nord.png) | ![NvChad Catppuccin](../assets/screenshots/zed/catppuccin.png) |

| Rxyhn | One Dark |
| :---: | :---: |
| ![NvChad Rxyhn](../assets/screenshots/zed/rxyhn.png) | ![NvChad One Dark](../assets/screenshots/zed/onedark.png) |

Hero ids: `tokyonight`, `kanagawa`, `nord`, `catppuccin`, `rxyhn`, `onedark`, `gruvbox`, `everforest`

Regenerate after theme changes (from repo root):

```bash
bun run previews
```

## Install from the Zed Extensions gallery

After the registry PR is merged, open Zed’s Extensions view, search **NvChad Themes**, and choose **Install**. Then open the theme picker and select any **NvChad** variant.

## Install manually (dev extension)

### Download the extension zip

Get the current Zed extension ZIP from [GitHub Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest).

Full steps (automated + manual): [INSTALL.md](https://github.com/KitsuneKode/nvchad-themes/blob/main/INSTALL.md)

1. **Extract** the zip. The folder you pick in Zed must contain **`extension.toml`** at its root:

   ```
   nvchad-themes-zed-extension-<version>/
     extension.toml
     LICENSE
     README.md
      themes/
        nvchad-themes.json    # all 94 variants
      screenshots/
   ```

2. In Zed: **`zed: install dev extension`**
3. Select the **extracted folder** (not `themes/` alone, not the git repo root unless you cloned).
4. **`zed: reload`** or restart Zed.
5. Theme picker → search **NvChad** → e.g. **NvChad Tokyonight**.

Verify checksum:

```bash
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256
sha256sum --ignore-missing -c checksums.sha256
```

### Alternative: user theme JSON only

This is not a dev extension install. Download the single user-theme JSON from [GitHub Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest) and copy that file to:

- Linux: `~/.config/zed/themes/`
- macOS: `~/Library/Application Support/Zed/themes/`

No `extension.toml`, ZIP, or `themes/` folder is needed; Zed watches that directory for JSON theme families.

```bash
bun run install:zed --all   # from a clone
bun run install:zed nord    # single theme
```

## Install (contributors)

```bash
bun run install:zed-dev
```

Then **`zed: install dev extension`** → select **`zed-extension/`** in this repository.

## Project panel & git colors

Zed colors file tree labels by git status when `project_panel.git_colors` is enabled (default):

| Status | Color role |
|--------|------------|
| Normal file | `text.muted` |
| Gitignored | `ignored` (dimmer) |
| Modified | `modified` (yellow/orange) |
| Added / untracked | `created` (green) |

Hero themes **NvChad Tokyonight** and **NvChad Kanagawa** pin chrome values from [zed-tokyo-night](https://github.com/ssaunderss/zed-tokyo-night) and [zed-kanagawa](https://github.com/ethangilmore/zed-kanagawa).

After updating themes: `bun run install:zed-dev` then **`zed: reload`**.

## Layout

```
zed-extension/
  extension.toml          # id = "nvchad-theme"
  LICENSE
  README.md
  screenshots/            # hero PNG previews (bundled in release zip)
  themes/
    nvchad-themes.json    # one family, 94 variants
```

Zed auto-discovers every `.json` in `themes/`. Theme-only extensions need no Rust code.

## Troubleshooting

**Themes not in picker**

- Dev extension path must contain `extension.toml`.
- Run **`zed: reload`** after install.
- Check **`zed: open log`** for JSON parse errors.

**Flat panels / wrong syntax**

- Re-run `bun run build` and reinstall the dev extension.
- Stale bundle is the usual cause.

**Git colors too subtle**

- Confirm **`project_panel.git_colors`**: `true`.
- Use an **NvChad** variant (e.g. NvChad Tokyonight), not a separate Tokyo Night extension.

**Diagnostics**

- `zed: open log`
- `zed --foreground` from a terminal

## Regenerating

```bash
bun run build
bun run previews          # optional: refresh screenshots/
bun run package           # release zip includes themes/ + screenshots/
```

## Publishing

See [Developing Extensions — Publishing](https://zed.dev/docs/extensions/developing-extensions#publishing-your-extension) and the root [PUBLISHING.md](https://github.com/KitsuneKode/nvchad-themes/blob/main/PUBLISHING.md).
