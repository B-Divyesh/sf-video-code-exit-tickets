# Run Before Next repair handoff

## Release status

This repair commit fixes every release blocker in independent report `424fc6fed4e44efca5a97f351e439b1a0139f457` (candidate `702038827a17b572aad6a6d8ee79667fe0b918f1`). It was deployed to production at <https://video-code-exit-tickets.sociobot.in> on 2026-08-28.

## What changed

- Learner JavaScript now runs in a dedicated Blob worker created by the already-isolated sandbox iframe. The page and extension never execute learner code on their UI thread. On timeout the parent removes/reloads that iframe, which terminates the worker and leaves the editor usable.
- The static sandbox CSP narrowly permits `worker-src blob:` alongside its existing isolated `unsafe-eval` policy. The normal app CSP still excludes `unsafe-eval`; the sandbox has `default-src 'none'` and `connect-src 'none'`.
- The unpacked MV3 extension uses the same worker boundary and its run timer now tracks the active run, so a stale timeout cannot interrupt a later retry.
- **Reset code** now restores the Run check label and enabled state after a passed demo checkpoint.
- The demo banner is inside the header landmark and the explanatory note is ordinary section content, resolving the standalone Axe landmark findings.

## Regression coverage

- `@claim:timeout-recovery` runs `while (true) {}`, asserts the exact timeout text within 2.5 seconds, then runs corrected code and asserts `6, 10, 14` passes.
- The consumer/unpacked-extension flow performs the same infinite-loop timeout and successful retry before checking stored progress.
- A demo regression passes, presses Reset code, and asserts Run check is enabled, relabelled, and the ticket is Not passed.
- Production-fixture coverage asserts the main policy has no `unsafe-eval`, while only `/sandbox.html` has isolated eval plus `worker-src blob:` and no network connection policy.

## Verification evidence

Clean-install validation on 2026-08-28:

- `npm ci`: passed.
- `npm run test:unit`: 3/3 passed.
- `npm test`: 13/13 Playwright tests passed. This covers desktop, 390px mobile, keyboard Control/Command+Enter, timeout/retry, reset recovery, routes/history, production CSP/cache policy, privacy, offline reload/service-worker update, accessibility, extension download, and unpacked-extension consumer flow.
- Every command in `.factory/claims.json` was run from the clean install, including new `npm test -- --grep @claim:timeout-recovery`; all passed. The allowlist claim passed with `npm run test:unit -- --testNamePattern @claim:template-allowlist`.
- `npm run check`: passed.
- `npm run build`: passed and wrote `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip`.
- `npm audit --omit=dev --audit-level=high`: 0 production vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/repair-2`: passed; title, `lang=en`, one h1, main landmark, alt text, labelled buttons, and console were clean. Standalone `@axe-core/cli` against that production fixture: 0 violations.
- Lighthouse local production fixture: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, CLS 0, TBT 0 ms. Evidence: `.factory/evidence/repair-2/lighthouse.json`.

Live post-deploy checks:

- Public `/demo` ran `while (true) {}`, showed the timeout, then passed corrected code. Reset code re-enabled Run check. At 390px there was no horizontal overflow and no page errors.
- `/opt/fleet/lib/verify-url.sh https://video-code-exit-tickets.sociobot.in/demo .factory/evidence/live-repair-2`: passed (one h1, main, `lang=en`, no missing alt text/unlabelled buttons, no console errors).
- The public `index.html` and hashed app JS have the same SHA-256 as `dist/site`; the downloaded production ZIP has the same unpacked files as `dist/site/downloads/run-before-next-chrome.zip`.
- Live main policy retains `script-src 'self'` without `unsafe-eval`; live sandbox policy is `default-src 'none'`, permits only its own script eval and Blob worker, and denies network. The hashed app JS has `Cache-Control: public, max-age=31536000, immutable`.

Local evidence is retained under `.factory/evidence/repair-2/`; live evidence is under `.factory/evidence/live-repair-2/`.

## Run and deploy

```bash
npm ci
npm run test:unit
npm test
npm run check
npm run build
```

Deploy `dist/site/` as the static root. This repair was deployed with Azure Static Web Apps CLI to production app `sf-video-code-exit-tickets` in resource group `sociobot`.

## Known gaps

No release-blocking gaps remain. Version one intentionally supports only the reviewed `javascript-console-v1` template; any new template needs its own sandbox review.
