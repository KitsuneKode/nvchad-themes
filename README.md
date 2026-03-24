# NvChad Rxyhn Theme for VS Code, Cursor, Zed, OpenCode, Gemini CLI, and Codex

Search-friendly port of the famous `rxyhn` look for VS Code, Cursor, Zed, OpenCode, Gemini CLI, and Codex, with `NvChad` in the project name for stronger discoverability.

## Preview

### Cursor / VS Code

![Cursor preview](./public/cursor.png)

### Zed

![Zed preview](./public/zed.png)

### OpenCode

![OpenCode preview](./public/opencode.png)

### Gemini CLI

![Gemini CLI preview](./public/gemini.png)

### Codex

![Codex preview](./public/codex.png)

Codex support is generated as a TextMate `.tmTheme` file that the Codex TUI can load from `~/.codex/themes`.

## Install From GitHub

### Fastest Option For Users

If you do not want to build anything, download the committed VSIX directly from this repo:

- [nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix](./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix)

Then install it manually:

```bash
code --install-extension ./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix
cursor --install-extension ./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix
```

Or use `Extensions: Install from VSIX...` in VS Code or Cursor.

For Zed, users can download the generated local theme file directly:

- [zed/rxyhn-theme.json](./zed/rxyhn-theme.json)

Then copy it into:

```bash
mkdir -p ~/.config/zed/themes
cp ./rxyhn-theme.json ~/.config/zed/themes/rxyhn-theme.json
```

Restart Zed and choose `NvChad Rxyhn Theme`.

For OpenCode, users can download the theme JSON directly:

- [opencode/rxyhn.json](./opencode/rxyhn.json)

Then copy it into:

```bash
mkdir -p ~/.config/opencode/themes
cp ./opencode/rxyhn.json ~/.config/opencode/themes/rxyhn.json
```

Restart OpenCode and select the theme (or set it in your OpenCode config file).

For Gemini CLI, users can download the theme JSON directly:

- [gemini/rxyhn.json](./gemini/rxyhn.json)

Then copy it into:

```bash
mkdir -p ~/.gemini/themes
cp ./gemini/rxyhn.json ~/.gemini/themes/rxyhn.json
```

And register the theme in `~/.gemini/settings.json`:

```jsonc
{
  "ui": {
    "theme": "NvChad Rxyhn Theme",
    "customThemes": {
      "NvChad Rxyhn Theme": {
        // paste the contents of gemini/rxyhn.json here
      }
    }
  }
}
```

Or use the automated installer (see below).

For Codex, users can download the generated TextMate theme directly:

- [codex/rxyhn.tmTheme](./codex/rxyhn.tmTheme)

Codex custom themes are file-based, so they may not show up like an extension install flow in other editors.

If you do not have the Codex CLI installed yet, install it first and launch it once:

```bash
npm i -g @openai/codex
codex
```

The first launch will prompt you to sign in.

Then copy it into:

```bash
mkdir -p ~/.codex/themes
cp ./codex/rxyhn.tmTheme ~/.codex/themes/rxyhn.tmTheme
```

And set the theme in `~/.codex/config.toml`:

```toml
[tui]
theme = "rxyhn"
```

Restart `codex` after saving the config.

Or use the automated installer (see below).

### Build From Source

Clone the repo:

```bash
git clone <your-github-repo-url>
cd nvchad-rxyhn-theme-vscode-cursor-zed
bun install
```

### VS Code

Build the VSIX and install it:

```bash
bun run package
code --install-extension ./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix
```

Then open the theme picker and choose `NvChad Rxyhn Theme`.

### Cursor

Build the VSIX and install it:

```bash
bun run package
cursor --install-extension ./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix
```

Then open the theme picker and choose `NvChad Rxyhn Theme`.

### Zed

Build the local Zed theme file and install it:

```bash
bun run build
mkdir -p ~/.config/zed/themes
cp ./zed/rxyhn-theme.json ~/.config/zed/themes/rxyhn-theme.json
```

Then restart Zed and choose `NvChad Rxyhn Theme` from the theme picker.

If you prefer the helper script:

```bash
bun run install:zed
```

### OpenCode

Build and install the OpenCode theme:

```bash
bun run build
bun run install:opencode
```

Manual alternative:

```bash
mkdir -p ~/.config/opencode/themes
cp ./opencode/rxyhn.json ~/.config/opencode/themes/rxyhn.json
```

Restart OpenCode and select the theme in its settings.

### Gemini CLI

Build and install the Gemini CLI theme:

```bash
bun run build
bun run install:gemini
```

This copies the theme to `~/.gemini/themes/` and registers it under `ui.customThemes` in `~/.gemini/settings.json`.

Manual alternative:

```bash
mkdir -p ~/.gemini/themes
cp ./gemini/rxyhn.json ~/.gemini/themes/rxyhn.json
```

Then add the theme to `~/.gemini/settings.json` under `ui.customThemes` (see the install section above for the JSON structure).

### Codex

Build and install the Codex theme:

```bash
bun run build
bun run install:codex
```

This copies `codex/rxyhn.tmTheme` into `~/.codex/themes/` and updates `~/.codex/config.toml` to use `theme = "rxyhn"`.

Manual alternative:

```bash
mkdir -p ~/.codex/themes
cp ./codex/rxyhn.tmTheme ~/.codex/themes/rxyhn.tmTheme
```

Then set the active theme in `~/.codex/config.toml`:

```toml
[tui]
theme = "rxyhn"
```

Restart `codex` after saving the file.

## Codex CLI Notes

- This target is for the Codex CLI / TUI.
- The custom theme name must match the file name without the extension, so `~/.codex/themes/rxyhn.tmTheme` pairs with `theme = "rxyhn"`.
- Custom Codex themes are configured through `~/.codex/config.toml`; they do not install like a VSIX.
- If Codex is running and you do not see the new theme, that usually means it still needs the `theme = "rxyhn"` entry in `~/.codex/config.toml`.
- If the theme does not appear, fully quit and reopen `codex` after updating the file and config.
- If `codex` is not available in your terminal at all, first confirm the CLI is installed by running `codex --version`.

## Release-Friendly Option

If you publish GitHub Releases, attach `nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix` to a release. That gives VS Code and Cursor users a simple download-and-install path without building locally.

Zed users can download `zed/rxyhn-theme.json` from the repo or a release and place it in `~/.config/zed/themes`.

Codex users can download `codex/rxyhn.tmTheme` from the repo or a release, place it in `~/.codex/themes`, and set `theme = "rxyhn"` in `~/.codex/config.toml`.

## Outputs

- VS Code / Cursor theme JSON: `themes/rxyhn-color-theme.json`
- VS Code / Cursor VSIX: `nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix`
- Zed local theme JSON: `zed/rxyhn-theme.json`
- OpenCode theme JSON: `opencode/rxyhn.json`
- Gemini CLI theme JSON: `gemini/rxyhn.json`
- Codex theme file: `codex/rxyhn.tmTheme`

All generated artifacts come from the shared palette and mappings in `src/theme.ts`.

## Adding Another Theme Later

This codebase is now set up so you can add more themes without rewriting the VS Code and Zed mapping logic.

The workflow is:

1. Add a new theme entry to `themeCatalog` in `src/theme.ts`
2. Give it a unique `id`, `displayName`, `base30`, and `base16`
3. Run:

```bash
bun run build
```

That will automatically:

- generate `themes/<id>-color-theme.json`
- generate `zed/<id>-theme.json`
- generate `opencode/<id>.json`
- generate `gemini/<id>.json`
- generate `codex/<id>.tmTheme`
- sync `package.json` so the VS Code extension contributes the new theme

## Build

```bash
bun run build
```

This regenerates:

- `themes/rxyhn-color-theme.json`
- `zed/rxyhn-theme.json`
- `opencode/rxyhn.json`
- `gemini/rxyhn.json`
- `codex/rxyhn.tmTheme`

## Local Dev Workflow

Build or rebuild the extension package:

```bash
bun run package
```

Install the VSIX locally:

```bash
code --install-extension ./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix
cursor --install-extension ./nvchad-rxyhn-theme-vscode-cursor-zed-0.1.0.vsix
```

Or install manually with `Extensions: Install from VSIX...`.

After installation, choose `NvChad Rxyhn Theme` from the color theme picker.

Generate the Zed theme file:

```bash
bun run build
```

Install it into your local Zed themes directory:

```bash
bun run install:zed
```

Manual alternative:

```bash
mkdir -p ~/.config/zed/themes
cp ./zed/rxyhn-theme.json ~/.config/zed/themes/rxyhn-theme.json
```

Then restart Zed and select `NvChad Rxyhn Theme` from the theme picker.

## Recommended Settings

Some parts of a full editor rice are not themeable by extensions or local theme files. These settings get the editors closer to the intended feel.

VS Code / Cursor:

```jsonc
{
  "workbench.colorTheme": "NvChad Rxyhn Theme",
  "editor.semanticHighlighting.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.cursorSmoothCaretAnimation": "off",
  "editor.renderLineHighlight": "gutter",
  "terminal.integrated.minimumContrastRatio": 1
}
```

Zed:

```jsonc
{
  "relative_line_numbers": "enabled",
  "vim_mode": true,
  "theme": {
    "mode": "system",
    "dark": "NvChad Rxyhn Theme",
    "light": "Catppuccin Mocha"
  }
}
```

Set your preferred Nerd Font separately if you want the rest of your setup to visually track your NvChad environment.

## Attribution

The palette is based on NvChad Base46's `rxyhn` theme and the original `rxyhn` rice credits noted upstream.
Review upstream licensing and attribution requirements before publishing to a marketplace or extension registry.
