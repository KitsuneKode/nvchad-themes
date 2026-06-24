# NvChad Themes — Install Packages

Version **1.0.0**. Pre-built files for VS Code, Cursor, and Zed.

**Repository:** https://github.com/KitsuneKode/nvchad-themes

## Direct downloads (latest release)

| Platform | Release URL |
|----------|-------------|
| VS Code / Cursor | [`nvchad-themes-1.0.0.vsix`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-1.0.0.vsix) |
| Zed extension | [`nvchad-themes-zed-extension-1.0.0.zip`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-extension-1.0.0.zip) |
| Zed user theme | [`nvchad-themes-zed-user-1.0.0.json`](https://github.com/KitsuneKode/nvchad-themes/releases/latest/download/nvchad-themes-zed-user-1.0.0.json) |

Files in this `dist/` folder match the release assets above.

## VS Code / Cursor / Devin Desktop

**File:** [`nvchad-themes-1.0.0.vsix`](./nvchad-themes-1.0.0.vsix)

1. Download the `.vsix`
2. Command palette → **Extensions: Install from VSIX...**
3. **Preferences: Color Theme** → search **NvChad**

```bash
code --install-extension nvchad-themes-1.0.0.vsix
cursor --install-extension nvchad-themes-1.0.0.vsix
```

## Zed — Dev extension (all 94 themes)

**File:** [`nvchad-themes-zed-extension-1.0.0.zip`](./nvchad-themes-zed-extension-1.0.0.zip)

1. Download and extract
2. **zed: install dev extension** → select extracted folder
3. Theme picker → search **NvChad**

## Zed — User theme file

**File:** [`nvchad-themes-zed-user-1.0.0.json`](./nvchad-themes-zed-user-1.0.0.json)

Copy to `~/.config/zed/themes/` (macOS: `~/Library/Application Support/Zed/themes/`).

## Verify

```bash
sha256sum -c checksums.sha256
```

## Rebuild

```bash
bun run package
```
