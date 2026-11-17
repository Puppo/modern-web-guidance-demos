# Modernization exercise — November 17, 2026

## Provenance

`article-2/legacy` at `b2b1169` is a deliberately constructed teaching variant of `article-2/refined` at `d5eda25`. Its empty initial profile, separate storage key, unconditional textarea auto-resizing, and premature `:invalid` styling are explicit exercise choices. This is not a skill-versus-no-skill generation comparison.

The workflow was executed through the Modern Web Guidance CLI in the authoring session. The article's Antigravity prompt is a suggested way for readers to reproduce the workflow, not a record of a tested Antigravity run.

## Findings and contextual decisions

`npx --yes modern-web-guidance@1.0.1 legacy-scan . --json` checked 52 deterministic rules across 38 guides. See [before](scan-before.json) and [after](scan-after.json).

| Finding | Context verification | Applied decision |
| --- | --- | --- |
| `form-fields-automatically-fit-contents` in app.js | The input listener measures the bio textarea on every edit and has no feature guard. It is not a virtual-scrolling calculation or compatibility fallback. | Remove the helper and both calls. Use CSS auto-sizing with a stable width and minimum/maximum block sizes. Accept ordinary scrolling and vertical resizing when unsupported. |
| `validate-input-after-interaction` in styles.css | The error border is an unguarded `input:invalid` rule, with no interaction gate. | Use `:user-invalid`. Synchronize visible error text, `aria-invalid`, and `aria-describedby`; preserve invalid-submit focus and clear state on correction and closing. |

Both guides were retrieved using version 1.0.1. Their output SHA-256 hashes are in [results](results.json). Skill revision was `2026_11_10-47b4c80e`. Guide content can evolve independently of these demo checkpoints.

The sizing guide allows standard fixed-field scrolling as the progressive fallback when automatic growth is optional. This exercise adopts that product decision. The validation guide requires explicit ARIA synchronization and a linked error only while shown. A polite live region lives inside the dialog so background inertness does not hide it during editing. Error space remains reserved to avoid moving action buttons as feedback changes.

Guides: [auto-sizing](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/form-fields-automatically-fit-contents.md), [validation timing](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/validate-input-after-interaction.md).

## Verification

- Legacy fixture: 45 existing test executions passed (15 scenarios × 3 engines).
- Modernized fixture: 60 test executions passed (20 scenarios × 3 engines), with one worker and no retries.
- Added scenarios cover untouched/reopened validation, invalid blur and correction, invalid submit and cancellation, textarea growth/capping/shrinking and saved values, and fallback presentation at 390 px.
- All tested engines support both CSS features. The fallback test forces `field-sizing: fixed` in a current browser and verifies scrolling, width, resizing availability and saving. It does not simulate a complete old browser.
- [Observations](observations.json) record browser versions and computed border colors. Both initial fields are constraint-invalid; only the legacy one has the red error border before interaction.
- Screenshots are actual Chromium dialog captures, visually checked during authoring. Full raw test output is retained locally in ignored `private-evidence/`.

Zero scanner findings means the matched legacy patterns are gone within this scanner's coverage. It is not a full accessibility or compatibility audit. Screen-reader speech and actual older-browser/device behavior remain untested. No performance improvement is claimed from removing the sizing handler.
