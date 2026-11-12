# Technical verification

Checked on 2026-11-12 in Chrome 157 on macOS through Chrome DevTools. This is a guided development preview, not an isolated comparison run.

## Preserved source

Initial implementation: `4fc091d` (before browser verification and fixes). Subsequent changes shorten accessible names to avoid repeating descriptions and delay cross-tab announcements until a modal is closed. The initial source remains in Git history.

## Results

- 19 scripted interaction checks passed at 320 × 740 with reduced motion enabled. See `interaction-checks.json` and `../tests/browser-checks.js`.
- Keyboard input through DevTools: Tab reached Edit profile, Enter opened the modal with focus on the name, Tab reached the bio, and Escape closed it and returned focus to Edit profile.
- Reload restored the saved profile, dark theme, and independent email preference.
- Corrupt JSON at startup showed defaults with a warning and working controls.
- A throwing localStorage getter at startup and a throwing setItem during use left editing usable and reported that persistence failed.
- Emulated system theme changes updated the System label and colors. An explicit dark override survived dark → light OS changes.
- A synthetic cross-tab storage event during an open dialog remained silent until cancellation. A real two-tab conflict flow is not yet tested.
- Text snapshot confirmed concise control names and separate help descriptions after the correction.
- Screenshots inspected at 1440 px (light) and 390 px (dark). No horizontal overflow at 320 px, including long unbroken profile values.
- Reduced-motion emulation found no running animations; this implementation intentionally includes no motion.
- Forced-colors emulation preserved the accessibility tree. Full visual validation of Windows high contrast is outstanding.

Lighthouse snapshot audits: accessibility, best practices, SEO, and agentic browsing each scored 100 in the light desktop, dark mobile, and open-dialog mobile states. Reports are retained alongside this file. These snapshots do not measure performance and do not certify accessibility. They precede only the later cross-tab announcement adjustment, which was checked separately.

The first exploratory script incorrectly compared scrollWidth with innerWidth, flagging the width of the vertical scrollbar as overflow. Actual measurements were scrollWidth = clientWidth = 1425, innerWidth = 1440. The repeatable check now compares scrollWidth with clientWidth. The original observation is preserved in `initial-interaction-checks.txt`.

## Outstanding

- Actual screen-reader testing and spoken announcements.
- Safari, Firefox, real mobile devices, browser zoom at 200%, and no-JavaScript runtime checks.
- Full keyboard traversal and pointer-based outside dismissal.
- Older browser fallback execution and real multi-tab conflicts.
- Performance tracing.

## Reproduce the scripted checks

Use a dedicated browser context at the local demo origin. In DevTools, remove only `mwg-preferences-v1` from localStorage, then reload. Paste `tests/browser-checks.js` into the console and run `await checkPreferences()`. The checks deliberately modify demo data. They exercise DOM interactions; they do not replace keyboard or screen-reader tests.

## Guidance provenance

Queries: `build accessible modal dialog`, `style accessible forms`, `implement color scheme`.

Guides retrieved: `dialog`, `forms`, `accessibility`, `dark-mode-toggle`, `dark-mode`, `color`, `html`. Installed skill revision argument: `2026_11_09-5bcc021b`. Retrieval used `pnpx modern-web-guidance@latest`; exact resolved package version is unknown. Full retrieval output is retained locally in ignored `private-evidence/`, with hashes in `guidance.json`.

Decisions shaped by the guides:

- Native modal focus and dismissal; no custom focus trap or redundant dialog ARIA.
- Native labels, radios, checkboxes, and constraints; whitespace validation on submission.
- Save announcements occur after the background stops being inert.
- Root color-scheme follows the meta element; the system choice removes the stored theme override.
- Explicit color fallbacks, visible focus outlines, and forced-color tokens.
- Optional outside dismissal and scroll containment degrade without blocking Cancel or Escape.

Sources: [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) and locally retrieved guides. No control-condition implementation has been generated.
