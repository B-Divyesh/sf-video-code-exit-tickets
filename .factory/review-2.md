# Adversarial first-read review 2 — Run Before Next

**Verdict: FAIL**

Reviewed on 2026-08-29 from a clean clone of `b270f4c77f16f71926888250dcf6e813dd103110`, and in fresh Chromium contexts against <https://video-code-exit-tickets.sociobot.in>. PASS requires zero findings. This review has one major finding.

## Cold first screen

At 390 × 844, before scrolling, the page answered all three questions:

- **What:** it pauses an author-prepared programming lesson until changed code passes.
- **For whom:** learners using lessons whose author added Run Before Next code checks.
- **First click:** **Try the sample checkpoint**.

The exact visible evidence was “Prove your code before the video continues”, “For learners using programming lessons whose author added Run Before Next code checks.”, “Try the sample checkpoint”, and “Works on lessons with an author-provided checkpoint file.” The same result held at 1440 × 900. This gate passes.

## Findings

### Major

#### F-2-1 — Demo-exit privacy promise has no registered claim test

- **Quote/location:** `/privacy`: “Demo edits stay in memory and disappear whenever you leave the demo. The demo does not read real extension data.” `.factory/demo.md` also says “every route exit discards the demo state.”
- **Why a visitor is asked to rely on an untested promise:** `.factory/claims.json` has no entry for either promise. Its closest entry, `privacy-demo`, proves empty web storage and same-origin requests after a demo pass. It does not leave and re-enter the demo, and it does not prove real extension data is unread. The source has an untagged regression test called `demo state is discarded through every SPA exit and history return`; the claims contract requires an exact `@claim:<id>` test for each published claim.
- **Concrete fix:** add `demo-exit-isolation` to `.factory/claims.json`; tag that test `@claim:demo-exit-isolation`; and assert a passed sample resets to starter code, `Not passed`, and initial output after Start for real, wordmark, Privacy, and browser Back. Add an extension-profile assertion that demo use cannot read or change extension storage, or remove “The demo does not read real extension data.”

## Demo and sandbox

Direct `/demo` immediately showed a realistic arrays checkpoint. Changing `* 1` to `* 2` produced `OUTPUT · PASSED` and `6, 10, 14`. The persistent “Demo — sample data, nothing is saved” banner included Reset demo and Start for real. At 390 px, Reset demo, Start for real, and the home link each measured 44 px high.

After a demo pass, localStorage, sessionStorage, and IndexedDB were empty. Requests were limited to the product origin and the local opaque sandbox worker. Reset and live exit/re-entry behavior restored the starter, Not passed, and initial output. This confirms current behavior; F-2-1 is about missing claim registration and proof.

## Claims run from a clean clone

`npm ci` succeeded in a new temporary clone. Every exact command in `.factory/claims.json` passed independently. Then `npm test` passed 23/23, `npm run check` passed, and `npm run build` produced `dist/site/` and the extension ZIP.

| Claims | Commands run exactly | Result |
| --- | --- | --- |
| `demo-pass`, `privacy-demo`, `timeout-recovery`, `extension-download`, `manifest-export`, `creator-sales-paused`, `sandbox-isolation`, `extension-flow`, `source-not-saved`, `video-pause-gate`, `video-local-only`, `sandbox-no-extension-apis`, `license-check-cadence`, `site-local-assets`, `no-manifest-inert`, `sample-manifest-download`, `offline-reload`, `manifest-round-trip`, `manifest-import-recovery` | `npm test -- --grep @claim:<id>` | PASS, each |
| `template-allowlist`, `checkpoint-sorting`, `unique-checkpoint-ids` | `npm run test:unit -- --testNamePattern @claim:<id>` | PASS, each |

No registered claim test failed. The missing test in F-2-1 is an unregistered public claim, so it cannot be accepted by the claim-only run.

## Copy audit

Counting convention: contractions, hyphenated words, paths, versions, and identifiers count as one word; code blocks are excluded. The landing page’s exhaustive sentence/label table is in `.factory/copy-audit.md`; I compared every row with live DOM text. It includes every visible landing heading, label, action, fact, body sentence, footer line, and the hidden install-guide copy. Every landing row is at most 16 words; none uses a banned marketing word, a mood/metaphor heading, inconsistent terminology, or a non-result naming action.

The README audit follows. These are all prose sentences, headings, bullets, and steps; code blocks are excluded.

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| Title | Run Before Next | 3 | — |
| Headline | Prove your code before the video continues. | 7 | — |
| Intro | Run Before Next is a Chrome extension for learners using author-prepared programming lessons. | 13 | — |
| Intro | An author adds a checkpoint JSON block to a lesson page they control. | 13 | — |
| Intro | At each marked time, the extension pauses the video and opens a runnable JavaScript checkpoint. | 15 | — |
| Intro | The learner changes the starter code, matches the expected output, and resumes the lesson. | 14 | — |
| Demo | Try the sample checkpoint or open `/?demo=1` while developing. | 9 | — |
| Demo | The canonical demo route is `/demo`. | 6 | — |
| Heading | What ships | 2 | — |
| Inventory | A Chrome extension built with TypeScript. | 6 | — |
| Inventory | Its unpacked files are in `.output/chrome-mv3/`. | 6 | — |
| Inventory | A packaged extension at `dist/site/downloads/run-before-next-chrome.zip`. | 5 | — |
| Inventory | A static landing site and live sandbox demo in `dist/site/`. | 10 | — |
| Inventory | One approved JavaScript console template: `javascript-console-v1`. | 6 | — |
| Inventory | License restore and a multi-checkpoint file builder for existing Creator Kit users. | 12 | — |
| Availability | New Creator Kit sales are paused. | 6 | — |
| Availability | WXT and Chrome Manifest V3 details are contributor concerns, not setup steps for lesson authors. | 15 | — |
| Privacy | The extension stores passed checkpoint IDs and lesson page addresses. | 10 | — |
| Privacy | It does not store learner editor contents. | 7 | — |
| Privacy | The live demo does not save sample edits. | 8 | — |
| Heading | Run locally | 2 | — |
| Requirement | Use Node.js 20 or newer. | 5 | — |
| Deploy | The deployment command is exactly `npm run build`. | 8 | — |
| Deploy | Deploy `dist/site/` as the static root. | 6 | — |
| Deploy | Its root contains `index.html`. | 4 | — |
| Heading | Load the extension | 3 | — |
| Step | Run `npm run build`. | 4 | — |
| Step | Unzip `dist/site/downloads/run-before-next-chrome.zip`. | 2 | — |
| Step | Open `chrome://extensions` in desktop Chrome. | 5 | — |
| Step | Turn on Developer mode. | 4 | — |
| Step | Choose Load unpacked and select the unzipped folder. | 8 | — |
| Step | Open a lesson page that includes the author checkpoint block below. | 11 | — |
| Install | The live download uses the same manual installation steps. | 9 | — |
| Install | It is not a Chrome Web Store install. | 8 | — |
| Heading | Add checkpoints to a lesson | 5 | — |
| Instruction | Add this checkpoint JSON block to a lesson page you control. | 11 | — |
| Manifest | Times are seconds from the start of the first page video. | 11 | — |
| Manifest | Checkpoint IDs must be unique. | 5 | — |
| Manifest | The extension sorts checkpoints by time. | 6 | — |
| Manifest | It rejects templates other than `javascript-console-v1`. | 6 | — |
| Builder | Existing Creator Kit users can import and edit version 1 checkpoint files. | 12 | — |
| Builder | The builder adds, removes, reorders, validates, and exports multiple checkpoints locally. | 11 | — |
| Heading | Privacy and security | 3 | — |
| Security | Learner code runs in an isolated extension page with no extension access. | 12 | — |
| Security | A run stops within 1.5 seconds if it does not return. | 11 | — |
| Security | The extension neither scrapes nor redistributes video. | 7 | — |
| Permission | Chrome asks for access to all sites. | 7 | — |
| Permission | This lets the extension look for an author-provided checkpoint file on each page. | 13 | — |
| Permission | If it finds none, it stops without changing the page, storage, video, or network activity. | 15 | — |
| Storage | Progress contains only page addresses and passed checkpoint IDs. | 9 | — |
| Links | See `/privacy` and `/terms` on the built site. | 8 | — |
| License | Existing Creator Kit access uses the Sociobot billing API. | 9 | — |
| License | The browser stores the license under `sb_license:video-code-exit-tickets`. | 7 | — |
| License | It checks the license at most once daily. | 8 | — |
| License | The free extension remains available during checks. | 7 | — |
| Heading | Tests and claims | 3 | — |
| Tests | Tests cover the demo, same-origin requests, downloads, offline reload, mobile layout, and accessibility. | 13 | — |
| Tests | They also run the unpacked extension through one checkpoint. | 9 | — |
| Claims | Every public product claim and its exact command appears in `.factory/claims.json`. | 11 | — |
| Heading | License | 1 | — |
| License | MIT. | 1 | — |
| License | See LICENSE. | 2 | — |

## Earlier findings checked again

All `F-1-*` findings are fixed in current live behavior and code, not merely marked fixed:

| IDs | Verification |
| --- | --- |
| F-1-1, F-1-4, F-1-13 through F-1-23 | First screen now states the author checkpoint constraint, sample action and desktop ZIP installation plainly; prior jargon/metaphor/term findings are absent. |
| F-1-2 | Exit/reset behavior works live; its missing claims coverage is F-2-1. |
| F-1-3, F-1-5, F-1-9 through F-1-12 | Tagged tests now cover timestamp crossing, inert no-manifest pages, sample manifest, IDs, offline reload, and the full builder loop. |
| F-1-6 through F-1-8 | Route documents have route metadata; history restores visible invoking focus; `/missing-page` is an HTTP 404 with the standard product skeleton. |
| F-1-24 through F-1-28 | README wording is plain, split into usable sentences, and its previous claim items are registered. |

## Structure, privacy, and visual checks

- `/`, `/demo`, `/creator`, `/privacy`, and `/terms` returned 200. `/missing-page` returned a real 404 with `noindex`. Each rendered route has one h1 and one main.
- Titles, descriptions, canonical, OG/Twitter metadata, favicon, and apple touch icon are route-specific. `robots.txt` and `sitemap.xml` enumerate public routes.
- All discovered internal product links returned 200; the deliberately requested 404 is the only 404. Header/footer include the expected Demo, Privacy, Terms, download, product one-liner, Param Factory attribution, and build ID.
- Fresh Axe scans had no serious or critical issues. Ordinary routes produced no console or page errors. At 390 px there is no horizontal overflow.
- CSP, nosniff, strict referrer policy, and response-header `frame-ancestors 'none'` are present. Eval is excluded from the app and allowed only in `/sandbox.html`, whose `connect-src` is `none`.
- Fresh public-route requests were same-origin apart from the opaque local sandbox worker: no analytics, ads, or third-party font/script request appeared. The registered offline claim passed.
- The dark mineral/glass checkpoint instrument, lime run rail, clipped panels, type pairing, and checkpoint-specific 404 follow `.factory/design.md` and are distinct from a generic SaaS template.

## Missed leverage

No extra AI, sync, or import/export feature is implied by the brief. The useful existing-customer import/edit/export loop is present; an AI feature would add cost and privacy surface without improving the required timestamp/output gate.

## What would make this perfect

Fix F-2-1: register and tag the demo-exit/isolation claim, test all advertised exits from clean state, and either prove or remove the real-extension-data statement. Then rerun every claims command and this first-read review. No other issue was found.
