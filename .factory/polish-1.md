# Polish round 1 — finding resolution

Source review: `.factory/review-1.md` at `f93ca462f559dc4fa04ab1dd812d0894f2df9261`.

This repository contains no earlier `.factory/review-*.md` or `.factory/polish-*.md`. Every finding in review 1 is resolved below. Browser evidence is under `.factory/evidence/polish-1/`; the screenshots and machine reports are retained as work-order evidence rather than product assets.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen now names learners using author-prepared lessons, states the checkpoint-file requirement, and repeats that limit beside the ZIP download. | Playwright: `the 390px first screen shows the job, audience, sample action, and 44px key targets`; screenshot: `.factory/evidence/polish-1/mobile-first-screen.png`; live: `/`. |
| F-1-2 | Entering or leaving demo mode creates a fresh in-memory sample and invalidates pending runs. Wordmark, Privacy, Start for real, and browser-history exits all discard demo state. | Playwright: `demo state is discarded through every SPA exit and history return`; screenshot: `.factory/evidence/polish-1/demo-mobile.png`; live: `/?demo=1`. |
| F-1-3 | The unpacked-extension test now plays a real 50-second MP4 from 46.8 seconds across the 47-second mark. It asserts automatic dialog opening, video pause, pass, and resume without sending `RBN_OPEN`. | Claim tests: `@claim:extension-flow` and `@claim:video-pause-gate`; fixture: `/extension-fixture.html`; clean-clone log: `.factory/evidence/polish-1/clean-clone-final.log`. |
| F-1-4 | The action reads “Download extension ZIP” at every viewport. It identifies desktop Chrome and reveals a focused four-step manual install guide after download. | Claim test: `@claim:extension-download`; Playwright mobile first-screen test; screenshot: `.factory/evidence/polish-1/install-guide.png`; live: `/`. |
| F-1-5 | Landing and Privacy copy explain the all-sites request and the no-checkpoint early exit. The content script now performs no readiness mutation before finding a valid checkpoint file. | Claim test: `@claim:no-manifest-inert` checks playback, UI, extension storage, and request paths on `/no-manifest-fixture.html`; live: `/privacy`. |
| F-1-6 | Build-time HTML is generated for Demo, Creator, Privacy, Terms, and 404. Each has its own title, description, canonical, Open Graph, and Twitter metadata; 404 is `noindex`. | Playwright: `known app routes deep-link while unknown paths return an HTTP 404`; live: `/demo`, `/creator`, `/privacy`, `/terms`, and `/missing-page`. |
| F-1-7 | History entries retain scroll and an invoking-element key. Popstate restores both; new route navigation still focuses the destination heading. | Playwright: `history restores visible scroll and invoking focus without moving focus to the h1`; live: home → Privacy → Back. |
| F-1-8 | The styled 404 now uses the standard header, navigation, download action, product footer, attribution, build ID, and direct “Page not found” wording. | Playwright route/axe checks; screenshot: `.factory/evidence/polish-1/404.png`; live: `/missing-page`. |
| F-1-9 | Registered and implemented a download-and-parse claim for the sample checkpoint file, including the arrays values and 47-second time. | Claim test: `@claim:sample-manifest-download`; live artifact: `/sample-manifest.json`. |
| F-1-10 | Registered the uniqueness statement and tagged the existing duplicate-ID validation test. “IDs” is used consistently. | Unit claim test: `@claim:unique-checkpoint-ids`. |
| F-1-11 | Registered the scoped offline statement and tagged the production service-worker reload test. | Claim test: `@claim:offline-reload`. |
| F-1-12 | The licensed builder now imports JSON, associates announced errors with the file control, recovers after invalid input, and adds, edits, removes, reorders, and exports multiple checkpoints locally. | Claim tests: `@claim:manifest-round-trip`, `@claim:manifest-import-recovery`, and `@claim:manifest-export`; screenshot: `.factory/evidence/polish-1/creator-builder.png`; live: `/creator`. |
| F-1-13 | Replaced “A checkpoint layer for video” with “Code checks for video lessons.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-14 | Replaced “Core extension is free” with “The Chrome extension is free.” | First-screen Playwright test; screenshot: `.factory/evidence/polish-1/mobile-first-screen.png`; live: `/`. |
| F-1-15 | Removed “checkpoint armed”; the art uses the direct timestamp label. | `.factory/copy-audit.md`; live: `/`. |
| F-1-16 | Replaced the metaphor heading with “See how a checkpoint blocks the video.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-17 | All sample actions now use “Try the sample checkpoint”; “Demo” remains only the route/navigation name. | Playwright first-screen and internal-navigation checks; live: `/` and `/demo`. |
| F-1-18 | Replaced “Add one falsifiable check” with “Add one runnable code check.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-19 | Replaced “Mark the moment” with “Set the checkpoint time.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-20 | Replaced the sandbox jargon with “approved JavaScript code runner.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-21 | Replaced the vague heading with “The extension does not copy your video.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-22 | Replaced “No hidden templates” with “JavaScript console checks only.” | Claim test: `@claim:template-allowlist`; live: `/`. |
| F-1-23 | Replaced the restore heading with “Existing customers can build checkpoint files.” | `.factory/copy-audit.md`; live: `/`. |
| F-1-24 | README describes a TypeScript Chrome extension first and leaves WXT/MV3 to the contributor note. | README copy audit; repository `README.md`. |
| F-1-25 | README now says “Add this checkpoint JSON block to a lesson page you control.” | README copy audit; repository `README.md`. |
| F-1-26 | README now says learner code runs in an isolated extension page with no extension access. | Claim test: `@claim:sandbox-no-extension-apis`; repository `README.md`. |
| F-1-27 | License storage, daily checking, and free-download availability are three short sentences. | Claim test: `@claim:license-check-cadence`; repository `README.md`. |
| F-1-28 | The README test description is split into two plain sentences and names observable behavior. | `.factory/copy-audit.md`; clean-clone full suite: 23/23 passed. |

## Local verification

- Fresh-clone audit at repair commit: all 22 commands in `.factory/claims.json` passed independently.
- `npm run check`: passed.
- `npm run test:unit`: 3/3 passed.
- `npm test`: 23/23 passed.
- `npm run build`: passed; generated the extension ZIP and `dist/site/`.
- `npm audit --omit=dev --audit-level=high`: zero production vulnerabilities.
- Playwright Axe: zero serious or critical findings on every public route and the licensed creator state.
- `verify-url.sh`: passed locally; report at `.factory/evidence/polish-1/verify-local/verify.json`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 20 ms. Report: `.factory/evidence/polish-1/lighthouse-home.json`.
- Initial site payload: 28.22 KB JavaScript (9.52 KB gzip), 17.94 KB CSS (4.81 KB gzip). Packaged extension: 9.85 KB.

## Live verification

On 2026-08-29, a fresh Chromium context opened <https://video-code-exit-tickets.sociobot.in> after deployment. It passed the first-screen geometry, `?demo=1` pass/reset, request and storage privacy, route metadata, real 404 response, history focus, creator import/recovery/edit/export, offline reload, internal-link crawl, legal-link presence, and ordinary-route console checks. The downloaded live ZIP was unpacked into a fresh Chromium profile: a page without a checkpoint file stayed unchanged, and the video fixture crossed 47 seconds, paused automatically, passed, and resumed without a synthetic open message. Live Playwright Axe found zero serious or critical issues on all six routes. Live Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO, with LCP 1.1 s, CLS 0, and TBT 30 ms. `verify-url.sh` returned no errors; reports are in `.factory/evidence/polish-1/verify-live/` and `.factory/evidence/polish-1/lighthouse-live.json`.
