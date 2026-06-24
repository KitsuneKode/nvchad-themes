# NvChad Themes

**The complete NvChad theme pack for VS Code, Cursor, and Zed.**

All **94** palettes from [NvChad base46](https://github.com/NvChad/base46) v3.0 — Nord, Catppuccin, Tokyo Night, Gruvbox, Poimandres, **Rxyhn**, and every other upstream theme — ported faithfully to modern editors and CLIs.

[![CI](https://github.com/KitsuneKode/nvchad-themes/actions/workflows/ci.yml/badge.svg)](https://github.com/KitsuneKode/nvchad-themes/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/KitsuneKode/nvchad-themes)](https://github.com/KitsuneKode/nvchad-themes/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Downloads

Download from **[GitHub Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest)** — no clone or build tools required.

| Platform | Artifact | Install |
|----------|----------|---------|
| **VS Code / Cursor** | [`nvchad-themes-1.0.1.vsix`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.1.vsix) | Extensions → **Install from VSIX…** |
| **Zed (extension)** | [`nvchad-themes-zed-extension-1.0.1.zip`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.1.zip) | Extract → **`zed: install dev extension`** |
| **Zed (user theme)** | [`nvchad-themes-zed-user-1.0.1.json`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.1.json) | Copy to `~/.config/zed/themes/` |
| **Checksums** | [`checksums.sha256`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/checksums.sha256) | `sha256sum -c checksums.sha256` after download |

Step-by-step: **[INSTALL.md](./INSTALL.md)** · Publishing: **[PUBLISHING.md](./PUBLISHING.md)**

## Previews

Generated from this repo's theme engine (`bun run previews`). Full VS Code gallery: [`assets/gallery/vscode/`](./assets/gallery/vscode/).

| NvChad Tokyonight | NvChad Kanagawa |
| :---: | :---: |
| ![NvChad Tokyonight](./assets/previews/tokyonight.png) | ![NvChad Kanagawa](./assets/previews/kanagawa.png) |

| NvChad Nord | NvChad Catppuccin |
| :---: | :---: |
| ![NvChad Nord](./assets/previews/nord.png) | ![NvChad Catppuccin](./assets/previews/catppuccin.png) |

| NvChad Rxyhn | NvChad One Dark |
| :---: | :---: |
| ![NvChad Rxyhn](./assets/previews/rxyhn.png) | ![NvChad One Dark](./assets/previews/onedark.png) |

## Try these themes first

| Theme | Zed picker | VS Code label |
|-------|------------|---------------|
| **NvChad Tokyonight** | `tokyonight` | NvChad Tokyonight |
| **NvChad Kanagawa** | `kanagawa` | NvChad Kanagawa |
| **NvChad Nord** | `nord` | NvChad Nord |
| **NvChad Catppuccin** | `catppuccin` | NvChad Catppuccin |
| **NvChad Rxyhn** | `rxyhn` | NvChad Rxyhn |

Tokyonight and Kanagawa include Zed project-panel git colors aligned with [zed-tokyo-night](https://github.com/ssaunderss/zed-tokyo-night) and [zed-kanagawa](https://github.com/ethangilmore/zed-kanagawa) (dim gitignored paths, yellow modified files).

## Quick install

### VS Code / Cursor

```bash
curl -LO https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.1.vsix
cursor --install-extension nvchad-themes-1.0.1.vsix
code --install-extension nvchad-themes-1.0.1.vsix
```

**Preferences: Color Theme** → search **NvChad**. Reload the window if themes do not appear.

### Zed (extension — all 94 themes)

1. Download [`nvchad-themes-zed-extension-1.0.1.zip`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.1.zip) and extract it.
2. The folder you select must contain **`extension.toml`** at the top level:

   ```
   nvchad-themes-zed-extension-1.0.1/
     extension.toml
     themes/
       nvchad-themes.json
     screenshots/
   ```

3. **`zed: install dev extension`** → select that extracted folder.
4. **`zed: reload`**
5. Theme picker → **NvChad Tokyonight** (or any NvChad variant).

**From a clone (contributors):**

```bash
bun run install:zed-dev
# Zed: zed: install dev extension → zed-extension/ in this repo
```

Details: [zed-extension/README.md](./zed-extension/README.md)

### Zed (user theme file only)

Download [`nvchad-themes-zed-user-1.0.1.json`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.1.json) and copy to `~/.config/zed/themes/` (macOS: `~/Library/Application Support/Zed/themes/`).

```bash
bun run install:zed --all    # from clone
```

### OpenCode · Gemini CLI · Codex

```bash
bun run install:opencode nord
bun run install:gemini nord
bun run install:codex nord
```

## What's inside

- **74 dark** + **20 light** themes from NvChad base46
- One VSIX with all VS Code color themes
- One Zed extension zip (`extension.toml` + `themes/` + `screenshots/`)
- One Zed user JSON bundle for `~/.config/zed/themes/`
- OpenCode, Gemini CLI, and Codex theme files

<details>
<summary>Full theme list</summary>

**Dark:** `aquarium`, `ashes`, `aylin`, `ayu_dark`, `bearded-arc`, `carbonfox`, `catppuccin`, `chadracula`, `chadracula-evondev`, `chadtain`, `chocolate`, `darcula-dark`, `dark_horizon`, `decay`, `default-dark`, `doomchad`, `eldritch`, `embark`, `everblush`, `everforest`, `falcon`, `flexoki`, `flouromachine`, `gatekeeper`, `github_dark`, `gruvbox`, `gruvchad`, `hiberbee`, `horizon`, `jabuti`, `jellybeans`, `kanagawa`, `kanagawa-dragon`, `material-darker`, `material-deep-ocean`, `melange`, `midnight_breeze`, `mito-laser`, `monekai`, `monochrome`, `mountain`, `neofusion`, `nightfox`, `nightlamp`, `nightowl`, `nord`, `obsidian-ember`, `oceanic-next`, `onedark`, `onenord`, `oxocarbon`, `palenight`, `pastelDark`, `pastelbeans`, `penumbra_dark`, `poimandres`, `radium`, `rosepine`, `rxyhn`, `scaryforest`, `seoul256_dark`, `solarized_dark`, `solarized_osaka`, `starlight`, `sweetpastel`, `tokyodark`, `tokyonight`, `tomorrow_night`, `tundra`, `vesper`, `vscode_dark`, `wombat`, `yoru`, `zenburn`

**Light:** `ayu_light`, `blossom_light`, `catppuccin-latte`, `default-light`, `everforest_light`, `flex-light`, `flexoki-light`, `github_light`, `gruvbox_light`, `material-lighter`, `nano-light`, `oceanic-light`, `one_light`, `onenord_light`, `penumbra_light`, `rosepine-dawn`, `seoul256_light`, `solarized_light`, `sunrise_breeze`, `vscode_light`

</details>

## Development

```bash
bun install
bun run import:base46    # sync palettes from NvChad/base46
bun run build            # regenerate all platform outputs
bun test
bun run previews         # hero PNG/WebP + gallery HTML/SVG
bun run package          # build dist/ locally (VSIX + Zed zip + INSTALL.md)
bun run verify
```

Release artifacts are published via [GitHub Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest) on version tags (`v*`). CI also uploads a `nvchad-themes-dist` artifact on every push for PR testing.

```
src/palettes/       imported base46 JSON
src/derive/         ThemeModel derivation
src/profiles/       hero theme overrides (Tokyo Night, Kanagawa, …)
src/builders/       VS Code, Zed, OpenCode, Gemini, Codex
zed-extension/      Zed dev extension source (bundled into release zip)
```

## Credits

- Palettes: [NvChad/base46](https://github.com/NvChad/base46) (v3.0)
- Zed reference ports: [zed-tokyo-night](https://github.com/ssaunderss/zed-tokyo-night), [zed-kanagawa](https://github.com/ethangilmore/zed-kanagawa)
- Port & multi-editor mapping: [KitsuneKode](https://github.com/KitsuneKode)

## License

MIT — see [LICENSE](./LICENSE).
