# Polish round 3 — cumulative finding resolution

Product commit: `d61ac9053602da797e9933c4345833053af90603`

Review source: `.factory/review-3.md` at `41c5c075da6559df03f0204b552970a6ecedd8f0`, plus every earlier review and polish report.

All 30 findings were checked in the final source, a clean clone, the packaged extension, and the cold production deployment. Round 3 fixes F-3-1 and also closes the normal-motion edge of F-1-7 found during final live verification.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen names learners using author-prepared lessons and states the checkpoint-file requirement beside the download path. | Test: `the 390px first screen shows the job, audience, sample action, facts, and 44px key targets`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-2 | Every demo entry and exit resets code, result, output, and pending runs. | Claim: `@claim:demo-exit-isolation`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; live `/?demo=1`, wordmark exit, and re-entry in `live-cold-check.json`. |
| F-1-3 | The extension test crosses 47 seconds in playable media, opens the checkpoint without a synthetic message, pauses, passes, and resumes. | Claims: `@claim:extension-flow` and `@claim:video-pause-gate`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-desktop.png`; live ZIP matched the tested build byte-for-byte. |
| F-1-4 | The download says “Download extension ZIP,” identifies desktop Chrome/manual installation, and reveals four install steps. | Claim: `@claim:extension-download`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/downloads/run-before-next-chrome.zip` returned 200. |
| F-1-5 | Home and Privacy explain all-sites access and the no-checkpoint early exit. Pages without a checkpoint file remain inert. | Claim: `@claim:no-manifest-inert`; screenshot: `.factory/evidence/polish-3/live-privacy-mobile.png`; live `/privacy`. |
| F-1-6 | Demo, Creator, Privacy, Terms, and 404 have route-specific source and rendered title, description, canonical, Open Graph, and Twitter metadata. | Test: `known app routes deep-link while unknown paths return an HTTP 404`; screenshots: `.factory/evidence/polish-3/live-privacy-mobile.png` and `live-terms-mobile.png`; all live routes passed `live-cold-check.json`. |
| F-1-7 | New routes focus their heading. Back restores the invoking link and scroll immediately in both normal and reduced-motion modes, without a smooth-scroll interval that leaves focus off-screen. | Test: `history restores visible scroll and invoking focus without moving focus to the h1`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; cold live focus assertions passed in `live-cold-check.json`. |
| F-1-8 | The 404 uses direct wording plus the standard header, footer, download, product line, attribution, and build ID. | Test: `all routes have one h1, a main landmark, and no serious axe findings`; screenshot: `.factory/evidence/polish-3/live-404-mobile.png`; live `/missing-page` returned HTTP 404 with `noindex`. |
| F-1-9 | The sample checkpoint file download is registered and parsed through the real manifest validator. | Claim: `@claim:sample-manifest-download`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/sample-manifest.json` returned 200. |
| F-1-10 | Duplicate checkpoint IDs are rejected by a registered unit claim. | Claim: `@claim:unique-checkpoint-ids`; screenshot: `.factory/evidence/polish-3/live-creator-mobile.png`; live `/creator`. |
| F-1-11 | The scoped offline promise is registered and the demo reloads offline after one online visit. | Claim: `@claim:offline-reload`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; cold live offline reload passed. |
| F-1-12 | Licensed users can import, validate, recover, add, remove, reorder, edit, and export multi-checkpoint files locally. | Claims: `@claim:manifest-round-trip`, `@claim:manifest-import-recovery`, and `@claim:manifest-export`; screenshot: `.factory/evidence/polish-3/live-creator-mobile.png`; live `/creator`. |
| F-1-13 | Replaced “A checkpoint layer for video” with “Code checks for video lessons.” | Test: 390 px first-screen test; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-14 | Replaced “Core extension is free” with “The Chrome extension is free.” | Test: 390 px first-screen test; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-15 | Removed “checkpoint armed”; the artwork gives the exact checkpoint time. | Copy audit: `.factory/copy-audit.md`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-desktop.png`; live `/`. |
| F-1-16 | Replaced the metaphor heading with “See how a checkpoint blocks the video.” | Copy audit; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-17 | Sample actions consistently say “Try the sample checkpoint”; “Demo” names only the route. | Test: 390 px first-screen and internal-navigation checks; screenshots: `.factory/evidence/polish-3/live-home/screenshot-mobile.png` and `live-demo/screenshot-mobile.png`; live `/` and `/demo`. |
| F-1-18 | Replaced “Add one falsifiable check” with “Add one runnable code check.” | Copy audit; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-19 | Replaced “Mark the moment” with “Set the checkpoint time.” | Copy audit; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-20 | Replaced allowlist jargon with “approved JavaScript code runner.” | Claim: `@claim:template-allowlist`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-21 | Replaced the vague privacy heading with “The extension does not copy your video.” | Copy audit; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-22 | Replaced “No hidden templates” with “JavaScript console checks only.” | Claim: `@claim:template-allowlist`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-23 | Replaced the restore heading with “Existing customers can build checkpoint files.” | Copy audit; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-24 | README introduces the learner-facing TypeScript Chrome extension; WXT and MV3 remain contributor context. | README copy audit in `.factory/review-3.md`; product screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-25 | README says to add a checkpoint JSON block to a lesson page the author controls. | README copy audit; screenshot: `.factory/evidence/polish-3/live-creator-mobile.png`; live author section at `/#authors`. |
| F-1-26 | README states that learner code runs in an isolated extension page with no extension access. | Claims: `@claim:sandbox-isolation` and `@claim:sandbox-no-extension-apis`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; live `/demo`. |
| F-1-27 | License storage, daily checking, and free-download availability are separate short sentences. | Claim: `@claim:license-check-cadence`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/`. |
| F-1-28 | README test copy uses two short sentences and names observable behavior. | Full 23-test browser suite and `.factory/copy-audit.md`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live tested behaviors are recorded in `live-cold-check.json`. |
| F-2-1 | `demo-exit-isolation` remains registered. Its test covers Start for real, wordmark, Privacy/Back, Back/Forward, and unchanged seeded extension storage. | Claim: `@claim:demo-exit-isolation`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; cold live reset, wordmark exit, empty storage, and same-origin requests passed. |
| F-3-1 | Replaced “No account.” with the exact registered scope: “The sample reloads offline after one online visit.” The fold test now asserts compatibility, offline, privacy, and price facts. | Claim: `@claim:offline-reload`; test: `the 390px first screen shows the job, audience, sample action, facts, and 44px key targets`; screenshot: `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live fact bottom is at 638.25 px in a 390×844 viewport. |

## Final verification

- Every one of the 23 commands in `.factory/claims.json` passed independently from a fresh clone of `d61ac9053602da797e9933c4345833053af90603`. Machine-readable results: `.factory/evidence/polish-3/clean-claim-results.json`.
- Clean clone: `npm run check`, 3/3 unit tests, 23/23 Playwright tests, `npm run build`, and `npm audit --audit-level=high` passed.
- Accessibility: all six routes had one h1, one main landmark, no horizontal overflow, and zero serious/critical Axe findings.
- Privacy/offline: demo storage remained empty, requests were same-origin, extension data remained unchanged, and the service-worker reload passed offline.
- Performance: local and live Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. Live LCP was 1.1 s, TBT 0 ms, and CLS 0.
- Deployment: Azure Static Web Apps deployment `8ff6a315-b67f-4e9e-809e-4cd8eb394999` succeeded. The production URL and every intended link returned the expected status.

No finding remains open.
