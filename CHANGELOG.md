# Changelog

## 2.2.2 — 2026-11-17

- Older-browser compatibility (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kit 1.8.0 brings the compatibility layer (fallbacks for APIs missing in old engines), and JavaScript syntax newer than ES2017 was replaced with equivalent forms where it existed; newer regular expressions and `import()` go through fallbacks. No functional changes intended. Verified with an ES2017 parser and in a simulated old engine, not on real devices.

## 2.2.1 — 2026-11-15

- New: social-sharing buttons (vertical, on the left edge; no external scripts, plain links opened only on click); the magnifier zoom and “fit screen” bar returns to the right edge, vertically centred; fixed overlapping layout at high zoom (panels sized in vh/vw no longer overflow the screen).

## 2.2.0 — 2026-11-15

- New: accessibility on every screen — the “Aa” button (text size, high contrast, no animations, readable text, underlined links, read aloud), a “Back to top” arrow and “Skip to content”; the window always fits the screen; the magnifier zoom and “fit screen” controls now sit on the left edge (fff-kit 1.6.0).

## 2.1.2 — 2026-11-15

- Changed: shared interface kit refreshed (ux v2) — on touch screens, small controls get a 44 px touch target; rows that would no longer fit keep their size. No change to the app's own logic or texts.

## 2.1.1 — 2026-11-15

- New: hyper-detailed fractal textures (fff-texturi 1.1.2) — the background and large surfaces (cards, panels, headers, buttons; tabs and dialogs that are hidden at load, once they open) get a locally generated material (WebGL2, no network, no images) that tiles seamlessly; the app keeps its own colours. Turn it off in the "Transparency" dialog or with `?notex=1`.

## 2.1.0 — 2026-11-14

- Interface translated into 8 languages (RO, EN, FR, DE, ES, IT, HU, PT) with a language selector; the choice is remembered locally; default follows the browser language.
- Translations are machine-assisted and have not been reviewed by native speakers.
- New test `tests/i18n.test.mjs`.

## 2.0.0 — 2026-11-14

- First public release (audited v2 from June 2026): limiter without volume loss, click-free ramps, flashlight strobe, daylight mode, honest signal meter, safety guide.
- Adopt the fff-kit 1.5.0, `#app-version`, metas, `app.json`; CSP with SHA-256 script hash; axe 0 violations.
