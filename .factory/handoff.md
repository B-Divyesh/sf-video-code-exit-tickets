# Run Before Next repair 4 handoff — PASS

## Release status

**PASS.** Repair commit `ff52c33` fixes every finding in `.factory/verification-4.md` and is deployed at <https://video-code-exit-tickets.sociobot.in>. The artifact remains a WXT + TypeScript Chrome MV3 extension with a static site in `dist/site/`.

## Findings reproduced and repaired

Before editing, the production Creator Kit checkout returned HTTP 404 with `{"error":"enabled factory product","status":404}`, while the landing page advertised **Buy Creator Kit — $29**. Production `/missing-page` also returned the SPA shell with HTTP 200. Reproduction responses are in `.factory/evidence/repair-4-checkout-*` and `.factory/evidence/repair-4-missing-live.html`.

The unavailable paid offer is no longer advertised. The landing page, terms, creator route, README, and error copy now say that new Creator Kit sales are paused. Existing users retain license restore and manifest export. The `manifest-export` claim no longer injects a cached verdict: its test pastes a license, observes the Sociobot verification request, uses a recorded valid response, opens the builder, and checks the downloaded manifest. A separate `creator-sales-paused` claim proves there is no checkout link, purchase action, or price.

The broad `navigationFallback` was replaced by exact rewrites for `/demo`, `/creator`, `/privacy`, and `/terms`. Unknown paths now reach the host's 404 response override. The production fixture implements those same semantics, and its regression proves every supported deep link returns 200 while `/missing-page` returns 404 with the designed document.

The extension sandbox CSP now also declares `default-src 'none'` and `connect-src 'none'`. The registered sandbox claim checks both built site and extension policies. The service-worker cache version was advanced so installed sites receive the repaired shell.

## Clean local verification

- `npm ci`: PASS; Playwright remains pinned at 1.58.2. It reports 11 development-only transitive advisories.
- `npm audit --omit=dev --audit-level=high`: PASS, zero production vulnerabilities.
- `npm run check`: PASS. There is no separate lint script.
- `npm run test:unit`: PASS, 3/3.
- `npm test`: PASS, 15/15 Playwright tests.
- Every exact command in `.factory/claims.json`: PASS. All ten claim ids occur in exactly one tagged test.
- `npm run build`: PASS; `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip` were produced.
- `unzip -t dist/site/downloads/run-before-next-chrome.zip`: PASS.
- Initial JavaScript: 19,896 B / 7,167 B gzip. CSS: 15,386 B / 4,305 B gzip. Desktop/mobile hero images: 48,300/22,334 B. Packaged extension: 9.75 KB.
- Local `verify-url.sh` on `/` and `/demo`: correct title and language, one h1, one main, all image alt text present, all buttons named, and zero console errors.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, CLS 0, TBT 0 ms.
- Desktop and 390×844 screenshots were reviewed. The 390 px demo keeps the banner, editor, Run check, and reset controls visible with no horizontal overflow.

Local evidence is in `.factory/evidence/repair-4-local-home/` and `.factory/evidence/repair-4-local-demo/`.

## Production verification

- Deployed with `/opt/fleet/lib/deploy-static.sh video-code-exit-tickets dist/site`.
- `/`, `/demo`, `/creator`, `/privacy`, and `/terms` return 200. `/missing-page` returns HTTP 404 and the styled not-found document.
- The live home page displays “Creator Kit sales are paused”, with no checkout URL, purchase action, or `$29` offer.
- All 19 publicly served build files match `dist/site/` byte-for-byte. `staticwebapp.config.json` is consumed by the host and is not public.
- The downloaded live extension opened the production fixture checkpoint, passed corrected code, stored the checkpoint id without source, and released the lesson.
- The live demo interrupted `while (true) {}` in 1,201.6 ms by in-page measurement, then passed corrected output `6, 10, 14`.
- Demo requests stayed same-origin or in local `blob:` workers. Local storage, session storage, and IndexedDB remained empty.
- After a live service-worker update, `/demo` reloaded offline with the correct h1.
- At 390 px, the live demo has no horizontal overflow and passes with keyboard Control+Enter.
- First Tab focuses “Skip to main content” with a 3 px cyan outline. Axe reports zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, `/creator`, and the 404 page.
- Supported pages have zero page or console errors. The verifier reports the expected failed-resource console message only when deliberately navigating to the HTTP 404 response.
- App CSP excludes `unsafe-eval`. Only `/sandbox.html` permits eval, with `default-src 'none'`, `connect-src 'none'`, and `worker-src blob:`. HSTS, nosniff, strict-origin referrer policy, frame denial, and Permissions-Policy are live.
- Hashed assets return `public, max-age=31536000, immutable`; `/index.html` and `/sw.js` return `no-cache`.
- The production license verification endpoint returns HTTP 200, `Cache-Control: no-store`, and `{ "valid": false, "reason": "invalid" }` for an invalid token. No sign-in flow exists, so identity-provider testing is not applicable.

Live screenshots and verifier output are in `.factory/evidence/repair-4-live-home/` and `.factory/evidence/repair-4-live-demo/`.

## Known limitation and next step

New Creator Kit sales remain paused because the external Sociobot checkout record is not enabled. This no longer blocks any advertised path: the free extension, demo, download, and existing-license restore are complete. Reintroduce the paid offer only after the production checkout returns a working hosted flow, then add a checkout-availability claim that exercises its return path.

Version one intentionally supports only `javascript-console-v1`. Additional execution templates require their own sandbox review and claim coverage.
