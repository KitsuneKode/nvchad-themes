# Plan 007: Premium NvChad feature stack (Zed + VS Code parity)

> **Executor instructions**: Run after **001** (reference harness) and **005** (clean palettes). Requires **Wave 0 ThemeModel** (`deriveThemeModel`). Update `plans/README.md` when done.
>
> **Drift check**: `git diff --stat HEAD -- src/derive src/integrations src/enhancements src/builders tests/parity`

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (broad touch surface; mitigated by parity tests per layer)
- **Depends on**: Wave 0 ThemeModel, `plans/001`, `plans/005`
- **Blocks**: `plans/003` (goldens should capture full stack), `plans/002` (profiles layer 6)
- **Category**: direction + tests

## Why this matters

NvChad in Neovim is not “palette → JSON dump.” It is a **stacked derivation**: base46 palette → plugin integrations (`defaults`, `tbline`, `nvimtree`, `git`, `cmp`, `treesitter`) → per-theme `polish_hl` → UI-specific tweaks. Today Zed and VS Code cover much of this **but in the wrong order and wrong places** — integrations only feed VS Code; Zed re-derives terminal/git/syntax separately; enhancements are adapter-local.

This plan makes **both platforms consume the same derived stack** so premium feel is systematic across 94 themes, not accidental on heroes.

## NvChad derivation order (canonical — must match ThemeModel)

Apply inside `deriveThemeModel` in this order only:

| Layer | Name | Source | ThemeModel field |
| ----- | ---- | ------ | ---------------- |
| L0 | Palette | `src/palettes/*.json` | `theme` (ThemeSpec) |
| L1 | Resolve | `resolve-color.ts` | all hex in palette |
| L2 | Surfaces | `surfaces.ts` | `surfaces.vscode`, `surfaces.zed` |
| L3 | Chrome | `separators.ts` + `zed-ui.ts` | `ui`, `zedUi` |
| L4 | Integrations | `integrations/index.ts` (+ expanded) | `integrations` |
| L5 | Syntax baseline | `syntax/index.ts` treesitter template | `syntax` (pre-polish) |
| L6 | Profile | `src/profiles/` (plan 002) | merged into L2–L5 |
| L7 | Polish | `polishHl` on ThemeSpec | `syntax` final |
| L8 | Enhancements | `enhancements.ts` | `vscodeExtras`, `zedExtras` |
| L9 | Adapters | `builders/*` | platform JSON only |

**Invariant:** Adapters at L9 never read `theme.base30` directly — only `ResolvedThemeModel`.

## Feature parity matrix (target: heroes pass all rows)

### Chrome & layout (L2–L3)

| Feature | NvChad / base46 | VS Code keys | Zed keys | Status |
| ------- | ----------------- | ------------ | -------- | ------ |
| Editor well | `black` | `editor.background` | `background`, `editor.background` | Done |
| Sidebar / panel chrome | `darkerBlack` / `statuslineBg` | `sideBar.*`, `activityBar.*` | `surface.background`, `panel.background` | Done |
| Raised active tab | `oneBg2` vs inactive on chrome | `tab.activeBackground` | `tab.active_background` | Done |
| Solid list selection | `pmenuBg` / `greyFg` | `list.*Selection*` | `element.selected` | Done |
| Solid separators | `line` + mix | `*border*`, `editorIndentGuide*` | `border`, `editor.indent_guide*` | Done |
| Status bar | `statuslineBg` | `statusBar.*` | `status_bar.background` | Done |

### Syntax (L5–L7)

| Feature | VS Code | Zed | Status |
| ------- | ------- | --- | ------ |
| treesitter.lua baseline | `tokenColors` + semantic | `style.syntax` baseline | Done |
| polish_hl per theme | merged scopes | NVIM_TO_ZED merge | Done (005 hardens) |
| Function = blue default | semantic + scopes | `function.*` unless polish overrides | Done |
| Punctuation / operator family | scopes | profile + cyan default (002) | Partial → 002 |

### Integrations (L4)

| base46 plugin | Ported today | ThemeModel target |
| ------------- | ------------ | ----------------- |
| `defaults.lua` | `integrationHints` (comments, cursor line, pmenu) | `integrations.defaults` |
| `tbline.lua` | tab active/inactive | `integrations.tabs` |
| `nvimtree.lua` | sidebar, folder, tree indent | `integrations.explorer` |
| `git.lua` | diff bg mix | `integrations.git` |
| `cmp.lua` | suggest kind colors | `integrations.completion` |
| `treesitter.lua` | syntax template | layer L5 |
| `lsp.lua` | **partial** (diagnostics via hardcoded builder keys) | `integrations.diagnostics` |
| `telescope.lua` | **not ported** | `integrations.picker` (VS Code quickInput) |
| `bufferline.lua` | **partial** (tabs only) | merge with `integrations.tabs` |

### Terminal (L4 shared)

| Feature | VS Code | Zed | Gap |
| ------- | ------- | --- | --- |
| ANSI 16 | `terminal.ansi*` | `terminal.ansi.*` | Derive once in `integrations.terminal` |
| Bright / dim | VS Code bright set | Zed dim + bright | Unify palette mapping |
| Terminal bg | editor well | `terminal.background` = surface | Document Zed semantic |

### Git & diff (L4)

| Feature | VS Code | Zed |
| ------- | ------- | --- |
| Diff insert/remove bg | `diffEditor.*` + hints | `version_control.*` + conflict markers |
| Gutter decorations | `gitDecoration.*` | `version_control.added/modified/...` |
| Merge conflict | `merge.*` | `version_control.conflict*` |

### Advanced UI (L8)

| Feature | VS Code (`vscodeEnhancements`) | Zed (`zedEnhancements`) | Action |
| ------- | ------------------------------ | ------------------------- | ------ |
| Symbol / completion kinds | `symbolIcon.*` from cmp hints | map to `icon.*` where Zed supports | Add Zed adapter slice |
| Inlay hints | `editorInlayHint.*` | no Zed key today | VS Code only; document |
| Testing colors | `testing.*` | panel tints in `zedEnhancements` | Align hues with VS Code |
| Debug / problems | `problems*`, `debugIcon.*` | `error`, `warning`, `info` + panel bgs | Parity test |
| Vim mode indicator | N/A | `vim.*` keys in Zed builder | Keep in Zed adapter |
| Chat / Copilot | `chat.*`, `inlineChat.*` | N/A | VS Code only |
| Multiplayer cursors | N/A | `players[]` | Zed only; derive from accents |

## Plugin port priority (phased — execute in order)

Port integrations in **impact order**, not alphabetical. Each phase lands with tests before the next.

### Phase 7a — Unify duplicated hues (do first)

**Why first:** Both builders already hardcode these; parity bugs show up immediately in daily use. **Deletion test** passes — removing duplicate `base30.green` from adapters concentrates logic in one module.

| Plugin | Action | Parity test |
| ------ | ------ | ----------- |
| `git.lua` | `gitIntegration()` → diff bg mix + decoration hues | VS Code `gitDecoration.*` === Zed `version_control.*` hex |
| Terminal (base46 palette keys) | `terminalIntegration()` → single ANSI 16 table | `terminal.ansiGreen` === `terminal.ansi.green` on heroes |
| `defaults.lua` | Split from monolithic `integrationHints` | cursor line, pmenu sel, comment/line number colors stable |

**Files:** `src/integrations/git.ts`, `terminal.ts`, `defaults.ts`  
**Commit sub-scope:** `feat(integrations): unify git and terminal derivation`

### Phase 7b — Chrome integrations (already partial — formalize)

**Why second:** Depends on L2–L3 surfaces from ThemeModel; feeds tab/sidebar feel.

| Plugin | Action | Both platforms |
| ------ | ------ | -------------- |
| `tbline.lua` + `bufferline.lua` | `tabsIntegration()` — active=editor/raised, inactive=overlay/surface, modified=yellow | VS Code `tab.*`, Zed `tab.*` |
| `nvimtree.lua` | `explorerIntegration()` — sidebar, folder, tree indent | VS Code `sideBar.*` + `tree.indentGuidesStroke`, Zed `panel.*` indent |

**Commit sub-scope:** `feat(integrations): formalize tabs and explorer slices`

### Phase 7c — Diagnostics (LSP)

**Why third:** Scattered across `editorError.*`, `problems*`, Zed `error`/`warning`/`info` + panel bgs. NvChad `lsp.lua` maps diagnostic severities to palette — port once.

| Output | VS Code | Zed |
| ------ | ------- | --- |
| `diagnostics.error` | `editorError.foreground`, `problemsErrorIcon.*` | `error`, `error.background` |
| `diagnostics.warning` | `editorWarning.*` | `warning`, `warning.background` |
| `diagnostics.info` | `editorInfo.*` | `info`, `info.background` |
| `diagnostics.hint` | `editorHint.*` | `hint`, `hint.background` |

**Source:** Fetch `NvChad/base46@v3.0/lua/base46/integrations/lsp.lua` at import time or pin excerpt in `src/references/base46/lsp.lua` for maintainer diff.

**Commit sub-scope:** `feat(integrations): port lsp diagnostic hues`

### Phase 7d — Completion & symbols

**Why fourth:** `cmp.lua` already partially in `integrationHints.suggestKindColors`; extend to Zed `icon.*` where schema allows and VS Code `symbolIcon.*` (today in `vscodeEnhancements`).

**Commit sub-scope:** `feat(integrations): completion kind colors on both platforms`

### Phase 7e — Picker / overlay (telescope)

**Why fifth:** Lower daily visibility than editor/git/terminal; maps to VS Code `quickInput.*`, `pickerGroup.*`, Zed `picker`/`ghost_element` if applicable.

**Defer if:** Zed has no stable picker keys — ship VS Code-only slice with `integrations.picker.vscode` optional field.

### Explicitly deferred (no base46 port in 007)

| Plugin | Reason |
| ------ | ------ |
| `which-key.lua` | No VS Code/Zed theme key equivalent |
| `mason.lua`, `lazy.lua` | Plugin UI not themeable in targets |
| `alpha.lua` (dashboard) | Out of editor chrome scope |
| Per-plugin `polish_hl` beyond treesitter/syntax | Already L7; import handles |

## Steps

### Step 1: Phase 7a — git + terminal + defaults

Create `src/integrations/git.ts`, `terminal.ts`, `defaults.ts`. Refactor `integrationHints` to compose them.

**Verify:** `tests/parity-heroes.test.ts` (create minimal) — git + terminal rows only.

### Step 2: Phase 7b — tabs + explorer

Create `tabs.ts`, `explorer.ts`. Wire VS Code tab hints and Zed tab keys from same slice.

**Verify:** Tokyonight — inactive tab on chrome, active tab raised (`#414868` family).

### Step 3: Phase 7c — diagnostics

Create `diagnostics.ts` from base46 `lsp.lua` semantics. Replace scattered builder keys.

**Verify:** error/warning/info hex identical in VS Code problems icons and Zed `error`/`warning`/`info`.

### Step 4: Phase 7d–7e — completion + picker

Create `completion.ts`, `picker.ts`. Move symbol icon logic from `vscodeEnhancements` into model.

### Step 5: Wire integrations into ThemeModel

In `deriveThemeModel`:

```typescript
integrations: {
  defaults, tabs, explorer, git, completion, diagnostics, terminal, picker
}
```

VS Code adapter: map `integrations.*` → workbench color keys (replace duplicate reads in `buildVsCodeColors` where overlapped).

Zed adapter: map `integrations.git` → `version_control.*`, `integrations.terminal` → `terminal.ansi.*`, etc.

**Verify:** deletion test — remove direct `theme.base30.green` from git decoration lines in both adapters; colors still come from model.

### Step 6: Enhancements into model (L8)

Move `vscodeEnhancements` / `zedEnhancements` to run inside derivation after L7:

- `model.vscodeExtras` — testing, inlay, symbol icons
- `model.zedExtras` — panel diagnostic tints, hover line number

Adapters spread these at end of color maps.

### Step 7: Full parity tests

Create `tests/parity-heroes.test.ts`:

- For each `HERO_THEME_IDS` theme: derive model once; assert cross-platform semantic equality for:
  - editor/sidebar hierarchy (relative luminance, not absolute hex across families)
  - git added/modified/deleted hues match between platforms
  - terminal primary hues match
  - syntax function color matches between Zed syntax and VS Code semantic `function`

Create `tests/parity-stack.test.ts`:

- Assert derivation order: profile before polish (mock theme with conflicting profile vs polish — polish wins)
- Assert adapters do not import `surfaces.ts` directly (lint or grep test)

### Step 8: Extend validate + goldens

- `validate-zed.ts`: optional check that `version_control.*` and `terminal.ansi.*` are `#rrggbb`
- Plan 003 goldens: add `themes/golden/<hero>.extract.json` for VS Code workbench subset (editor, tab, git, terminal) — same freshness gate as Zed

## Done criteria

- [ ] Phases 7a–7c complete (git, terminal, tabs, explorer, diagnostics)
- [ ] `deriveThemeModel` exposes full L4–L8 stack; adapters are mapping-only
- [ ] Terminal ANSI derived once; heroes pass hex parity test
- [ ] Git/diff hues derived once; heroes pass parity test
- [ ] `integrations` covers diagnostics + picker overlays (minimum viable port)
- [ ] `tests/parity-heroes.test.ts` green for 5 heroes
- [ ] `bun test` → 0 fail; `bun run verify` → exit 0
- [ ] `plans/README.md` plan 007 → `DONE`

## STOP conditions

- Parity tests require per-theme hand edits for > 10 heroes — stop; fix derivation not themes
- ThemeModel wave 0 not landed — stop; complete Wave 0 first
- Zed schema missing a key we need — document in adapter as VS Code-only; do not block stack

## Maintenance notes

- New base46 plugin in upstream → add integration slice + row in parity matrix before adapter keys
- Profile (002) overrides layers L2–L5 only; never adapter keys
