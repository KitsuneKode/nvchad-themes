# AGENTS.md

## Current Status

- This repo generates a shared `NvChad Rxyhn Theme` for:
  - VS Code / Cursor extension packaging
  - Zed local theme installation
  - OpenCode local theme installation
  - Gemini CLI local theme installation
  - Codex local theme installation
- Public-facing name preference is `NvChad Rxyhn Theme` and the recommended GitHub repo name is `nvchad-rxyhn-theme-vscode-cursor-zed`.
- The repo now includes an MIT `LICENSE` and a GitHub-oriented README with install steps for all supported editors and CLIs.
- The single source of truth is `src/theme.ts`.
- Generated outputs are:
  - `themes/rxyhn-color-theme.json`
  - `zed/rxyhn-theme.json`
  - `opencode/rxyhn.json`
  - `gemini/rxyhn.json`
  - `codex/rxyhn.tmTheme`
  - `nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix`
- The committed VSIX is intended to stay in the repo so users can download and install it without building locally.

## Important Files

- `src/theme.ts`: shared palette, VS Code mappings, and Zed mappings
- `scripts/build-theme.ts`: regenerates both theme JSON files
- `scripts/build-theme.ts`: also syncs `package.json` theme contributions from `themeCatalog`
- `scripts/package-theme.ts`: packages the VS Code / Cursor VSIX
- `scripts/install-zed-theme.ts`: copies the generated Zed theme into `~/.config/zed/themes`
- `scripts/install-opencode-theme.ts`: copies the generated OpenCode theme into `~/.config/opencode/themes`
- `scripts/install-gemini-theme.ts`: copies the generated Gemini CLI theme into `~/.gemini/themes`
- `scripts/install-codex-theme.ts`: copies the generated Codex theme into `~/.codex/themes` and updates `~/.codex/config.toml`
- `README.md`: user-facing install and usage steps

## Agent Workflow

- Do not hand-edit generated JSON files unless debugging output.
- Make palette or mapping changes in `src/theme.ts`, then run `bun run build`.
- New themes should be added by inserting a new `themeCatalog` entry with `id`, `displayName`, `base30`, and `base16`.
- If you change VS Code packaging behavior, verify the archive contents with:
  - `unzip -l nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix`
- If you change the Zed output, reinstall it with:
  - `bun run install:zed`

## Commands

- `bun run build`
- `bun run package`
- `bun run install:zed`
- `bun run install:opencode`
- `bun run install:gemini`
- `bun run install:codex`

## Known Caveats

- `vsce` in this environment emits a minimal archive first, so `scripts/package-theme.ts` rebuilds the final VSIX payload after packaging.
- No Git remote is configured locally right now, so README clone instructions intentionally use a placeholder repo URL instead of guessing one.
- Zed support is currently delivered as a local theme file, not a Zed extension.
