# Plan 002: Zed profile overrides by theme family

> **Executor instructions**: Follow plan 001 first (or confirm it is DONE). Run drift check, then execute steps. Update `plans/README.md` when finished.
>
> **Drift check**: `git diff --stat 3bd8eab..HEAD -- src/profiles src/derive src/builders/zed.ts src/surfaces.ts src/zed-ui.ts src/catalog.ts`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (94 themes — overrides must be opt-in, not hand-maintained for all)
- **Depends on**: `plans/001-zed-reference-conformance.md`
- **Category**: direction
- **Planned at**: commit `3bd8eab`, 2026-06-24

## Why this matters

A single global Zed ladder works for Tokyo Night–like palettes (`darkerBlack` < `black` < `oneBg2`) but **fails or looks flat** on palettes where base46 keys don't match Zed's visual model (e.g. `statuslineBg` lighter than editor, exotic `darkerBlack` spacing, light themes with inverted base01).

Premium feel requires **reference families**: themes inherit semantics from a known-good port (Tokyo Night, Catppuccin, Kanagawa) with **small per-theme overrides** only where `polish_hl` or palette quirks demand it.

## Current state

- `src/surfaces.ts` — one `zedLadder()` for all themes; special-cases only luminance thresholds.
- `src/zed-ui.ts` — one `zedUiTokens()`; punctuation defaults to `base.cyan` for dark.
- `src/palettes/tokyonight.json` — has `polish_hl` with Tokyo-specific function colors (lines 56–76).
- `src/palettes/*.json` — 67/94 include `polishHl` after import; overrides are syntax-only, not surface/tab.
- No `src/profiles/` directory.

**Target pattern (from zed-tokyo-night):**

- Family `tokyo-night`: raised tab = `oneBg2`, operator/punctuation = cyan (`#89ddff`), comment = `#51597d` (between `greyFg` and `greyFg2`).
- Family `kanagawa`: numbers = `babyPink`, brackets = `pmenuBg` (already in polish_hl tests).
- Family `default-dark`: fallback ladder + baseline syntax.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Build | `bun run build` | exit 0 |
| Tests | `bun test` | 0 fail |
| Package | `bun run package` | exit 0 |

## Scope

**In scope:**

- `src/profiles/` (new) — profile definitions + manifest
- `src/derive/theme-model.ts` — apply profile during derivation (`baseline < profile < polish_hl`); builders stay thin adapters
- `src/catalog.ts` or `src/profiles/registry.ts` — map `theme.id` → profile
- `tests/profile-overrides.test.ts` (create) — assert derived model fields, not raw zed.json
- `src/palettes/.base46-manifest.json` — optional `profile` field per theme (generated)

**Out of scope:**

- Hand-tuning all 94 themes in Theme Builder (human workflow stays in plan 003)
- VS Code profile system

## Steps

### Step 1: Define profile types

Create `src/profiles/types.ts`:

```typescript
export type ZedReferenceProfile =
  | "tokyo-night"
  | "catppuccin"
  | "kanagawa"
  | "nord"
  | "gruvbox"
  | "default-dark"
  | "default-light";

export type ZedProfileOverride = {
  id: ZedReferenceProfile;
  /** Optional fixed surface/tab tokens; omit to use zedLadder defaults */
  surfaces?: Partial<{
    surface: string;
    raised: string;
    elevated: string;
  }>;
  /** Zed syntax key → color hex overrides applied after buildZedSyntax baseline */
  syntax?: Record<string, string>;
  /** zed-ui token overrides */
  ui?: Partial<{
    punctuation: string;
    comment: string;
    indentGuide: string;
  }>;
};
```

### Step 2: Implement reference profiles

Create `src/profiles/tokyo-night.ts`, `kanagawa.ts`, `default-dark.ts`, `default-light.ts` with **documented** values from `src/references/official/tokyonight.json` (plan 001).

`tokyo-night` profile must include:

- `syntax.punctuation` / `operator` → `#89ddff` (or `base.cyan` if palette matches)
- `syntax.comment` → `#51597d` (mix toward `greyFg2` if no exact key)
- `ui.indentGuide` → `#363b54` equivalent via `mixColors`

`default-dark` profile: empty overrides (pure ladder).

### Step 3: Theme → profile registry

Create `src/profiles/registry.ts`:

```typescript
const THEME_PROFILE: Record<string, ZedReferenceProfile> = {
  tokyonight: "tokyo-night",
  tokyodark: "tokyo-night",
  kanagawa: "kanagawa",
  "kanagawa-dragon": "kanagawa",
  catppuccin: "catppuccin",
  "catppuccin-latte": "catppuccin",
  nord: "nord",
  gruvbox: "gruvbox",
  // ...
};

export const profileForTheme = (id: string, type: "dark" | "light"): ZedReferenceProfile =>
  THEME_PROFILE[id] ?? (type === "light" ? "default-light" : "default-dark");
```

Start with **hero + top 20 popular** themes from README line 92; default bucket covers the rest.

**Verify**: `bun -e "import { profileForTheme } from './src/profiles/registry.ts'; console.log(profileForTheme('tokyonight','dark'))"` → `tokyo-night`

### Step 4: Wire profiles into derivation (not zed.ts)

In `src/derive/theme-model.ts` (requires Wave 0 ThemeModel from execute plan):

1. `const profile = loadProfile(profileForTheme(theme.id, theme.type))`
2. Build baseline: `zedLadder(theme)`, `buildSyntaxRules(theme)`, `zedUiTokens(theme)`, `separatorColors(theme)`.
3. Merge profile overrides onto baseline fields before returning `ResolvedThemeModel`.
4. Document order: **baseline < profile < polish_hl** (polish_hl wins).

Platform builders (`src/builders/zed.ts`, etc.) only read `ResolvedThemeModel` — no profile imports in adapters.

**Verify**: `bun -e "..."` — `deriveThemeModel(tokyonight).syntax.punctuation` matches Tokyo reference (`#89ddff` or cyan family)

### Step 5: Tests

`tests/profile-overrides.test.ts`:

- Each mapped popular theme resolves a profile.
- `deriveThemeModel(tokyonight)` punctuation/comment match reference extract.
- Unmapped `default-dark` theme uses ladder only (no throw).
- Profile + polish_hl: kanagawa `Number` still `babyPink`.

## Done criteria

- [ ] `src/profiles/registry.ts` maps ≥ 15 named themes + defaults
- [ ] Tokyo Night punctuation no longer purple from blanket `polish_hl` bracket rule unless intended
- [ ] `bun test` → 0 fail
- [ ] `bun run verify` → exit 0
- [ ] `plans/README.md` plan 002 → `DONE`

## STOP conditions

- Profile overrides require editing > 30 palette JSON files — stop; use registry only.
- Reference extract from 001 missing — complete 001 first.
- Applying profiles breaks > 10 existing golden extracts — list themes, adjust profiles not goldens without maintainer sign-off.

## Maintenance notes

- New base46 theme: auto-assign `default-dark` / `default-light`; promote to named profile only after visual QA.
- When upstream adds `polish_hl`, re-check profile syntax overrides don't fight polish (precedence: polish wins).
