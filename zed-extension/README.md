# NvChad Themes — Zed Extension

All 94 [NvChad base46](https://github.com/NvChad/base46) themes in one Zed theme extension.

This folder follows the [Zed theme extension layout](https://zed.dev/docs/extensions/themes):

```
zed-extension/
  extension.toml
  LICENSE
  screenshots/          # hero preview HTML (open in browser)
  themes/
    nvchad-themes.json  # one theme family, 94 variants
    {id}-theme.json     # per-theme import for Theme Builder
```

Zed auto-discovers every `.json` file in `themes/` when the extension loads. No Rust code is required for theme-only extensions.

## Screenshots

Hero preview cards (Shiki-rendered syntax samples) live in `screenshots/`:

- `kanagawa.html` / `.svg` — open in a browser for a quick visual check
- Same for `nord`, `catppuccin`, `rxyhn`, `onedark`, `tokyonight`, `gruvbox`, `everforest`

Regenerate after theme changes:

```bash
bun run previews
```

## Install (recommended): Dev extension

From the repo root:

```bash
bun run install:zed-dev
```

In Zed:

1. Open the command palette
2. Run **`zed: install dev extension`**
3. Select this **`zed-extension/`** directory (not the repo root)

All 94 themes appear in the theme picker. Search for **NvChad**.

Per-theme JSON files (`themes/kanagawa-theme.json`, etc.) can be imported into [Zed Theme Builder](https://zed.dev/theme-builder) for visual tuning.

### Troubleshooting

**Panels look flat / same color as the editor**

- Confirm `surface.background` ≠ `background` — inspect `zed-extension/themes/tokyonight-theme.json` or run `zed: open log` for parse errors
- Re-run `bun run install:zed-dev` after `bun run build` so Zed picks up fresh JSON
- Compare with `zed/golden/tokyonight.json` surface extract

**Wrong syntax colors (e.g. variables show `M.base_16...`)**

- Run `bun run build` — usually a stale extension bundle
- `zed: reload` or restart Zed

**Theme not in the picker**

- Dev extension path must be **`zed-extension/`**, not the repo root
- Check `extension.toml` → `id = "nvchad-themes"`
- If a marketplace build with the same ID is installed, the dev extension replaces it

**Prerequisites**

- **Contributors:** [Bun](https://bun.sh) for `install:zed-dev` and the build pipeline
- **End users:** download the [dist zip](../dist/nvchad-themes-zed-extension-1.0.0.zip) — no clone or Bun required

**Diagnostics**

- **`zed: open log`** — theme parse errors
- **`zed --foreground`** — verbose logs from a terminal

Docs: [Developing Extensions](https://zed.dev/docs/extensions/developing-extensions)

## Install (alternative): Manual user theme file

Copy the bundled theme family into Zed's user themes directory:

```bash
bun run install:zed --all
```

This writes `~/.config/zed/themes/nvchad-themes.json`. Zed watches that folder and reloads themes when files change.

Install a single theme instead:

```bash
bun run install:zed nord
```

That copies `zed/nord-theme.json` as its own one-variant theme family.

## Theme Builder workflow

Tune hero themes visually at [zed.dev/theme-builder](https://zed.dev/theme-builder):

1. `bun run build` — generates `zed/{id}-theme.json` and `zed-extension/themes/{id}-theme.json`
2. Import a per-theme JSON in Theme Builder
3. Export tuned JSON and compare with `zed/golden/{id}.json` surface extracts

## Theme file format

Each file in `themes/` is a **theme family** per the [Zed theme schema v0.2.0](https://zed.dev/schema/themes/v0.2.0.json):

```json
{
  "$schema": "https://zed.dev/schema/themes/v0.2.0.json",
  "name": "NvChad Themes",
  "author": "NvChad",
  "themes": [
    { "name": "NvChad Nord", "appearance": "dark", "style": { ... } }
  ]
}
```

The bundle ships all 94 variants in one family (similar to Catppuccin's multi-flavor JSON files).

## Publishing to the Zed extension store

Theme extensions are published separately from language extensions. See [Developing Extensions — Publishing](https://zed.dev/docs/extensions/developing-extensions#publishing-your-extension):

1. Host this extension in its own public Git repository
2. Include an accepted license at the extension root (`LICENSE`)
3. Open a PR to [zed-industries/extensions](https://github.com/zed-industries/extensions) adding a submodule and `extensions.toml` entry

## Regenerating

From the repo root:

```bash
bun run build
bun run previews   # optional: hero + gallery assets
```

This refreshes `themes/nvchad-themes.json`, `themes/{id}-theme.json`, and `zed/{id}-theme.json` from `src/palettes/` and the theme engine.
