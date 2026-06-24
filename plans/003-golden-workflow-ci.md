# Plan 003: Golden workflow + CI regression gates

> **Executor instructions**: Complete plan 001 (reference harness) first. Update `plans/README.md` when done.
>
> **Drift check**: `git diff --stat 3bd8eab..HEAD -- scripts/generate-previews.ts scripts/write-golden-extracts.ts zed/golden .github/workflows/ci.yml tests/theme-quality.test.ts`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: `plans/001-zed-reference-conformance.md`
- **Category**: dx
- **Planned at**: commit `3bd8eab`, 2026-06-24

## Why this matters

Maintainers tune hero themes in [Zed Theme Builder](https://zed.dev/theme-builder) and compare exports to `zed/golden/{id}.json` (`zed-extension/README.md:76-82`), but:

- Golden generation is split across `scripts/generate-previews.ts` (subset `GOLDEN_IDS`) and `scripts/write-golden-extracts.ts` (full `HERO_THEME_IDS`).
- CI runs `bun test` but **does not** fail when goldens are stale relative to builders.
- `bun run previews` regenerates 94 HTML files — too heavy for every PR.

This plan unifies golden extraction, adds a fast CI gate, and documents the human Theme Builder loop.

## Current state

- `src/references/hero-themes.ts:25` — `HERO_THEME_IDS = ["kanagawa","catppuccin","nord","rxyhn"]`
- `scripts/generate-previews.ts:7-9` — separate `GOLDEN_IDS` (same 4 IDs today, but duplicated constant)
- `tests/theme-quality.test.ts:153-174` — loads `zed/golden/${id}.json` for each hero
- `.github/workflows/ci.yml` — build, test, package, verify; **no** golden freshness check
- Golden keys today: `background`, `surface.background`, `editor.background`, `tab.active_background`, `border`, `editor.indent_guide`, `pane_group.border`

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Full previews | `bun run previews` | exit 0, regenerates gallery |
| Golden only | `bun run goldens` (add) | exit 0, updates `zed/golden/*.json` |
| Golden check | `bun run goldens --check` (add) | exit 0 if committed goldens match build |
| CI parity | `bun test && bun run goldens --check` | exit 0 |

## Scope

**In scope:**

- `scripts/generate-golden-extracts.ts` (new, canonical)
- `scripts/generate-previews.ts` — call shared extract helper; remove duplicate logic
- `scripts/write-golden-extracts.ts` — delete or thin wrapper delegating to new script
- `package.json` — `"goldens": "bun run scripts/generate-golden-extracts.ts"`
- `.github/workflows/ci.yml` — add `bun run goldens --check` after `bun test`
- `zed/golden/*.json` — regenerate once after surface overhaul
- `zed-extension/README.md`, `AGENTS.md` — document workflow

**Out of scope:**

- PNG/WebP (plan 004)
- Per-theme profiles (plan 002)

## Steps

### Step 1: Canonical golden extract function

Create `scripts/lib/golden-extract.ts`:

```typescript
export const GOLDEN_STYLE_KEYS = [
  "background",
  "surface.background",
  "editor.background",
  "tab.active_background",
  "tab.inactive_background",
  "title_bar.background",
  "panel.background",
  "element.selected",
  "element.hover",
  "text",
  "editor.foreground",
  "border",
  "editor.indent_guide",
  "pane_group.border"
] as const;

export const extractGoldenStyle = (style: Record<string, string>) =>
  Object.fromEntries(GOLDEN_STYLE_KEYS.map((k) => [k, style[k]]));
```

Import `HERO_THEME_IDS` from `src/references/hero-themes.ts` only.

### Step 2: `generate-golden-extracts.ts` CLI

Flags:

- default: write `zed/golden/${id}.json` for each hero
- `--check`: build in memory, compare to disk, exit 1 on mismatch (print diff)
- `--tuned`: also write `zed/golden/${id}.tuned.json` wrapper for Theme Builder import notes

**Verify**: `bun run goldens --check` → exit 0 after committed goldens match

### Step 3: Integrate previews script

`scripts/generate-previews.ts` should import `extractGoldenStyle` and call `generateHeroGoldens()` from shared module — remove local `GOLDEN_IDS` constant.

Keep full-gallery HTML generation behind default; add `--heroes-only` flag to skip 94-theme gallery when iterating.

**Verify**: `bun run scripts/generate-previews.ts --heroes-only` completes in < 30s locally

### Step 4: CI gate

Append to `.github/workflows/ci.yml` after `bun test`:

```yaml
      - run: bun run goldens --check
```

Optional: on `pull_request`, comment that intentional visual changes require `bun run goldens` commit.

### Step 5: Theme Builder workflow doc

Expand `zed-extension/README.md` § Theme Builder:

1. `bun run build`
2. Import `zed-extension/themes/{id}-theme.json`
3. Tune in UI (panels, tabs, syntax)
4. Export JSON → save as `zed/golden/{id}.tuned.json` for review
5. Merge approved token changes into `src/profiles/` or builders
6. `bun run goldens` to refresh committed extracts

## Done criteria

- [ ] Single source `HERO_THEME_IDS` drives golden generation
- [ ] `bun run goldens --check` in CI
- [ ] `write-golden-extracts.ts` removed or delegates without duplicate logic
- [ ] `bun test` + `bun run goldens --check` → pass
- [ ] `plans/README.md` plan 003 → `DONE`

## STOP conditions

- Golden check fails for all heroes after 001 — refresh goldens once with maintainer approval, then re-enable check.
- `--check` flakiness from non-deterministic build — stop and fix builder determinism first.

## Maintenance notes

- Any change to `GOLDEN_STYLE_KEYS` is a breaking change — bump note in `plans/README.md`.
- Theme Builder exports are **inputs** to profiles, not committed as production themes wholesale.
