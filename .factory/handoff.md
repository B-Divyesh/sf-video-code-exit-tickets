# Run Before Next — polish round 3 handoff

Work order: `video-code-exit-tickets-polish-3`

Review base: `41c5c075da6559df03f0204b552970a6ecedd8f0`

Final product commit: `d61ac9053602da797e9933c4345833053af90603`

Production: <https://video-code-exit-tickets.sociobot.in>

## Outcome

All findings in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` are resolved. The round 3 defect is fixed: the first screen now states “The sample reloads offline after one online visit.” The 390×844 regression test asserts the job, audience, action, compatibility, offline, privacy, and free-price facts are all above the fold.

Final live verification also exposed and fixed a normal-motion edge in F-1-7. History restoration now moves scroll and focus together immediately instead of allowing smooth scrolling to leave keyboard focus temporarily off-screen. The regression test covers normal and reduced-motion modes.

The existing luminous mineral-glass visual system, WXT MV3 extension, isolated in-memory demo, local manifest builder, route documents, legal pages, and packaged ZIP remain intact.

## Changes

- Replaced the first-screen “No account.” fact with the exact registered offline promise.
- Expanded the mobile first-screen test to assert all required fact categories within 844 px.
- Made new-route and history scroll restoration synchronous with focus placement.
- Added `scripts/verify-live.mjs` for repeatable cold route, metadata, mobile, demo, privacy, offline, focus, link, header, console, and Axe verification.
- Updated `.factory/catalog-description.txt` to the 74-character verb-first sentence: “Prove a code change before an author-prepared programming video continues.”
- Updated the exhaustive copy audit and added `.factory/polish-3.md` with finding-by-finding evidence.

## Clean-clone verification

A fresh clone at `/tmp/rbn-polish3-final-UzexrY` checked commit `d61ac9053602da797e9933c4345833053af90603`.

- `npm ci`: passed; 0 vulnerabilities.
- All 23 exact `.factory/claims.json` commands: passed independently.
- `npm run check`: passed.
- `npm run test:unit`: 3/3 passed.
- `npm test`: 23/23 passed.
- `npm run build`: passed and produced `dist/site/` plus the packaged MV3 ZIP.
- `npm audit --audit-level=high`: passed; 0 vulnerabilities.

Claim-by-claim results are in `.factory/evidence/polish-3/clean-claim-results.json`. The concise run record is `.factory/evidence/polish-3/clean-clone-summary.txt`.

## Accessibility, privacy, offline, and browser evidence

- Playwright Axe found zero serious or critical violations across `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and the HTTP 404.
- Every route has `lang="en"`, one h1, one main landmark, correct source and rendered metadata, and no 390 px overflow.
- Keyboard run, 44 px key targets, dialog operation, new-route heading focus, and visible Back focus passed.
- The demo passed with `6, 10, 14`, reset to starter state, discarded edits on exit, and showed its persistent banner/actions.
- Demo `localStorage`, `sessionStorage`, and IndexedDB remained empty. Demo requests stayed same-origin. Seeded extension storage remained unchanged in the claim test.
- The demo reloaded offline after one online visit.
- All intended internal links and downloads returned 200. `/missing-page` returned a designed HTTP 404 with `noindex`.
- Home and direct `?demo=1` produced no console errors under `/opt/fleet/lib/verify-url.sh`.
- Live CSP includes response-header `frame-ancestors 'none'` and `object-src 'none'`; nosniff and strict referrer policy are present.

Cold production details are in `.factory/evidence/polish-3/live-cold-check.json`. Current screenshots include:

- `.factory/evidence/polish-3/live-home/screenshot-mobile.png`
- `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`
- `.factory/evidence/polish-3/live-creator-mobile.png`
- `.factory/evidence/polish-3/live-privacy-mobile.png`
- `.factory/evidence/polish-3/live-terms-mobile.png`
- `.factory/evidence/polish-3/live-404-mobile.png`

## Performance and payloads

- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.5 s, TBT 40 ms, CLS 0.
- Live Lighthouse: 100/100/100/100; LCP 1.1 s, TBT 0 ms, CLS 0.
- Initial JavaScript: 28.76 kB raw / 9.70 kB gzip.
- CSS: 17.94 kB raw / 4.81 kB gzip.
- Mobile hero image: 22.33 kB.
- Packaged extension ZIP: 9.85 kB.

Reports: `.factory/evidence/polish-3/lighthouse-local.json` and `.factory/evidence/polish-3/lighthouse-live.json`.

## Deployment

The exact work-order command ran successfully:

```bash
npm ci && npm test && npm run build:site
/opt/fleet/lib/deploy-static.sh video-code-exit-tickets dist/site
```

Final Azure Static Web Apps deployment: `8ff6a315-b67f-4e9e-809e-4cd8eb394999`.

The custom domain returned HTTPS 200. The downloaded production ZIP SHA-256 matched `dist/site/downloads/run-before-next-chrome.zip` exactly:

`ffaa82e15a35619142234740fb07bbe620a8f2d009484b8c24e0205fa8d37976`

## How to verify

```bash
npm ci
npm run check
npm run test:unit
npm test
npm run build
node scripts/verify-live.mjs https://video-code-exit-tickets.sociobot.in .factory/evidence/polish-3
```

## Known gaps and next steps

None. No review finding or required acceptance item remains open.
