# Run Before Next

Prove your code change before the video continues.

Run Before Next is a Chrome MV3 extension for people learning programming from video. An author adds a small JSON manifest to an existing lesson page. At each marked time, the extension pauses the page video and opens a runnable JavaScript checkpoint. The learner changes the starter code, matches the expected output, and resumes the lesson.

[Try the sample with no setup](https://video-code-exit-tickets.sociobot.in/demo) or open `/demo` while developing.

## What ships

- A WXT and TypeScript Chrome MV3 extension in `.output/chrome-mv3/`.
- A packaged extension at `dist/site/downloads/run-before-next-chrome.zip`.
- A static landing site and live sandbox demo in `dist/site/`.
- One allowlisted sandbox template: `javascript-console-v1`.
- License restore and a manifest builder for existing Creator Kit users. New sales are paused.

The extension stores passed checkpoint ids and lesson page addresses. It does not store learner editor contents. The live demo records no sample edits in local or session storage.

## Run locally

Use Node.js 20 or newer.

```bash
npm install
npm run dev             # landing site on the printed local URL
npm run dev:extension   # WXT extension development
npm run check           # TypeScript
npm run test:unit       # manifest rules
npm test                # build plus Playwright claims and accessibility checks
npm run build           # extension, site, and packaged zip
```

The deployment command is exactly `npm run build`. Deploy `dist/site/` as the static root. Its root contains `index.html`.

## Load the extension

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Turn on Developer mode.
4. Choose **Load unpacked** and select `.output/chrome-mv3`.
5. Open a lesson page that includes the author manifest below.

## Add checkpoints to a lesson

Place an application JSON script in a page you control. Run Before Next does not fetch a remote manifest.

```html
<script type="application/json" data-run-before-next-manifest>
{
  "version": 1,
  "title": "JavaScript arrays",
  "checkpoints": [{
    "id": "double-prices",
    "at": 47,
    "prompt": "Change the multiplier so the output is 6, 10, 14.",
    "template": "javascript-console-v1",
    "starterCode": "const prices = [3, 5, 7];\nconst doubled = prices.map(price => price * 1);\nconsole.log(doubled.join(', '));",
    "expectedOutput": "6, 10, 14"
  }]
}
</script>
```

Times are seconds from the start of the first page video. Checkpoint ids must be unique. The extension sorts checkpoints by time and rejects templates outside the allowlist.

## Privacy and security

Learner code runs in the extension’s declared sandbox page. The sandbox has no extension APIs. A run stops within 1.5 seconds if it does not return. The extension neither scrapes nor redistributes video.

Progress contains only page addresses and passed checkpoint ids. Removing the extension clears that data. See `/privacy` and `/terms` on the built site.

Existing Creator Kit access uses the Sociobot billing API. The browser stores a supplied license under `sb_license:video-code-exit-tickets`, verifies it at most once daily, and never blocks the free extension while checking. New Creator Kit sales are paused.

## Tests and claims

The test suite covers the live demo, request privacy, packaged download, paid manifest export, offline reload, mobile layout, accessibility, and an unpacked-extension run. Testable product claims and their exact commands are in `.factory/claims.json`.

## License

MIT. See [LICENSE](./LICENSE).
