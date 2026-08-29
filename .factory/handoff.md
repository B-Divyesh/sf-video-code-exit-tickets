# Run Before Next — polish round 1 handoff

Work order: `video-code-exit-tickets-polish-1`

Production: <https://video-code-exit-tickets.sociobot.in>

Release source: `39924482a8324e64953a10a09c89349c9d02bd09`; the following handoff commit contains evidence only.

## What changed

- Resolved all 28 findings in `.factory/review-1.md`; there were no earlier review or polish reports in the repository.
- Rewrote the first screen to state the author-prepared checkpoint-file requirement before download.
- Added the direct, isolated `/?demo=1` sample entry, persistent demo banner, reset action, and reset-on-every-exit behavior.
- Replaced the synthetic core-flow test with a real 50-second media fixture that crosses the 47-second checkpoint.
- Added a complete local checkpoint-file builder: JSON import, linked validation errors, recovery, multi-checkpoint editing, add/remove/reorder, and export.
- Added route-specific static metadata, real route documents, history focus restoration, a styled HTTP 404, complete legal/navigation chrome, and mobile-specific layout fixes.
- Explained Chrome's all-sites permission and made pages without checkpoint files inert.
- Registered 22 claims in `.factory/claims.json`, with exactly one matching claim tag per ID.
- Applied every required copy rewrite and recorded the exhaustive word-count audit in `.factory/copy-audit.md`.
- Kept the luminous mineral/glass visual system and documented the polish decisions in `.factory/design.md`.
- Updated Vite, Vitest, and WXT to audited releases and made ZIP selection deterministic when older packages remain in `.output`.
- Updated `.factory/catalog-description.txt` to: “Prove code changes before author-prepared video lessons continue.”

The finding-by-finding change and evidence map is in `.factory/polish-1.md`.

## Verification

### Clean clone

The final pushed repair was cloned into a new temporary directory. From that clone:

- All 22 exact commands from `.factory/claims.json`: passed independently.
- `npm run check`: passed.
- `npm run test:unit`: 3/3 passed.
- `npm test`: 23/23 passed.
- `npm run build`: passed and produced `dist/site/` plus the Chrome MV3 ZIP.
- `npm audit --audit-level=high`: zero vulnerabilities across production and development dependencies.
- ZIP unpack and manifest inspection: passed; version 1.0.1 and expected MV3 files present.

The claim-by-claim output is `.factory/evidence/polish-1/clean-clone-final.log`.

### Accessibility, privacy, mobile, offline, and performance

- Playwright Axe: zero serious or critical findings on `/`, `/demo`, `/creator`, `/privacy`, `/terms`, and the 404, including the licensed builder state.
- Keyboard: skip link, controls, code-run shortcut, extension-dialog focus loop, SPA route focus, and history focus restoration passed.
- Mobile: no horizontal overflow at 390 × 844; first-screen copy and primary action are above the fold; key targets are at least 44 px.
- Privacy: demo storage remained empty; ordinary site flows made no third-party requests; no-manifest extension flow changed no page, storage, playback, or network destination.
- Offline: the demo reloaded and remained usable after one online visit.
- Local `verify-url.sh`: passed with no errors.
- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.5 s, CLS 0, TBT 20 ms.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 30 ms.
- Initial site payload: 28.22 KB JavaScript (9.52 KB gzip) and 17.94 KB CSS (4.81 KB gzip), below the 200 KB and 50 KB budgets.
- Chrome extension ZIP: 9.85 KB.

Evidence is under `.factory/evidence/polish-1/`, including mobile, demo, install-guide, creator, 404, Lighthouse, and `verify-url.sh` artifacts.

### Cold production re-check

After deployment, a new browser context verified the public custom domain. The check covered:

- required first-screen wording and layout;
- direct `?demo=1` entry, pass, exit, and fresh re-entry;
- per-route source metadata and HTTP 404/noindex behavior;
- visible history focus restoration;
- multi-checkpoint import, invalid-file recovery, editing, and export;
- same-origin request privacy, empty demo storage, offline reload, and clean ordinary-route consoles;
- internal-link crawl and Privacy/Terms links in every footer;
- one `<h1>`, one `<main>`, and zero serious/critical Axe findings per route;
- the live downloaded ZIP in a fresh extension profile, including no-manifest inactivity and automatic 47-second pause/pass/resume.

`verify-url.sh` returned 200 with title, `lang`, one heading, one main landmark, labelled controls, alt text, and no errors.

## Run and verify

```bash
npm ci
npm run check
npm run test:unit
npm test
npm run build
npm audit --audit-level=high
```

The production site is deployed from `dist/site/`. The extension archive is `dist/site/downloads/run-before-next-chrome.zip`.

## Known gaps

None. Creator Kit sales remain intentionally paused as stated in the product; existing licenses continue to work.
