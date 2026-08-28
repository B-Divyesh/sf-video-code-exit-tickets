# Demo contract

- URL: `https://video-code-exit-tickets.sociobot.in/demo` or `/demo` locally.
- Direct entry: opening `/demo` loads the sample without an account or setup.
- Sample: a JavaScript arrays lesson paused at 00:47. The starter multiplies `[3, 5, 7]` by `1`; the learner changes it to `2` to print `6, 10, 14`.
- Pass path: change `* 1` to `* 2`, then choose **Run check** or press Control/Command + Enter.
- Reset: **Reset code** resets the editor. **Reset demo** resets all in-memory demo state.
- Leave demo: **Start for real** returns to the extension download area. Demo changes are discarded.
- Isolation: demo code and pass state stay in JavaScript memory. The demo does not read or write `localStorage`, `sessionStorage`, IndexedDB, OPFS, or extension storage. It therefore needs no `demo:` key.
- Requests: the demo loads only same-origin site files. It does not verify paid licenses or call billing while demo mode is active.
