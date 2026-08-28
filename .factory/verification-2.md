# Independent verification 2 — FAIL

Verified on 2026-08-28 against candidate commit `702038827a17b572aad6a6d8ee79667fe0b918f1` and `https://video-code-exit-tickets.sociobot.in`.

## Decision

**FAIL — release blocked by P1 invalid-code recovery.** The prior production-CSP defect is repaired and the deployed files match this candidate. However, entering an endless JavaScript loop in the required one-click demo freezes the tab permanently instead of showing the documented timeout. This violates the brief's runnable-checkpoint job, the README's timeout promise, and the required invalid-input/recovery path.

## Required first-read test

Cold live desktop load passed the plain-words test:

- **What:** “Prove your code before the video continues.”
- **Who:** “For video learners who need to change and run each idea before moving on.”
- **First action:** the visible **Try it with sample data** link, with “Opens one JavaScript checkpoint. No setup.” beside it.

The action opens `/demo` in one click and displays the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls.

## Release-blocking defect

### P1 — an endless learner program freezes the live demo instead of timing out

Reproduction on a fresh Chromium context:

1. Open `https://video-code-exit-tickets.sociobot.in/demo`.
2. Replace the sample editor contents with `while (true) {}`.
3. Choose **Run check**.

Expected: after the documented 1.2/1.5 second limit, output says “The code ran for too long. Check for an endless loop.” and the learner can correct and run code again.

Actual: the sandbox's `new Function` loop occupies the renderer shared with its parent. The main page cannot process its timeout or repaint the recovery state; after more than 30 seconds the Playwright process and Chromium renderer remained hung. I had to terminate only that isolated test browser process. No timeout message or recovery path became available.

Evidence in the candidate: [`shared/runner.ts`](../shared/runner.ts) places a same-document `/sandbox.html` iframe in the page and tries to enforce timeout from the parent; [`site/public/sandbox.js`](../site/public/sandbox.js) executes learner text synchronously using `new Function`. An iframe is not a pre-emptible execution boundary. The README currently promises, “A run stops after 1.5 seconds if it does not return.”

This is both accidental-input recovery failure and an easy denial of service against the required demo. Use an execution boundary that can actually be terminated (for example a dedicated Worker/worker-like sandbox with a hard kill path) and add a claim or production Playwright regression that runs `while (true) {}` and proves the tab remains usable.

### P2 — Reset code leaves the demo permanently unable to run after a pass

Fresh live reproduction:

1. Change `* 1` to `* 2`; Run check passes with `6, 10, 14`.
2. Choose **Reset code**.

The editor returns to starter code and the state says “Not passed,” but the disabled button remains labelled “Checkpoint passed.” It is impossible to run another check without using the separate Reset demo banner action or reloading. `bindDemo()` resets the data/output but never clears the run button's `disabled` flag or label.

## Required claims from clean checkout

`npm ci` completed from this candidate before running every command in `.factory/claims.json` exactly. All passed through the product's production-fixture demo entry point:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |

The existing claims cover normal execution but not the required hostile/boundary execution recovery, which is why the P1 survives them.

## Local candidate checks

- `npm run check`: PASS.
- `npm run test:unit`: PASS (3 tests).
- `npm test`: PASS (11 Playwright tests, including production-CSP, axe, mobile, offline reload, and unpacked-extension flow).
- `npm run build`: PASS and produces `dist/site/` plus `dist/site/downloads/run-before-next-chrome.zip`.
- `npm audit --omit=dev --audit-level=high`: PASS (0 production vulnerabilities).
- Built sizes: JavaScript 20,003 B / 7,298 B gzip; CSS 15,386 B / 4,311 B gzip; desktop hero 48,300 B; mobile hero 22,334 B; packaged extension 9,373 B. All are within the stated budgets.

## Fresh live checks that passed

- Deployment identity: byte-for-byte comparison passed for all publicly served site files (HTML, JS, CSS, images, manifest sample, sandbox, worker, metadata, and 404 files). The live extension ZIP has identical unpacked files to the freshly built candidate.
- Normal and wrong-output paths: unchanged starter code says to change it; `* 3` reports `9, 15, 21` and the expected output; `* 2` passes with `6, 10, 14`. No console or page errors were emitted in these paths.
- Desktop and 390 px mobile: no horizontal overflow; editor, Run check, and demo banner are visible at 390 px.
- Keyboard: first Tab reaches the skip link with a visible `rgb(115, 230, 255) solid 3px` focus outline; Enter focuses `main`; Control+Enter successfully runs the normal sample path.
- Reduced motion: live computed primary-control transition and animation are `none`, and document scroll behavior is `auto` under `prefers-reduced-motion: reduce`.
- Accessibility: axe found zero serious or critical violations on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and `/missing-page`. Each rendered exactly one `h1` and one `main`; all tested routes had no console/page errors.
- Privacy: a fresh passed-demo request log contains only same-origin `/demo`, JS, CSS, `/sandbox.html`, and `/sandbox.js`. `localStorage` and `sessionStorage` were both empty afterward. There are no third-party fonts, analytics, or sign-in requests; the product has no sign-in flow.
- PWA: after first visit the live service worker registered and `registration.update()` resolved to active `/sw.js`; `/demo` reloaded offline and rendered its title, h1, and demo banner.
- Headers: main-page CSP excludes `unsafe-eval`; only `/sandbox.html` has `script-src 'self' 'unsafe-eval'` together with `default-src 'none'` and `connect-src 'none'`. HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, frame denial, and Permissions-Policy are present. Hashed JS/CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML and service worker use `no-cache`.
- Product-unlock rate limit: from one client, 30 consecutive invalid verification requests returned `200` with `{"valid":false,"reason":"invalid"}`. Requests 31–35 returned `429` with `Retry-After: 4`. Observed allowance: 30 requests per burst; enforcement satisfies the documented requirement.

## Re-verification required

Repair the P1 with a truly killable executor, prove timeout and successful subsequent run in an automated production-header/demo test, and restore Reset code's enabled Run check state after a successful pass. Then rerun every claim command and the live invalid-code recovery path before accepting a new candidate.
