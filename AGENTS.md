# AGENTS.md

## Current Status

- This repo generates a shared `NvChad Rxyhn` theme for:
  - VS Code / Cursor extension packaging
  - Zed local theme installation
- The single source of truth is `src/theme.ts`.
- Generated outputs are:
  - `themes/rxyhn-color-theme.json`
  - `zed/nvchad-rxyhn.json`
  - `nvchad-rxyhn-theme-0.1.0.vsix`

## Important Files

- `src/theme.ts`: shared palette, VS Code mappings, and Zed mappings
- `scripts/build-theme.ts`: regenerates both theme JSON files
- `scripts/package-theme.ts`: packages the VS Code / Cursor VSIX
- `scripts/install-zed-theme.ts`: copies the generated Zed theme into `~/.config/zed/themes`
- `README.md`: user-facing install and usage steps

## Agent Workflow

- Do not hand-edit generated JSON files unless debugging output.
- Make palette or mapping changes in `src/theme.ts`, then run `bun run build`.
- If you change VS Code packaging behavior, verify the archive contents with:
  - `unzip -l nvchad-rxyhn-theme-0.1.0.vsix`
- If you change the Zed output, reinstall it with:
  - `bun run install:zed`

## Commands

- `bun run build`
- `bun run package`
- `bun run install:zed`

## Known Caveats

- `vsce` in this environment emits a minimal archive first, so `scripts/package-theme.ts` rebuilds the final VSIX payload after packaging.
- A `LICENSE` file is still missing, so marketplace publication is not fully polished yet.
- Zed support is currently delivered as a local theme file, not a Zed extension.
