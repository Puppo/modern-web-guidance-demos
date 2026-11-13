# Common Ground — refined user preferences demo

A small settings page built with vanilla HTML, CSS, and JavaScript, using Modern Web Guidance. No build step, external fonts, or runtime dependencies.

## Run locally

From this directory, with Node.js 26 or newer and npm installed:

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173. Keep this origin consistent: browser storage is origin-specific. Stop the server with Ctrl+C. The pinned `http-server` package is a development dependency; the browser application still has no runtime dependencies.

## Try it

- Edit the profile, save it, and reload. Cancel, Escape, and supported outside-click dismissal discard edits.
- Submit an empty or whitespace-only display name.
- Preview light, dark, or system appearance. Save to retain it, or discard to restore the last applied preference.
- Toggle either notification preference independently. These settings do not send emails.
- Block browser storage and try saving: changes remain usable for the session with an explicit warning.

Data stays in this browser under `mwg-preferences-v1`. Remove that key in DevTools to reset. Nothing is uploaded. JavaScript is needed for editing and persistence; the page explains this if it is disabled.

## Changes in this version

This branch starts from `article-1/guided` at `df397eb`. It fixes a reproduced two-tab data-loss bug: receiving remote changes now refreshes saved state while preserving the current form draft. Saving one form no longer overwrites an already received change to the other form. Cancel and Discard restore the latest received saved values.

Concurrent edits to the same form remain last-save-wins. This local demo does not provide transactional synchronization for simultaneous writes.

## Implementation

- Native `<dialog>` and `showModal()` supply modal semantics and focus behavior. `closedby="any"` is optional: Cancel and Escape remain available without it.
- Native radios, checkboxes, labels, fieldsets, and form constraints retain browser behavior.
- Theme selection previews immediately but persists only on Save. System mode removes the override. Both native controls and page colors follow the chosen scheme.
- Profile drafts are separate from saved preferences, so saving a profile does not silently save an unsubmitted theme selection.
- Storage access and parsing are guarded. Display names and bios are inserted as text, not HTML.
- No animation is included in this first implementation.

Browser policy: Baseline Widely available as of 2026-11-12, with progressive enhancement for newer features. `light-dark()` has a CSS fallback; unsupported `accent-color` keeps native colors; modal scroll containment may degrade in some browsers. See [verification notes](verification/README.md) for actual coverage.

## Provenance

This is a development preview created in the existing planning conversation, with prior knowledge of the briefs. It is **not** an isolated guided experiment and must not be compared with a baseline as if all generation conditions matched. The initial source snapshot is preserved as a separate commit before browser verification and fixes.

Technical guidance references and test evidence live in `verification/`. Editorial briefs live separately in the blog checkout.

## Checks

Use the same Node.js environment to run the automated tests:

```sh
npm ci
npx playwright install chromium firefox webkit
npm test
```

The test runner starts its own Node.js static server on port 4174 and uses isolated browser contexts. It does not reuse or clear your personal browser data. Playwright is a development dependency only.

Run `npm run test:report` to inspect the latest local report. Traces and screenshots are retained on failure in ignored output directories. Committed verification summaries record the tested source hashes and browser versions.

See [technical verification](verification/README.md) and [cross-browser findings](verification/cross-browser.md) for evidence and coverage limits.
