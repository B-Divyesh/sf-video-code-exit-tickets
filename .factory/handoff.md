# Run Before Next — adversarial review 3 handoff

Work order: `video-code-exit-tickets-review-3`

Reviewed commit: `b0e995fc6721175c92e738adeb6868c6ae19df1f`

Production: <https://video-code-exit-tickets.sociobot.in>

## Outcome

The verdict in `.factory/review-3.md` is **FAIL** with no blocking findings and one minor finding:

- `F-3-1`: the first-screen facts state compatibility, account, privacy, and price, but omit the mandatory offline fact. Replace “No account.” with the registered claim scope: “The sample reloads offline after one online visit.” Then recheck the mobile fold.

No product code was modified.

## Verification performed

- Opened production cold in fresh Chromium contexts at 390 × 844 and 1440 × 900 before scrolling.
- Entered the sample in one click, passed it with `* 2`, reset it, exited it, and verified empty demo storage plus same-origin-only requests.
- Ran every exact `.factory/claims.json` command independently from clean clone `/tmp/rbn-review3-9kS2Zj`; all 23 passed.
- Ran `npm run check`, `npm run test:unit`, `npm test`, and `npm run build` in that clone; results were 3/3 unit tests and 23/23 Playwright tests passing, with `dist/site/` and the extension ZIP produced.
- Crawled all live links and downloads; all HTTP targets returned 200 except the intentionally tested designed 404.
- Checked every public route and the 404 for titles, metadata, one h1/main, heading order, mobile overflow, focus/history, console errors, and Axe serious/critical issues.
- Ran `/opt/fleet/lib/verify-url.sh` against production; it returned no errors.
- Compared the live JS, CSS, ZIP, and unpacked extension files with the current local build; they matched.
- Rechecked every finding from reviews 1 and 2 in live behavior and current code; none regressed.

## Files changed

- `.factory/review-3.md`
- `.factory/handoff.md`

## Remaining work

Resolve F-3-1 and rerun the 390 px first-screen and copy checks. No other gap was found.
