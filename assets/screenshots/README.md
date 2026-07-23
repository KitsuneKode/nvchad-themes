# Editor screenshots (drop zone)

Drop real editor screenshots here to provide the README and Zed extension gallery with current editor proof. **`bun run previews`** (and **`bun run package`**) sync Zed shots into `zed-extension/screenshots/` for the release zip.

## Folders

| Folder | Editor | Used for |
|--------|--------|----------|
| [`cursor/`](./cursor/) | VS Code / Cursor | Root [README.md](../../README.md) preview grid |
| [`zed/`](./zed/) | Zed | [zed-extension/README.md](../../zed-extension/README.md) + Zed release zip |

## Filename

Use the theme id + extension. Capture PNG files at **1896×1018** (or a clean 16:10 size) so the README gallery stays consistent:

```
tokyonight.png
kanagawa.png
nord.png
catppuccin.png
rxyhn.png
onedark.png
```

PNG is the release-readiness format. Other raster formats may be useful while editing, but convert them to PNG before committing.

## README heroes (recommended)

| Theme id | Cursor | Zed |
|----------|:------:|:---:|
| `tokyonight` | ✓ | ✓ |
| `kanagawa` | ✓ | ✓ |
| `nord` | ✓ | ✓ |
| `catppuccin` | ✓ | ✓ |
| `rxyhn` | ✓ | ✓ |
| `onedark` | ✓ | ✓ |

**Zed zip extras** (syntax fallback if no manual file): `gruvbox`, `everforest` — optional in `zed/`.

## Other 94 themes

No screenshots needed — see the [full theme list](../../README.md#theme-list), [NvChad gallery](https://nvchad.com/themes/), and [syntax gallery](../gallery/vscode/).

## After adding files

```bash
bun run previews        # sync Zed → zed-extension/screenshots/ + verify
# or only sync:
bun run previews:sync
```

`bun run previews:check` requires all six Cursor/VS Code and Zed hero screenshots to exist as valid PNGs. Generated syntax renders in `assets/previews/` remain useful for the full 94-theme gallery, but they are not substitutes for the README editor screenshots.

## Capture checklist before release

After changing theme generation or chrome mappings, recapture these six themes in both editors:

```text
tokyonight  kanagawa  nord  catppuccin  rxyhn  onedark
```

Save Cursor/VS Code captures under `assets/screenshots/cursor/`, Zed captures under `assets/screenshots/zed/`, then run:

```bash
bun run previews
bun run previews:check
```

Do not claim the final visual state until the screenshots show the current generated themes in the actual editors.
