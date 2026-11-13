# Cross-browser verification — 2026-11-13

## Scope and outcome

45 tests passed: 15 scenarios on each of Playwright's Chromium, Firefox, and WebKit builds. Exact versions are recorded in `browser-environment.json`; tested source hashes and per-test results are in `cross-browser-results.json`.

These are automated browser tests, not screen-reader tests. WebKit coverage is not a claim that branded Safari or a real iPhone was tested.

## Reproduced defect and correction

Before the fix, a tab with unsaved preferences ignored a profile update from another tab. Saving the preferences then wrote its stale profile back to storage. The inverse also occurred: saving an open profile draft overwrote a theme saved by another tab.

The storage listener now refreshes the saved baseline and non-edited UI while leaving the active form draft intact. Subsequent saves retain received changes to the other form. Canceling a profile draft and discarding preference changes restore the latest received values. Four real two-page tests cover the save/cancel/discard cases; a fifth covers clean-tab synchronization.

The original implementation remains at `df397eb` on `article-1/guided`. The change is deliberately small and does not add synchronization libraries. Same-form edits and genuinely simultaneous writes remain last-save-wins; localStorage is not a transaction system.

## Other checks

- Existing 19 scripted interaction assertions at 320 px with reduced motion.
- Keyboard opening, dialog traversal, background exclusion, Escape and focus return.
- Native radio arrow keys and checkbox Space activation.
- Outside-click dismissal where supported, with Cancel otherwise.
- Persistence after reload and system-theme changes with an explicit override.
- Blocked storage and invalid JSON recovery.
- JavaScript disabled: visible explanation, disabled save/edit actions, system colors.
- Text size doubled at a 640 px viewport without horizontal page or dialog overflow. This is text enlargement, not native browser zoom.

## Test harness corrections

The first run started before Firefox/WebKit downloads finished; missing executable errors were setup failures, not application regressions. The Chromium run exposed the two actual data-loss defects.

The no-JavaScript assertion initially targeted the noscript container. The content was present in the DOM and visibly rendered, but Playwright's normalized text matcher returned no text for that container. The corrected assertion targets its paragraph.

On macOS, WebKit's normal Tab traversal can skip buttons and links. Keyboard tests now use Option+Tab for that engine/platform, following Playwright's own focus tests, rather than changing application tabindex values to compensate for browser preferences.

Source: [Playwright focus tests](https://github.com/microsoft/playwright/blob/main/tests/page/page-focus.spec.ts).

The initial exploratory reports and full final report are retained locally in ignored `private-evidence/`. Compact portable results are committed. No claim of a baseline-versus-skill experiment is made.

## Still outstanding

Manual screen-reader testing, actual Safari/iOS and Android devices, native browser zoom, older feature-fallback paths, and performance profiling. Automated success does not establish full accessibility compliance.

## Node-only tooling follow-up

The local demo and test server now use pinned `http-server@14.1.1`, with Node.js 26+ required and `.nvmrc` set to 26. Both demo branches were smoke-tested with `npm ci` and `npm start`. The application sources are unchanged.

On Node.js 26.13.0, the first default parallel run passed 43 tests and timed out on two Firefox scenarios (canceling a profile draft and discarding preferences). A full rerun with `npm test -- --workers=1` passed all 45 tests. The timeout cause was not established; this is not a claim that parallel flakiness is resolved. See `node-server-results.json` for this follow-up; earlier evidence remains unchanged.
