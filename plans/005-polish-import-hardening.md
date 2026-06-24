# Plan 005: Polish import hardening + mapping tests

> **Executor instructions**: Can run in parallel with plan 001. Update `plans/README.md` when done.
>
> **Drift check**: `git diff --stat 3bd8eab..HEAD -- scripts/import-base46.ts src/resolve-color.ts src/syntax/index.ts tests/`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: correctness
- **Planned at**: commit `3bd8eab`, 2026-06-24

## Why this matters

Broken syntax colors shipped to users when `polish_hl` contained unresolved `M.base_16.base05` literals (seen in `zed-extension/screenshots/tokyonight.html` and `src/palettes/tokyonight.json:59`). Build-time resolution in `src/resolve-color.ts` fixes output, but import should persist resolved hex, and **CI must catch regressions** before 94 themes regenerate.

`scripts/import-base46.ts:258` recurses `resolveValue` without cycle detection — malformed upstream Lua can stack overflow.

## Current state

- `scripts/import-base46.ts:228-262` — `resolveValue` with `M.base_16` support added; no `seen` set
- `src/syntax/index.ts:218-251` — `applyPolishHl(theme, rules, polishHl)` resolves at build via `resolveThemeColorOr`
- `tests/theme-quality.test.ts:92-110` — asserts no `M.` in built Zed syntax catalog-wide
- Import does not fail when `resolveValue` returns non-hex

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Import | `bun run import:base46` | 94 themes, exit 0 |
| Import check | `bun run import:base46 --check` | exit 0 |
| Tests | `bun test tests/import-base46.test.ts` | all pass |

## Scope

**In scope:**

- `scripts/import-base46.ts`
- `src/resolve-color.ts` (shared helper if deduplicating)
- `tests/import-base46.test.ts` (create)
- `tests/polish-mapping.test.ts` (create)
- `src/palettes/*.json` — regenerated resolved `polishHl` values (via import)

**Out of scope:**

- Zed surface profiles (plan 002)
- VS Code semantic token mapping expansion

## Steps

### Step 1: Cycle-safe `resolveValue`

Add optional `seen: Set<string>` parameter to `resolveValue` in `scripts/import-base46.ts`:

```typescript
if (seen.has(trimmed)) throw new Error(`Cyclic color reference: ${trimmed}`);
seen.add(trimmed);
// ... recurse with seen
```

### Step 2: Fail import on unresolved polish colors

In `parsePolishSection`, after `resolveValue`:

```typescript
if (entry.fg && !isHexColor(entry.fg)) {
  throw new Error(`Unresolved polish fg for ${group} in theme ${id}: ${entry.fg}`);
}
```

Run full import once; fix parser edge cases if legitimate upstream patterns exist (document in test).

**Verify**: `bun run import:base46` → exit 0; `grep -r "M\.base_16" src/palettes/tokyonight.json` → no matches

### Step 3: Unit tests for resolver

`tests/import-base46.test.ts` (use exported test helpers or duplicate minimal resolver in test):

- `M.base_16.base05` → hex from mock base16
- Cycle `A → B → A` throws
- Unknown `M.base_30.foo` throws or returns trimmed (match current behavior, document)

### Step 4: Polish mapping coverage test

`tests/polish-mapping.test.ts`:

For each `theme in themeCatalog` where `theme.polishHl` exists:

- Every `treesitter` key maps via `NVIM_TO_ZED` or `NVIM_TO_VSCODE_SCOPES` in `src/syntax/index.ts`
- Warn (not fail) on unmapped keys — collect report written to stdout in test for maintainer review
- **Fail** if any built Zed syntax color matches `/^M\./`

### Step 5: Re-import and rebuild

```bash
bun run import:base46
bun run build
bun test
```

Commit updated palette JSON only if hex values change (expected).

## Done criteria

- [ ] Zero `M.base_16` strings in `src/palettes/` after import
- [ ] Cycle detection test passes
- [ ] `bun run import:base46 --check` passes in CI
- [ ] `bun test` → 0 fail
- [ ] `plans/README.md` plan 005 → `DONE`

## STOP conditions

- > 10 palettes fail unresolved fg after import — stop with theme ID list; may need parser extension for new Lua patterns.
- Upstream base46 changes break import — pin ref `v3.0` and report.

## Maintenance notes

- Run `import:base46` after every base46 release; mapping test guards Zed/VS Code parity.
- Do not add new `NVIM_TO_ZED` entries without a mapping test entry.
