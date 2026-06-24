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
- Mappings: edit `src/builders/`, then `bun run build`
- Distribution: `bun run package` → `dist/`
- Verify: `bun run verify`
- Publishing: see [PUBLISHING.md](./PUBLISHING.md)

## Commands

- `bun run import:base46 [--check]`
- `bun run build` · `bun test` · `bun run package` · `bun run verify`
- `bun run publish:vscode` — Marketplace (requires `vsce login`)
- `bun run install:zed-dev` · `bun run install:zed [--all] [id]`

## Caveats

- `package-dist.ts` rebuilds VSIX with only `themes/`, `package.json`, `readme.md`, `LICENSE`, `assets/icon.png`
- Zed registry PR uses `zed-extension/` via `path` submodule field or a dedicated repo
- Bump `package.json` and `zed-extension/extension.toml` versions together
