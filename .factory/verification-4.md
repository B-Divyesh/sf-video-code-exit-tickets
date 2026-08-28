# Independent verification 4 — FAIL

Verified on 2026-08-28 against candidate commit `4334c1a11e23cce7b15efa999b78aa94aa593f4a` and [production](https://video-code-exit-tickets.sociobot.in).

## Decision

**FAIL — release blocked by a broken paid purchase path.** The free browser-extension product and its one-click demo work in fresh local and live checks, but the visible **Buy Creator Kit — $29** action leads to a production API response of `404 {"error":"enabled factory product","status":404}`. A visitor cannot buy the paid product that the site advertises, so this candidate does not work end to end for every shipped user path.

## Release-blocking defects

### P1 — Creator Kit checkout is not enabled

At 2026-08-28 21:52 UTC, a fresh request to `https://api.sociobot.in/api/v1/products/video-code-exit-tickets/checkout` returned HTTP 404 and:

```json
{"error":"enabled factory product","status":404}
```

The landing page calls this exact URL from the visible `$29` purchase button. The registered `manifest-export` claim only seeds a cached valid-license result; it proves that a licensed user can download a manifest, not that a customer can obtain that license. Enable/register the production Sociobot product and verify the real checkout return flow before release. Add an observable checkout-availability claim test or remove the paid offer until it is enabled.

### P2 — unknown URLs return a successful HTTP response

`GET https://video-code-exit-tickets.sociobot.in/missing-page` returns HTTP 200 and the SPA shell, rather than a real 404 response. The client eventually renders its styled “Page not found” screen, but crawlers and non-JavaScript clients receive a success. The checked-in `responseOverrides` configuration contains a `/404.html` rewrite, but `navigationFallback` consumes unknown paths first in the deployed behavior. Configure the host so unknown non-app paths return status 404 while supported SPA routes still deep-link.

## Required first-read test — PASS

A cold live page clearly states:

- **What:** “Prove your code before the video continues.”
- **For whom:** “For video learners who need to change and run each idea before moving on.”
- **First action:** the visible **Try it with sample data** link, followed by “Opens one JavaScript checkpoint. No setup.”

Clicking it once entered `/demo`, immediately displayed the realistic arrays checkpoint, and showed the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real.

## Claims from the clean install — PASS

After `npm ci`, every command listed in `.factory/claims.json` passed from the product demo/test entry point:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `timeout-recovery` | `npm test -- --grep @claim:timeout-recovery` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |

## Local quality gates — PASS

- `npm ci`: PASS. It reported 11 transitive development advisories; `npm audit --omit=dev --audit-level=high` reported **0 vulnerabilities**.
- `npm run test:unit`: PASS, 3/3.
- `npm run check`: PASS. There is no separate lint script.
- `npm test`: PASS, 13/13 Playwright tests. The accessible-route, 390px, offline-reload, keyboard/history, and extension groups were also rerun independently and passed.
- `npm run build`: PASS; it produced `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip`.
- Built initial JS is 20,136 B (7,337 B gzip); CSS is 15,386 B (4,311 B gzip); desktop/mobile hero images are 48,300/22,334 B. All are within the supplied static-product budgets. Lighthouse was not installed in this clean clone, so no fresh Lighthouse score is claimed.

## Functional and recovery evidence — PASS

- On live `/demo`, changing `* 1` to `* 2` and using Control+Enter produced `6, 10, 14` and Passed.
- Invalid JavaScript (`const = ;`) produced a clear recovery error in 440 ms; corrected code passed afterward.
- `while (true) {}` produced the documented timeout recovery in 1,509 ms wall-clock, left Run check usable, and accepted corrected code. The registered test measures the in-page timeout against its stated 1,650 ms allowance and passed.
- Reset demo returned state to Not passed. Keyboard tab navigation reached every demo banner control, navigation link, editor, Run check, and Reset code control. The checked CSS supplies a visible 3px cyan `:focus-visible` outline and reduced-motion rules.
- The unpacked built extension passed the fixture flow: it paused the checkpoint, interrupted endless code, passed the corrected code, stored checkpoint progress without source, and released the lesson.
- At 390×844, editor and Run check were visible and `scrollWidth` equalled 390.
- After an online visit and service-worker update, live `/demo` reloaded offline with the expected h1.

## Privacy, accessibility, headers, deployment identity — PASS

- Fresh browser request logging for landing and full demo flow saw only the site origin plus local `blob:` Workers; no third-party request, analytics, font CDN, or sign-in request occurred. After a demo pass, localStorage, sessionStorage, and IndexedDB were empty.
- Axe Playwright reported zero serious/critical findings on the landing and demo. The repository route suite covers `/`, `/demo`, `/privacy`, `/terms`, `/creator`, and the rendered not-found screen with one `h1` and one `main` each.
- Live pages had no page errors or console errors. Main CSP forbids `unsafe-eval`; `/sandbox.html` alone permits it and has `default-src 'none'`, `connect-src 'none'`, and `worker-src blob:`. HSTS, nosniff, strict-origin referrer policy, frame denial, and Permissions-Policy were present.
- Production served immutable caching for hashed assets and no-cache for `/index.html` and `/sw.js`.
- Local candidate HTML, JS, CSS, images, source map, sandbox, service worker, metadata, fixture, manifests, and extension files match production byte-for-byte. The downloadable ZIP container hash differs only because ZIP timestamps differ; all eight unpacked extension files are byte-identical.
- The invalid-license verification endpoint returned 200 with `Cache-Control: no-store`. A single-client rate probe received 30 successful responses, then 50 HTTP 429 responses with `Retry-After: 4`; observed allowance is 30 requests per burst. No sign-in flow exists, so no identity-provider test applies.

## Scope

No product code was modified during this verification. This report and `.factory/handoff.md` are the only candidate changes. The browser extension is not a library, CLI, or backend; its relevant unpacked-extension, service-worker update/offline, and purchase-verification checks were performed.
