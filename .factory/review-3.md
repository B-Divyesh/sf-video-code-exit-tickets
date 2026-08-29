# Adversarial first-read review 3 — Run Before Next

**Verdict: FAIL**

Reviewed on 2026-08-29 at commit `b0e995fc6721175c92e738adeb6868c6ae19df1f`, from a clean temporary clone and fresh Chromium contexts against <https://video-code-exit-tickets.sociobot.in>. The review found no blocking issue and one minor issue. PASS requires zero findings.

## Finding

### Minor

#### F-3-1 — The first-screen facts omit offline behavior

- **Quote/location:** landing first-screen facts: “Works on lessons with an author-provided checkpoint file.”, “No account.”, “Learner code is not saved.”, and “The Chrome extension is free.”
- **Why this is incomplete:** the mandatory first-screen fact set must state privacy, offline behavior, and price. Privacy and price are present, but offline behavior is absent even though `offline-reload` registers and proves the scoped promise. A visitor cannot tell from the first screen whether the sample remains usable after losing a connection.
- **Concrete fix:** replace “No account.” with “The sample reloads offline after one online visit.” This is the exact registered scope, stays below 22 words, and avoids implying that every lesson video is available offline. Recheck the 390 px first screen after the copy change.

## Cold first screen

At 390 × 844, before scrolling, I could answer all three required questions:

- **What:** the extension makes a learner prove a code change before a programming video continues.
- **For whom:** learners using programming lessons whose author added Run Before Next checks.
- **First click:** **Try the sample checkpoint**.

The exact visible evidence was “Prove your code before the video continues”, “For learners using programming lessons whose author added Run Before Next code checks.”, “Try the sample checkpoint”, and “Opens one JavaScript checkpoint. No setup.” The author-file limit, privacy statement, and free price were also visible before scrolling. The same questions were answered at 1440 × 900. This is not a blocking finding; F-3-1 concerns the missing offline fact.

## Copy audit

Counts treat contractions, hyphenated terms, paths, versions, and identifiers as one word. Code blocks are excluded. Headings, labels, and actions are included to check isolated meaning and action wording.

### Landing page

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| Skip link | Skip to main content | 4 | — |
| Wordmark | Run Before Next | 3 | — |
| Nav | Demo | 1 | — |
| Nav | For authors | 2 | — |
| Nav | Privacy | 1 | — |
| Header action | Download extension ZIP | 3 | — |
| Download description | Desktop Chrome manual install for lessons with an author checkpoint file. | 11 | — |
| Eyebrow | Code checks for video lessons | 5 | — |
| H1 | Prove your code before the video continues | 7 | — |
| Audience | For learners using programming lessons whose author added Run Before Next code checks. | 13 | — |
| Primary action | Try the sample checkpoint | 4 | — |
| Action note | Opens one JavaScript checkpoint. | 4 | — |
| Action note | No setup. | 2 | — |
| Fact | Works on lessons with an author-provided checkpoint file. | 8 | F-3-1: fact set lacks offline scope |
| Fact | No account. | 2 | F-3-1: proposed replacement |
| Fact | Learner code is not saved. | 5 | — |
| Fact | The Chrome extension is free. | 5 | — |
| Download note | Download for desktop Chrome. | 4 | — |
| Download note | Manual installation is required. | 4 | — |
| Art label | Lesson 04 | 2 | — |
| Art time | 00:47 | 1 | — |
| Art label | Checkpoint at 00:47 | 3 | — |
| Install label | Desktop Chrome · manual install | 4 | — |
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
| Action | Try the sample checkpoint → | 4 | — |
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
| Footer link | Built by Param Factory ↗ | 4 | — |
| Build | v1.0.1 · build 2026.08.29 | 3 | — |
| Provenance | Hero image generated for this product. | 6 | — |

No landing sentence exceeds 22 words. No banned marketing adjective, unexplained metaphor, inconsistent product term, or non-result-naming action was found. F-3-1 is an omission from the fact set rather than a sentence-length defect.

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

No README sentence exceeds 22 words. No jargon needing a reader-facing rewrite, banned marketing adjective, inconsistent term, mood heading, metaphor heading, or weak action was found.

## Demo and sandbox

- One click on **Try the sample checkpoint** opened `/?demo=1` with a realistic arrays lesson, checkpoint at 00:47, prompt, paused-video state, starter code, expected result, editor, and **Run check** action.
- The first 390 px screen already showed the sample lesson, checkpoint count, task, source array, map operation, and paused checkpoint state.
- Changing `* 1` to `* 2` produced “Passed” and `6, 10, 14` on the live site.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed **Reset demo** and **Start for real**.
- **Reset demo** restored `* 1`, “Not passed”, and the initial output message.
- `localStorage`, `sessionStorage`, and IndexedDB stayed empty during the pass/reset flow. A seeded real-origin sentinel remained unchanged after reset and exit.
- Every recorded live demo request was same-origin. No analytics, font, billing, or model request occurred.
- `@claim:demo-exit-isolation` also passed in a clean unpacked-extension profile with seeded extension storage, proving demo exits clear sample state without reading or changing extension data.

The demo gate passes.

## Claims

All 23 exact commands in `.factory/claims.json` were run independently from clean clone `/tmp/rbn-review3-9kS2Zj` after `npm ci`. No listed test failed and no claim remained untested.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `demo-exit-isolation` | `npm test -- --grep @claim:demo-exit-isolation` | PASS |
| `timeout-recovery` | `npm test -- --grep @claim:timeout-recovery` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `creator-sales-paused` | `npm test -- --grep @claim:creator-sales-paused` | PASS |
| `sandbox-isolation` | `npm test -- --grep @claim:sandbox-isolation` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |
| `checkpoint-sorting` | `npm run test:unit -- --testNamePattern @claim:checkpoint-sorting` | PASS |
| `video-pause-gate` | `npm test -- --grep @claim:video-pause-gate` | PASS |
| `video-local-only` | `npm test -- --grep @claim:video-local-only` | PASS |
| `sandbox-no-extension-apis` | `npm test -- --grep @claim:sandbox-no-extension-apis` | PASS |
| `license-check-cadence` | `npm test -- --grep @claim:license-check-cadence` | PASS |
| `site-local-assets` | `npm test -- --grep @claim:site-local-assets` | PASS |
| `no-manifest-inert` | `npm test -- --grep @claim:no-manifest-inert` | PASS |
| `sample-manifest-download` | `npm test -- --grep @claim:sample-manifest-download` | PASS |
| `unique-checkpoint-ids` | `npm run test:unit -- --testNamePattern @claim:unique-checkpoint-ids` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `manifest-round-trip` | `npm test -- --grep @claim:manifest-round-trip` | PASS |
| `manifest-import-recovery` | `npm test -- --grep @claim:manifest-import-recovery` | PASS |

The landing and README claim cross-check found no unlisted claim. F-3-1 asks the first screen to surface an already registered claim; it does not require a new claim entry.

## Earlier findings checked again

I read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `.factory/polish-2.md`, and the prior `.factory/handoff.md`. Each earlier finding was checked in current code, the clean build, and the live deployment.

| Earlier ID | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Mobile and desktop first screens name learners, author-added checks, and the checkpoint-file limit. | Fixed |
| F-1-2 | Live reset/exit checks and `@claim:demo-exit-isolation` restore fresh demo state on every advertised exit. | Fixed |
| F-1-3 | `@claim:extension-flow` crosses 47 seconds in playable media without a synthetic open command. | Fixed |
| F-1-4 | Live action says “Download extension ZIP”; desktop/manual scope and four install steps are present. | Fixed |
| F-1-5 | Home and Privacy disclose all-sites access; `@claim:no-manifest-inert` passed. | Fixed |
| F-1-6 | Demo, Creator, Privacy, Terms, and 404 return route-specific title, description, canonical, OG, Twitter, favicon, and apple-touch metadata. | Fixed |
| F-1-7 | Live new navigation focused the route h1; Back restored scroll 4115 and visible focus to `footer-privacy`. | Fixed |
| F-1-8 | The HTTP 404 uses “Page not found”, the common header/footer, actions, attribution, and build ID. | Fixed |
| F-1-9 | `@claim:sample-manifest-download` downloaded, parsed, and validated the sample file. | Fixed |
| F-1-10 | `@claim:unique-checkpoint-ids` rejected duplicate IDs. | Fixed |
| F-1-11 | `offline-reload` is registered and passed from the clean clone. | Fixed |
| F-1-12 | Round-trip and recovery claims passed for local multi-checkpoint import, edit, reorder, add/remove, and export. | Fixed |
| F-1-13 | Live eyebrow is “Code checks for video lessons.” | Fixed |
| F-1-14 | Live fact is “The Chrome extension is free.” | Fixed |
| F-1-15 | “checkpoint armed” is absent; the art says “Checkpoint at 00:47.” | Fixed |
| F-1-16 | Live h2 is “See how a checkpoint blocks the video.” | Fixed |
| F-1-17 | Sample actions consistently say “Try the sample checkpoint”; Demo is the route name. | Fixed |
| F-1-18 | Live h2 is “Add one runnable code check.” | Fixed |
| F-1-19 | Live h3 is “Set the checkpoint time.” | Fixed |
| F-1-20 | Live copy uses “approved JavaScript code runner”; the allowlist claim passed. | Fixed |
| F-1-21 | Live h2 is “The extension does not copy your video.” | Fixed |
| F-1-22 | Live boundary is “JavaScript console checks only.” | Fixed |
| F-1-23 | Live h2 is “Existing customers can build checkpoint files.” | Fixed |
| F-1-24 | README introduces a TypeScript Chrome extension; WXT/MV3 are confined to contributor context. | Fixed |
| F-1-25 | README says “Add this checkpoint JSON block to a lesson page you control.” | Fixed |
| F-1-26 | README says the isolated extension page has no extension access; the claim passed. | Fixed |
| F-1-27 | License storage, cadence, and free availability are three separate sentences. | Fixed |
| F-1-28 | README test coverage is split into two short, observable sentences. | Fixed |
| F-2-1 | `demo-exit-isolation` exists in `claims.json`, has an exact tagged test, and passed independently. | Fixed |

No earlier finding regressed. F-3-1 is new and narrower than F-1-1: the job, audience, compatibility limit, and first action remain clear.

## Structure, accessibility, and live checks

- `/`, `/demo`, `/creator`, `/privacy`, and `/terms` returned 200. The test unknown path returned a designed HTTP 404 with `noindex`.
- Every route had `lang="en"`, one h1, one main landmark, an ordered heading outline, a route-specific title in the required pattern, description, canonical, OG/Twitter metadata, SVG favicon, and apple-touch icon.
- `robots.txt` and `sitemap.xml` were live and listed all five public routes.
- The link crawl returned 200 for every product URL, download, fragment destination, and the external Param Factory destination. The two explicit `mailto:` links were allowed.
- New route navigation focused the destination h1. Back restored both scroll position and visible focus to the invoking footer link.
- Playwright Axe 4.10.2 found zero serious or critical violations across all public routes and the 404 at 390 px. The factory URL verifier reported no errors, one h1, `lang`, main, alt text, and labeled buttons.
- Ordinary routes produced no console or page errors, no route had horizontal overflow at 390 px, and the reduced-motion history path passed.
- Live security headers include CSP, `frame-ancestors 'none'`, nosniff, strict referrer policy, HSTS, and a restrictive permissions policy.
- The current build emits 28.56 kB JavaScript raw / 9.64 kB gzip. The live JavaScript, CSS, ZIP hash, and every unpacked extension file matched the current checkout.
- The mineral-green field, lime run signal, cut-corner panels, checkpoint rail, generated terrain art, and matching 404 are product-specific and do not present as a generic SaaS template.

## Quality gates

From the clean clone:

- `npm ci`: PASS; zero vulnerabilities.
- `npm run check`: PASS.
- `npm run test:unit`: PASS, 3/3.
- `npm test`: PASS, 23/23.
- `npm run build`: PASS; `dist/site/` and the Chrome extension ZIP were produced.
- All 23 exact claim commands: PASS independently.

## Missed leverage

No missing AI, sync, import, or export step is implied by the brief. The deterministic code-output gate is the product's job; adding model inference would add cost and privacy surface without improving it. Authors can download a sample checkpoint file, and existing Creator Kit users can import, validate, edit, reorder, add, remove, and export checkpoint files locally.

## What would make this perfect

Resolve F-3-1 by putting the already tested offline scope in the first-screen fact list, then recheck the 390 px fold and rerun the copy audit. No other product, demo, claim, routing, accessibility, privacy, visual, or leverage issue was found.
