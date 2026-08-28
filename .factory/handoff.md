# Run Before Next handoff

## What was built

- A WXT and TypeScript Chrome MV3 extension.
- Author manifests embedded as `application/json` on lesson pages.
- Validation for unique ids, timestamps, required fields, and the `javascript-console-v1` allowlist.
- Page video monitoring that pauses at each incomplete checkpoint.
- A keyboard-ready checkpoint panel with reset, exact-output feedback, timeout errors, pass state, and lesson resume.
- A declared MV3 sandbox page. Learner code has no extension API access.
- Local progress that stores page addresses and passed checkpoint ids, never learner source.
- A popup with lesson status, an empty state, and a manual **Open next checkpoint** action.
- A static landing site with `/demo`, `/creator`, `/privacy`, `/terms`, and styled 404 handling.
- A one-click sample lesson with in-memory data, reset controls, keyboard execution, error feedback, and offline reload.
- A $29 one-time Creator Kit. The site accepts return licenses, verifies through the Sociobot billing API, caches results for one day, restores pasted licenses, and gates the manifest builder.
- An original luminous glass landscape, responsive WebP derivatives, Open Graph art, favicon, and apple-touch icon.
- Service-worker caching, security headers, metadata, sitemap, robots file, and a packaged extension download.

Runtime AI was not added. The product has a deterministic verification job and does not benefit from sending learner code to a model.

## Run and verify

```bash
npm install
npm run check
npm run test:unit
npm test
npm run build
```

`npm run build` is the deployment build. It writes the static root to `dist/site/`, including `index.html` and `downloads/run-before-next-chrome.zip`. The unpacked extension is in `.output/chrome-mv3/`.

Verification completed on 2026-08-28:

- TypeScript: passed.
- Vitest: 3 passed.
- Playwright: 9 passed, including all claims, the unpacked extension, offline reload, 390px layout, keyboard execution, history, links, console, and axe.
- Axe: no serious or critical findings on home, demo, creator, privacy, terms, or not-found routes.
- Factory URL verifier: passed; no console errors, one `h1`, `lang=en`, main landmark, no missing image alt text, no unlabeled buttons. Evidence: `.factory/evidence/verify.json`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse timings: FCP 0.9s, LCP 1.4s, CLS 0, TBT 0ms, Speed Index 0.9s.
- Built site assets: initial JS 7.37 KB gzip; CSS 4.31 KB gzip; hero WebP 48 KB desktop and 22 KB mobile.
- Extension: 19 KB unpacked output; 9.37 KB packaged zip.
- Production dependency audit: `npm audit --omit=dev` reports 0 vulnerabilities.

Claim definitions and exact isolated commands are in `.factory/claims.json`. Demo isolation is in `.factory/demo.md`. Landing copy and terminology are audited in `.factory/copy-audit.md`.

## Known gaps and next steps

- Version one runs short JavaScript console exercises only. Python and full-stack templates need separate reviewed sandboxes.
- The extension targets the first video element on a page. A later manifest version can add an explicit video selector.
- Chrome MV3 is packaged and tested. Firefox packaging is not included.
- The factory must register the `video-code-exit-tickets` billing product and confirm its production return URL before sales open.
- Classroom analytics are not in version one. The paid Creator Kit is local and does not collect learner activity.
- Store review and deployment remain factory operations; this repository does not change DNS or infrastructure.
