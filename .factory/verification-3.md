# Independent verification 3 — FAIL

Verified 2026-08-28 against candidate commit `3ff5938909adad5e89daf8c128b564308b5ddedc` and [production](https://video-code-exit-tickets.sociobot.in).

## Decision

**FAIL — release blocked by the mandatory claims contract.** The previous production defects are repaired and the product works end to end in fresh live testing. However, README makes a quantitative promise that is not stated or measured by its corresponding registered claim test. The supplied claims rules require every quantitative claim to assert the number it promises; they make an unlisted or unproved claim a review failure.

## Release-blocking defect

### P1 — the 1.5-second timeout promise is not tested as a 1.5-second promise

README says: “A run stops after 1.5 seconds if it does not return.” The only related entry in `.factory/claims.json` is `timeout-recovery`, whose claim is only “Stops an endless demo program and lets the learner run corrected code.” Its exact test waits as long as 2.5 seconds for the timeout text; it neither names nor measures the advertised 1.5-second limit.

This violates the claims rule for quantitative copy: the registered claim must contain the number and its one sandbox test must measure that number with a stated margin. The implementation happens to be fast enough today: fresh production measurement from dispatching `while (true) {}` to the displayed recovery message was **1202.1 ms**. That is evidence the feature works, not a substitute for a durable numeric assertion in the product test suite.

Required repair: amend the claim to state the real timeout promise and update its single test to measure it (with an explicit scheduling margin), or remove the `1.5 seconds` promise from README. Re-run all claim commands and independent verification afterward.

## Required first-read test — PASS

A cold 390px production load answered the required questions in plain words on the first screen:

- **What:** “Prove your code before the video continues.”
- **For whom:** “For video learners who need to change and run each idea before moving on.”
- **What to click first:** the visible **Try it with sample data** link, with “Opens one JavaScript checkpoint. No setup.” beside it.

The one-click action opens `/demo`, immediately displays the JavaScript arrays checkpoint, and includes the persistent “Demo — sample data, nothing is saved” banner plus Reset demo and Start for real controls.

## Required claims from a clean install — PASS

After `npm ci`, every exact command in `.factory/claims.json` passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `timeout-recovery` | `npm test -- --grep @claim:timeout-recovery` | PASS (but does not measure the advertised 1.5 s) |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |

## Functional and recovery testing — PASS

Fresh production `/demo` evidence:

- Unchanged starter code reports “Change the starter code before you run the check.”
- A wrong multiplier reports the actual `9, 15, 21` output and expected `6, 10, 14`.
- `while (true) {}` returns “The code ran for too long...” and leaves Run check enabled; corrected code then passes with `6, 10, 14`.
- Control+Enter runs the check. After a pass, Reset code restores the starter code, Not passed status, and enabled Run check control.
- At 390px, the editor, Run check, and demo banner are visible with no horizontal overflow.
- The unpacked built extension opened the bundled video fixture checkpoint, timed out the endless program, passed corrected code, recorded only passed progress (not source), and released the lesson.

## Local quality gates — PASS

- `npm run check`: PASS.
- `npm run test:unit`: PASS, 3/3.
- `npm test`: all 13 Playwright tests passed across the fresh run; the final offline, keyboard/history, and unpacked-extension group was also rerun independently: 3/3 PASS.
- `npm run build`: PASS; produced `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip`.
- `npm audit --omit=dev --audit-level=high`: PASS, 0 production vulnerabilities.
- Built site: JS 20,136 B (7.31 KB gzip), CSS 15,386 B (4.31 KB gzip), desktop hero 48,300 B, mobile hero 22,334 B, packaged extension 9,738 B. All meet the stated budgets.

## Live deployment, privacy, accessibility, and headers — PASS

- Every public candidate file matched production byte-for-byte: HTML, JS, CSS, images, source map, sandbox, service worker, metadata, sample manifest, and 404 page. The download ZIP container differs in archive metadata only; all eight unpacked extension files compare identical.
- Fresh demo request logging recorded only the site origin plus local `blob:` worker URLs. Demo localStorage and sessionStorage were empty after a pass. There were no analytics, third-party fonts, ads, or sign-in requests.
- Main CSP has `script-src 'self'` without `unsafe-eval`; only `/sandbox.html` permits its own eval with `default-src 'none'`, `connect-src 'none'`, and `worker-src blob:`. HSTS, `nosniff`, strict-origin referrer policy, `frame-ancestors 'none'`, and Permissions-Policy are present.
- Hashed JS/CSS/images have `Cache-Control: public, max-age=31536000, immutable`; `index.html` and `sw.js` have `no-cache`.
- Production service worker became active after update; `/demo` reloaded offline after the first online visit.
- `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and a missing route each rendered exactly one h1 and main with no console/page errors. Axe found zero serious or critical violations on each route.
- Keyboard smoke test: first Tab reaches Skip to main content with a visible 3px cyan outline; Enter moves focus to main. Reduced motion computes `transition: none`, `animation: none`, and `scroll-behavior: auto`.
- Lighthouse mobile report: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.93 s, LCP 0.97 s, CLS 0, TBT 30 ms. Chromium reported a tab crash while collecting its final screenshot after scores/metrics were produced; independent Playwright loads showed no page errors.
- The license verification API gave 30 `200 {"valid":false,"reason":"invalid"}` responses from one client; request 31 and later gave `429` with `Retry-After: 4`. Observed allowance: 30 requests per burst.

## Scope notes

No code was modified during this verification. There is no sign-in flow, so no identity-provider check applies. This browser extension is not a library/CLI/backend; the relevant unpacked-extension, PWA update/offline, and paid-verification allowance checks above were performed.
