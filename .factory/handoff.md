# Run Before Next — polish round 2 handoff

Work order: `video-code-exit-tickets-polish-2`

Production: <https://video-code-exit-tickets.sociobot.in>

Deployed repair source: `b54a9f939d3709742e9854c9b59b791b6698e800`

Deployment: Azure Static Web Apps `2de7b923-8053-421a-a45b-1784ccc2d2f6`

## Outcome

All findings in `.factory/review-1.md` and `.factory/review-2.md` are resolved. Round 2 closes F-2-1 by registering and proving demo exit/isolation behavior instead of relying on an untagged regression test.

The new `demo-exit-isolation` claim test:

- passes the realistic arrays sample;
- leaves through Start for real, the wordmark, Privacy plus Back, and Back/Forward;
- checks starter code, “Not passed,” and initial output after every return;
- runs the live demo in an unpacked-extension profile with seeded private extension data;
- proves the private marker is not rendered and extension storage is unchanged after demo pass/reset.

The earlier first-screen, one-click demo, author compatibility wording, timestamp gate, install path, permission disclosure, real routes and metadata, focus restoration, styled 404, legal links, mobile layout, copy rewrites, offline behavior, and multi-checkpoint builder fixes remain present and passed again. The luminous mineral/glass identity and browser-extension/static-site artifact class are unchanged.

The catalog description is now: “Pause author-prepared programming videos until changed code passes.” It is verb-first and 67 characters.

## Exact verification evidence

- Fresh clean clone of `b54a9f939d3709742e9854c9b59b791b6698e800`: `npm ci` passed with zero vulnerabilities; all 23 exact claim commands from `.factory/claims.json` passed independently. Summary: `.factory/evidence/polish-2/clean-clone-summary.txt`.
- `npm run check`: passed.
- `npm run test:unit`: 3/3 passed.
- `npm test`: 23/23 passed.
- `npm run build`: passed; `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip` produced.
- Exact work-order build `npm ci && npm test && npm run build:site`: passed before deployment.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Playwright Axe: zero serious or critical issues on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and the 404.
- Local `verify-url.sh`: no console errors; correct title, `lang`, h1, main, alt text, and button labels on home and `/?demo=1`.
- Live `verify-url.sh`: the same checks passed. Reports: `.factory/evidence/polish-2/verify-live-home/verify.json` and `.factory/evidence/polish-2/verify-live-demo/verify.json`.
- Mobile 390 × 844: complete first-screen message/action/fact, no horizontal overflow, 44px key controls, usable demo, creator, privacy, and 404 layouts.
- Privacy: empty local/session/IndexedDB demo storage, same-origin demo requests, unchanged seeded extension storage, and inert no-manifest behavior.
- Offline: the production demo reloaded after one online visit.
- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.4 s, CLS 0, TBT 40 ms.
- Final live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 20 ms.
- Initial assets: JavaScript 28.56 kB raw / 9.64 kB gzip; CSS 17.94 kB raw / 4.81 kB gzip.
- Live ZIP: 9,852 bytes, Manifest V3 version 1.0.1, and file-for-file identical to the built unpacked extension.
- Live route crawl: `/`, `/demo`, `/creator`, `/privacy`, `/terms`, sample manifest, ZIP, robots, and sitemap returned 200; `/missing-page` returned the intended HTTP 404 with `noindex`.
- Cold production detail: `.factory/evidence/polish-2/live-cold-check.json`.
- Finding-by-finding evidence: `.factory/polish-2.md`.

## Run and verify

```bash
npm ci
npm run check
npm run test:unit
npm test
npm run build
npm audit --audit-level=high
```

Deploy `dist/site/` as the static root. The packaged extension is `dist/site/downloads/run-before-next-chrome.zip`.

## Known gaps

None found. New Creator Kit sales remain intentionally paused as stated on the site; this is product policy, not unfinished work.
