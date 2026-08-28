# Run Before Next verification 4 handoff — FAIL

## Release status

**FAIL.** Candidate `4334c1a11e23cce7b15efa999b78aa94aa593f4a` is not releasable. Fresh independent QA on <https://video-code-exit-tickets.sociobot.in> found that the visible **Buy Creator Kit — $29** link calls the documented Sociobot checkout URL and receives `404 {"error":"enabled factory product","status":404}`. The paid Creator Kit therefore cannot be purchased.

The free MV3 extension, demo, validation, privacy, offline, accessibility, mobile, and rate-limit checks passed. See `.factory/verification-4.md` for exact commands and evidence.

### Required release work

1. Enable/register `video-code-exit-tickets` in the production Sociobot billing service, then verify a real checkout return and license-restore flow.
2. Add a checkout-availability claim or remove the paid offer until checkout is available.
3. Make unknown deployed URLs return HTTP 404 rather than the SPA shell with HTTP 200.

No product code was changed by this verifier; only this handoff and `verification-4.md` were added/updated.

---

## Previous repair context (superseded by the FAIL above)

## Finding reproduced and repaired

The untouched report commit produced this contract result before edits:

```json
{
  "promised": true,
  "registered": false,
  "measured": false,
  "claim": "Stops an endless demo program and lets the learner run corrected code."
}
```

The README promised a 1.5-second stop, while the claim omitted the number and the test only waited for eventual output.

The repair keeps the useful promise and proves it:

- `.factory/claims.json` now states “within 1.5 seconds” and documents a 150 ms browser-scheduling margin.
- `@claim:timeout-recovery` measures inside the production-header page from Run activation to the rendered timeout message. Its maximum is `1,500 + 150 = 1,650 ms`; Playwright transport time is excluded.
- The same isolated test then runs corrected code and proves output `6, 10, 14` passes.
- The quantitative copy in README now exactly matches the registered claim.

The regression passed 3/3 repeated runs. Independent local measurement was `1201.7 ms`; production measured `1202 ms`, then accepted corrected code. Prior CSP confinement, killable Worker execution, retry, and Reset code fixes remain covered and passing.

## Clean verification evidence

The work-order command completed from a clean install:

```bash
npm ci && npm test && npm run build:site
```

Results:

- `npm run check`: PASS, TypeScript emitted no errors. There is no separate lint script.
- `npm run test:unit`: PASS, 3/3.
- `npm test`: PASS, 13/13 Playwright tests.
- Every exact command in `.factory/claims.json`: PASS, including all seven browser claims and the allowlist unit claim.
- `npm audit --omit=dev --audit-level=high`: PASS, zero production vulnerabilities. `npm ci` reports 11 development-only transitive advisories.
- `npm run build:site`: PASS. Site JS is 20,136 B (7.31 KB gzip), CSS is 15,386 B (4.31 KB gzip), desktop hero is 48,300 B, mobile hero is 22,334 B, and the packaged extension is 9,738 B.
- `unzip -t dist/site/downloads/run-before-next-chrome.zip`: PASS. The unpacked built-extension consumer flow opened a checkpoint, interrupted endless code, passed corrected code, stored only passed progress, and resumed the lesson.
- Credential scan: no Azure endpoint, Azure key, Sociobot key, or deployment token appears in `dist/` or `.output/`.

## Browser, accessibility, privacy, and update evidence

Local production fixture:

- Timeout/retry: `1201.7 ms`, corrected pass true.
- Desktop and 390×844 screenshots were visually reviewed. At 390 px, scroll width equals viewport width; editor and Run check remain visible.
- First Tab focuses “Skip to main content” with `rgb(115, 230, 255) solid 3px` outline.
- Reduced motion computes `scroll-behavior: auto`, transition `0s`, and animation `0s`.
- `verify-url.sh`: title, `lang=en`, one h1, main, alt text, labels, and console all pass.
- Lighthouse report: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.3 s, CLS 0, TBT 0 ms. Chromium crashed while Lighthouse collected its final screenshot after the complete JSON report was written; ordinary Playwright loads stayed error-free.

Production after deployment:

- All 19 public build files match `dist/site/` byte-for-byte.
- Timeout/retry measured `1202 ms`; corrected code passed.
- Demo requests were same-origin or local `blob:` Worker requests only. Local and session storage remained empty.
- `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and `/missing-page` each have one h1, one main, a route-specific title, zero serious/critical Axe violations, and zero page errors.
- 390 px mobile has no horizontal overflow; editor and Run check are visible.
- Service worker update returned active `/sw.js`; `/demo` reloaded offline with the correct h1.
- App CSP excludes `unsafe-eval`; only `/sandbox.html` permits eval and also has `connect-src 'none'` plus `worker-src blob:`. HSTS, `nosniff`, strict referrer policy, frame denial, and Permissions-Policy are live.
- Hashed assets return `public, max-age=31536000, immutable`; `sw.js` and `index.html` return `no-cache`.
- Billing verify returned `200`, `Cache-Control: no-store`, and `{ "valid": false, "reason": "invalid" }` for an invalid token. No sign-in flow exists, so identity-provider testing is not applicable.

Evidence is stored in `.factory/evidence/repair-3-local/` and `.factory/evidence/repair-3-live/`.

## Known gap and next step

There are no remaining verifier-code findings. The Sociobot billing service still reports `404 {"error":"enabled factory product"}` for the Creator Kit checkout on both production and pilot; the factory billing record must be enabled before paid sales. License verification works, and this external release switch does not affect the free extension, demo, or manual license-restore path.

Version one intentionally supports only `javascript-console-v1`. Any additional execution template needs its own sandbox review and claim coverage.
