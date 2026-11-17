# T3 Code chrome screenshots

## Live captures (`live/`)

Real screenshots of the T3 Code app (v0.1.10 nightly, web UI at 1280×800) with each curated theme applied,
captured on 2026-11-17. Canvas colors were checked against `canvas` in `t3code/nv-*.json` and match exactly.
The sidebar thread list is blurred for privacy; the row colors remain visible.

| File | Contents |
|------|----------|
| `live/overview.png` | 3×3 grid: T3 Code built-in dark + eight hero NvChad themes |
| `live/<id>.png` | One live capture per theme (`everblush`, `github_dark`, `gruvbox`, `nord`, `rxyhn`, `yoru`, `catppuccin`, `tokyonight`, `t3-native-dark`) |

`bun run t3:visuals` never writes to `live/`; it links whatever captures exist here into the "Live T3 Code captures" section of [`../../t3-theme-comparison.html`](../../t3-theme-comparison.html). Re-capture these by hand after large palette changes.

## Generated chrome mocks

Generated from the **published** `t3code/nv-*.json` roles (sidebar, chat bubble, code block, banners, accent button) — not syntax-only previews.

```bash
bun run build
bun run t3:visuals
```

| File | Contents |
|------|----------|
| `overview.png` | T3 native dark reference + eight hero NvChad themes |
| `*.png` | Single-theme chrome mock (`everblush`, `github_dark`, `gruvbox`, …) |
| `t3-native-dark.png` | T3 Code default dark chrome reference |

Source HTML: [`assets/t3-theme-comparison.html`](../../t3-theme-comparison.html). For full T3 app shots, install with `bun run install:t3code` and capture Settings → Appearance in T3 Code.
