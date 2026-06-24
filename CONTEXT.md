# NvChad Themes

Domain vocabulary for the theme derivation pipeline and platform adapters.

## Language

**Palette**:
Imported base46 `base_30` and `base_16` color JSON in `src/palettes/`.
_Avoid_: theme file, color JSON

**ThemeSpec**:
A catalog entry combining palette keys, metadata, and optional `polishHl` overrides.
_Avoid_: theme object, raw theme

**ThemeModel**:
The output of `deriveThemeModel` — all platform-neutral derived tokens before adapters run.
_Avoid_: resolved theme, intermediate

**Profile**:
A reference-family override (tokyo-night, kanagawa, etc.) applied during derivation at layer L6.
_Avoid_: preset, family config

**Adapter**:
A thin mapper from ThemeModel to a platform file (`toVsCodeTheme`, `toZedStyle`, etc.).
_Avoid_: builder, exporter

**Reference**:
Pinned official theme JSON used for conformance tests (e.g. zed-tokyo-night extract).
_Avoid_: golden, fixture

**Golden**:
Committed builder extract checked by CI for freshness (`zed/golden/`, `themes/golden/`).
_Avoid_: snapshot, baseline file
