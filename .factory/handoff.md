# Run Before Next repair 5 handoff — ready to release

## Scope

Repaired the release blockers reported in independent verification 5 for candidate `69599e1fcac6560ae1875b8ba69493ac673912e1`.

- The extension checkpoint now makes the lesson body inert, covers it with a pointer-blocking backdrop, traps Tab and Shift+Tab inside the dialog, and restores the page only after **Resume lesson**.
- A checkpoint now re-pauses the page video on `play`, `playing`, and later `timeupdate` events. A host player cannot advance it before the required check passes.
- Demo runs now disable Run check while pending and use a monotonically increasing run id. Reset cancels the prior run, so a stale timeout cannot overwrite a later pass.
- At 390×844, the home screen now leads with the job, audience, and sample action; product art follows the first action. Persistent demo controls and the wordmark meet the 44 px target minimum.
- Added claim registration and regression coverage for local video handling, sandbox API isolation, checkpoint sorting, license verification cadence/non-blocking download, and site-wide local-only assets. Removed two public promises that were not independently testable as stated.

## Verification evidence

All commands ran in this repair container on 2026-08-28.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 447 packages installed. npm reports 11 development-dependency advisories; see below. |
| `npm run check` | PASS |
| `npm run test:unit` | PASS — 3/3 |
| `npm test` | PASS — 19/19 Playwright checks (the full suite was also exercised in focused desktop/mobile groups) |
| Registered unit claims | PASS: `@claim:template-allowlist`, `@claim:checkpoint-sorting` |
| Registered new browser claims | PASS: `@claim:site-local-assets`, `@claim:license-check-cadence`, `@claim:video-pause-gate`, `@claim:video-local-only`, `@claim:sandbox-no-extension-apis` |
| Browser accessibility | PASS — Axe reports no serious/critical findings on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and the 404 route |
| Keyboard/mobile/offline | PASS — focus trap and Ctrl/⌘+Enter; 390×844 home and demo checks; no horizontal overflow; offline demo reload after first visit |
| `npm run build` | PASS — creates `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip` |
| `unzip -t dist/site/downloads/run-before-next-chrome.zip` | PASS |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 shipped-production vulnerabilities |
| Lighthouse against production fixture | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, CLS 0 |

Current first-load assets: JS 20,077 B (7,210 B gzip), CSS 15,667 B (4,350 B gzip), mobile hero 22,334 B, desktop hero 48,300 B, extension zip about 10.1 KB. All are within the product budgets.

The core regression uses a real playable canvas `MediaStream` attached to the fixture `VIDEO`. It proves the video advances before opening, then proves a programmatic `video.play()` remains paused with less than 0.05 s advance while the modal is active. It also proves body inertness, a circular keyboard tab order, `typeof chrome === "undefined"` inside the sandbox, local-only HTTP requests, and explicit resume after a pass.

## Deployment

Artifact class remains **Chrome MV3 browser extension plus static site**. Build and deploy the static root `dist/site/`; the packaged extension is available at `dist/site/downloads/run-before-next-chrome.zip`. The configured production identity is `https://video-code-exit-tickets.sociobot.in`.

Repair commit `bb23893` was pushed to `main`. This checkout has no Static Web Apps deployment token or checked-in deployment configuration, and the public host still returned the previous `assets/index-BC6ccfrd.js` fingerprint after the push. The factory's configured static deployment must publish the pushed commit; no infrastructure credentials were changed or guessed.

## Known notes

- `npm ci` reports 11 advisories in development tooling (2 moderate, 5 high, 4 critical). The production-only audit is clean; no dependency update was made during this scoped repair.
- No separate lint command exists; strict TypeScript checking is the repository's type/lint gate.
- Production propagation remains pending the factory deployment trigger described above.
