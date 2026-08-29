# Polish round 2 — cumulative finding resolution

Release candidate: `b270f4c77f16f71926888250dcf6e813dd103110`

Review source: `.factory/review-2.md` at `8d5b82837df32bdbf4d14fcd5bfd9ab1f5f04538`, plus `.factory/review-1.md` and `.factory/polish-1.md`.

All earlier fixes were inspected again in the current source, clean build, and cold production deployment. Round 2 adds the missing registered proof for demo exit and extension-data isolation.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen names learners using author-prepared lessons and states the checkpoint-file requirement before download. | Playwright: `the 390px first screen shows the job, audience, sample action, and 44px key targets`; screenshot: `.factory/evidence/polish-2/verify-live-home/screenshot-mobile.png`; live `/`. |
| F-1-2 | Every demo entry and exit resets code, pass state, output, and pending runs. | Claim: `@claim:demo-exit-isolation`; screenshot: `.factory/evidence/polish-2/demo-live-mobile.png`; live `/?demo=1`. |
| F-1-3 | The extension test crosses 47 seconds in playable media and opens the checkpoint without a synthetic open message. | Claims: `@claim:extension-flow`, `@claim:video-pause-gate`; live fixture and downloaded ZIP rechecked. |
| F-1-4 | The action says “Download extension ZIP,” states desktop/manual installation, and reveals the four install steps. | Claim: `@claim:extension-download`; home screenshot; live `/downloads/run-before-next-chrome.zip` returned 200 and unpacked to the expected MV3 files. |
| F-1-5 | Home and Privacy explain all-sites access; pages without checkpoint files remain inert. | Claim: `@claim:no-manifest-inert`; privacy screenshot: `.factory/evidence/polish-2/privacy-live-mobile.png`; live `/privacy`. |
| F-1-6 | Demo, Creator, Privacy, Terms, and 404 ship route-specific source metadata. | Test: `known app routes deep-link while unknown paths return an HTTP 404`; live cold check: `.factory/evidence/polish-2/live-cold-check.json`. |
| F-1-7 | New routes focus their heading; history uses manual restoration, returns focus to a visible invoking link, and falls back to the route heading when no invoker exists. | Tests: `history restores visible scroll and invoking focus without moving focus to the h1` and `@claim:demo-exit-isolation`; live focus check in `live-cold-check.json`. |
| F-1-8 | The 404 uses the standard header/footer, direct wording, product art, actions, build, and attribution. | Test: route/Axe suite; screenshot: `.factory/evidence/polish-2/404-live-mobile.png`; live `/missing-page` returned 404. |
| F-1-9 | The sample checkpoint download has a registered validation test. | Claim: `@claim:sample-manifest-download`; live `/sample-manifest.json` returned 200. |
| F-1-10 | Unique checkpoint IDs have a registered unit claim. | Claim: `@claim:unique-checkpoint-ids`; live Creator builder screenshot. |
| F-1-11 | Offline scope is explicit and registered: the demo reloads after one online visit. | Claim: `@claim:offline-reload`; live offline reload recorded in `live-cold-check.json`. |
| F-1-12 | The local builder imports, validates, recovers, adds, removes, reorders, edits, and exports multi-checkpoint files. | Claims: `@claim:manifest-round-trip`, `@claim:manifest-import-recovery`, `@claim:manifest-export`; screenshot: `.factory/evidence/polish-2/creator-live-mobile.png`; live `/creator`. |
| F-1-13 | “A checkpoint layer for video” remains replaced by “Code checks for video lessons.” | `.factory/copy-audit.md`; live `/`. |
| F-1-14 | “Core extension is free” remains replaced by “The Chrome extension is free.” | First-screen test and home screenshot; live `/`. |
| F-1-15 | Decorative “checkpoint armed” remains removed; the art gives the exact timestamp. | `.factory/copy-audit.md`; home screenshot; live `/`. |
| F-1-16 | The preview heading remains “See how a checkpoint blocks the video.” | `.factory/copy-audit.md`; home screenshot; live `/`. |
| F-1-17 | Sample actions consistently say “Try the sample checkpoint”; “Demo” names only the route/navigation. | First-screen and navigation tests; live `/` and `/demo`. |
| F-1-18 | “Falsifiable” remains replaced by “Add one runnable code check.” | `.factory/copy-audit.md`; live `/`. |
| F-1-19 | “Mark the moment” remains replaced by “Set the checkpoint time.” | `.factory/copy-audit.md`; live `/`. |
| F-1-20 | Allowlist jargon remains replaced by “approved JavaScript code runner” and “JavaScript console checks only.” | Claim: `@claim:template-allowlist`; live `/`. |
| F-1-21 | The privacy heading remains “The extension does not copy your video.” | `.factory/copy-audit.md`; live `/`. |
| F-1-22 | “No hidden templates” remains replaced by “JavaScript console checks only.” | Claim: `@claim:template-allowlist`; live `/`. |
| F-1-23 | The paid heading remains “Existing customers can build checkpoint files.” | `.factory/copy-audit.md`; live `/`. |
| F-1-24 | README leads with the learner-facing TypeScript Chrome extension; WXT/MV3 stay in contributor context. | README audit in `.factory/review-2.md`; repository `README.md`. |
| F-1-25 | README says to add a checkpoint JSON block to a lesson page the author controls. | README audit; `README.md`; related live builder `/creator`. |
| F-1-26 | README plainly states that learner code runs in an isolated extension page with no extension access. | Claim: `@claim:sandbox-no-extension-apis`; downloaded live ZIP inspected. |
| F-1-27 | License storage, daily checking, and free-download availability remain separate short sentences. | Claim: `@claim:license-check-cadence`; `README.md`; live `/`. |
| F-1-28 | README test copy remains split into short observable statements. | `.factory/copy-audit.md`; full suite 23/23; `README.md`. |
| F-2-1 | Added `demo-exit-isolation` to `.factory/claims.json` and tagged one exact test. It passes the sample before Start for real, wordmark, Privacy/Back, and Back/Forward exits; every return asserts starter code, “Not passed,” and initial output. A separate unpacked-extension context seeds private extension storage, proves its marker never enters the demo DOM, and proves storage is byte-for-byte unchanged after pass/reset. | Claim: `@claim:demo-exit-isolation`; clean-clone result: `.factory/evidence/polish-2/clean-clone-summary.txt`; screenshot: `.factory/evidence/polish-2/demo-live-mobile.png`; cold live check: `/?demo=1` and `.factory/evidence/polish-2/live-cold-check.json`. |

## Verification

- Clean clone of `9ffd333`: `npm ci` and all 23 exact `.factory/claims.json` commands passed independently.
- Local: `npm run check`, 3/3 unit tests, 23/23 Playwright tests, `npm run build`, and `npm audit --audit-level=high` passed.
- Work-order build: `npm ci && npm test && npm run build:site` passed and produced `dist/site/` plus the 9,852-byte Chrome MV3 ZIP.
- Accessibility: Playwright Axe reported zero serious or critical findings across all six routes. Keyboard, dialog trap, route focus, visible history focus, reduced motion, one h1, landmarks, labels, and 390px targets passed.
- Privacy/offline: demo storage stayed empty, demo requests stayed same-origin, seeded extension storage stayed unchanged, no-manifest pages stayed inert, and the demo reloaded offline.
- Performance: local Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1.4 s, CLS 0, TBT 40 ms. Live scored 100/100/100/100; LCP 1.1 s, CLS 0, TBT 30 ms.
- Payloads: initial JavaScript 28.56 kB raw / 9.64 kB gzip; CSS 17.94 kB raw / 4.81 kB gzip; extension ZIP 9.85 kB.
- Deployment: Azure Static Web Apps deployment `2321f600-aac3-4ed0-be61-ce005e3db5ea` succeeded. The custom domain returned HTTPS 200.
- Cold production check: route status/metadata, 404/noindex, headers, all exits, extension isolation, mobile layout, focus, Axe, storage, same-origin requests, offline reload, legal links, console, ZIP, and internal artifacts passed.

No finding from either review remains open.
