# Common Ground — modernized form

This completes the exercise on `article-2/legacy`. The legacy branch deliberately introduces two teaching examples. This branch applies the retrieved Modern Web Guidance recommendations to them.

- Bio grows with `field-sizing: content`, within height limits. The older-browser fallback is a standard scrollable, vertically resizable textarea.
- The name uses `:user-invalid` for error styling. Text and ARIA feedback follow the same state, with explicit submit, correction, and dialog-reset handling.

## Run

Use Node.js 26+ and npm.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173 and choose Edit profile. On a fresh profile, the empty required name starts neutral. Enter spaces and leave the field, or try Save profile, to see the error. Correct it, cancel, and reopen to inspect recovery. Paste multiple lines in Bio and then shorten the text.

Data is local under `mwg-modernization-v1`. To reset the exercise, remove this key in DevTools and reload. After changing branches, restart the server and reload every demo tab.

## Repeat the scan and checks

```sh
npx --yes modern-web-guidance@1.0.1 legacy-scan . --json
npx playwright install chromium firefox webkit
npm test -- --workers=1
```

The recorded scan goes from two findings to zero. The modernized branch passes 20 scenarios on each of three engines. The report links each result to source hashes and distinguishes simulated fallback coverage from actual older-browser testing.

Read [modernization evidence](verification/modernization/README.md) for the findings, guide decisions, and validation limits. Other verification files are historical records inherited from the previous preferences demo.
