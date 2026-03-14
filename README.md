# NvChad Rxyhn

Palette-faithful VS Code, Cursor, and Zed port of NvChad's `rxyhn` theme.

## Install From GitHub

Clone the repo:

```bash
git clone <your-github-repo-url>
cd vscode-extension-rxyhn-theme
bun install
```

### VS Code

Build the VSIX and install it:

```bash
bun run package
code --install-extension ./nvchad-rxyhn-theme-0.1.0.vsix
```

Then open the theme picker and choose `NvChad Rxyhn`.

### Cursor

Build the VSIX and install it:

```bash
bun run package
cursor --install-extension ./nvchad-rxyhn-theme-0.1.0.vsix
```

Then open the theme picker and choose `NvChad Rxyhn`.

### Zed

Build the local Zed theme file and install it:

```bash
bun run build
mkdir -p ~/.config/zed/themes
cp ./zed/nvchad-rxyhn.json ~/.config/zed/themes/nvchad-rxyhn.json
```

Then restart Zed and choose `NvChad Rxyhn` from the theme picker.

If you prefer the helper script:

```bash
bun run install:zed
```

## Release-Friendly Option

If you publish GitHub Releases, attach `nvchad-rxyhn-theme-0.1.0.vsix` to a release. That gives VS Code and Cursor users a simple download-and-install path without building locally.

Zed users can download `zed/nvchad-rxyhn.json` from the repo or a release and place it in `~/.config/zed/themes`.

## Outputs

- VS Code / Cursor theme JSON: `themes/rxyhn-color-theme.json`
- VS Code / Cursor VSIX: `nvchad-rxyhn-theme-0.1.0.vsix`
- Zed local theme JSON: `zed/nvchad-rxyhn.json`

All generated artifacts come from the shared palette and mappings in `src/theme.ts`.

## Build

```bash
bun run build
```

This regenerates both:

- `themes/rxyhn-color-theme.json`
- `zed/nvchad-rxyhn.json`

## Local Dev Workflow

Build or rebuild the extension package:

```bash
bun run package
```

Install the VSIX locally:

```bash
code --install-extension ./nvchad-rxyhn-theme-0.1.0.vsix
cursor --install-extension ./nvchad-rxyhn-theme-0.1.0.vsix
```

Or install manually with `Extensions: Install from VSIX...`.

After installation, choose `NvChad Rxyhn` from the color theme picker.

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
cp ./zed/nvchad-rxyhn.json ~/.config/zed/themes/nvchad-rxyhn.json
```

Then restart Zed and select `NvChad Rxyhn` from the theme picker.

If you want to pin it in `~/.config/zed/settings.json`, use:

```jsonc
{
  "theme": {
    "mode": "system",
    "dark": "NvChad Rxyhn",
    "light": "Catppuccin Mocha"
  }
}
```

## Recommended Settings

Some parts of a full editor rice are not themeable by extensions or local theme files. These settings get the editors closer to the intended feel.

VS Code / Cursor:

```jsonc
{
  "workbench.colorTheme": "NvChad Rxyhn",
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
    "dark": "NvChad Rxyhn",
    "light": "Catppuccin Mocha"
  }
}
```

Set your preferred Nerd Font separately if you want the rest of your setup to visually track your NvChad environment.

## Attribution

The palette is based on NvChad Base46's `rxyhn` theme and the original `rxyhn` rice credits noted upstream.
Review upstream licensing and attribution requirements before publishing to a marketplace or extension registry.
