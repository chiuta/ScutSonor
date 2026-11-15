# Changelog

## 2.1.1 — 2026-11-15

- New: hyper-detailed fractal textures (fff-texturi 1.1.2) — the background and large surfaces (cards, panels, headers, buttons; tabs and dialogs that are hidden at load, once they open) get a locally generated material (WebGL2, no network, no images) that tiles seamlessly; the app keeps its own colours. Turn it off in the "Transparency" dialog or with `?notex=1`.

## 2.1.0 — 2026-11-14

- Interface translated into 8 languages (RO, EN, FR, DE, ES, IT, HU, PT) with a language selector; the choice is remembered locally; default follows the browser language.
- Translations are machine-assisted and have not been reviewed by native speakers.
- New test `tests/i18n.test.mjs`.

## 2.0.0 — 2026-11-14

- First public release (audited v2 from June 2026): limiter without volume loss, click-free ramps, flashlight strobe, daylight mode, honest signal meter, safety guide.
- Adopt the fff-kit 1.5.0, `#app-version`, metas, `app.json`; CSP with SHA-256 script hash; axe 0 violations.
