import './styles.css';
import { runJavaScript } from '../shared/runner';
import { SAMPLE_MANIFEST, validateManifest, type Checkpoint, type LessonManifest } from '../shared/checkpoints';

const SITE_URL = 'https://video-code-exit-tickets.sociobot.in';
const SLUG = 'video-code-exit-tickets';
const LICENSE_KEY = `sb_license:${SLUG}`;
const LICENSE_CACHE_KEY = `sb_license_cache:${SLUG}`;
const app = document.querySelector<HTMLDivElement>('#app')!;
let demoCode = SAMPLE_MANIFEST.checkpoints[0].starterCode;
let demoPassed = false;
let demoRunId = 0;
let activeRoute: Route;
let builderDraft: LessonManifest = structuredClone(SAMPLE_MANIFEST);
let builderMessage = '';

type Route = 'home' | 'demo' | 'creator' | 'privacy' | 'terms' | 'not-found';
type RenderMode = 'initial' | 'new' | 'history' | 'refresh';
type HistoryState = { scrollY?: number; focusKey?: string };

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('popstate', (event) => render('history', event.state as HistoryState | null));
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-route]');
  if (!link || link.origin !== location.origin || event.defaultPrevented) return;
  event.preventDefault();
  history.replaceState({ ...history.state, scrollY: window.scrollY, focusKey: link.dataset.focusKey }, '');
  history.pushState({ scrollY: 0 }, '', link.href);
  render('new');
});

function route(): Route {
  if (location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1') return 'demo';
  if (location.pathname === '/') return 'home';
  if (location.pathname === '/creator') return 'creator';
  if (location.pathname === '/privacy') return 'privacy';
  if (location.pathname === '/terms') return 'terms';
  return 'not-found';
}

function resetDemo() {
  demoRunId++;
  demoCode = SAMPLE_MANIFEST.checkpoints[0].starterCode;
  demoPassed = false;
}

function render(mode: RenderMode = 'refresh', historyState?: HistoryState | null) {
  const current = route();
  if (current !== activeRoute && (current === 'demo' || activeRoute === 'demo')) resetDemo();
  activeRoute = current;
  const page = current === 'home' ? homePage() : current === 'demo' ? demoPage() : current === 'creator' ? creatorPage() : current === 'privacy' ? privacyPage() : current === 'terms' ? termsPage() : notFoundPage();
  app.innerHTML = `${header(current === 'demo' ? demoBanner() : '')}<main id="main" tabindex="-1">${page}</main>${footer()}`;
  setMetadata(current);
  bindCommon();
  if (current === 'demo') bindDemo();
  if (current === 'creator') bindCreator();
  if (current === 'home') bindLicense();
  if (mode === 'new') focusNewRoute();
  if (mode === 'history') restoreHistoryPosition(historyState);
}

function focusNewRoute() {
  jumpTo(0);
  const h1 = document.querySelector<HTMLHeadingElement>('h1');
  h1?.setAttribute('tabindex', '-1');
  h1?.focus({ preventScroll: true });
  announceRoute(h1?.textContent || 'Page changed');
}

function restoreHistoryPosition(state?: HistoryState | null) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      jumpTo(state?.scrollY || 0);
      const savedTarget = state?.focusKey
        ? document.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(state.focusKey)}"]`)
        : null;
      const focusTarget = savedTarget || document.querySelector<HTMLHeadingElement>('h1');
      if (focusTarget instanceof HTMLHeadingElement) focusTarget.setAttribute('tabindex', '-1');
      focusTarget?.focus({ preventScroll: true });
      if (focusTarget) {
        const bounds = focusTarget.getBoundingClientRect();
        if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
          jumpTo(window.scrollY + bounds.top - (window.innerHeight - bounds.height) / 2);
        }
      }
      announceRoute(document.querySelector('h1')?.textContent || 'Page changed');
    });
  });
}

function jumpTo(top: number) {
  const previous = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, top);
  document.documentElement.style.scrollBehavior = previous;
}

function announceRoute(message: string) {
  const status = document.querySelector('#route-status');
  if (status) status.textContent = message;
}

function header(banner = '') {
  return `<header>${banner}<div class="site-header"><a class="wordmark" href="/" data-route data-focus-key="header-home" aria-label="Run Before Next home"><span class="wordmark-mark" aria-hidden="true"><i></i></span><span>Run Before Next</span></a><nav aria-label="Main navigation"><a href="/demo" data-route data-focus-key="nav-demo">Demo</a><a href="/#authors">For authors</a><a href="/privacy" data-route data-focus-key="nav-privacy">Privacy</a></nav><span class="sr-only" id="download-requirement">Desktop Chrome manual install for lessons with an author checkpoint file.</span><a class="header-download extension-download" href="/downloads/run-before-next-chrome.zip" download aria-describedby="download-requirement">Download extension ZIP</a></div></header>`;
}

function footer() {
  return `<footer><div><a class="wordmark" href="/" data-route data-focus-key="footer-home"><span class="wordmark-mark" aria-hidden="true"><i></i></span><span>Run Before Next</span></a><p>Runnable code checks for existing video lessons.</p></div><nav aria-label="Footer navigation"><a href="/demo" data-route data-focus-key="footer-demo">Demo</a><a href="/privacy" data-route data-focus-key="footer-privacy">Privacy</a><a href="/terms" data-route data-focus-key="footer-terms">Terms</a><a href="https://sociobot.in" rel="noreferrer">Built by Param Factory ↗</a></nav><p class="build">v1.0.1 · build 2026.08.29<br>Hero image generated for this product.</p></footer>`;
}

function homePage() {
  return `<section class="hero" id="download"><div class="hero-copy"><p class="eyebrow"><span></span> Code checks for video lessons</p><h1>Prove your code before the video continues</h1><p class="lede">For learners using programming lessons whose author added Run Before Next code checks.</p><div class="hero-action"><a class="button primary" href="/?demo=1" data-route>Try the sample checkpoint</a><span>Opens one JavaScript checkpoint. No setup.</span></div><ul class="plain-facts" aria-label="Product facts"><li>Works on lessons with an author-provided checkpoint file.</li><li>The sample reloads offline after one online visit.</li><li>Learner code is not saved.</li><li>The Chrome extension is free.</li></ul><p class="download-requirement">Download for desktop Chrome. Manual installation is required.</p></div><div class="hero-art"><picture><source media="(max-width: 640px)" srcset="/assets/checkpoint-landscape-mobile.webp"><img src="/assets/checkpoint-landscape.webp" width="1200" height="800" alt="A glowing run path links three code checkpoints across a dark glass landscape." fetchpriority="high" decoding="async"></picture><div class="timestamp-stamp" aria-hidden="true"><span>LESSON 04</span><b>00:47</b><small>Checkpoint at 00:47</small></div></div></section>
  <section class="install-guide" id="install-guide" hidden tabindex="-1" aria-labelledby="install-title"><p class="eyebrow">DESKTOP CHROME · MANUAL INSTALL</p><h2 id="install-title">Install the downloaded extension ZIP</h2><ol><li>Unzip <code>run-before-next-chrome.zip</code>.</li><li>Open <code>chrome://extensions</code> and turn on Developer mode.</li><li>Choose <b>Load unpacked</b> and select the unzipped folder.</li><li>Open a lesson whose author added a checkpoint file.</li></ol><p>Chrome asks for access to all sites so the extension can check each page for that file. If it finds none, it stops.</p></section>
  <section class="live-strip" aria-labelledby="preview-title"><div><p class="eyebrow">THE PRODUCT</p><h2 id="preview-title">See how a checkpoint blocks the video</h2></div><ol class="checkpoint-rail"><li class="done"><span>01</span><b>Watch</b><small>Concept shown</small></li><li class="active"><span>02</span><b>Change</b><small>Edit starter code</small></li><li><span>03</span><b>Run</b><small>Match the output</small></li><li><span>04</span><b>Resume</b><small>Video continues</small></li></ol><a class="text-link" href="/?demo=1" data-route>Try the sample checkpoint →</a></section>
  <section class="how" aria-labelledby="how-title"><div class="section-intro"><p class="eyebrow">HOW IT WORKS</p><h2 id="how-title">Add one runnable code check</h2><p>A small checkpoint file gives the extension a time, starter code, and expected output.</p></div><ol class="steps"><li><span>1</span><div><h3>Set the checkpoint time</h3><p>The author adds a checkpoint time to the lesson page.</p></div></li><li><span>2</span><div><h3>Change and run</h3><p>The extension pauses the video and opens the approved JavaScript code runner.</p></div></li><li><span>3</span><div><h3>Pass and resume</h3><p>The video continues when the changed code prints the expected output.</p></div></li></ol></section>
  <section class="author-band" id="authors" aria-labelledby="authors-title"><div><p class="eyebrow">FOR AUTHORS</p><h2 id="authors-title">Attach checkpoints without moving your videos</h2><p>Add one JSON script to the lesson page. The extension does not scrape, host, or copy the video.</p><a class="button secondary" href="/sample-manifest.json" download>Download sample checkpoint file</a></div><pre aria-label="Example checkpoint file"><code>&lt;script type="application/json"
  data-run-before-next-manifest&gt;
{ "version": 1,
  "title": "JavaScript arrays",
  "checkpoints": [ ... ] }
&lt;/script&gt;</code></pre></section>
  <section class="boundaries" aria-labelledby="privacy-title"><div><p class="eyebrow">CLEAR BOUNDARIES</p><h2 id="privacy-title">The extension does not copy your video</h2></div><ul><li><b>Author checkpoint files only.</b><span>Without a checkpoint file, the extension stops without touching the page.</span></li><li><b>All-sites permission.</b><span>Chrome uses it to check each page for an author-provided checkpoint file.</span></li><li><b>No source upload.</b><span>Code runs inside an isolated browser sandbox.</span></li><li><b>JavaScript console checks only.</b><span>Version one accepts only the JavaScript console template.</span></li></ul></section>
  <section class="paid" id="creator-kit" aria-labelledby="paid-title"><div><p class="eyebrow">CREATOR KIT · EXISTING LICENSES</p><h2 id="paid-title">Existing customers can build checkpoint files</h2><p>Creator Kit sales are paused. Existing license holders can verify a license, import checkpoint files, and edit every check.</p></div><div class="purchase"><button class="button secondary" id="restore-toggle" type="button">Restore an existing license</button><form id="license-form" hidden><label for="license">License token</label><div><input id="license" name="license" autocomplete="off" required><button type="submit">Verify license</button></div><p id="license-status" role="status"></p></form>${hasPaidLicense() ? '<a class="text-link" href="/creator" data-route>Open checkpoint file builder →</a>' : ''}</div></section>`;
}

function demoBanner() {
  return `<div class="demo-banner"><span><b>Demo</b> — sample data, nothing is saved</span><div><button id="reset-demo" type="button">Reset demo</button><a href="/" data-route>Start for real</a></div></div>`;
}

function demoPage() {
  const checkpoint = SAMPLE_MANIFEST.checkpoints[0];
  return `<section class="demo-page"><div class="demo-heading"><p class="eyebrow">SAMPLE LESSON · CHECKPOINT 1 OF 1</p><h1>Change the code before moving on</h1><p>Set the multiplier to 2. Then run the check.</p></div><div class="lesson-instrument"><section class="mock-video" aria-label="Paused sample video"><div class="video-grid" aria-hidden="true"><span>[ 3, 5, 7 ]</span><b>map( )</b><i>?</i></div><div class="video-controls"><button aria-label="Play sample video" id="fake-play">▶</button><div class="timeline"><span></span></div><time>0:47 / 2:18</time></div><p class="paused-label"><span></span> Paused for checkpoint</p></section><section class="ticket" aria-labelledby="ticket-title"><div class="ticket-head"><p class="eyebrow">RUN TICKET · 00:47</p><span id="demo-state">Not passed</span></div><h2 id="ticket-title">Double each price</h2><p>${checkpoint.prompt}</p><label for="demo-code">JavaScript</label><textarea id="demo-code" spellcheck="false">${escapeHtml(demoCode)}</textarea><div class="editor-actions"><button class="button primary" id="run-demo" type="button">Run check <kbd>Ctrl ↵</kbd></button><button class="button ghost" id="reset-code" type="button">Reset code</button></div><div class="output" id="demo-output" role="status" aria-live="polite"><span>OUTPUT</span><p>Run the changed code to see its output.</p></div></section></div><div class="demo-note"><span aria-hidden="true">↳</span><p>This sample uses the same checkpoint file and isolated runner as the extension. Change <code>* 1</code> to <code>* 2</code>.</p></div></section>`;
}

function creatorPage() {
  if (!hasPaidLicense()) return `<section class="narrow legal"><p class="eyebrow">CREATOR KIT</p><h1>Restore a license to build checkpoint files</h1><p>Creator Kit sales are paused. Existing customers can restore access on the home page.</p><a class="button primary" href="/#creator-kit">Restore an existing license</a></section>`;
  const checkpoints = builderDraft.checkpoints.map((checkpoint, index) => checkpointFields(checkpoint, index)).join('');
  return `<section class="creator"><div class="creator-heading"><p class="eyebrow">CREATOR KIT</p><h1>Build and edit checkpoint files</h1><p>Import an existing JSON file or edit several checkpoints. Everything stays in this browser tab.</p></div><div class="import-panel"><label for="manifest-file">Import checkpoint JSON</label><input id="manifest-file" type="file" accept="application/json,.json" aria-describedby="import-status"><p id="import-status" role="status">Choose a version 1 checkpoint file to replace the current draft.</p></div><form id="builder-form" class="builder" novalidate><label for="lesson-title">Lesson title</label><input id="lesson-title" data-root-field="title" required value="${escapeHtml(builderDraft.title)}" aria-describedby="builder-status"><div id="checkpoint-list">${checkpoints}</div><button class="button ghost" id="add-checkpoint" type="button">Add checkpoint</button><button class="button primary" type="submit">Download checkpoint JSON</button><p id="builder-status" role="status" aria-live="polite">${escapeHtml(builderMessage)}</p></form></section>`;
}

function checkpointFields(checkpoint: Checkpoint, index: number) {
  return `<fieldset class="checkpoint-fields" data-checkpoint="${index}" tabindex="-1"><legend>Checkpoint ${index + 1}</legend><div class="checkpoint-actions"><button type="button" data-move="up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>Move up</button><button type="button" data-move="down" data-index="${index}" ${index === builderDraft.checkpoints.length - 1 ? 'disabled' : ''}>Move down</button><button type="button" data-remove="${index}" ${builderDraft.checkpoints.length === 1 ? 'disabled' : ''}>Remove checkpoint</button></div><div class="field-row"><label for="checkpoint-id-${index}">Checkpoint ID<input id="checkpoint-id-${index}" data-index="${index}" data-field="id" required value="${escapeHtml(checkpoint.id)}" pattern="[a-z0-9-]+" aria-describedby="builder-status"></label><label for="checkpoint-at-${index}">Pause at seconds<input id="checkpoint-at-${index}" data-index="${index}" data-field="at" type="number" min="0" required value="${checkpoint.at}" aria-describedby="builder-status"></label></div><label for="checkpoint-prompt-${index}">Learner prompt</label><input id="checkpoint-prompt-${index}" data-index="${index}" data-field="prompt" required value="${escapeHtml(checkpoint.prompt)}" aria-describedby="builder-status"><label for="starter-code-${index}">Starter code</label><textarea id="starter-code-${index}" data-index="${index}" data-field="starterCode" required aria-describedby="builder-status">${escapeHtml(checkpoint.starterCode)}</textarea><label for="expected-output-${index}">Expected output</label><input id="expected-output-${index}" data-index="${index}" data-field="expectedOutput" required value="${escapeHtml(checkpoint.expectedOutput)}" aria-describedby="builder-status"></fieldset>`;
}

function privacyPage() {
  return `<article class="narrow legal"><p class="eyebrow">PRIVACY · EFFECTIVE AUGUST 29, 2026</p><h1>Your code stays in your browser</h1><p>Run Before Next does not create accounts or collect learner source code.</p><h2>Site access</h2><p>Chrome asks for access to all sites so the extension can check each page for an author-provided checkpoint file. If it finds none, it stops without changing the page, storage, video, or network activity.</p><h2>What the extension stores</h2><p>The extension stores passed checkpoint IDs and lesson page addresses in browser extension storage. It does not store editor contents.</p><h2>What the demo stores</h2><p>Demo edits stay in memory and disappear whenever you leave the demo. The demo does not read real extension data.</p><h2>License checks</h2><p>If you restore a Creator Kit license, the site stores the token and last result in local browser storage. It sends the token to the Sociobot billing API for verification.</p><h2>Requests</h2><p>The site loads its code and images from this domain. It does not load analytics, ads, or third-party fonts.</p><h2>Delete local data</h2><p>Remove the extension to clear extension progress. Clear this site’s browser data to remove a saved license.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article>`;
}

function termsPage() {
  return `<article class="narrow legal"><p class="eyebrow">TERMS · EFFECTIVE AUGUST 29, 2026</p><h1>Use checkpoints on lessons you may edit</h1><p>Run Before Next is provided under these terms and the repository’s MIT license.</p><h2>Acceptable use</h2><p>Only add checkpoint files to lesson pages you control. Do not use the extension to copy videos or bypass access controls.</p><h2>Sandbox limits</h2><p>The sandbox runs short JavaScript console exercises. Authors are responsible for the accuracy and safety of their checkpoint content.</p><h2>Existing Creator Kit licenses</h2><p>Creator Kit sales are paused. Existing licenses can restore checkpoint-file builder access after verification.</p><h2>No warranty</h2><p>The software is provided “as is” without warranty. Keep copies of checkpoint files you create.</p><h2>Contact</h2><p>For terms questions, email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></article>`;
}

function notFoundPage() {
  return `<section class="not-found"><div class="lost-ticket" aria-hidden="true"><span>404</span><i></i></div><p class="eyebrow">PAGE NOT FOUND</p><h1>Page not found</h1><p>This address does not exist. Return to the home page or try the demo.</p><div class="not-found-actions"><a class="button primary" href="/" data-route>Return home</a><a class="button secondary" href="/demo" data-route>Try the sample checkpoint</a></div></section>`;
}

function bindCommon() {
  document.querySelector('#reset-demo')?.addEventListener('click', () => { resetDemo(); render(); });
  document.querySelectorAll<HTMLAnchorElement>('.extension-download').forEach(link => link.addEventListener('click', () => {
    window.setTimeout(() => {
      if (route() !== 'home') return;
      const panel = document.querySelector<HTMLElement>('#install-guide');
      if (!panel) return;
      panel.hidden = false;
      panel.focus();
      panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }, 0);
  }));
}

function bindDemo() {
  const textarea = document.querySelector<HTMLTextAreaElement>('#demo-code')!;
  const output = document.querySelector<HTMLDivElement>('#demo-output')!;
  const state = document.querySelector<HTMLSpanElement>('#demo-state')!;
  textarea.value = demoCode;
  const run = async () => {
    const runId = ++demoRunId;
    const button = document.querySelector<HTMLButtonElement>('#run-demo')!;
    demoCode = textarea.value;
    output.className = 'output running'; output.innerHTML = '<span>OUTPUT</span><p>Running in the JavaScript sandbox…</p>';
    if (demoCode === SAMPLE_MANIFEST.checkpoints[0].starterCode) return showDemoError('Change the starter code before you run the check.', runId);
    button.disabled = true;
    const result = await runJavaScript(demoCode);
    if (runId !== demoRunId) return;
    button.disabled = false;
    if (result.error) return showDemoError(`The code stopped: ${result.error} Fix it, then run the check again.`, runId);
    if (result.output.trim() !== SAMPLE_MANIFEST.checkpoints[0].expectedOutput) return showDemoError(`Output: ${result.output || '(nothing)'}. Expected: 6, 10, 14. Change the code and run it again.`, runId);
    demoPassed = true; state.textContent = 'Passed'; state.className = 'passed';
    output.className = 'output pass'; output.innerHTML = `<span>OUTPUT · PASSED</span><p>${escapeHtml(result.output)}</p>`;
    button.textContent = 'Checkpoint passed'; button.disabled = true;
  };
  const showDemoError = (message: string, runId: number) => {
    if (runId !== demoRunId) return;
    demoPassed = false; state.textContent = 'Try again'; state.className = 'failed'; output.className = 'output fail';
    output.innerHTML = `<span>OUTPUT · NOT YET</span><p>${escapeHtml(message)}</p>`;
    const button = document.querySelector<HTMLButtonElement>('#run-demo')!;
    button.disabled = false; button.innerHTML = 'Run check <kbd>Ctrl ↵</kbd>';
  };
  document.querySelector('#run-demo')!.addEventListener('click', run);
  document.querySelector('#reset-code')!.addEventListener('click', () => {
    resetDemo(); textarea.value = demoCode; state.textContent = 'Not passed'; state.className = ''; output.className = 'output';
    output.innerHTML = '<span>OUTPUT</span><p>Run the changed code to see its output.</p>';
    const button = document.querySelector<HTMLButtonElement>('#run-demo')!; button.disabled = false; button.innerHTML = 'Run check <kbd>Ctrl ↵</kbd>';
  });
  textarea.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void run(); } });
  if (demoPassed) { state.textContent = 'Passed'; state.className = 'passed'; }
  document.querySelector('#fake-play')!.addEventListener('click', () => { output.className = 'output fail'; output.innerHTML = '<span>VIDEO PAUSED</span><p>Pass the checkpoint before the lesson continues.</p>'; });
}

function bindLicense() {
  const toggle = document.querySelector<HTMLButtonElement>('#restore-toggle');
  const form = document.querySelector<HTMLFormElement>('#license-form');
  toggle?.addEventListener('click', () => { form!.hidden = !form!.hidden; if (!form!.hidden) form!.querySelector<HTMLInputElement>('input')!.focus(); });
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = new FormData(form).get('license')?.toString().trim();
    if (!token) return;
    localStorage.setItem(LICENSE_KEY, token);
    const status = document.querySelector<HTMLParagraphElement>('#license-status')!;
    status.textContent = 'Checking this license…';
    const valid = await verifyLicense(token);
    status.textContent = valid ? 'License verified. The checkpoint file builder is ready.' : 'This license is not active. Check the token and try again.';
    if (valid) window.setTimeout(() => render(), 500);
  });
}

function bindCreator() {
  const form = document.querySelector<HTMLFormElement>('#builder-form');
  if (!form) return;
  const syncDraft = () => {
    builderDraft.title = value('lesson-title');
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-field]').forEach(input => {
      const checkpoint = builderDraft.checkpoints[Number(input.dataset.index)];
      const field = input.dataset.field as keyof Checkpoint;
      if (field === 'at') checkpoint.at = Number(input.value);
      else if (field === 'id') checkpoint.id = input.value;
      else if (field === 'prompt') checkpoint.prompt = input.value;
      else if (field === 'starterCode') checkpoint.starterCode = input.value;
      else if (field === 'expectedOutput') checkpoint.expectedOutput = input.value;
    });
  };
  form.addEventListener('input', syncDraft);
  form.addEventListener('submit', (event) => {
    event.preventDefault(); syncDraft(); clearBuilderErrors();
    const checked = validateManifest(builderDraft);
    if (!checked.ok) { showBuilderError(checked.message); return; }
    downloadJson(checked.manifest);
    document.querySelector<HTMLParagraphElement>('#builder-status')!.textContent = 'Checkpoint file downloaded. Add its JSON block to the lesson page.';
  });
  document.querySelector('#add-checkpoint')?.addEventListener('click', () => {
    syncDraft(); const last = builderDraft.checkpoints.at(-1)!;
    builderDraft.checkpoints.push({ ...structuredClone(last), id: nextCheckpointId(), at: last.at + 30 });
    builderMessage = 'Checkpoint added.'; render();
    document.querySelector<HTMLInputElement>(`#checkpoint-id-${builderDraft.checkpoints.length - 1}`)?.focus();
  });
  form.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach(button => button.addEventListener('click', () => {
    syncDraft(); builderDraft.checkpoints.splice(Number(button.dataset.remove), 1); builderMessage = 'Checkpoint removed.'; render();
  }));
  form.querySelectorAll<HTMLButtonElement>('[data-move]').forEach(button => button.addEventListener('click', () => {
    syncDraft(); const from = Number(button.dataset.index); const to = button.dataset.move === 'up' ? from - 1 : from + 1;
    [builderDraft.checkpoints[from], builderDraft.checkpoints[to]] = [builderDraft.checkpoints[to], builderDraft.checkpoints[from]];
    builderMessage = `Checkpoint moved ${button.dataset.move}.`; render();
    document.querySelector<HTMLFieldSetElement>(`[data-checkpoint="${to}"]`)?.focus();
  }));
  document.querySelector<HTMLInputElement>('#manifest-file')?.addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement;
    const status = document.querySelector<HTMLParagraphElement>('#import-status')!;
    input.removeAttribute('aria-invalid');
    try {
      const file = input.files?.[0];
      if (!file) return;
      const checked = validateManifest(JSON.parse(await file.text()));
      if (!checked.ok) throw new Error(checked.message);
      builderDraft = structuredClone(checked.manifest); builderMessage = `Imported ${builderDraft.checkpoints.length} checkpoints.`; render();
      document.querySelector<HTMLInputElement>('#lesson-title')?.focus();
    } catch (error) {
      input.setAttribute('aria-invalid', 'true');
      status.textContent = `The file could not be imported: ${error instanceof Error ? error.message : 'Use valid JSON.'}`;
    }
  });
}

function nextCheckpointId() {
  let number = builderDraft.checkpoints.length + 1;
  while (builderDraft.checkpoints.some(item => item.id === `checkpoint-${number}`)) number++;
  return `checkpoint-${number}`;
}

function clearBuilderErrors() { document.querySelectorAll('[aria-invalid="true"]').forEach(element => element.removeAttribute('aria-invalid')); }

function showBuilderError(message: string) {
  document.querySelector<HTMLParagraphElement>('#builder-status')!.textContent = `${message} Fix the marked field and download again.`;
  const match = message.match(/Checkpoint (?:“([^”]+)”|(\d+))/);
  const index = match?.[1] ? builderDraft.checkpoints.findIndex(item => item.id === match[1]) : Number(match?.[2] || 1) - 1;
  const field = message.includes('appears twice') || message.includes('needs an id') ? 'id' : message.includes('time') ? 'at' : message.includes('prompt') ? 'prompt' : message.includes('starter') ? 'starterCode' : message.includes('expected') ? 'expectedOutput' : undefined;
  const input = field ? document.querySelector<HTMLElement>(`[data-index="${Math.max(0, index)}"][data-field="${field}"]`) : document.querySelector<HTMLElement>('#lesson-title');
  input?.setAttribute('aria-invalid', 'true'); input?.focus();
}

function downloadJson(manifest: LessonManifest) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'run-before-next.manifest.json'; link.click(); URL.revokeObjectURL(url);
}

function value(id: string) { return document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!.value.trim(); }
function escapeHtml(value: string) { const span = document.createElement('span'); span.textContent = value; return span.innerHTML; }

const metadata: Record<Route, { title: string; description: string; canonical: string }> = {
  home: { title: 'Run Before Next — Code checks for video lessons', description: 'Pause an author-prepared video lesson, change runnable code, and pass its output check before the lesson continues.', canonical: '/' },
  demo: { title: 'Demo — Run Before Next', description: 'Try one isolated JavaScript checkpoint with sample lesson data. Demo changes are not saved.', canonical: '/demo' },
  creator: { title: 'Checkpoint file builder — Run Before Next', description: 'Import, validate, edit, reorder, and export lesson checkpoint files in your browser.', canonical: '/creator' },
  privacy: { title: 'Privacy — Run Before Next', description: 'Learn what the Run Before Next extension checks, stores, and sends.', canonical: '/privacy' },
  terms: { title: 'Terms — Run Before Next', description: 'Read the terms for using Run Before Next with lesson pages and checkpoint files.', canonical: '/terms' },
  'not-found': { title: 'Page not found — Run Before Next', description: 'This Run Before Next address does not exist. Return home or try the sample checkpoint.', canonical: '/404.html' }
};

function setMetadata(current: Route) {
  const item = metadata[current];
  document.title = item.title;
  setMeta('meta[name="description"]', item.description);
  setMeta('meta[property="og:title"]', item.title);
  setMeta('meta[property="og:description"]', item.description);
  setMeta('meta[property="og:url"]', `${SITE_URL}${item.canonical}`);
  setMeta('meta[name="twitter:title"]', item.title);
  setMeta('meta[name="twitter:description"]', item.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `${SITE_URL}${item.canonical}`;
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (current === 'not-found' && !robots) {
    robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots);
  }
  if (robots) robots.content = current === 'not-found' ? 'noindex' : 'index,follow';
}

function setMeta(selector: string, content: string) { document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content); }

function hasPaidLicense() {
  try { const cache = JSON.parse(localStorage.getItem(LICENSE_CACHE_KEY) || 'null'); return Boolean(cache?.valid); }
  catch { return false; }
}

function initLicense() {
  if (route() === 'demo') return;
  const params = new URLSearchParams(location.search);
  const incoming = params.get('license');
  if (incoming) {
    localStorage.setItem(LICENSE_KEY, incoming); params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  const token = incoming || localStorage.getItem(LICENSE_KEY);
  if (!token) return;
  try { const cache = JSON.parse(localStorage.getItem(LICENSE_CACHE_KEY) || 'null'); if (cache && Date.now() - cache.checkedAt < 86400000) return; }
  catch { /* verify malformed cache */ }
  void verifyLicense(token).then(() => render());
}

async function verifyLicense(token: string) {
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    const data = await response.json() as { valid?: boolean };
    const valid = data.valid === true;
    localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify({ valid, checkedAt: Date.now() }));
    if (!valid) localStorage.removeItem(LICENSE_KEY);
    return valid;
  } catch { return hasPaidLicense(); }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}

activeRoute = route();
initLicense();
render('initial');
registerServiceWorker();
