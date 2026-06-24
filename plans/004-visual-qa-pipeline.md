# Plan 004: Visual QA pipeline (hero raster previews)

> **Executor instructions**: Land plan 003 first so golden JSON is stable. Update `plans/README.md` when done.
>
> **Drift check**: `git diff --stat 3bd8eab..HEAD -- scripts/generate-previews.ts assets/previews zed-extension/screenshots package.json`

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (headless render env differences in CI)
- **Depends on**: `plans/003-golden-workflow-ci.md`
- **Category**: dx
- **Planned at**: commit `3bd8eab`, 2026-06-24

## Why this matters

README marketplace previews use **static WebP** (`README.md:30-34` → `assets/previews/nord.webp`), but `bun run previews` only generates **HTML/SVG** (`scripts/generate-previews.ts:44-46`). Users browsing GitHub or the Zed extension store see NvChad gallery images, not Shiki-rendered outputs of **this** builder — creating a visual expectation gap.

Hero raster assets also enable quick PR review without opening Zed.

## Current state

- `assets/previews/*.webp` — 4 committed hero images (NvChad.com sourced per README line 36)
- `zed-extension/screenshots/*.html` — Shiki hero previews, not referenced by extension manifest for marketplace
- `scripts/generate-previews.ts` — uses Shiki; writes HTML + SVG only
- No PNG/WebP generation step in repo

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Previews | `bun run previews` | exit 0 |
| Raster only | `bun run previews:raster` (add) | writes WebP/PNG |
| Check assets | `ls assets/previews/*.webp \| wc -l` | ≥ 8 hero files |

## Scope

**In scope:**

- `scripts/render-preview-raster.ts` (new)
- `scripts/generate-previews.ts` — optional raster hook
- `package.json` — `previews:raster` script
- `assets/previews/` — generated `*.webp` for heroes + optional gallery thumbs
- `zed-extension/screenshots/` — `*.png` for Zed marketplace (1280×800 or Zed docs size)
- `README.md` — clarify which previews are builder-generated vs NvChad gallery
- `.github/workflows/ci.yml` — optional job `previews-raster` on `main` only (not every PR)

**Out of scope:**

- True Zed GPUI pixel tests
- Generating 94 full-size PNGs on every PR

## Steps

### Step 1: Choose rasterization approach

**Recommended:** `sharp` to convert existing SVG output to WebP/PNG (already produced by previews). Avoid Puppeteer unless SVG quality insufficient.

Add devDependency: `sharp` (record in `package.json`).

```typescript
import sharp from "sharp";
await sharp(svgPath).webp({ quality: 85 }).toFile(webpPath);
```

### Step 2: Hero raster outputs

For each id in `HERO_THEME_IDS` + `["tokyonight","onedark","gruvbox","everforest"]` (Zed README line 24):

- Input: `zed-extension/screenshots/${id}.svg`
- Output: `assets/previews/${id}.webp` (README)
- Output: `zed-extension/screenshots/${id}.png` (marketplace)

Dimensions: width 800px for README; 1280×800 for Zed screenshots per [extension guidelines](https://zed.dev/docs/extensions/developing-extensions).

**Verify**: `test -f assets/previews/tokyonight.webp && file assets/previews/tokyonight.webp` → WebP image data

### Step 3: Wire scripts

```json
"previews:raster": "bun run scripts/render-preview-raster.ts",
"previews": "bun run build && bun run scripts/generate-previews.ts && bun run previews:raster"
```

Add `--heroes-only` passthrough.

### Step 4: Update README copy

Replace or supplement NvChad gallery note:

> Hero images below are **generated from this repo's theme engine** (`bun run previews`). Gallery thumbnails for all 94 themes: `assets/gallery/vscode/`.

Keep NvChad attribution for palette source, not screenshot source.

### Step 5: CI (optional, main branch)

```yaml
  previews:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run previews --heroes-only
      - uses: actions/upload-artifact@v4
        with:
          name: hero-previews
          path: assets/previews/*.webp
```

## Done criteria

- [ ] `assets/previews/tokyonight.webp` generated from current builder
- [ ] `zed-extension/screenshots/tokyonight.png` exists
- [ ] README documents regeneration command
- [ ] `bun run previews --heroes-only` → exit 0
- [ ] `plans/README.md` plan 004 → `DONE`

## STOP conditions

- `sharp` fails on CI runners — fall back to committed SVG-only and report; do not block main test job.
- Generated WebP visibly wrong (colors) — fix Shiki theme load in `generate-previews.ts` first.

## Maintenance notes

- Regenerate raster assets after any `src/builders/zed.ts` or profile change affecting heroes.
- Zed marketplace may require specific screenshot naming — confirm against latest Zed docs before publish.
