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

## Previews

Screenshots from the [NvChad theme gallery](https://nvchad.com/themes) — the same palettes shipped here.

| NvChad Nord | NvChad One Dark |
| :---: | :---: |
| ![NvChad Nord](./assets/previews/nord.webp) | ![NvChad One Dark](./assets/previews/onedark.webp) |

| NvChad Catppuccin | NvChad Rxyhn |
| :---: | :---: |
| ![NvChad Catppuccin](./assets/previews/catppuccin.webp) | ![NvChad Rxyhn](./assets/previews/rxyhn.webp) |

*Preview images © [NvChad](https://nvchad.com/themes). Rxyhn is the theme this project grew from.*

## Quick install

### VS Code / Cursor

```bash
# from a clone
cursor --install-extension ./dist/nvchad-themes-1.0.0.vsix
code --install-extension ./dist/nvchad-themes-1.0.0.vsix
```

Open **Preferences: Color Theme** and search **NvChad**.

### Zed

**Extension (recommended)** — download the [Zed zip](./dist/nvchad-themes-zed-extension-1.0.0.zip), extract, then **zed: install dev extension** and select the folder.

**User theme file** — download the [JSON bundle](./dist/nvchad-themes-zed-user-1.0.0.json) into `~/.config/zed/themes/`.

```bash
bun run install:zed-dev    # local dev: use zed-extension/ in this repo
bun run install:zed --all  # copy user theme file to ~/.config/zed/themes/
```

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
bun run import:base46    # sync palettes from NvChad/base46
bun run build            # generate all platform outputs
bun test
bun run package          # build dist/ artifacts
bun run verify
```

```
src/palettes/     imported base46 JSON (source of truth)
src/builders/     VS Code, Zed, OpenCode, Gemini, Codex mappers
zed-extension/    Zed marketplace-ready extension
dist/             VSIX, Zed zip, user theme JSON (distribution)
```

## Credits

- Palettes: [NvChad/base46](https://github.com/NvChad/base46) (v3.0)
- Port & multi-editor mapping: [KitsuneKode](https://github.com/KitsuneKode)

Neovim-only `polish_hl` overrides are not ported — only `base_30` + `base_16` palettes.

## License

MIT — see [LICENSE](./LICENSE).
