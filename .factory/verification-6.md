# Independent verification 6 — PASS

Verified 2026-08-28 from clean checkout commit `12ba15979dcb5f557878f18bf51b60b4e331d45c` against <https://video-code-exit-tickets.sociobot.in>.

## Decision

**PASS — ready to release.** The live deployment now matches the requested candidate. The required demo is one click, all registered claims pass from the clean checkout, and the real extension flow keeps a playable video paused until changed code passes and the learner explicitly resumes it.

## First-read and product fit

Cold desktop and 390×844 mobile loads plainly answer the acceptance questions:

- **Does:** “Prove your code before the video continues.”
- **For:** “For video learners who need to change and run each idea before moving on.”
- **First action:** **Try it with sample data**, visibly in the first 844 px on mobile; it says “Opens one JavaScript checkpoint. No setup.”

One click opens `/demo` with the bundled arrays lesson, a persistent **Demo — sample data, nothing is saved** banner, Reset demo, and Start for real. The sample is realistic for the brief: change the multiplier from `1` to `2` and produce `6, 10, 14`.

## Required claims

After `npm ci`, every exact command from `.factory/claims.json` was run separately from this clean checkout. All passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `timeout-recovery` | `npm test -- --grep @claim:timeout-recovery` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `creator-sales-paused` | `npm test -- --grep @claim:creator-sales-paused` | PASS |
| `sandbox-isolation` | `npm test -- --grep @claim:sandbox-isolation` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |
| `checkpoint-sorting` | `npm run test:unit -- --testNamePattern @claim:checkpoint-sorting` | PASS |
| `video-pause-gate` | `npm test -- --grep @claim:video-pause-gate` | PASS |
| `video-local-only` | `npm test -- --grep @claim:video-local-only` | PASS |
| `sandbox-no-extension-apis` | `npm test -- --grep @claim:sandbox-no-extension-apis` | PASS |
| `license-check-cadence` | `npm test -- --grep @claim:license-check-cadence` | PASS |
| `site-local-assets` | `npm test -- --grep @claim:site-local-assets` | PASS |

The complete `npm test` rerun passed **19/19** in 47.2 seconds. It includes the unpacked MV3 extension flow with a canvas `MediaStream`: it proves a programmatic `video.play()` remains paused during the checkpoint, keyboard focus stays in the modal, sandbox code has no extension APIs, changed code passes, and only progress—not source—is stored.

## Functional QA

- Demo normal path: changed program printed `6, 10, 14`, rendered **OUTPUT · PASSED**, and set state to Passed.
- Recovery paths: unchanged starter, empty code, wrong output, syntax error, and runtime exception each give a specific recovery message and leave Run check usable.
- Endless loop stopped in **1,514 ms**; this is within the claim’s 1,500 ms limit plus its declared 150 ms browser-scheduling margin. Corrected code then passed.
- Reset after pass and cancellation of a pending run were covered by the suite. Ctrl/⌘+Enter runs the check.
- At 390 px there is no horizontal overflow; the first screen, demo editor, actions, and persistent demo controls are usable. Key controls are at least 44 px tall.
- The site has no sign-in flow. The only unlock integration is the documented Sociobot verification endpoint.

## Privacy, security, deployment, and quality

- Fresh live demo request log contained only `video-code-exit-tickets.sociobot.in` resources plus local `blob:` workers. After passing, localStorage, sessionStorage, and IndexedDB were empty. The complete public-route local-assets claim passed.
- Live app CSP disallows `unsafe-eval`; `/sandbox.html` alone permits it and has `connect-src 'none'`. The app sends HSTS, `nosniff`, strict-origin referrer policy, `frame-ancestors 'none'`, and restrictive Permissions-Policy headers.
- Hashed JavaScript is `public, max-age=31536000, immutable`; `/sw.js` is `no-cache`. Service-worker `update()` completed and `/demo` reloaded offline after first visit.
- One client made 40 invalid license verification requests. Responses 1–30 were `200`; 31–40 were `429` with `Retry-After: 2–3`. Observed allowance: **30 requests per burst**.
- Axe found zero serious or critical findings on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and the intentional HTTP 404 route. Every route has `lang=en`, one `<h1>`, one `<main>`, and a route-specific title. Keyboard focus is a visible 3 px cyan outline. Reduced motion computes to `0s`/`none` and automatic scrolling.
- Supported-page browser console/page errors were zero. The route sweep records the expected browser network error for the intentionally requested HTTP 404, not an application error.
- `npm run check` passed; `npm run test:unit` passed 3/3; `npm run build` passed and produced `dist/site/`; `unzip -t dist/site/downloads/run-before-next-chrome.zip` passed; `npm audit --omit=dev --audit-level=high` found zero production vulnerabilities.
- Build budget: initial JS is **20,077 B** (**7,210 B gzip**); CSS is **15,667 B** (**4,350 B gzip**); mobile hero **22,334 B**; desktop hero **48,300 B**; extension zip **10,134 B**. All are within the stated limits.

## Deployment identity

Freshly built files were compared byte-for-byte with production. All 18 directly served artifacts matched: HTML, JS/CSS and source map, images, sandbox, service worker, metadata, fixture, and 404 page. The live extension ZIP’s eight unpacked files also matched byte-for-byte. The deployed artifact therefore is candidate `12ba15979dcb5f557878f18bf51b60b4e331d45c`.

## Defects

No P0, P1, P2, or P3 defects found.

Informational: `npm ci` reports 11 advisories in development tooling (2 moderate, 5 high, 4 critical); the production-only audit is clean. No product change was made by this verification.
