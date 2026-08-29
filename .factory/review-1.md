# Adversarial first-read review 1 — Run Before Next

**Verdict: FAIL**

Reviewed the live production site at <https://video-code-exit-tickets.sociobot.in> on 2026-08-29 from fresh Chromium contexts at 390 × 844 and 1440 × 900. The review found four blocking issues, eight major issues, and sixteen minor copy issues. A PASS requires zero findings.

## 1. Cold first screen

Before scrolling, I understood the page as follows:

- **What it does:** pauses a programming video at a code checkpoint and requires the learner to change and run code before continuing.
- **For whom:** people learning programming from video.
- **What to click first:** **Try it with sample data**.

The visible evidence was the headline “Prove your code before the video continues,” the sentence “For video learners who need to change and run each idea before moving on,” and the primary action “Try it with sample data.” All three were visible in both viewports. On mobile, the action note and three facts were also above the fold.

This is not a clean first-screen pass. The audience sentence omits the product's decisive compatibility condition: it works only when the lesson author has embedded a Run Before Next manifest. See **F-1-1**.

## 2. Findings

### Blocking

#### F-1-1 — The first screen implies the extension works with programming videos generally

- **Quote/location:** landing first screen: “For video learners who need to change and run each idea before moving on.”
- **Why this fails:** the extension does nothing unless the lesson page contains an author-supplied `data-run-before-next-manifest` script. A learner can reasonably read the hero, download the extension, and expect it to work on an ordinary programming video. The required author integration appears only after scrolling and in the README. The first screen therefore does not honestly identify who can use the product.
- **Concrete fix:** replace the sentence with: “For learners using programming lessons whose author added Run Before Next code checks.” Add a nearby fact: “Works on lessons with an author-provided checkpoint file.” Add that limitation to the download action.

#### F-1-2 — Demo state survives some exits and returns in a contradictory state

- **Quote/location:** `/demo`; banner says “Demo — sample data, nothing is saved.” `.factory/demo.md` says leaving demo discards demo data.
- **Observed:** pass the sample, choose the **Run Before Next** wordmark, then choose **Demo**. The editor still contains `* 2` and the ticket says “Passed,” while the output panel says “Run the changed code to see its output” and **Run check** is enabled. **Start for real** happens to reload the document and clear state, but the other visible exit does not.
- **Why this fails:** leaving demo mode must discard demo state on every route exit. The retained, internally inconsistent state violates the demo sandbox contract and can mislead the next demo visit.
- **Concrete fix:** reset `demoCode`, `demoPassed`, and `demoRunId` whenever routing away from `/demo`, or create a fresh demo state whenever entering it. Add a test that passes the demo, leaves through the wordmark and Privacy link, re-enters with SPA navigation/back, and confirms the original code, “Not passed,” and initial output.

#### F-1-3 — No claim test proves that reaching a marked timestamp opens the checkpoint

- **Quote/location:** landing: “The author adds a checkpoint time to the lesson page” and “The extension pauses the video”; README: “At each marked time, the extension pauses the page video”; claim `extension-flow`.
- **Observed:** `tests/e2e/site.spec.ts` opens the extension checkpoint by sending `{ type: 'RBN_OPEN' }` from the service worker. It does not advance the fixture video across the manifest's `at: 47` timestamp and wait for the `timeupdate` path to open the checkpoint.
- **Why this fails:** automatic timestamp gating is the core job in the brief. The registered test bypasses that behavior, so the central claim remains untested even though all listed commands return PASS.
- **Concrete fix:** add a tagged clean-profile test that starts below the checkpoint time, crosses 47 seconds through a playable video or controlled media fixture, verifies the dialog opens without `RBN_OPEN`, verifies the video pauses, then passes and resumes. Point the relevant claims entry to that test.

#### F-1-4 — The live install path ends at an unexplained ZIP file

- **Quote/location:** header action “Download extension”; on mobile the visible label is only “↓”.
- **Observed:** the action downloads `run-before-next-chrome.zip`. The live site provides no unpack, Developer mode, or Load unpacked instructions and does not link to the README. A phone cannot install this Chrome extension; desktop Chrome cannot install the ZIP by clicking it.
- **Why this fails:** the sample is tryable, but the real learner job is not actionable from the live product. The label also conceals the sideload requirement. On mobile, the icon-only presentation does not tell a sighted visitor what will happen.
- **Concrete fix:** label it **Download extension ZIP**, state “Desktop Chrome; manual install,” and show a short install panel after download with unpack/Developer mode/Load unpacked steps. Keep a visible text label at 390 px. If a store listing becomes available, use **Install Chrome extension** and link to it instead.

### Major

#### F-1-5 — The extension's all-sites access is not disclosed

- **Quote/location:** landing: “The extension only watches the local video time”; Privacy: “Run Before Next does not create accounts or collect learner source code.”
- **Code evidence:** the packaged manifest requests `host_permissions: ["<all_urls>"]` and injects the content script on `<all_urls>`.
- **Why this fails:** Chrome presents a broad site-access warning. The current privacy copy does not explain why that permission exists or that the content script checks every page for the marked manifest. The narrower “only watches” sentence is incomplete.
- **Concrete fix:** add plain copy before download and on `/privacy`: “Chrome asks for access to all sites so the extension can check each page for an author-provided checkpoint file. If it finds none, it stops.” Add a claim and test proving that a page without a manifest causes no storage write, network request, or video control.

#### F-1-6 — Route metadata describes the home page on non-home routes

- **Quote/location:** `/demo`, `/creator`, `/privacy`, and `/terms` all expose the home description “Pause a video lesson, change runnable code, and pass one output check before the lesson continues” and the home Open Graph/Twitter title and description. `/missing-page` has no canonical, Open Graph, Twitter, or apple-touch metadata.
- **Why this fails:** direct links to Privacy, Terms, and Demo preview as the landing page. Non-JavaScript crawlers also receive the home canonical from the shared HTML response before the client changes it.
- **Concrete fix:** serve route-specific HTML metadata, or generate static HTML entries for each public route. Update title, description, canonical, Open Graph, and Twitter fields per route. Give the 404 the same metadata set, with noindex if intended.

#### F-1-7 — Back/forward restores scroll but moves focus to an off-screen heading

- **Quote/location:** `site/main.ts`, `popstate` calls `render(true)`, which focuses the new `<h1>`; live mobile history navigation.
- **Observed:** from the bottom of home, open Privacy, then go Back with reduced motion. Home scroll returns to 4,365 px, but `document.activeElement` is the home `<h1>` thousands of pixels above the viewport.
- **Why this fails:** visual position and keyboard/screen-reader focus disagree. The user resumes at the prior scroll position while assistive technology is moved to unrelated off-screen content.
- **Concrete fix:** distinguish new navigation from history restoration. On a new push, scroll to and focus the new `<h1>`; on popstate, restore the stored scroll position and the invoking element (or a stable route focus target at that position). Add assertions for both focus and bounding-box visibility.

#### F-1-8 — The designed 404 does not use the site's standard skeleton

- **Quote/location:** `/missing-page`; heading “This run path ends here”; header contains only the wordmark and footer contains only Privacy/Terms.
- **Why this fails:** the 404 omits Demo, For authors, Download, the product one-liner, Param Factory attribution, and build ID. Its metaphor heading also fails to name the problem directly.
- **Concrete fix:** render the same header/footer as other routes and use `<h1>Page not found</h1>` with “This address does not exist. Return to the home page or try the demo.” Preserve the current product-specific ticket art.

#### F-1-9 — “Download sample manifest” is an unlisted claim

- **Quote/location:** landing author section action “Download sample manifest.”
- **Why this fails:** the action promises an artifact, but `.factory/claims.json` has no entry that downloads and validates `/sample-manifest.json`. The link crawl returning 200 is not a registered claim test and does not validate the file.
- **Concrete fix:** add `sample-manifest-download` to `claims.json`; download the file from a fresh context, parse it, run `validateManifest`, and assert the documented sample values.

#### F-1-10 — Unique checkpoint IDs are an unlisted claim

- **Quote/location:** README: “Checkpoint ids must be unique.”
- **Why this fails:** an untagged unit test rejects duplicate IDs, but the sentence has no `claims.json` entry and therefore is skipped by claim-by-claim verification.
- **Concrete fix:** add a `unique-checkpoint-ids` claim and tag the existing duplicate-ID unit test `@claim:unique-checkpoint-ids`. Use “IDs” consistently.

#### F-1-11 — Offline reload is advertised as covered but is not registered as a claim

- **Quote/location:** README: “The test suite covers … offline reload …”
- **Why this fails:** the suite contains an untagged offline demo test, but `claims.json` has no offline claim. Claim-only runs cannot establish the stated capability.
- **Concrete fix:** either remove “offline reload” from the README or add `offline-reload` with the exact user-facing scope (“The demo reloads offline after one online visit”) and tag the existing test.

#### F-1-12 — Existing authors cannot import or edit an existing multi-checkpoint manifest

- **Quote/location:** paid section: “Existing license holders can verify a license and use the guided manifest builder”; `/creator` presents one fixed checkpoint form and only downloads a new file.
- **Why this fails:** the brief supports selected timestamps and the manifest format supports multiple checkpoints. An existing Creator Kit user will reasonably need to open an existing JSON file, validate it, add/edit/remove multiple checkpoints, and export it again. Re-entering one hard-coded checkpoint is not a complete edit loop.
- **Concrete fix:** add local JSON import, validation errors tied to fields, add/remove/reorder controls for multiple checkpoints, and export. Keep it local-first and add claims for round-trip fidelity and invalid-file recovery. AI is not needed; deterministic validation is the appropriate implementation.

### Minor copy findings

#### F-1-13 — “A checkpoint layer for video” uses unexplained product jargon

- **Why:** “layer” does not tell a cold visitor what the extension does.
- **Rewrite:** “Code checks for video lessons.”

#### F-1-14 — “Core extension is free” is ambiguous

- **Why:** “core” implies an undefined non-core edition.
- **Rewrite:** “The Chrome extension is free.”

#### F-1-15 — “checkpoint armed” is decorative product lore

- **Why:** it adds mood rather than usable information.
- **Rewrite:** “Checkpoint at 00:47,” or remove it because the timestamp is already adjacent.

#### F-1-16 — “One small stop between watching and knowing” is a metaphor heading

- **Why:** it does not name the preview section out of context.
- **Rewrite:** “See how a checkpoint blocks the video.”

#### F-1-17 — The demo action uses three names for the same destination

- **Quote/location:** “Try it with sample data,” “Open the live checkpoint,” README “Try the sample with no setup,” and nav “Demo.”
- **Why:** “sample,” “live checkpoint,” and “demo” make one route sound like different things.
- **Rewrite:** use **Try the sample checkpoint** for actions and **Demo** only as the route/nav name.

#### F-1-18 — “Add one falsifiable check” uses academic jargon

- **Why:** “falsifiable” is not needed to explain a runnable output check.
- **Rewrite:** “Add one runnable code check.”

#### F-1-19 — “Mark the moment” does not name the step out of context

- **Why:** a headings list does not reveal that this means a video timestamp.
- **Rewrite:** “Set the checkpoint time.”

#### F-1-20 — “allowlisted JavaScript sandbox” stacks security jargon

- **Quote/location:** “The extension pauses the video and opens an allowlisted JavaScript sandbox.”
- **Why:** a learner cannot use “allowlisted” to understand the action.
- **Rewrite:** “The extension pauses the video and opens the approved JavaScript code runner.”

#### F-1-21 — “Your lesson stays where it is” is a vague heading

- **Why:** it does not name the privacy boundary.
- **Rewrite:** “The extension does not copy your video.”

#### F-1-22 — “No hidden templates” does not describe the actual limit

- **Why:** “hidden” is undefined; the supporting sentence says only one template is accepted.
- **Rewrite:** “JavaScript console checks only.”

#### F-1-23 — “Restore your manifest builder” depends on unexplained terminology

- **Why:** as an isolated heading, it does not say who can restore what.
- **Rewrite:** “Existing customers can build checkpoint files.”

#### F-1-24 — The README introduces WXT and MV3 without explanation

- **Quote/location:** “A WXT and TypeScript Chrome MV3 extension in `.output/chrome-mv3/`.”
- **Why:** this inventory is not understandable to an author who only needs to install or integrate the extension.
- **Rewrite:** “A Chrome extension built with TypeScript. Its unpacked files are in `.output/chrome-mv3/`.” Put framework details in a contributor note.

#### F-1-25 — “application JSON script” is unnecessarily opaque

- **Quote/location:** README: “Place an application JSON script in a page you control.”
- **Why:** the phrase is not standard user language and does not connect to the visible sample.
- **Rewrite:** “Add this checkpoint JSON block to a lesson page you control.”

#### F-1-26 — “declared sandbox page” is implementation jargon

- **Quote/location:** README: “Learner code runs in the extension’s declared sandbox page.”
- **Why:** “declared” adds no usable safety information.
- **Rewrite:** “Learner code runs in an isolated extension page with no extension access.”

#### F-1-27 — The license-storage sentence contains three ideas

- **Quote/location:** README: “The browser stores a supplied license under `sb_license:video-code-exit-tickets`, verifies it at most once daily, and never blocks the free extension while checking.” (22 words)
- **Why:** it meets the numeric cap but violates the one-idea rule and makes the privacy behavior hard to scan.
- **Rewrite:** “The browser stores the license under `sb_license:video-code-exit-tickets`. It checks the license at most once daily. The free extension remains available during checks.”

#### F-1-28 — The README test sentence exceeds 22 words and uses opaque labels

- **Quote/location:** “The test suite covers the live demo, request privacy, packaged download, paid manifest export, offline reload, mobile layout, accessibility, and an unpacked-extension run.” (23 words)
- **Why:** it breaks the hard cap; “request privacy,” “paid manifest export,” and “unpacked-extension run” do not state observable results.
- **Rewrite:** “Tests cover the demo, same-origin requests, downloads, offline reload, mobile layout, and accessibility. They also run the unpacked extension through one checkpoint.”

## 3. Copy audit

Counts treat hyphenated terms, paths, versions, and contractions as one word. Code blocks are excluded because they are code rather than sentences. Headings, labels, and actions are included so the audit also checks out-of-context meaning and verb labels.

### Landing page

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| Skip link | Skip to main content | 4 | — |
| Wordmark | Run Before Next | 3 | — |
| Nav | Demo | 1 | — |
| Nav | For authors | 2 | — |
| Nav | Privacy | 1 | — |
| Header action | Download extension | 2 | F-1-4 |
| Eyebrow | A checkpoint layer for video | 5 | F-1-13 |
| H1 | Prove your code before the video continues | 7 | — |
| Lede | For video learners who need to change and run each idea before moving on. | 14 | F-1-1 |
| Primary action | Try it with sample data | 5 | F-1-17 |
| Action note | Opens one JavaScript checkpoint. | 4 | — |
| Action note | No setup. | 2 | — |
| Fact | No account. | 2 | — |
| Fact | Learner code is not saved. | 5 | — |
| Fact | Core extension is free. | 4 | F-1-14 |
| Art label | LESSON 04 | 2 | — |
| Art label | 00:47 | 1 | — |
| Art label | checkpoint armed | 2 | F-1-15 |
| Section label | THE PRODUCT | 2 | — |
| H2 | One small stop between watching and knowing | 7 | F-1-16 |
| Rail | Watch | 1 | — |
| Rail note | Concept shown | 2 | — |
| Rail | Change | 1 | — |
| Rail note | Edit starter code | 3 | — |
| Rail | Run | 1 | — |
| Rail note | Match the output | 3 | — |
| Rail | Resume | 1 | — |
| Rail note | Video continues | 2 | — |
| Link | Open the live checkpoint | 4 | F-1-17 |
| Section label | HOW IT WORKS | 3 | — |
| H2 | Add one falsifiable check | 4 | F-1-18 |
| Body | A small manifest gives the extension a time, starter code, and expected output. | 13 | — |
| H3 | Mark the moment | 3 | F-1-19 |
| Body | The author adds a checkpoint time to the lesson page. | 10 | F-1-3 |
| H3 | Change and run | 3 | — |
| Body | The extension pauses the video and opens an allowlisted JavaScript sandbox. | 11 | F-1-20 |
| H3 | Pass and resume | 3 | — |
| Body | The video continues when the changed code prints the expected output. | 11 | — |
| Section label | FOR AUTHORS | 2 | — |
| H2 | Attach checkpoints without moving your videos | 6 | — |
| Body | Add one JSON script to the lesson page. | 8 | — |
| Body | The extension does not scrape, host, or copy the video. | 10 | — |
| Action | Download sample manifest | 3 | F-1-9 |
| Section label | CLEAR BOUNDARIES | 2 | — |
| H2 | Your lesson stays where it is | 6 | F-1-21 |
| Boundary | No video scraping. | 3 | — |
| Body | The extension only watches the local video time. | 8 | F-1-5 |
| Boundary | No source upload. | 3 | — |
| Body | Code runs inside an isolated browser sandbox. | 7 | — |
| Boundary | No hidden templates. | 3 | F-1-22 |
| Body | Version one accepts only the JavaScript console template. | 8 | — |
| Section label | CREATOR KIT · EXISTING LICENSES | 4 | — |
| H2 | Restore your manifest builder | 4 | F-1-23 |
| Body | Creator Kit sales are paused. | 5 | — |
| Body | Existing license holders can verify a license and use the guided manifest builder. | 13 | — |
| Action | Restore an existing license | 4 | — |
| Form label | License token | 2 | — |
| Form action | Verify license | 2 | — |
| Footer | Runnable code checks for existing video lessons. | 7 | — |
| Footer link | Privacy | 1 | — |
| Footer link | Terms | 1 | — |
| Footer link | Built by Param Factory | 4 | — |
| Build | v1.0.0 · build 2026.08.28 | 3 | — |
| Provenance | Hero image generated for this product. | 6 | — |

### README

| Location | Exact copy | Words | Flag |
| --- | --- | ---: | --- |
| H1 | Run Before Next | 3 | — |
| Tagline | Prove your code change before the video continues. | 8 | — |
| Intro | Run Before Next is a Chrome MV3 extension for people learning programming from video. | 14 | F-1-24 |
| Intro | An author adds a small JSON manifest to an existing lesson page. | 12 | — |
| Intro | At each marked time, the extension pauses the page video and opens a runnable JavaScript checkpoint. | 16 | F-1-3 |
| Intro | The learner changes the starter code, matches the expected output, and resumes the lesson. | 14 | — |
| Link | Try the sample with no setup | 6 | F-1-17 |
| H2 | What ships | 2 | — |
| Bullet | A WXT and TypeScript Chrome MV3 extension in `.output/chrome-mv3/`. | 9 | F-1-24 |
| Bullet | A packaged extension at `dist/site/downloads/run-before-next-chrome.zip`. | 5 | — |
| Bullet | A static landing site and live sandbox demo in `dist/site/`. | 10 | — |
| Bullet | One allowlisted sandbox template: `javascript-console-v1`. | 5 | F-1-20 |
| Bullet | License restore and a manifest builder for existing Creator Kit users. | 11 | — |
| Sentence | New sales are paused. | 4 | — |
| Sentence | The extension stores passed checkpoint ids and lesson page addresses. | 10 | — |
| Sentence | It does not store learner editor contents. | 7 | — |
| Sentence | The live demo records no sample edits in local or session storage. | 12 | — |
| H2 | Run locally | 2 | — |
| Sentence | Use Node.js 20 or newer. | 5 | — |
| Sentence | The deployment command is exactly `npm run build`. | 8 | — |
| Sentence | Deploy `dist/site/` as the static root. | 6 | — |
| Sentence | Its root contains `index.html`. | 4 | — |
| H2 | Load the extension | 3 | — |
| Step | Run `npm run build`. | 4 | — |
| Step | Open `chrome://extensions`. | 2 | — |
| Step | Turn on Developer mode. | 4 | — |
| Step | Choose Load unpacked and select `.output/chrome-mv3`. | 6 | — |
| Step | Open a lesson page that includes the author manifest below. | 10 | — |
| H2 | Add checkpoints to a lesson | 5 | — |
| Sentence | Place an application JSON script in a page you control. | 10 | F-1-25 |
| Sentence | Times are seconds from the start of the first page video. | 11 | F-1-3 |
| Sentence | Checkpoint ids must be unique. | 5 | F-1-10 |
| Sentence | The extension sorts checkpoints by time and rejects templates outside the allowlist. | 12 | F-1-20 |
| H2 | Privacy and security | 3 | — |
| Sentence | Learner code runs in the extension’s declared sandbox page. | 9 | F-1-26 |
| Sentence | The sandbox has no extension APIs. | 6 | — |
| Sentence | A run stops within 1.5 seconds if it does not return. | 11 | — |
| Sentence | The extension neither scrapes nor redistributes video. | 7 | — |
| Sentence | Progress contains only page addresses and passed checkpoint ids. | 9 | — |
| Sentence | See `/privacy` and `/terms` on the built site. | 8 | — |
| Sentence | Existing Creator Kit access uses the Sociobot billing API. | 9 | — |
| Sentence | The browser stores a supplied license under `sb_license:video-code-exit-tickets`, verifies it at most once daily, and never blocks the free extension while checking. | 22 | F-1-27 |
| Sentence | New Creator Kit sales are paused. | 6 | — |
| H2 | Tests and claims | 3 | — |
| Sentence | The test suite covers the live demo, request privacy, packaged download, paid manifest export, offline reload, mobile layout, accessibility, and an unpacked-extension run. | 23 | F-1-11, F-1-28 |
| Sentence | Testable product claims and their exact commands are in `.factory/claims.json`. | 10 | F-1-11 |
| H2 | License | 1 | — |
| Sentence | MIT. | 1 | — |
| Sentence | See LICENSE. | 2 | — |

No banned marketing adjective from the supplied plain-words list appears. One sentence exceeds 22 words. F-1-27 is exactly 22 words but still contains three ideas.

All visible textual actions use a result-oriented verb. F-1-4 remains because the mobile download action replaces that text with an unexplained arrow and the resulting ZIP has no live install instructions.

## 4. Demo and sandbox verification

- One click from the landing page opens `/demo`.
- The first mobile screen shows a paused sample arrays lesson at 00:47 with `[3, 5, 7]`, `map()`, a checkpoint heading, and the instruction to set the multiplier to 2. The editor is below the first fold, but the screen already depicts the product in use with specific sample data.
- Changing `* 1` to `* 2` and choosing **Run check** produces `OUTPUT · PASSED` and `6, 10, 14`.
- **Reset demo** restores `* 1`, “Not passed,” and the initial output message.
- **Start for real** returns to `/#download` and clears demo state because it performs a document navigation.
- A seeded `localStorage` key and `sessionStorage` key were unchanged after the demo pass/reset flow. No IndexedDB database appeared.
- The request log contained only `https://video-code-exit-tickets.sociobot.in` resources plus the sandbox's `blob:null/...` worker. No demo request reached Sociobot billing or another origin.
- In a fresh live context, `/demo` reloaded with HTTP 200 after one online visit and `context.setOffline(true)`; the demo heading and editor remained available.
- F-1-2 remains blocking because SPA exits retain the in-memory demo state.

## 5. Claims verification

Every exact command in `.factory/claims.json` was run from the clean `b637022` worktree after `npm ci`.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `timeout-recovery` | `npm test -- --grep @claim:timeout-recovery` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `creator-sales-paused` | `npm test -- --grep @claim:creator-sales-paused` | PASS |
| `sandbox-isolation` | `npm test -- --grep @claim:sandbox-isolation` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS, but insufficient coverage; F-1-3 |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |
| `checkpoint-sorting` | `npm run test:unit -- --testNamePattern @claim:checkpoint-sorting` | PASS |
| `video-pause-gate` | `npm test -- --grep @claim:video-pause-gate` | PASS |
| `video-local-only` | `npm test -- --grep @claim:video-local-only` | PASS |
| `sandbox-no-extension-apis` | `npm test -- --grep @claim:sandbox-no-extension-apis` | PASS |
| `license-check-cadence` | `npm test -- --grep @claim:license-check-cadence` | PASS |
| `site-local-assets` | `npm test -- --grep @claim:site-local-assets` | PASS |

Unlisted claims are recorded as F-1-9 through F-1-11. No listed command failed, but the core timing assertion is bypassed as described in F-1-3.

## 6. Structure, accessibility, and live checks

- Home, Demo, Creator, Privacy, and Terms return 200. An unknown path returns the designed 404 response.
- Each checked route has one `<h1>`, one `<main>`, `lang="en"`, and a route-specific `<title>` matching the required naming pattern.
- The home page has canonical, Open Graph, Twitter card, SVG favicon, apple-touch icon, theme color, robots.txt, and a sitemap. Route metadata defects are in F-1-6.
- All extracted internal links and downloads returned 200. `https://sociobot.in/` returned 200. The two `mailto:` links are explicit and allowed.
- Clean live loads produced no console errors.
- `/opt/fleet/lib/verify-url.sh` passed the live home page.
- Playwright Axe 4.10.2 found zero violations on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and `/missing-page` at 390 px. The standalone Axe CLI could not pair its downloaded ChromeDriver 152 with the provided Chromium 145, so the installed Playwright Axe integration was used as the permitted equivalent.
- Focus rings, 44 px key targets, reduced-motion CSS, image alt text, keyboard demo execution, and the demo status live region are present.
- The built first-load JavaScript is 20.08 kB raw / 7.21 kB gzip, below the limit.
- The visual identity is distinct: the dark mineral landscape, lime run path, cut-corner ticket shapes, and checkpoint rail follow `.factory/design.md` and do not resemble a generic centered-gradient SaaS template.

## 7. History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The earlier `.factory/handoff.md` contained no finding IDs. It said the prior deployment-only mismatch had been resolved and the live artifact matched candidate `12ba159`.

That deployment repair remains fixed: the rebuilt and live `index.html`, hashed JavaScript, and hashed CSS are byte-identical. The ZIP container hash differs because regenerated ZIP metadata is nondeterministic, but all eight unpacked files are byte-identical. The live smoke, route, demo, request, and accessibility checks were rerun rather than inherited from the prior handoff.

## 8. Quality gates

- `npm ci`: completed; reported 11 development-tooling advisories.
- `npm run check`: PASS.
- `npm run test:unit`: PASS, 3/3.
- `npm test`: PASS, 19/19.
- `npm run build`: PASS; `dist/site/` and the extension ZIP were produced.
- All 16 registered claim commands: PASS.

Passing gates do not override the blocking demo, core-claim coverage, first-screen scope, and install-path findings.

## 9. What would make this perfect

Resolve every finding above, then rerun this entire review from a fresh browser context and clean checkout. A perfect round would show the author-manifest prerequisite before the first scroll; offer an honest install path; discard demo state through every exit; prove automatic timestamp activation; register every claim; explain all-sites permission; provide correct metadata and history focus; use the full skeleton on 404; import and round-trip multi-checkpoint manifests; and contain no flagged copy. Until all of those checks produce zero findings, the verdict remains FAIL.
