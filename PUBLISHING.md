# Publishing Guide

This repo ships two store-ready extensions from one source tree. **End-user downloads** come from the VS Code Marketplace, the Zed Extensions gallery, and [GitHub Releases](https://github.com/KitsuneKode/nvchad-themes/releases/latest) for manual/offline artifacts. See [INSTALL.md](./INSTALL.md). The `dist/` folder is build output only (not committed).

| Store | Artifact | Extension ID |
|-------|----------|--------------|
| VS Code Marketplace | `dist/nvchad-themes-<version>.vsix` (from `bun run package`) | `kitsunekode.nvchad-themes` |
| Open VSX (Cursor, VSCodium, etc.) | same VSIX | `kitsunekode.nvchad-themes` |
| Zed Extension Registry | `zed-extension/` or release zip | `nvchad-themes` |
| GitHub Releases (canonical) | VSIX, Zed zip, user JSON, checksums, INSTALL.md | — |

Palettes are synced from [NvChad/base46](https://github.com/NvChad/base46) v3.0. Bump `version` in `package.json` and `zed-extension/extension.toml` together before any release.

## Pre-release checklist

```bash
bun install
bun run import:base46 --check
bun run build
bun test
bun run goldens:check
bun run previews
bun run previews:check
bun run docs:check
bun run package
bun run verify
```

Confirm `dist/` contains (locally, not committed):

- `nvchad-themes-<version>.vsix`
- `nvchad-themes-zed-extension-<version>.zip`
- `nvchad-themes-zed-user-<version>.json`
- `checksums.sha256`
- `INSTALL.md`

Tag and push — CI uploads `dist/*` to GitHub Releases on `v*` tags:

```bash
git tag v1.0.1
git push origin v1.0.1
```

The release workflow uses root `INSTALL.md` as the release body and sets `fail_on_unmatched_files: true`.

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

### Recommended — Submodule from this repo (monorepo)

The registry consumes a public Git submodule, not the GitHub release ZIP. The current repository is already structured for the supported `path` layout: the Zed extension lives under `zed-extension/` and has its own `LICENSE`.

```bash
# In a personal fork of zed-industries/extensions
git clone https://github.com/YOUR_GITHUB_USER/extensions.git
cd extensions
git checkout -b add-nvchad-themes
git submodule add https://github.com/KitsuneKode/nvchad-themes.git extensions/nvchad-themes
```

Add this entry to the alphabetically sorted `extensions.toml` at the registry repo root:

```toml
[nvchad-themes]
submodule = "extensions/nvchad-themes"
path = "zed-extension"
version = "1.0.1"
```

The `path` field points at `zed-extension/` inside the submodule. The extension ID and `extension.toml` version must match the registry entry. The submodule URL must use HTTPS, the repository must be public, and the checked-out submodule commit must exist on a branch rather than only as a detached commit.

Sort and verify the registry checkout before opening the PR:

```bash
git submodule update --init --recursive
pnpm sort-extensions
git diff --check
git add .gitmodules extensions/nvchad-themes extensions.toml
git commit -m "Add NvChad Themes extension"
git push origin add-nvchad-themes
```

Open a pull request from your fork to `zed-industries/extensions`. Zed packages the extension after the PR is merged.

### Alternative — Dedicated Zed repo

Some publishers split the Zed extension into its own public repository containing only the contents of `zed-extension/`. This is optional; the monorepo subdirectory approach above avoids a second source repository.

### PR requirements

- Extension ID `nvchad-themes` must be unique
- MIT `LICENSE` at the extension root
- `extension.toml` `version` matches `extensions.toml`
- The extension repository is public and the registry submodule uses HTTPS
- Theme-only — no Rust required
- Test locally: **zed: install dev extension** → select `zed-extension/`

See [Developing Extensions](https://zed.dev/docs/extensions/developing-extensions#publishing-your-extension).

### Updating an existing registry entry

For a new release, bump `package.json` and `zed-extension/extension.toml` together, regenerate and verify the outputs, then update the submodule commit and registry version in a new PR:

```bash
git submodule update --remote extensions/nvchad-themes
pnpm sort-extensions
git diff --check
```

The registry `version` must match the `extension.toml` at the checked-out submodule commit.

## After publishing

Update README marketplace badges once listings are live:

```markdown
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/kitsunekode.nvchad-themes?label=VS%20Code)](https://marketplace.visualstudio.com/items?itemName=kitsunekode.nvchad-themes)
```

Zed does not expose a simple badge URL; link to the extension page in the Zed extension store after merge.
