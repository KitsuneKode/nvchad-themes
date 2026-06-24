# Editor screenshots (drop zone)

Drop real editor screenshots here to replace the bundled syntax placeholders. **`bun run previews`** (and **`bun run package`**) sync Zed shots into `zed-extension/screenshots/` for the release zip.

## Folders

| Folder | Editor | Used for |
|--------|--------|----------|
| [`cursor/`](./cursor/) | VS Code / Cursor | Root [README.md](../../README.md) preview grid |
| [`zed/`](./zed/) | Zed | [zed-extension/README.md](../../zed-extension/README.md) + Zed release zip |

## Filename

Use the theme id + extension:

```
tokyonight.png
kanagawa.png
nord.png
catppuccin.png
rxyhn.png
onedark.png
```

Also accepted: `.webp`, `.jpg`, `.jpeg` (converted to PNG for Zed on sync).

## README heroes (recommended)

| Theme id | Cursor | Zed |
|----------|:------:|:---:|
| `tokyonight` | ✓ | ✓ |
| `kanagawa` | ✓ | ✓ |
| `nord` | ✓ | ✓ |
| `catppuccin` | ✓ | ✓ |
| `rxyhn` | ✓ | optional |
| `onedark` | ✓ | optional |

**Zed zip extras** (syntax fallback if no manual file): `gruvbox`, `everforest` — optional in `zed/`.

## Other 94 themes

No screenshots needed — see the [full theme list](../../README.md#full-theme-list), [NvChad gallery](https://nvchad.com/themes/), and [syntax gallery](../gallery/vscode/).

## After adding files

```bash
bun run previews        # sync Zed → zed-extension/screenshots/ + verify
# or only sync:
bun run previews:sync
```

Until Cursor shots exist, `previews:check` accepts generated syntax PNGs in `assets/previews/` as fallback.
