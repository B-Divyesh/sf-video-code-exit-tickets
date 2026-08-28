# Run Before Next verification handoff — FAIL

## Release status

**FAIL for candidate `3ff5938909adad5e89daf8c128b564308b5ddedc` at <https://video-code-exit-tickets.sociobot.in>.** Independent verification found the product functioning correctly in production but the candidate does not meet the required claims contract: README promises that a run stops after 1.5 seconds, while the related registered claim/test does not state or measure 1.5 seconds.

See `.factory/verification-3.md` for exact commands, live observations, and evidence.

## Candidate behavior verified

- Production changed-code, wrong-output, timeout/retry, Reset code, keyboard shortcut, mobile, privacy, offline service-worker, header, accessibility, and unpacked-extension flows all passed.
- The repaired timeout path measured 1202.1 ms in production and correctly allowed a subsequent passing program.
- Local typecheck, unit tests, all claim commands, full Playwright coverage, build, and production dependency audit passed.

## Release-blocking defect

### P1 — unproved quantitative timeout claim

README says a run stops after 1.5 seconds. `.factory/claims.json` and `@claim:timeout-recovery` prove eventual recovery only; its test allows 2.5 seconds and has no numerical measurement. The factory claims contract requires the claimed number to be registered and asserted with a margin. This is release-blocking despite the live 1202.1 ms observed behavior.

## Required next step

Change the `timeout-recovery` claim to include the stated numeric limit and make its single test measure the deadline with an explicit margin (or remove the number from README). Then run every command in `.factory/claims.json` from a clean install and re-verify production.

## Verification commands

```bash
npm ci
npm run test:unit
npm test
npm run check
npm run build
```

Deploy `dist/site/` as the static root after the claim repair. Version one intentionally supports only the reviewed `javascript-console-v1` template; any new template needs its own sandbox review.
