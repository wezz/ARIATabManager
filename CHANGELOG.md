# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-06-11

### Added

- Hidden tab panels now leave the tab order: content panels default to
  `data-ariamanager-hide="inert"` (requires `@wezz/ariamanager` >= 1.1) and the
  initial `inert` state is synced to each panel's `aria-hidden`. Opt out per
  panel by setting `data-ariamanager-hide` yourself.
- `data-tab-delay` is now honoured for the open animation delay (previously the
  configured value was read from the wrong attribute and silently ignored).
- A `test` script with `vitest` + `jsdom`, and an initial test suite.

### Fixed

- No longer throws during server-side rendering (no DOM): the constructor
  no-ops when `document` is undefined.
- Buttons whose `aria-controls` resolves to nothing no longer throw on click.
- `data-tab-setheight` containers no longer leak a 1s `setInterval` per
  initialisation — height now tracks via a `ResizeObserver`.
- `getTabContainer` no longer throws on detached nodes.

### Changed

- Peer dependency on `@wezz/ariamanager` raised to `^1.1.2`.
- The shared `ARIAManager` is now strongly typed (was `any`); removed a
  misleading `await` on the synchronous `GetARIAControlTargets`.
- Removed a leftover `console.log` from the height calculation.

### Fixed (packaging)

- CommonJS consumers now get correct types. The package ships a CJS declaration
  (`dist/index.d.cts`, `export =`) matching `module.exports =` in the UMD build,
  alongside the ESM `dist/index.d.ts`, with split `import`/`require` conditions
  in `exports`. `attw` is clean across node16 (CJS & ESM) and bundler. node10 is
  not targeted (the package requires Node >= 18), so `check:exports` ignores the
  node10-only `false-export-default` rule.

## [1.1.1] - 2026-06-11

### Changed

- Rebuilt against `@wezz/ariamanager` 1.1.0 (singleton). Peer range raised to
  `^1.1.0` so the tab manager and the host app share one ARIAManager instance.

### Internal

- Added `publint` + `@arethetypeswrong/cli` checks, `sideEffects: false`, and an
  `engines.node` field.

## [1.1.0] - 2026-06-11

### Changed

- **`@wezz/ariamanager` is now a peer dependency and is externalized from the
  bundle** instead of being inlined. Consumers install ariamanager themselves, a
  single shared ARIAManager is used, and ariamanager fixes propagate without
  republishing this package. **This is the one consumer-facing change:** make
  sure `@wezz/ariamanager` (>= 1.1.0) is installed alongside this package.

## [1.0.9] - 2026-06-11

### Fixed

- Corrected the package `exports` map, which pointed at `dist/ariatabmanager.js`
  / `.umd.cjs` — files the build never emits (it emits `dist/index.*`). Bundlers
  could not resolve the package. Now points at `dist/index.js` / `dist/index.umd.cjs`.

[Unreleased]: https://github.com/wezz/ARIATabManager/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/wezz/ARIATabManager/releases/tag/v1.1.1
[1.1.0]: https://github.com/wezz/ARIATabManager/releases/tag/v1.1.0
[1.0.9]: https://github.com/wezz/ARIATabManager/releases/tag/v1.0.9
