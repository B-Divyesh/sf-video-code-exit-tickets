# Run Before Next

Prove your code before the video continues.

Run Before Next is a Chrome extension for learners using author-prepared programming lessons. An author adds a checkpoint JSON block to a lesson page they control. At each marked time, the extension pauses the video and opens a runnable JavaScript checkpoint. The learner changes the starter code, matches the expected output, and resumes the lesson.

[Try the sample checkpoint](https://video-code-exit-tickets.sociobot.in/?demo=1) or open `/?demo=1` while developing. The canonical demo route is `/demo`.

## What ships

- A Chrome extension built with TypeScript. Its unpacked files are in `.output/chrome-mv3/`.
- A packaged extension at `dist/site/downloads/run-before-next-chrome.zip`.
- A static landing site and live sandbox demo in `dist/site/`.
- One approved JavaScript console template: `javascript-console-v1`.
- License restore and a multi-checkpoint file builder for existing Creator Kit users.

New Creator Kit sales are paused. WXT and Chrome Manifest V3 details are contributor concerns, not setup steps for lesson authors.

The extension stores passed checkpoint IDs and lesson page addresses. It does not store learner editor contents. The live demo does not save sample edits.

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
2. Unzip `dist/site/downloads/run-before-next-chrome.zip`.
3. Open `chrome://extensions` in desktop Chrome.
4. Turn on Developer mode.
5. Choose **Load unpacked** and select the unzipped folder.
6. Open a lesson page that includes the author checkpoint block below.

The live download uses the same manual installation steps. It is not a Chrome Web Store install.

## Add checkpoints to a lesson

Add this checkpoint JSON block to a lesson page you control.

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

Times are seconds from the start of the first page video. Checkpoint IDs must be unique. The extension sorts checkpoints by time. It rejects templates other than `javascript-console-v1`.

Existing Creator Kit users can import and edit version 1 checkpoint files. The builder adds, removes, reorders, validates, and exports multiple checkpoints locally.

## Privacy and security

Learner code runs in an isolated extension page with no extension access. A run stops within 1.5 seconds if it does not return. The extension neither scrapes nor redistributes video.

Chrome asks for access to all sites. This lets the extension look for an author-provided checkpoint file on each page. If it finds none, it stops without changing the page, storage, video, or network activity.

Progress contains only page addresses and passed checkpoint IDs. See `/privacy` and `/terms` on the built site.

Existing Creator Kit access uses the Sociobot billing API. The browser stores the license under `sb_license:video-code-exit-tickets`. It checks the license at most once daily. The free extension remains available during checks.

## Tests and claims

Tests cover the demo, same-origin requests, downloads, offline reload, mobile layout, and accessibility. They also run the unpacked extension through one checkpoint.

Every public product claim and its exact command appears in `.factory/claims.json`.

## License

MIT. See [LICENSE](./LICENSE).
