# NvChad Themes

**The complete NvChad theme pack for VS Code, Cursor, and Zed.**

All **94** palettes from [NvChad base46](https://github.com/NvChad/base46) v3.0 — Nord, Catppuccin, Tokyo Night, Gruvbox, Poimandres, **Rxyhn**, and every other upstream theme — ported faithfully to modern editors and CLIs.

[![CI](https://github.com/KitsuneKode/nvchad-themes/actions/workflows/ci.yml/badge.svg)](https://github.com/KitsuneKode/nvchad-themes/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Downloads

| Platform | File | Install |
|----------|------|---------|
| **VS Code / Cursor** | [nvchad-themes-1.0.0.vsix](./dist/nvchad-themes-1.0.0.vsix) | Extensions → **Install from VSIX…** |
| **Zed (extension)** | [nvchad-themes-zed-extension-1.0.0.zip](./dist/nvchad-themes-zed-extension-1.0.0.zip) | Extract → **zed: install dev extension** |
| **Zed (user theme)** | [nvchad-themes-zed-user-1.0.0.json](./dist/nvchad-themes-zed-user-1.0.0.json) | Copy to `~/.config/zed/themes/` |

**Latest release:** [github.com/KitsuneKode/nvchad-themes/releases/latest](https://github.com/KitsuneKode/nvchad-themes/releases/latest)

Verify checksums: `sha256sum -c dist/checksums.sha256`

Full install steps: [dist/INSTALL.md](./dist/INSTALL.md) · Publishing: [PUBLISHING.md](./PUBLISHING.md)

**No clone required:** download artifacts from [GitHub Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest) or [`dist/`](./dist/) — verify with `sha256sum -c dist/checksums.sha256`.

## Previews

Hero images are **generated from this repo's theme engine** (`bun run previews`). Gallery thumbnails for all 94 themes: [`assets/gallery/vscode/`](./assets/gallery/vscode/).

| NvChad Tokyonight | NvChad Kanagawa |
| :---: | :---: |
| ![NvChad Tokyonight](./assets/previews/tokyonight.webp) | ![NvChad Kanagawa](./assets/previews/kanagawa.webp) |

| NvChad Nord | NvChad Catppuccin |
| :---: | :---: |
| ![NvChad Nord](./assets/previews/nord.webp) | ![NvChad Catppuccin](./assets/previews/catppuccin.webp) |

| NvChad Rxyhn | NvChad One Dark |
| :---: | :---: |
| ![NvChad Rxyhn](./assets/previews/rxyhn.webp) | ![NvChad One Dark](./assets/previews/onedark.webp) |

Regenerate after theme changes: `bun run previews` (full) or `bun run previews --heroes-only` (8 heroes). CI checks golden JSON with `bun run goldens:check`.

## Quick install

### VS Code / Cursor

```bash
# from a clone
cursor --install-extension ./dist/nvchad-themes-1.0.0.vsix
code --install-extension ./dist/nvchad-themes-1.0.0.vsix
```

Open **Preferences: Color Theme** and search **NvChad**. Reload the window if themes do not appear immediately.

## Try these themes first

New to NvChad? Start with one of these five — they cover the most common tastes and are used for regression testing.

| Theme | Why try it | Zed search | VS Code label |
|-------|------------|------------|---------------|
| **NvChad Tokyonight** | Reference-aligned Zed port | `tokyonight` | NvChad Tokyonight |
| **NvChad Kanagawa** | Polished warm highlights | `kanagawa` | NvChad Kanagawa |
| **NvChad Nord** | Cool neutral baseline | `nord` | NvChad Nord |
| **NvChad Catppuccin** | Soft, low-glare contrast | `catppuccin` | NvChad Catppuccin |
| **NvChad Rxyhn** | Original project theme | `rxyhn` | NvChad Rxyhn |

**VS Code / Cursor:** install the [VSIX](./dist/nvchad-themes-1.0.0.vsix) → **Preferences: Color Theme** → search the label above.

**Zed:** install the [extension zip](./dist/nvchad-themes-zed-extension-1.0.0.zip) or run `bun run install:zed-dev` from a clone → theme picker → search the Zed name.

```bash
bun run build && bun run package
cursor --install-extension ./dist/nvchad-themes-1.0.0.vsix
# Developer: Inspect Editor Tokens and Scopes — verify syntax on hero themes
```

### Zed

**Extension (recommended)** — download the [Zed zip](./dist/nvchad-themes-zed-extension-1.0.0.zip), extract, then **zed: install dev extension** and select the folder.

**User theme file** — download the [JSON bundle](./dist/nvchad-themes-zed-user-1.0.0.json) into `~/.config/zed/themes/`.

```bash
bun run install:zed-dev    # local dev: use zed-extension/ in this repo
bun run install:zed --all  # copy user theme file to ~/.config/zed/themes/
bun run previews           # regenerate gallery + hero preview HTML/SVG/WebP/PNG
```

**Without Bun:** download [nvchad-themes-1.0.0.vsix](./dist/nvchad-themes-1.0.0.vsix) or [nvchad-themes-zed-extension-1.0.0.zip](./dist/nvchad-themes-zed-extension-1.0.0.zip) from [`dist/`](./dist/) or [Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest). No build tools needed.

### OpenCode · Gemini CLI · Codex

```bash
bun run install:opencode nord
bun run install:gemini nord
bun run install:codex nord
```

## What's inside

- **74 dark** + **20 light** themes, synced from upstream base46
- One VSIX with all VS Code color themes
- One Zed extension bundle with all 94 variants
- Generated outputs for OpenCode, Gemini CLI, and Codex

<details>
<summary>Full theme list</summary>

**Dark:** `aquarium`, `ashes`, `aylin`, `ayu_dark`, `bearded-arc`, `carbonfox`, `catppuccin`, `chadracula`, `chadracula-evondev`, `chadtain`, `chocolate`, `darcula-dark`, `dark_horizon`, `decay`, `default-dark`, `doomchad`, `eldritch`, `embark`, `everblush`, `everforest`, `falcon`, `flexoki`, `flouromachine`, `gatekeeper`, `github_dark`, `gruvbox`, `gruvchad`, `hiberbee`, `horizon`, `jabuti`, `jellybeans`, `kanagawa`, `kanagawa-dragon`, `material-darker`, `material-deep-ocean`, `melange`, `midnight_breeze`, `mito-laser`, `monekai`, `monochrome`, `mountain`, `neofusion`, `nightfox`, `nightlamp`, `nightowl`, `nord`, `obsidian-ember`, `oceanic-next`, `onedark`, `onenord`, `oxocarbon`, `palenight`, `pastelDark`, `pastelbeans`, `penumbra_dark`, `poimandres`, `radium`, `rosepine`, `rxyhn`, `scaryforest`, `seoul256_dark`, `solarized_dark`, `solarized_osaka`, `starlight`, `sweetpastel`, `tokyodark`, `tokyonight`, `tomorrow_night`, `tundra`, `vesper`, `vscode_dark`, `wombat`, `yoru`, `zenburn`

**Light:** `ayu_light`, `blossom_light`, `catppuccin-latte`, `default-light`, `everforest_light`, `flex-light`, `flexoki-light`, `github_light`, `gruvbox_light`, `material-lighter`, `nano-light`, `oceanic-light`, `one_light`, `onenord_light`, `penumbra_light`, `rosepine-dawn`, `seoul256_light`, `solarized_light`, `sunrise_breeze`, `vscode_light`

</details>

Popular picks: `onedark`, `nord`, `catppuccin`, `gruvbox`, `tokyonight`, `rosepine`, `rxyhn`, `kanagawa`, `everforest`, `poimandres`.

## Development

```bash
bun install
bun run import:base46    # sync palettes + polish_hl from NvChad/base46
bun run build            # generate all platform outputs
bun test
bun run previews         # hero + gallery preview HTML/SVG/WebP/PNG assets
bun run package          # build dist/ artifacts
bun run verify
```

### Local install (Zed)

```bash
bun run install:zed-dev          # build + validate zed-extension/
# Zed: zed: install dev extension → select zed-extension/

bun run install:zed --all          # copy user theme JSON to ~/.config/zed/themes/
```

Per-theme JSON for [Zed Theme Builder](https://zed.dev/theme-builder): `zed/{id}-theme.json` and `zed-extension/themes/{id}-theme.json`.

### Local install (VS Code / Cursor)

```bash
bun run build && bun run package
cursor --install-extension ./dist/nvchad-themes-1.0.0.vsix
# Reload window → Preferences: Color Theme → search NvChad
```

```
src/palettes/       imported base46 JSON (source of truth)
src/surfaces.ts     Zed + VS Code surface ladders
src/syntax/         treesitter template + polish_hl engine
src/integrations/   base46 UI recipe ports
src/builders/       VS Code, Zed, OpenCode, Gemini, Codex emitters
zed-extension/      Zed marketplace-ready extension (bundle + 94 per-theme JSON)
dist/               VSIX, Zed zip, user theme JSON (distribution)
```

## Credits

- Palettes: [NvChad/base46](https://github.com/NvChad/base46) (v3.0)
- Port & multi-editor mapping: [KitsuneKode](https://github.com/KitsuneKode)

Neovim `polish_hl` overrides are imported from base46 where present and applied via the syntax engine.

## License

MIT — see [LICENSE](./LICENSE).
