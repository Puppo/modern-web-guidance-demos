# Common Ground — modernization starting point

This is an intentionally constructed teaching variant of the preferences demo. It starts from the corrected application at d5eda25 and adds two patterns to inspect with Modern Web Guidance: an unconditional JavaScript textarea auto-resizer and premature input error styling with :invalid. A new profile starts empty so the validation timing is visible.

## Run

Use Node.js 26+ and npm.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173, choose Edit profile and inspect the empty name before typing. Enter several lines in Bio to see the auto-resizer. Local data uses the separate key `mwg-modernization-v1`. Remove that key and reload to reset the exercise.

## Scan

```sh
npx --yes modern-web-guidance@1.0.1 legacy-scan . --json
```

The scan reports candidates that require contextual review. The matching completed exercise will be on `article-2/modernized`. After switching branches, restart the server and reload every demo tab.

## Checks

```sh
npx playwright install chromium firefox webkit
npm test -- --workers=1
```

Historical verification files inherited from d5eda25 describe the earlier application. New modernization evidence records this exercise separately. The prepared legacy examples are not an unguided AI generation result.
