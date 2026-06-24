# Publishing Guide

This repo ships two store-ready extensions from one source tree:

| Store | Artifact | Extension ID |
|-------|----------|--------------|
| VS Code Marketplace | `dist/nvchad-themes-1.0.0.vsix` | `kitsunekode.nvchad-themes` |
| Open VSX (Cursor, VSCodium, etc.) | same VSIX | `kitsunekode.nvchad-themes` |
| Zed Extension Registry | `zed-extension/` or `dist/nvchad-themes-zed-extension-*.zip` | `nvchad-themes` |

Palettes are synced from [NvChad/base46](https://github.com/NvChad/base46) v3.0. Bump `version` in `package.json` and `zed-extension/extension.toml` together before any release.

## Pre-release checklist

```bash
bun install
bun run import:base46 --check
bun run build
bun test
bun run package
bun run verify
```

Confirm `dist/` contains:

- `nvchad-themes-<version>.vsix`
- `nvchad-themes-zed-extension-<version>.zip`
- `nvchad-themes-zed-user-<version>.json`
- `checksums.sha256`

Tag and create a GitHub Release (CI uploads `dist/*` on `v*` tags):

```bash
git tag v1.0.0
git push origin v1.0.0
```

## VS Code Marketplace

### One-time setup

1. Create a [Visual Studio Marketplace publisher](https://marketplace.visualstudio.com/manage) (e.g. `kitsunekode`).
2. Create a [Personal Access Token](https://dev.azure.com/) with **Marketplace (Manage)** scope.
3. Login once: `bunx @vscode/vsce login kitsunekode`

### Publish

```bash
bun run publish:vscode
```

The VSIX is rebuilt into `dist/` first. Marketplace listing text comes from `package.json` and `README.md`.

### Open VSX (optional, for Cursor / VSCodium)

```bash
bunx ovsx create-namespace kitsunekode   # first time only
bun run publish:vscode:ovsx
```

## Zed Extension Registry

Zed theme extensions are published via PR to [zed-industries/extensions](https://github.com/zed-industries/extensions).

### Option A — Submodule from this repo (monorepo)

If the whole repo stays public:

```bash
# In a fork of zed-industries/extensions
git submodule add https://github.com/KitsuneKode/nvchad-themes.git extensions/nvchad-themes
```

Add to `extensions.toml` at the repo root:

```toml
[nvchad-themes]
submodule = "extensions/nvchad-themes"
path = "zed-extension"
version = "1.0.0"
```

The `path` field points at `zed-extension/` inside the submodule. `LICENSE` must exist at that path (already present).

### Option B — Dedicated Zed repo

Some publishers split the Zed extension into its own repository containing only `zed-extension/` contents. Use `dist/nvchad-themes-zed-extension-*.zip` as the canonical layout.

### PR requirements

- Extension ID `nvchad-themes` must be unique
- MIT `LICENSE` at the extension root
- `extension.toml` `version` matches `extensions.toml`
- Theme-only — no Rust required
- Test locally: **zed: install dev extension** → select `zed-extension/`

See [Developing Extensions](https://zed.dev/docs/extensions/developing-extensions#publishing-your-extension).

## After publishing

Update README marketplace badges once listings are live:

```markdown
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/kitsunekode.nvchad-themes?label=VS%20Code)](https://marketplace.visualstudio.com/items?itemName=kitsunekode.nvchad-themes)
```

Zed does not expose a simple badge URL; link to the extension page in the Zed extension store after merge.
