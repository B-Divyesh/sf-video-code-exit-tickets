# Run Before Next handoff

## Repair status — ready for deployment

This repair addresses both findings in independent verification report `749d05ccbdd87460c004c2a8a10992cc6c0f728f` for candidate `853fd8ba4c3a7365292581c9fe7d9fd37dc1ee41`.

- The `/demo` runner no longer evaluates learner code in the main site context. `shared/runner.ts` now creates a hidden, opaque-origin `<iframe sandbox="allow-scripts">` at `/sandbox.html`, matching the isolation model already used by the extension. The main CSP remains `script-src 'self'` with no `unsafe-eval`. Only `/sandbox.html` receives a tightly scoped CSP permitting `unsafe-eval`; it has no network, images, styles, forms, objects, or inherited site origin. The changed `* 2` sample produces `6, 10, 14` under these production headers.
- `staticwebapp.config.json` now serves `/assets/*` with `Cache-Control: public, max-age=31536000, immutable`. `index.html` and `sw.js` are `no-cache`, so deployments and service-worker updates are discovered promptly.
- `tests/production-server.mjs` serves the built static artifact using the committed Static Web Apps CSP/cache configuration. Playwright now proves that `demo-pass` works with the main CSP, that the sandbox is the only eval-enabled document, and that cache headers have the intended values. This closes the deployment-only test gap.

Deployed to `https://video-code-exit-tickets.sociobot.in` from repair commit `3bbede8` on 2026-08-28 with the Static Web Apps production deployment token for `sf-video-code-exit-tickets`. Live checks passed: `/demo` changed-code keyboard run returned `6, 10, 14` with no page or console errors; the 390px view had no horizontal overflow; the live URL verifier found one `h1`, `lang=en`, a main landmark, and no missing alt text or unlabeled buttons. Live headers confirm the main page excludes `unsafe-eval`, `/sandbox.html` has the isolated no-network eval policy, `/assets/index-C7-dK_vi.js` is immutable for one year, and `/sw.js` is `no-cache`.

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

Repair verification completed locally on 2026-08-28:

- `npm ci`: passed from a clean dependency install.
- `npm run check`: passed.
- `npm run test:unit`: 3 passed.
- `npm test`: 11 Playwright tests passed. This includes every `.factory/claims.json` command, unpacked-extension consumer flow, desktop and 390px mobile, keyboard execution, privacy request/storage capture, offline reload, service-worker `registration.update()`, route/history/link checks, and Axe serious/critical checks.
- `npm run build`: passed; writes `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip`.
- `npm audit --omit=dev --audit-level=high`: 0 production vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/repair`: passed with no console errors, title `Demo — Run Before Next`, `lang=en`, one `h1`, a main landmark, and no missing image alt text or unlabeled buttons. Evidence: `.factory/evidence/repair/verify.json`.
- Built site assets: initial JavaScript 7.27 KB gzip; CSS 4.31 KB gzip; hero WebP 48 KB desktop and 22 KB mobile. The extension remains 19 KB unpacked and 9.37 KB packaged.

Claim definitions and exact isolated commands are in `.factory/claims.json`. Demo isolation is in `.factory/demo.md`. Landing copy and terminology are audited in `.factory/copy-audit.md`.

## Known gaps and next steps

- Version one runs short JavaScript console exercises only. Python and full-stack templates need separate reviewed sandboxes.
- The extension targets the first video element on a page. A later manifest version can add an explicit video selector.
- Chrome MV3 is packaged and tested. Firefox packaging is not included.
- The factory must register the `video-code-exit-tickets` billing product and confirm its production return URL before sales open.
- Classroom analytics are not in version one. The paid Creator Kit is local and does not collect learner activity.
- No repair-specific gaps remain. Future template expansion still needs separately reviewed sandbox policies.
