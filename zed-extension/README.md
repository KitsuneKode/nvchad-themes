# NvChad Themes — Zed Extension

All 94 [NvChad base46](https://github.com/NvChad/base46) themes in one Zed theme extension.

This folder follows the [Zed theme extension layout](https://zed.dev/docs/extensions/themes):

```
zed-extension/
  extension.toml
  LICENSE
  themes/
    nvchad-themes.json   # one theme family, 94 variants
```

Zed auto-discovers every `.json` file in `themes/` when the extension loads. No Rust code is required for theme-only extensions.

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

### Troubleshooting

- **`zed: open log`** — check for theme parse errors
- **`zed --foreground`** — run Zed from a terminal for verbose logs
- If a published extension with the same ID is installed, Zed replaces it with the dev build

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
```

This refreshes `themes/nvchad-themes.json` from `src/palettes/` and `src/builders/zed.ts`.
