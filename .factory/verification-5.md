# Independent verification 5 — FAIL

Verified 2026-08-28 against candidate commit `69599e1fcac6560ae1875b8ba69493ac673912e1` and <https://video-code-exit-tickets.sociobot.in>.

## Decision

**FAIL — release blocked.** The deployment matches the candidate and the registered claim tests pass, but the extension does not enforce its core “pass before resume” rule. Its modal lets keyboard focus reach the underlying video, and that video resumes before the checkpoint passes. The mandatory 390 px first screen also hides the sample action below the fold. The public copy additionally contains claims that are absent from `.factory/claims.json`.

## Release-blocking findings

### P1 — the lesson video can resume before the checkpoint passes

Fresh reproduction with the candidate's unpacked extension and a real playable video:

1. Load `.output/chrome-mv3` and open a lesson containing the bundled manifest.
2. Start the video, then open its checkpoint. The extension pauses it and focuses the code editor.
3. Press Tab from the editor to **Run check**, Tab to **Reset code**, then Tab again. Focus leaves the `aria-modal="true"` dialog, reaches the page body, and the next Tab focuses the underlying `VIDEO` element.
4. Press Space without changing or passing the code.

Observed: the video changed from paused to playing and advanced to **0.530513 s**, while `#run-before-next-root` remained open and the checkpoint was not passed. The page behind the dialog is not inert and focus is not trapped. A second check simulated the host player's own code calling `video.play()` after the checkpoint opened: time advanced from **0.382390 s to 1.073692 s in 700 ms**, still with the checkpoint open.

The cause is visible in `entrypoints/content.ts`: `open()` pauses once, but later `timeupdate` events call `open()` and return immediately when `current.id` matches. The dialog neither blocks the page nor listens for `play`/`playing` to pause again. This breaks the brief's defining requirement that a learner must pass before resume and also fails required modal focus management.

The passing automated extension test only checks that the overlay closes after a pass. Its fixture video has no media source, so it cannot detect premature playback.

### P1 — the required sample action is not on the 390×844 first screen

On a fresh mobile production load:

- headline: top **544.58 px**, bottom **738.14 px**;
- audience sentence: top **766.14 px**, bottom **849.81 px**, so its last line is clipped below the 844 px viewport;
- **Try it with sample data**: top **881.81 px**, entirely below the first screen;
- its “Opens one JavaScript checkpoint. No setup.” explanation starts at **947.81 px**.

The first screen therefore does not fully show who the product is for or what to click first. This is an explicit acceptance-gate failure. Evidence: [390×844 cold first screen](evidence/verification-5/mobile-first-screen.png).

### P1 — public claims are missing from the required claims registry

Every registered claim has exactly one tagged test and all ten commands pass. However, the claims contract also requires every factual promise in the site and README to appear in `.factory/claims.json`. The following shipped promises have no registry entry or dedicated claim test:

- “The extension does not scrape, host, or copy the video” / “neither scrapes nor redistributes video.”
- “The sandbox has no extension APIs.”
- “The extension sorts checkpoints by time.” An untagged unit assertion exists, but the promise is not registered.
- License verification happens “at most once daily” and “never blocks the free extension while checking.”
- “The site loads its code and images from this domain. It does not load analytics, ads, or third-party fonts.” The registered privacy test covers `/demo`, not the whole site promise.

Under the supplied claims contract, an unlisted claim fails review even if source inspection suggests it is currently true.

## Other defects

### P2 — overlapping demo runs produce a contradictory locked state

On fresh live `/demo`, enter `while (true) {}` and choose **Run check**. Before it times out, replace the code with `console.log("6, 10, 14")` and choose **Run check** again.

At 300 ms the second run had passed: state `Passed`, output `6, 10, 14`, and the disabled button read **Checkpoint passed**. At 1.7 s, the stale first run overwrote the result with the timeout error and state `Try again`, but the button remained disabled and still read **Checkpoint passed**. The learner must discover **Reset code** to recover. The demo needs a run id/cancellation rule or must disable the action while a run is pending.

### P2 — key mobile demo links are below the 44 px touch-target minimum

At 390 px with styles fully loaded, **Reset demo** measured **105.4×23.7 px** and **Start for real** measured **102.8×23.7 px**. The mobile header wordmark measured **152×33.6 px**. These miss the required 44 px target height. Main Run and Reset controls are 48 px high.

## Required first-read gate

Desktop first-read passes:

- **What:** “Prove your code before the video continues.”
- **For whom:** “For video learners who need to change and run each idea before moving on.”
- **First action:** **Try it with sample data**, with “Opens one JavaScript checkpoint. No setup.”

One click opens `/demo` with a realistic arrays checkpoint and the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and **Start for real**. The same gate fails at 390×844 as documented above.

## Registered claims from the clean candidate

The checkout was clean at the requested commit before `npm ci`. Every exact command from `.factory/claims.json` was then run separately:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-pass` | `npm test -- --grep @claim:demo-pass` | PASS |
| `privacy-demo` | `npm test -- --grep @claim:privacy-demo` | PASS |
| `timeout-recovery` | `npm test -- --grep @claim:timeout-recovery` | PASS |
| `extension-download` | `npm test -- --grep @claim:extension-download` | PASS |
| `manifest-export` | `npm test -- --grep @claim:manifest-export` | PASS |
| `creator-sales-paused` | `npm test -- --grep @claim:creator-sales-paused` | PASS |
| `sandbox-isolation` | `npm test -- --grep @claim:sandbox-isolation` | PASS |
| `extension-flow` | `npm test -- --grep @claim:extension-flow` | PASS |
| `source-not-saved` | `npm test -- --grep @claim:source-not-saved` | PASS |
| `template-allowlist` | `npm run test:unit -- --testNamePattern @claim:template-allowlist` | PASS |

## Local quality gates

- `npm ci`: PASS. It reported 11 development dependency advisories (2 moderate, 5 high, 4 critical).
- `npm audit --omit=dev --audit-level=high`: PASS, zero shipped-production vulnerabilities.
- `npm run check`: PASS. No separate lint script exists.
- `npm run test:unit`: PASS, 3/3.
- `npm test`: PASS, 15/15 Playwright tests in 34.8 s.
- `npm run build`: PASS; `dist/site/` and `dist/site/downloads/run-before-next-chrome.zip` were produced.
- `unzip -t dist/site/downloads/run-before-next-chrome.zip`: PASS.
- Initial JavaScript: **19,896 B / 7,167 B gzip**. CSS: **15,386 B / 4,311 B gzip**. Desktop/mobile hero images: **48,300 / 22,334 B**. Extension ZIP: **9,752 B**. All supplied bundle budgets pass.
- A fresh Lighthouse report calculated Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**, FCP **1.0 s**, LCP **1.0 s**, CLS **0**, and TBT **0 ms**. The CLI then exited nonzero because its full-page screenshot crashed the headless tab; Playwright runs did not show a page crash, so the scores are recorded as informative rather than a passing command gate.

## Fresh live functional evidence

- Normal extension flow with a real video: changed code passed with `6, 10, 14`; **Resume lesson** removed the checkpoint, resumed playback to 0.937 s, and storage contained only the page-derived progress key and `double-prices`, not source code.
- Demo unchanged starter: “Change the starter code before you run the check.”
- Empty program: reports `(nothing)` versus expected output and leaves Run enabled.
- Wrong output: reports `9, 15, 21` versus `6, 10, 14` and leaves Run enabled.
- Invalid syntax: reports `Unexpected token '='` and leaves Run enabled.
- Runtime exception: reports `broken on purpose` and leaves Run enabled.
- Endless loop: timeout rendered in **1201.5 ms**, left Run enabled, and corrected code then passed.
- Reset after pass restored starter code, `Not passed`, and an enabled Run button.
- Control+Enter passed the checkpoint. Keyboard focus rings computed as a 3 px cyan solid outline.
- Reduced motion matched; primary transition duration was 0 s, animation was none, and scroll behavior was auto.
- At 390 px, the demo had zero horizontal overflow; editor and controls remained visible; Run and Reset were each 48 px high.

## Accessibility, privacy, routing, headers, and PWA

- Axe found zero serious or critical findings on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and the real HTTP 404 page. The manual modal and touch-target defects above are not detected by axe.
- Supported routes each returned 200 with one `h1`, one `main`, `lang="en"`, route-specific title and canonical URL, no missing image alt text, and no console/page errors. `/missing-page` returned 404 with the styled not-found page and no serious/critical axe findings.
- All discovered HTTP(S) links returned 200; `mailto:` links were excluded.
- A complete fresh demo flow requested only the site origin plus local `blob:null/...` Workers. After pass, localStorage, sessionStorage, IndexedDB, and OPFS were empty.
- Main CSP excludes `unsafe-eval`; only `/sandbox.html` permits it and also declares `connect-src 'none'`. HSTS, nosniff, strict-origin referrer policy, frame denial, and Permissions-Policy are present.
- Hashed JavaScript uses `public, max-age=31536000, immutable`; HTML and `/sw.js` use `no-cache`.
- Service-worker `update()` completed. `/demo` reloaded offline with its title, h1, and demo banner, including after clearing the browser HTTP cache immediately after the first online visit.
- The Sociobot verification endpoint returned `200`, `Cache-Control: no-store`, and `{ valid:false, reason:"invalid" }` for an invalid token. One client received 30 responses, then requests 31–40 returned `429` with `Retry-After: 2–3`. Observed allowance: **30 requests per burst**.
- Invalid license entry shows a recovery message, removes the token, and retains only a cached false verdict.
- There is no sign-in flow, library API, CLI, or product backend, so those conditional checks do not apply.

## Deployment identity

All 18 directly served site files other than the extension ZIP matched the fresh candidate build byte-for-byte, including HTML, hashed JS/CSS, source map, images, sandbox, service worker, metadata, sample manifest, fixture, and 404 assets. The ZIP container differs because generated timestamps differ, but all eight unpacked extension files are byte-identical. Production therefore matches candidate `69599e1fcac6560ae1875b8ba69493ac673912e1`.

## Required repair

Keep the video paused for the entire active checkpoint, make the modal truly modal for keyboard and pointer input, and add a real-media regression proving playback cannot advance before pass. Put the plain-language promise and sample action fully in the 390×844 first viewport. Cancel or ignore stale demo runs. Bring the persistent demo controls and other key links to 44 px targets. Register and test every shipped claim, or remove the unsupported promises.

No product code was modified during this verification.
