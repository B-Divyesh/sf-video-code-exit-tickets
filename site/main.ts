import './styles.css';
import { runJavaScript } from '../shared/runner';
import { SAMPLE_MANIFEST, validateManifest, type LessonManifest } from '../shared/checkpoints';

const SITE_URL = 'https://video-code-exit-tickets.sociobot.in';
const SLUG = 'video-code-exit-tickets';
const LICENSE_KEY = `sb_license:${SLUG}`;
const LICENSE_CACHE_KEY = `sb_license_cache:${SLUG}`;
const app = document.querySelector<HTMLDivElement>('#app')!;
let demoCode = SAMPLE_MANIFEST.checkpoints[0].starterCode;
let demoPassed = false;
let demoRunId = 0;

type Route = 'home' | 'demo' | 'creator' | 'privacy' | 'terms' | 'not-found';

initLicense();
render();
registerServiceWorker();

window.addEventListener('popstate', () => render(true));
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-route]');
  if (!link || link.origin !== location.origin) return;
  event.preventDefault();
  history.pushState({}, '', link.href);
  render(true);
});

function route(): Route {
  if (location.pathname === '/') return 'home';
  if (location.pathname === '/demo') return 'demo';
  if (location.pathname === '/creator') return 'creator';
  if (location.pathname === '/privacy') return 'privacy';
  if (location.pathname === '/terms') return 'terms';
  return 'not-found';
}

function render(focus = false) {
  const current = route();
  const page = current === 'home' ? homePage() : current === 'demo' ? demoPage() : current === 'creator' ? creatorPage() : current === 'privacy' ? privacyPage() : current === 'terms' ? termsPage() : notFoundPage();
  app.innerHTML = `${header(current === 'demo' ? demoBanner() : '')}<main id="main" tabindex="-1">${page}</main>${footer()}`;
  setMetadata(current);
  bindCommon();
  if (current === 'demo') bindDemo();
  if (current === 'creator') bindCreator();
  if (current === 'home') bindLicense();
  if (focus) {
    window.scrollTo(0, 0);
    const h1 = document.querySelector<HTMLHeadingElement>('h1');
    h1?.setAttribute('tabindex', '-1'); h1?.focus();
    document.querySelector('#route-status')!.textContent = h1?.textContent || 'Page changed';
  }
}

function header(banner = '') {
  return `<header>${banner}<div class="site-header"><a class="wordmark" href="/" data-route aria-label="Run Before Next home"><span class="wordmark-mark" aria-hidden="true"><i></i></span><span>Run Before Next</span></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/#authors">For authors</a><a href="/privacy" data-route>Privacy</a></nav><a class="header-download" href="/downloads/run-before-next-chrome.zip" download>Download extension</a></div></header>`;
}

function footer() {
  return `<footer><div><a class="wordmark" href="/" data-route><span class="wordmark-mark" aria-hidden="true"><i></i></span><span>Run Before Next</span></a><p>Runnable code checks for existing video lessons.</p></div><nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://sociobot.in" rel="noreferrer">Built by Param Factory ↗</a></nav><p class="build">v1.0.0 · build 2026.08.28<br>Hero image generated for this product.</p></footer>`;
}

function homePage() {
  return `<section class="hero" id="download"><div class="hero-copy"><p class="eyebrow"><span></span> A checkpoint layer for video</p><h1>Prove your code before the video continues</h1><p class="lede">For video learners who need to change and run each idea before moving on.</p><div class="hero-action"><a class="button primary" href="/demo" data-route>Try it with sample data</a><span>Opens one JavaScript checkpoint. No setup.</span></div><ul class="plain-facts" aria-label="Product facts"><li>No account.</li><li>Learner code is not saved.</li><li>Core extension is free.</li></ul></div><div class="hero-art"><picture><source media="(max-width: 640px)" srcset="/assets/checkpoint-landscape-mobile.webp"><img src="/assets/checkpoint-landscape.webp" width="1200" height="800" alt="A glowing run path links three code checkpoints across a dark glass landscape." fetchpriority="high" decoding="async"></picture><div class="timestamp-stamp" aria-hidden="true"><span>LESSON 04</span><b>00:47</b><small>checkpoint armed</small></div></div></section>
  <section class="live-strip" aria-labelledby="preview-title"><div><p class="eyebrow">THE PRODUCT</p><h2 id="preview-title">One small stop between watching and knowing</h2></div><ol class="checkpoint-rail"><li class="done"><span>01</span><b>Watch</b><small>Concept shown</small></li><li class="active"><span>02</span><b>Change</b><small>Edit starter code</small></li><li><span>03</span><b>Run</b><small>Match the output</small></li><li><span>04</span><b>Resume</b><small>Video continues</small></li></ol><a class="text-link" href="/demo" data-route>Open the live checkpoint →</a></section>
  <section class="how" aria-labelledby="how-title"><div class="section-intro"><p class="eyebrow">HOW IT WORKS</p><h2 id="how-title">Add one falsifiable check</h2><p>A small manifest gives the extension a time, starter code, and expected output.</p></div><ol class="steps"><li><span>1</span><div><h3>Mark the moment</h3><p>The author adds a checkpoint time to the lesson page.</p></div></li><li><span>2</span><div><h3>Change and run</h3><p>The extension pauses the video and opens an allowlisted JavaScript sandbox.</p></div></li><li><span>3</span><div><h3>Pass and resume</h3><p>The video continues when the changed code prints the expected output.</p></div></li></ol></section>
  <section class="author-band" id="authors" aria-labelledby="authors-title"><div><p class="eyebrow">FOR AUTHORS</p><h2 id="authors-title">Attach checkpoints without moving your videos</h2><p>Add one JSON script to the lesson page. The extension does not scrape, host, or copy the video.</p><a class="button secondary" href="/sample-manifest.json" download>Download sample manifest</a></div><pre aria-label="Example manifest"><code>&lt;script type="application/json"
  data-run-before-next-manifest&gt;
{ "version": 1,
  "title": "JavaScript arrays",
  "checkpoints": [ ... ] }
&lt;/script&gt;</code></pre></section>
  <section class="boundaries" aria-labelledby="privacy-title"><div><p class="eyebrow">CLEAR BOUNDARIES</p><h2 id="privacy-title">Your lesson stays where it is</h2></div><ul><li><b>No video scraping.</b><span>The extension only watches the local video time.</span></li><li><b>No source upload.</b><span>Code runs inside an isolated browser sandbox.</span></li><li><b>No hidden templates.</b><span>Version one accepts only the JavaScript console template.</span></li></ul></section>
  <section class="paid" id="creator-kit" aria-labelledby="paid-title"><div><p class="eyebrow">CREATOR KIT · EXISTING LICENSES</p><h2 id="paid-title">Restore your manifest builder</h2><p>Creator Kit sales are paused. Existing license holders can verify a license and use the guided manifest builder.</p></div><div class="purchase"><button class="button secondary" id="restore-toggle" type="button">Restore an existing license</button><form id="license-form" hidden><label for="license">License token</label><div><input id="license" name="license" autocomplete="off" required><button type="submit">Verify license</button></div><p id="license-status" role="status"></p></form>${hasPaidLicense() ? '<a class="text-link" href="/creator" data-route>Open manifest builder →</a>' : ''}</div></section>`;
}

function demoBanner() {
  return `<div class="demo-banner"><span><b>Demo</b> — sample data, nothing is saved</span><div><button id="reset-demo" type="button">Reset demo</button><a href="/#download">Start for real</a></div></div>`;
}

function demoPage() {
  const checkpoint = SAMPLE_MANIFEST.checkpoints[0];
  return `<section class="demo-page"><div class="demo-heading"><p class="eyebrow">SAMPLE LESSON · CHECKPOINT 1 OF 1</p><h1>Change the code before moving on</h1><p>Set the multiplier to 2. Then run the check.</p></div><div class="lesson-instrument"><section class="mock-video" aria-label="Paused sample video"><div class="video-grid" aria-hidden="true"><span>[ 3, 5, 7 ]</span><b>map( )</b><i>?</i></div><div class="video-controls"><button aria-label="Play sample video" id="fake-play">▶</button><div class="timeline"><span></span></div><time>0:47 / 2:18</time></div><p class="paused-label"><span></span> Paused for checkpoint</p></section><section class="ticket" aria-labelledby="ticket-title"><div class="ticket-head"><p class="eyebrow">RUN TICKET · 00:47</p><span id="demo-state">Not passed</span></div><h2 id="ticket-title">Double each price</h2><p>${checkpoint.prompt}</p><label for="demo-code">JavaScript</label><textarea id="demo-code" spellcheck="false">${escapeHtml(demoCode)}</textarea><div class="editor-actions"><button class="button primary" id="run-demo" type="button">Run check <kbd>Ctrl ↵</kbd></button><button class="button ghost" id="reset-code" type="button">Reset code</button></div><div class="output" id="demo-output" role="status" aria-live="polite"><span>OUTPUT</span><p>Run the changed code to see its output.</p></div></section></div><div class="demo-note"><span aria-hidden="true">↳</span><p>This sample uses the same manifest and isolated runner as the extension. Change <code>* 1</code> to <code>* 2</code>.</p></div></section>`;
}

function creatorPage() {
  if (!hasPaidLicense()) return `<section class="narrow legal"><p class="eyebrow">CREATOR KIT</p><h1>Restore a license to build manifests</h1><p>Creator Kit sales are paused. Existing license holders can restore access on the home page.</p><a class="button primary" href="/#creator-kit">Restore an existing license</a></section>`;
  return `<section class="creator"><div class="creator-heading"><p class="eyebrow">CREATOR KIT</p><h1>Build a lesson checkpoint manifest</h1><p>Fill in one runnable check. The builder validates and downloads the JSON file.</p></div><form id="builder-form" class="builder"><label for="lesson-title">Lesson title</label><input id="lesson-title" required value="JavaScript arrays"><div class="field-row"><label>Checkpoint id<input id="checkpoint-id" required value="double-prices" pattern="[a-z0-9-]+"></label><label>Pause at seconds<input id="checkpoint-at" type="number" min="0" required value="47"></label></div><label for="checkpoint-prompt">Learner prompt</label><input id="checkpoint-prompt" required value="Change the multiplier so the output is 6, 10, 14."><label for="starter-code">Starter code</label><textarea id="starter-code" required>${escapeHtml(SAMPLE_MANIFEST.checkpoints[0].starterCode)}</textarea><label for="expected-output">Expected output</label><input id="expected-output" required value="6, 10, 14"><button class="button primary" type="submit">Download manifest JSON</button><p id="builder-status" role="status"></p></form></section>`;
}

function privacyPage() {
  return `<article class="narrow legal"><p class="eyebrow">PRIVACY · EFFECTIVE AUGUST 28, 2026</p><h1>Your code stays in your browser</h1><p>Run Before Next does not create accounts or collect learner source code.</p><h2>What the extension stores</h2><p>The extension stores passed checkpoint ids and lesson page addresses in browser extension storage. It does not store editor contents.</p><h2>What the demo stores</h2><p>Demo edits stay in memory and disappear when the page closes. The demo does not read real extension data.</p><h2>License checks</h2><p>If you restore a Creator Kit license, the site stores the token and last result in local browser storage. It sends the token to the Sociobot billing API for verification.</p><h2>Requests</h2><p>The site loads its code and images from this domain. It does not load analytics, ads, or third-party fonts.</p><h2>Delete local data</h2><p>Remove the extension to clear extension progress. Clear this site’s browser data to remove a saved license.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article>`;
}

function termsPage() {
  return `<article class="narrow legal"><p class="eyebrow">TERMS · EFFECTIVE AUGUST 28, 2026</p><h1>Use checkpoints on lessons you may edit</h1><p>Run Before Next is provided under these terms and the repository’s MIT license.</p><h2>Acceptable use</h2><p>Only add manifests to lesson pages you control. Do not use the extension to copy videos or bypass access controls.</p><h2>Sandbox limits</h2><p>The sandbox runs short JavaScript console exercises. Authors are responsible for the accuracy and safety of their checkpoint content.</p><h2>Existing Creator Kit licenses</h2><p>Creator Kit sales are paused. Existing licenses can restore manifest-builder access after verification.</p><h2>No warranty</h2><p>The software is provided “as is” without warranty. Keep copies of author manifests you create.</p><h2>Contact</h2><p>For terms questions, email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></article>`;
}

function notFoundPage() {
  return `<section class="not-found"><div class="lost-ticket" aria-hidden="true"><span>404</span><i></i></div><p class="eyebrow">CHECKPOINT NOT FOUND</p><h1>This run path ends here</h1><p>The page does not exist. Return to the lesson start.</p><a class="button primary" href="/" data-route>Return home</a></section>`;
}

function bindCommon() {
  document.querySelector('#reset-demo')?.addEventListener('click', () => { demoRunId++; demoCode = SAMPLE_MANIFEST.checkpoints[0].starterCode; demoPassed = false; render(); });
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
    demoPassed = false;
    state.textContent = 'Try again';
    state.className = 'failed';
    output.className = 'output fail';
    output.innerHTML = `<span>OUTPUT · NOT YET</span><p>${escapeHtml(message)}</p>`;
    const button = document.querySelector<HTMLButtonElement>('#run-demo')!;
    button.disabled = false;
    button.innerHTML = 'Run check <kbd>Ctrl ↵</kbd>';
  };
  document.querySelector('#run-demo')!.addEventListener('click', run);
  document.querySelector('#reset-code')!.addEventListener('click', () => {
    demoRunId++;
    textarea.value = SAMPLE_MANIFEST.checkpoints[0].starterCode;
    demoCode = textarea.value;
    demoPassed = false;
    state.textContent = 'Not passed';
    state.className = '';
    output.className = 'output';
    output.innerHTML = '<span>OUTPUT</span><p>Run the changed code to see its output.</p>';
    const button = document.querySelector<HTMLButtonElement>('#run-demo')!;
    button.disabled = false;
    button.innerHTML = 'Run check <kbd>Ctrl ↵</kbd>';
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
    status.textContent = valid ? 'License verified. The manifest builder is ready.' : 'This license is not active. Check the token and try again.';
    if (valid) window.setTimeout(() => render(), 500);
  });
}

function bindCreator() {
  const form = document.querySelector<HTMLFormElement>('#builder-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const manifest: LessonManifest = { version: 1, title: value('lesson-title'), checkpoints: [{ id: value('checkpoint-id'), at: Number(value('checkpoint-at')), prompt: value('checkpoint-prompt'), template: 'javascript-console-v1', starterCode: value('starter-code'), expectedOutput: value('expected-output') }] };
    const checked = validateManifest(manifest);
    const status = document.querySelector<HTMLParagraphElement>('#builder-status')!;
    if (!checked.ok) { status.textContent = checked.message; return; }
    const url = URL.createObjectURL(new Blob([JSON.stringify(checked.manifest, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'run-before-next.manifest.json'; link.click(); URL.revokeObjectURL(url);
    status.textContent = 'Manifest downloaded. Add its JSON inside the script tag shown on the home page.';
  });
}

function value(id: string) { return document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!.value.trim(); }
function escapeHtml(value: string) { const span = document.createElement('span'); span.textContent = value; return span.innerHTML; }

function setMetadata(current: Route) {
  const titles: Record<Route, string> = { home: 'Run Before Next — Prove code changes in video lessons', demo: 'Demo — Run Before Next', creator: 'Manifest builder — Run Before Next', privacy: 'Privacy — Run Before Next', terms: 'Terms — Run Before Next', 'not-found': 'Page not found — Run Before Next' };
  document.title = titles[current];
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!;
  canonical.href = `${SITE_URL}${location.pathname}`;
}

function hasPaidLicense() {
  try { const cache = JSON.parse(localStorage.getItem(LICENSE_CACHE_KEY) || 'null'); return Boolean(cache?.valid); }
  catch { return false; }
}

function initLicense() {
  if (route() === 'demo') return;
  const params = new URLSearchParams(location.search);
  const incoming = params.get('license');
  if (incoming) {
    localStorage.setItem(LICENSE_KEY, incoming);
    params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  const token = incoming || localStorage.getItem(LICENSE_KEY);
  if (!token) return;
  try {
    const cache = JSON.parse(localStorage.getItem(LICENSE_CACHE_KEY) || 'null');
    if (cache && Date.now() - cache.checkedAt < 86400000) return;
  } catch { /* verify malformed cache */ }
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
  } catch {
    return hasPaidLicense();
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
