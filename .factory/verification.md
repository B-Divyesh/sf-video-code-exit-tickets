# Independent verification — FAIL

Verified 2026-08-28 against candidate `853fd8ba4c3a7365292581c9fe7d9fd37dc1ee41` and the deployed URL `https://video-code-exit-tickets.sociobot.in`.

## Decision

**FAIL — release blocking.** The deployed demo cannot execute changed JavaScript. This invalidates the live one-click sample experience and the `demo-pass` product claim, even though the candidate's local test passes.

## First-read test

Cold desktop load of the live home page answered all three required questions in plain words:

- What: “Prove your code before the video continues.”
- Who: “For video learners who need to change and run each idea before moving on.”
- First action: **Try it with sample data**; the adjacent text says it opens one JavaScript checkpoint with no setup.

The first-read copy and visible one-click demo action pass. The action itself fails in production as described below.

## Release-blocking defect

### P0 — live demo runner is blocked by the production CSP

1. Open a fresh browser context at `https://video-code-exit-tickets.sociobot.in/demo`.
2. Change `price * 1` to `price * 2` and select **Run check** (or press Control+Enter).
3. The required result `6, 10, 14` never passes. The live UI instead shows:

   ```text
   OUTPUT · NOT YET
   The code stopped: Evaluating a string as JavaScript violates the following
   Content Security Policy directive because 'unsafe-eval' is not an allowed
   source of script: script-src 'self'". Fix it, then run the check again.
   ```

Evidence: the live page response sets `script-src 'self'`; the shared runner uses `new Function(...)`. The local dev server has no equivalent response CSP, so all local claim tests pass and do not catch this deployment-only failure. The extension sandbox has its own `'unsafe-eval'` allowance, which is why the local unpacked-extension test continues to pass.

This breaks the brief's smallest useful product, violates the mandatory “Try it with sample data” path, and makes the published `demo-pass` claim false on the deployed candidate.

### P2 — deployed hashed assets do not use immutable long-lived caching

Direct response headers for `assets/index-BgAhBHNl.js`, CSS, image, service worker, and the extension ZIP all report:

```text
Cache-Control: public, must-revalidate, max-age=30
```

This does not meet the factory caching requirement for long-lived immutable hashed assets. The deployed `staticwebapp.config.json` contains no per-asset cache policy. This is not the reason for the FAIL, but should be corrected with the CSP deployment fix.

## Required claims from clean checkout

`npm ci` completed, then every command in `.factory/claims.json` was run exactly. All local commands passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |

The local `demo-pass` result is insufficient for release because the independent live reproduction above fails under the deployed header. Add a claim/integration test that serves the production CSP or test the deployed demo before release.

## Local candidate checks

- `npm run check`: PASS.
- `npm run test:unit`: PASS, 3 tests.
- `npm test`: PASS, 9 Playwright tests.
- `npm run build`: PASS. Five additional sequential production builds also passed.
- `npm audit --omit=dev --audit-level=high`: PASS, 0 production vulnerabilities.
- Build output: initial JavaScript 7.37 KB gzip; CSS 4.31 KB gzip; packaged extension 9.37 KB; unpacked extension 18.99 KB. All are within the stated budgets.
- Local unpacked extension flow: PASS. It opens the fixture checkpoint, executes the changed program, records only the passed id, and resumes the lesson. The allowlist unit test rejects an unknown template.

One build issued an `ENOENT` for generated `background.js` immediately after a tool-interrupted run. With no concurrent build processes, five subsequent exact builds and the final full suite passed; this was not reproducible and is not counted as a defect.

## Deployment identity and live checks

- The deployed `index.html`, JS, CSS, and hero image have byte-identical SHA-256 values to a fresh candidate build.
- The downloaded live extension ZIP has different container metadata, but every unzipped file (manifest, background, content script, sandbox, popup, and CSS) has the same SHA-256 as the fresh candidate package.
- Home, demo, creator, privacy, terms, 404, and a deep missing path load. The single-page app renders one `h1` and one `main` on all tested routes.
- Fresh desktop and 390 px mobile loads: no console or page errors; mobile demo has no horizontal overflow and keeps the editor, Run check control, and persistent sample-data banner visible.
- Keyboard: the first Tab reaches the skip link with a visible `rgb(115, 230, 255) solid 3px` outline; Enter focuses `#main`. Control+Enter reaches the same broken live runner path.
- Reduced motion: live computed primary-button transition is `none`, animation is `none`, and document scroll behavior is `auto`.
- Axe against live `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and `/missing-page`: no serious or critical findings.
- Lighthouse on the live home: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.0 s, CLS 0, TBT 50 ms. Lighthouse logged a Chrome tab crash after producing the report, but the report contains complete scores and audit values.

## Privacy, headers, PWA, and service allowance

- Fresh live demo request log contains only the site document, same-origin JS, and same-origin CSS. Its localStorage and sessionStorage key lists are empty. This supports the demo's no-storage/no-third-party-request promise, independent of the execution failure.
- Home cold load likewise made only same-origin document, JS, CSS, and image requests. There are no third-party fonts, analytics, or sign-in requests. The product has no sign-in flow.
- Main response headers include CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, `frame-ancestors 'none'`, and Permissions-Policy. The CSP's missing `'unsafe-eval'` is the P0 cause.
- PWA: service worker is active at `/sw.js`; `registration.update()` completes with an activated worker; after an online load/reload, `/demo` reloads offline and renders “Change the code before moving on”.
- Sociobot product verification endpoint allowance: after 30 rapid invalid-token verification requests from one client, request 31 returned `429` with `Retry-After: 2`; later requests returned `429` with `Retry-After: 3`. Observed allowance: 30 requests in that burst. The endpoint responds `200 {"valid":false,"reason":"invalid"}` before that limit. This satisfies rate-limit enforcement.

## Recommended repair and re-verification

Use a runner that can execute under the live CSP (preferred), or narrowly align the production CSP with the deliberate sandbox policy without weakening unrelated pages. Then add a production-CSP/deployed-demo claim test. Configure immutable, long-lived caching for content-hashed assets while keeping the service worker and HTML short-lived. Re-run all claim commands and the live changed-code pass path before accepting a new candidate.
