# Adversarial first-read review 4 — Run Before Next

**Verdict: PASS**

Reviewed on 2026-08-29 at commit `f42052245ae075154d2530f29632e4ada3cff98d`, using a fresh temporary clone and fresh Chromium contexts against <https://video-code-exit-tickets.sociobot.in>. There are zero findings and every registered claim test was run. This is a PASS under the required zero-findings rule.

## Cold first screen

At 390 × 844, before scrolling, the answer to all three first-visit questions was available:

| Question | Answer from the first screen | Exact visible evidence |
| --- | --- | --- |
| What does this do? | It makes the learner prove a code change before the lesson video continues. | “Prove your code before the video continues” |
| Who is it for? | Learners using programming lessons whose author added this product's code checks. | “For learners using programming lessons whose author added Run Before Next code checks.” |
| What should I click first? | Try the realistic sample checkpoint. | “Try the sample checkpoint” and “Opens one JavaScript checkpoint. No setup.” |

The constraint is equally clear: “Works on lessons with an author-provided checkpoint file.” Privacy, offline scope, and price are also visible: “Learner code is not saved.”, “The sample reloads offline after one online visit.”, and “The Chrome extension is free.” All seven required text blocks remained inside the 844 px mobile viewport. The same job, audience, constraint, and action were clear at 1440 × 900. No blocking first-screen issue was found.

## Copy audit

Word counts treat contractions, hyphenated words, paths, versions, and identifiers as one word. Code examples are excluded. `—` means no issue: no text exceeds 22 words, no banned marketing word or unexplained metaphor was found, terminology is consistent, headings stand alone, and actions name their result.

### Landing page

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| Skip link | Skip to main content | 4 | — |
| Wordmark | Run Before Next | 3 | — |
| Navigation | Demo | 1 | — |
| Navigation | For authors | 2 | — |
| Navigation | Privacy | 1 | — |
| Header action | Download extension ZIP | 3 | — |
| Header description | Desktop Chrome manual install for lessons with an author checkpoint file. | 11 | — |
| Eyebrow | Code checks for video lessons | 5 | — |
| H1 | Prove your code before the video continues | 7 | — |
| Audience | For learners using programming lessons whose author added Run Before Next code checks. | 13 | — |
| Primary action | Try the sample checkpoint | 4 | — |
| Action note | Opens one JavaScript checkpoint. | 4 | — |
| Action note | No setup. | 2 | — |
| Fact | Works on lessons with an author-provided checkpoint file. | 8 | — |
| Fact | The sample reloads offline after one online visit. | 8 | — |
| Fact | Learner code is not saved. | 5 | — |
| Fact | The Chrome extension is free. | 5 | — |
| Download note | Download for desktop Chrome. | 4 | — |
| Download note | Manual installation is required. | 4 | — |
| Art label | Lesson 04 | 2 | — |
| Art time | 00:47 | 1 | — |
| Art label | Checkpoint at 00:47 | 3 | — |
| Install eyebrow | Desktop Chrome · manual install | 4 | — |
| H2 | Install the downloaded extension ZIP | 5 | — |
| Install step | Unzip run-before-next-chrome.zip. | 2 | — |
| Install step | Open chrome://extensions and turn on Developer mode. | 6 | — |
| Install step | Choose Load unpacked and select the unzipped folder. | 8 | — |
| Install step | Open a lesson whose author added a checkpoint file. | 9 | — |
| Permission | Chrome asks for access to all sites so the extension can check each page for that file. | 16 | — |
| Permission | If it finds none, it stops. | 6 | — |
| Section label | The product | 2 | — |
| H2 | See how a checkpoint blocks the video | 7 | — |
| Rail | Watch · Concept shown | 3 | — |
| Rail | Change · Edit starter code | 4 | — |
| Rail | Run · Match the output | 4 | — |
| Rail | Resume · Video continues | 3 | — |
| Action | Try the sample checkpoint | 4 | — |
| Section label | How it works | 3 | — |
| H2 | Add one runnable code check | 5 | — |
| Body | A small checkpoint file gives the extension a time, starter code, and expected output. | 14 | — |
| H3 | Set the checkpoint time | 4 | — |
| Body | The author adds a checkpoint time to the lesson page. | 10 | — |
| H3 | Change and run | 3 | — |
| Body | The extension pauses the video and opens the approved JavaScript code runner. | 12 | — |
| H3 | Pass and resume | 3 | — |
| Body | The video continues when the changed code prints the expected output. | 11 | — |
| Section label | For authors | 2 | — |
| H2 | Attach checkpoints without moving your videos | 6 | — |
| Body | Add one JSON script to the lesson page. | 8 | — |
| Body | The extension does not scrape, host, or copy the video. | 10 | — |
| Action | Download sample checkpoint file | 4 | — |
| Section label | Clear boundaries | 2 | — |
| H2 | The extension does not copy your video | 7 | — |
| Boundary | Author checkpoint files only. | 4 | — |
| Body | Without a checkpoint file, the extension stops without touching the page. | 11 | — |
| Boundary | All-sites permission. | 2 | — |
| Body | Chrome uses it to check each page for an author-provided checkpoint file. | 12 | — |
| Boundary | No source upload. | 3 | — |
| Body | Code runs inside an isolated browser sandbox. | 7 | — |
| Boundary | JavaScript console checks only. | 4 | — |
| Body | Version one accepts only the JavaScript console template. | 8 | — |
| Section label | Creator Kit · existing licenses | 4 | — |
| H2 | Existing customers can build checkpoint files | 6 | — |
| Body | Creator Kit sales are paused. | 5 | — |
| Body | Existing license holders can verify a license, import checkpoint files, and edit every check. | 14 | — |
| Action | Restore an existing license | 4 | — |
| Form label | License token | 2 | — |
| Form action | Verify license | 2 | — |
| Footer | Runnable code checks for existing video lessons. | 7 | — |
| Footer link | Demo | 1 | — |
| Footer link | Privacy | 1 | — |
| Footer link | Terms | 1 | — |
| Footer link | Built by Param Factory | 4 | — |
| Build | v1.0.1 · build 2026.08.29 | 3 | — |
| Provenance | Hero image generated for this product. | 6 | — |

### README

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

Terminology remains consistent: a timed task is a “checkpoint”, author JSON is a “checkpoint file”, the starting program is “starter code”, and the required console text is “expected output”. The landing and README claim-like copy maps to the listed claims; no unlisted claim was found.

## Demo and sandbox

- One click on **Try the sample checkpoint** opens `/?demo=1` and immediately shows a paused arrays lesson at 00:47, the task, starter code, expected result, editor, and **Run check**.
- Changing `* 1` to `* 2` produced `OUTPUT · PASSED` and `6, 10, 14`.
- The persistent banner says “Demo — sample data, nothing is saved” and offers **Reset demo** and **Start for real**.
- **Reset demo** restored the starter program, `Not passed`, and the initial output. Passing, exiting through the wordmark, and returning also restored a fresh sample.
- During pass, reset, exit, and offline reload, localStorage, sessionStorage, and IndexedDB were empty. The production request log contained only same-origin requests (plus browser blob handling); no analytics, billing, font, or model request appeared.
- The sample reloaded while offline after one online visit. The shipped claim test also verifies that demo use neither reads nor changes seeded extension storage.

The demo is one-click, realistic, visibly labelled, resettable, and isolated. No demo finding was found.

## Claims and clean-clone verification

A new clone at `/tmp/rbn-review4-AODzJB` ran `npm ci` successfully with zero vulnerabilities. Each exact command recorded in `.factory/claims.json` passed independently; the final aggregate result was 23/23 Playwright tests and 3/3 unit tests.

| Claim IDs | Exact registered command | Result |
| --- | --- | --- |
| `demo-pass`, `privacy-demo`, `demo-exit-isolation`, `timeout-recovery`, `extension-download`, `manifest-export`, `creator-sales-paused`, `sandbox-isolation`, `extension-flow`, `source-not-saved`, `video-pause-gate`, `video-local-only`, `sandbox-no-extension-apis`, `license-check-cadence`, `site-local-assets`, `no-manifest-inert`, `sample-manifest-download`, `offline-reload`, `manifest-round-trip`, `manifest-import-recovery` | `npm test -- --grep @claim:<id>` | PASS, each |
| `template-allowlist`, `checkpoint-sorting`, `unique-checkpoint-ids` | `npm run test:unit -- --testNamePattern @claim:<id>` | PASS, each |

Additional clean-clone gates passed: `npm run check`; `npm run test:unit` (3/3); `npm test` (23/23); and `npm run build`, which produced `dist/site/index.html` and `dist/site/downloads/run-before-next-chrome.zip`. The built site JavaScript is 28.76 kB raw / 9.70 kB gzip, well below the static-product budget.

## Earlier findings checked again

Each historical finding was rechecked in live behavior and current code/tests, rather than accepted from its marked status.

| Earlier ID | Current confirmation | Status |
| --- | --- | --- |
| F-1-1 | Both first screens identify learners, the author-provided checkpoint-file constraint, and the first action. | Fixed |
| F-1-2 | Reset, Start for real, wordmark exit, Privacy/Back, and Back/Forward return to fresh in-memory demo state; `@claim:demo-exit-isolation` passes. | Fixed |
| F-1-3 | `@claim:extension-flow` crosses the authored timestamp, pauses, passes, and releases the fixture lesson. | Fixed |
| F-1-4 | The live action names the ZIP result and the four desktop/manual installation steps are present. | Fixed |
| F-1-5 | Home and Privacy disclose all-sites access; `@claim:no-manifest-inert` proves the no-file early exit. | Fixed |
| F-1-6 | Every route has route-specific title, description, canonical, OG/Twitter, favicon, and apple-touch metadata. | Fixed |
| F-1-7 | New routes focus the h1; Back restores the visible invoking link and scroll position. | Fixed |
| F-1-8 | The HTTP 404 has the common header/footer, direct h1, product actions, attribution, and build ID. | Fixed |
| F-1-9 | `@claim:sample-manifest-download` downloads and validates the documented sample file. | Fixed |
| F-1-10 | `@claim:unique-checkpoint-ids` rejects duplicate IDs. | Fixed |
| F-1-11 | `@claim:offline-reload` is registered and passes from a fresh browser state. | Fixed |
| F-1-12 | The licensed builder claims cover import, recovery, edit, reorder, add/remove, validation, and export. | Fixed |
| F-1-13 | The live eyebrow is “Code checks for video lessons.” | Fixed |
| F-1-14 | The live fact is “The Chrome extension is free.” | Fixed |
| F-1-15 | Decorative “checkpoint armed” is absent; the art labels the actionable 00:47 checkpoint. | Fixed |
| F-1-16 | The live preview h2 is “See how a checkpoint blocks the video.” | Fixed |
| F-1-17 | Sample actions consistently say “Try the sample checkpoint”; Demo is reserved for the route. | Fixed |
| F-1-18 | The live how-it-works h2 is “Add one runnable code check.” | Fixed |
| F-1-19 | The live step h3 is “Set the checkpoint time.” | Fixed |
| F-1-20 | Live copy says “approved JavaScript code runner”; `@claim:template-allowlist` passes. | Fixed |
| F-1-21 | The privacy h2 states “The extension does not copy your video.” | Fixed |
| F-1-22 | The boundary states “JavaScript console checks only.” | Fixed |
| F-1-23 | The existing-customer h2 states “Existing customers can build checkpoint files.” | Fixed |
| F-1-24 | README leads with the learner-facing Chrome extension; WXT/MV3 are contributor context. | Fixed |
| F-1-25 | README says to add a checkpoint JSON block to a lesson page the author controls. | Fixed |
| F-1-26 | README states the isolated extension page has no extension access; the sandbox claims pass. | Fixed |
| F-1-27 | README separates license storage, daily cadence, and free-download availability. | Fixed |
| F-1-28 | README test copy is short and names observable coverage. | Fixed |
| F-2-1 | `demo-exit-isolation` is registered and proves every advertised exit plus extension-data isolation. | Fixed |
| F-3-1 | The first screen now includes the registered offline scope: “The sample reloads offline after one online visit.” | Fixed |

## Structure, privacy, and visual checks

- `/`, `/demo`, `/creator`, `/privacy`, and `/terms` returned 200; `/missing-page` returned an HTTP 404 with `noindex`. Every rendered route has one h1, one main landmark, `lang="en"`, no 390 px horizontal overflow, and no console/page error.
- Fresh Axe scans across all six routes found zero serious or critical violations. The live test also confirmed keyboard route focus, visible Back focus, and the demo's key controls at 44 px or more.
- The internal-link crawl returned 200 for home, demo, privacy, terms, the extension ZIP, and the sample manifest. Header/footer are consistent and include the required legal links and Param Factory attribution.
- Response headers include `frame-ancestors 'none'`, `object-src 'none'`, `X-Content-Type-Options: nosniff`, and strict-origin-when-cross-origin referrer policy. The CSP keeps eval out of the app and confines the runner to its declared sandbox.
- The original mineral-glass terrain, lime run path, clipped ticket panels, condensed display type, and checkpoint-shaped 404 follow `.factory/design.md`. The page does not resemble a generic centered-hero/three-card SaaS template.

## Missed leverage

No omitted AI, sync, or import/export feature is implied by the brief. The useful existing-customer import/edit/export workflow is present. Adding an AI feature would increase privacy and cost surface without improving the defined timestamp-and-output gate.

## What would make this perfect

No concrete product, copy, demo, claim, privacy, routing, accessibility, or visual-system change remains to recommend from this review. Preserve the registered-claim discipline when adding future capabilities.
