# Plan 001: Zed reference conformance harness

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for plan 001 in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 3bd8eab..HEAD -- src/references src/surfaces.ts src/zed-ui.ts src/builders/zed.ts scripts/lib/validate-zed.ts tests/theme-quality.test.ts`
> If in-scope files changed since this plan was written, compare "Current state" excerpts against live code before proceeding.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (tightening validation may surface palette-specific edge cases)
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `3bd8eab`, 2026-06-24

## Why this matters

Users reported Zed themes with invisible panels, wrong highlights, and flat chrome. Root cause was **misaligned Zed semantics** (treating `background` as title-bar crust, alpha selection washes, unresolved `M.base_16.*` polish refs). A one-off fix for Tokyo Night is not enough — **94 themes need automated conformance** against known-good reference ports (e.g. [zed-tokyo-night](https://github.com/ssaunderss/zed-tokyo-night)) so regressions fail CI instead of shipping to users.

This plan pins reference extracts, updates stale hero metadata, and extends `validate-zed.ts` to catch invalid syntax colors and hierarchy violations across the full bundle.

## Current state

**Architecture (post-overhaul target — verify on disk):**

- `src/surfaces.ts` — `zedLadder()`: Zed-native ladder where `background` === editor well, `surface` === darker chrome, `raised` === active tab (`oneBg2`).
- `src/zed-ui.ts` — `zedUiTokens()`: borders, text (`base16.base05`), solid `element.selected` (`greyFg`), indent guides.
- `src/builders/zed.ts` — builds full Zed `style` + `buildZedSyntax()` with baseline tree-sitter keys.
- `src/resolve-color.ts` — resolves `M.base_16.*` / `M.base_30.*` at build time.
- `scripts/lib/validate-zed.ts` — hierarchy checks; **does not** validate every `style.syntax.*.color` is `#rrggbb`.
- `src/references/hero-themes.ts` — **stale**: still documents `tabActiveEqualsEditor: true` (lines 5–22) while tests expect raised active tabs (`tests/theme-quality.test.ts:29`).
- `tests/theme-quality.test.ts` — hardcoded Tokyo Night assertions (lines 44–68); no pinned JSON from upstream reference repo.

**Reference Tokyo Night (zed-tokyo-night) key semantics:**

```
background / editor.background:  #1a1b26  (editor well)
surface.background / title_bar:  #16161e  (darker chrome)
tab.inactive_background:       #16161e
tab.active_background:           #414868  (raised, NOT editor)
text / editor.foreground:        #a9b1d6  (base16.base05)
element.selected:                #565f89  (solid greyFg)
function:                        #7aa2f7
```

**Repo conventions:**

- Tests use `bun test` (`package.json:60`).
- Hero IDs: `src/references/hero-themes.ts` → `HERO_THEME_IDS`.
- Do not hand-edit generated `zed-extension/themes/*.json`; change builders and `bun run build`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install | `bun install` | exit 0 |
| Build | `bun run build` | exit 0 |
| Tests | `bun test` | 0 fail |
| Package | `bun run package` | exit 0 |
| Verify | `bun run verify` | exit 0 |

## Scope

**In scope:**

- `src/references/` (new official reference JSON + updated `hero-themes.ts`)
- `scripts/lib/validate-zed.ts`
- `tests/theme-quality.test.ts` (new reference-driven tests)
- `tests/reference-conformance.test.ts` (create)
- `scripts/fetch-zed-references.ts` (create, optional maintainer script)
- `package.json` (add `test:references` or document in scripts if needed)

**Out of scope:**

- Per-theme manual overrides (`plans/002-zed-profile-overrides.md`)
- PNG/WebP generation (`plans/004-visual-qa-pipeline.md`)
- VS Code builder changes (`src/builders/vscode.ts`)

## Git workflow

- Branch: `advisor/001-zed-reference-conformance`
- Commits: conventional style matching repo (`Track the VSIX…`, `Ship NvChad Themes…`)
- Do NOT push unless operator instructs.

## Steps

### Step 1: Pin official reference extracts

Create `src/references/official/` with **curated JSON extracts** (not full 2500-line theme files) for themes that have quality Zed ports:

| File | Source | Keys to extract |
|------|--------|-----------------|
| `tokyonight.json` | `ssaunderss/zed-tokyo-night` `themes/tokyonight.json` variant "Tokyo Night" | `background`, `surface.background`, `editor.background`, `tab.*`, `title_bar.background`, `panel.background`, `text`, `editor.foreground`, `element.selected`, `element.hover`, `border`, `editor.indent_guide`, syntax: `function`, `function.call`, `function.method.call`, `keyword`, `comment`, `variable`, `punctuation` |
| `tokyonight-storm.json` | same repo, Storm variant | surface + tab semantics only |

Add a maintainer script `scripts/fetch-zed-references.ts` that downloads upstream JSON and rewrites extracts (for refresh). Script should **not** run in CI by default (network); committed extracts are source of truth.

**Verify**: `test -f src/references/official/tokyonight.json && jq -e '.background == "#1a1b26"' src/references/official/tokyonight.json` → exit 0

### Step 2: Fix stale hero reference metadata

Update `src/references/hero-themes.ts`:

- Remove or replace `tabActiveEqualsEditor: true` with `tabActiveRaised: true`.
- Add `referenceProfile?: "tokyo-night" | "catppuccin" | "kanagawa" | "nord" | "default-dark"` per hero.
- Add `tokyonight` to a new `REFERENCE_THEME_IDS` array used for upstream alignment tests (separate from surface heroes if desired).

Document Zed-native ladder rules in a short comment block at top of file (copy from `src/surfaces.ts:31-34`).

**Verify**: `grep -n "tabActiveEqualsEditor" src/references/hero-themes.ts` → no matches

### Step 3: Reference-driven conformance tests

Create `tests/reference-conformance.test.ts`:

1. Load `src/references/official/tokyonight.json`.
2. `buildZedTheme(getThemeById("tokyonight"))` and assert **every key** in the official extract matches built output (or document intentional deltas in a `ALLOWED_DELTAS` map with comments).
3. For all 94 themes: assert no `style.syntax` color contains `M.` or lacks `#` prefix.
4. For all dark themes: `luminance(surface.background) < luminance(background)`; `background === editor.background`.
5. For all themes: `element.selected` is 7-char hex (no alpha).

Keep existing `tests/theme-quality.test.ts` hero tests; migrate Tokyo hardcoded block to use official JSON loader to avoid duplication.

**Verify**: `bun test tests/reference-conformance.test.ts` → all pass

### Step 4: Harden `validate-zed.ts`

In `scripts/lib/validate-zed.ts`, after existing `validateThemeStyle`:

1. For each `theme.style.syntax` entry: require `color` is string, `^#[0-9a-fA-F]{6}$`, no `M.` substring.
2. Optional: validate `font_style` is `null` | `"italic"` | `"bold"` | `"underline"` | `"strikethrough"` (Zed v0.2.0 subset).
3. Export `validateSyntaxColors(style.syntax)` for unit testing.

Add `tests/validate-zed.test.ts` with a minimal invalid bundle fixture.

**Verify**: `bun run package` → exit 0 (validate runs inside package/verify pipeline)

### Step 5: Document reference refresh in AGENTS.md

Add a short section under workflow:

```markdown
### Zed reference themes
- Official extracts: `src/references/official/*.json`
- Refresh: `bun run scripts/fetch-zed-references.ts` (maintainer only)
- Conformance: `bun test tests/reference-conformance.test.ts`
```

**Verify**: `grep -n "references/official" AGENTS.md` → at least one match

## Test plan

- New: `tests/reference-conformance.test.ts` — Tokyo Night full extract match; catalog-wide syntax hex; hierarchy invariants.
- New: `tests/validate-zed.test.ts` — malformed syntax color fails validation.
- Updated: `tests/theme-quality.test.ts` — use shared loader, no duplicate hardcoded hex lists.

Pattern to follow: `tests/theme-quality.test.ts` hero loop (lines 16–41).

## Done criteria

- [ ] `src/references/official/tokyonight.json` exists with documented upstream source
- [ ] `src/references/hero-themes.ts` no longer claims `tabActiveEqualsEditor`
- [ ] `bun test` → 0 failures
- [ ] `bun run package && bun run verify` → exit 0
- [ ] `grep -r "M\.base_16" zed-extension/themes/tokyonight-theme.json` → no matches
- [ ] `plans/README.md` plan 001 status → `DONE`

## STOP conditions

- Official upstream JSON structure changed (keys missing) — report URL + diff, do not guess mappings.
- More than 5 themes fail hierarchy after validation tighten — stop and list theme IDs; may need plan 002 profiles.
- `zed-ui.ts` / `zedLadder` not present and rebuilding surfaces is out of scope — report blocker.

## Maintenance notes

- When Zed schema bumps past v0.2.0, re-fetch reference themes and extend validation allowlist.
- New hero theme → add extract to `official/` and extend `HERO_THEME_IDS`.
- Reviewers: scrutinize any `ALLOWED_DELTAS` entries — each must have a comment explaining why we diverge from upstream.
