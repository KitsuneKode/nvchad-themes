# AGENTS.md

## Project

**NvChad Themes** (`nvchad-themes`) — all 94 [NvChad/base46](https://github.com/NvChad/base46) v3.0 themes for VS Code, Cursor, Zed, OpenCode, Gemini CLI, and Codex.

- GitHub: `https://github.com/KitsuneKode/nvchad-themes`
- VS Code extension ID: `kitsunekode.nvchad-themes`
- Zed extension ID: `nvchad-themes`

## Generated outputs

- `themes/<id>-color-theme.json` — VS Code
- `dist/nvchad-themes-<version>.vsix` — VS Code / Cursor distribution
- `dist/nvchad-themes-zed-extension-<version>.zip` — Zed distribution
- `zed-extension/` — Zed dev extension / marketplace path
- `opencode/`, `gemini/`, `codex/` — CLI targets

## Workflow

- Palettes: `bun run import:base46` → `src/palettes/*.json`
- Derivation: edit `src/derive/`, `src/profiles/`, `src/integrations/`, then `bun run build`
- Mappings: platform adapters in `src/builders/` consume `deriveThemeModel` output
- Distribution: `bun run package` → `dist/`
- Verify: `bun run verify` · `bun run goldens:check`
- Previews: `bun run previews` or `bun run previews --heroes-only`
- Publishing: see [PUBLISHING.md](./PUBLISHING.md)

## Commands

| Audience | Commands |
|----------|----------|
| **User** | Download from [`dist/`](../dist/) or [Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest); install VSIX or Zed zip — see [INSTALL.md](../dist/INSTALL.md) |
| **Contributor** | `import:base46`, `build`, `test`, `package`, `verify`, `previews` |
| **Tuner** | Zed Theme Builder + `zed/golden/` workflow — see [plans/003-golden-workflow-ci.md](./plans/003-golden-workflow-ci.md) |

- `bun run import:base46 [--check]`
- `bun run build` · `bun test` · `bun run goldens` · `bun run goldens:check` · `bun run package` · `bun run verify`
- `bun run previews` · `bun run previews --heroes-only`
- `bun run publish:vscode` — Marketplace (requires `vsce login`)
- `bun run install:zed-dev` · `bun run install:zed [--all] [id]`

## Caveats

- `package-dist.ts` rebuilds VSIX with only `themes/`, `package.json`, `readme.md`, `LICENSE`, `assets/icon.png`
- Zed dist zip includes `extension.toml`, `LICENSE`, `README.md`, `themes/`, `screenshots/` (hero PNGs)
- `bun run package` runs hero previews before zipping; release CI runs `bun run previews` first
- Zed registry PR uses `zed-extension/` via `path` submodule field or a dedicated repo
- Bump `package.json` and `zed-extension/extension.toml` versions together
