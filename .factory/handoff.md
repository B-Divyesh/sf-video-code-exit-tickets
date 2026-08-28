# Run Before Next verification 5 handoff — FAIL

## Release status

**FAIL.** Independently verified on 2026-08-28 against commit `69599e1fcac6560ae1875b8ba69493ac673912e1` and <https://video-code-exit-tickets.sociobot.in>. Production matches the candidate, but release remains blocked.

## Blocking evidence

1. **P1 — checkpoint bypass:** the extension's `aria-modal` dialog does not trap focus or inert the lesson. From the focused editor, Tab reaches Run, Reset, the page body, then the underlying video. Pressing Space resumed a real video to 0.530513 s without a pass while the checkpoint remained open. A host `video.play()` call likewise advanced playback from 0.382390 s to 1.073692 s. The core “pass before resume” job is not enforced.
2. **P1 — mobile first-read gate:** at 390×844, the audience sentence extends below the first viewport and **Try it with sample data** starts at y=881.81 px. The required first action is absent from the first screen. See [evidence](evidence/verification-5/mobile-first-screen.png).
3. **P1 — claims contract:** public promises about video scraping/copying, sandbox extension APIs, checkpoint sorting, daily license verification/non-blocking behavior, and site-wide analytics/font requests are not registered in `.factory/claims.json` with dedicated claim tests.
4. **P2 — overlapping demo runs:** a corrected run can pass, then a stale endless-run timeout overwrites it with `Try again` while **Checkpoint passed** remains disabled.
5. **P2 — touch targets:** mobile **Reset demo** and **Start for real** are only 23.7 px high; the wordmark is 33.6 px high, below the 44 px minimum.

## What passed

- All ten exact `.factory/claims.json` commands pass.
- `npm run check`, `npm run test:unit` (3/3), `npm test` (15/15), `npm run build`, ZIP integrity, and `npm audit --omit=dev --audit-level=high` pass.
- Initial JS is 19,896 B (7,167 B gzip); CSS is 15,386 B (4,311 B gzip); mobile hero is 22,334 B.
- Normal, empty, wrong-output, syntax-error, runtime-error, timeout, corrected retry, keyboard shortcut, reset, license-error, and real-video successful-resume paths were exercised.
- Demo requests stayed same-origin or local Blob workers. Demo local/session storage, IndexedDB, and OPFS remained empty.
- Axe reported no serious/critical findings on all routes and the 404 page. Supported pages had no console/page errors.
- Security headers, immutable hashed-asset caching, real 404 status, reduced motion, service-worker update, and offline reload pass.
- The license endpoint allows 30 requests per burst; requests 31–40 returned 429 with `Retry-After: 2–3`.
- All served site files match the candidate byte-for-byte. The live ZIP's unpacked extension files also match exactly.

## Commands

```sh
npm ci
npm run check
npm run test:unit
npm test
npm run build
npm audit --omit=dev --audit-level=high
unzip -t dist/site/downloads/run-before-next-chrome.zip
```

Full evidence and repair guidance are in `.factory/verification-5.md`. No product code was changed; only this handoff, the verification report, and the mobile evidence screenshot were added.
