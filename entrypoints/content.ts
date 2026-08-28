import { browser } from 'wxt/browser';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { validateManifest, type Checkpoint, type LessonManifest } from '../shared/checkpoints';

declare global {
  interface Window { __runBeforeNext?: { open: () => void } }
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    document.documentElement.setAttribute('data-run-before-next', 'ready');
    const parsed = readManifest();
    if (!parsed) return;
    if (!parsed.ok) {
      announcePageError(parsed.message);
      return;
    }
    const controller = new CheckpointController(parsed.manifest);
    window.__runBeforeNext = { open: () => controller.openNext() };
    controller.start();
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === 'RBN_STATUS') return Promise.resolve(controller.status());
      if (message?.type === 'RBN_OPEN') controller.openNext();
      return undefined;
    });
  }
});

function readManifest() {
  const node = document.querySelector<HTMLScriptElement>('script[data-run-before-next-manifest][type="application/json"]');
  if (!node) return null;
  try { return validateManifest(JSON.parse(node.textContent || '')); }
  catch { return { ok: false as const, message: 'The checkpoint manifest is not valid JSON.' }; }
}

function announcePageError(message: string) {
  const note = document.createElement('div');
  note.setAttribute('role', 'status');
  note.textContent = `Run Before Next: ${message}`;
  Object.assign(note.style, { position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647', background: '#291814', color: '#fff2ee', padding: '12px 16px', border: '1px solid #ff9188', borderRadius: '12px', font: '14px system-ui' });
  document.body.append(note);
}

class CheckpointController {
  private passed = new Set<string>();
  private current?: Checkpoint;
  private video?: HTMLVideoElement;
  private host?: HTMLElement;
  private shadow?: ShadowRoot;
  private sandbox?: HTMLIFrameElement;
  private sandboxReady = false;
  private runId = '';
  private storageKey: string;

  constructor(private manifest: LessonManifest) {
    this.storageKey = `progress:${location.origin}${location.pathname}:${manifest.title}`;
  }

  async start() {
    const saved = await browser.storage.local.get(this.storageKey);
    const ids = saved[this.storageKey];
    if (Array.isArray(ids)) ids.forEach((id) => typeof id === 'string' && this.passed.add(id));
    this.video = document.querySelector('video') || undefined;
    if (!this.video) {
      const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) { observer.disconnect(); this.bindVideo(video); }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.setTimeout(() => observer.disconnect(), 30000);
      return;
    }
    this.bindVideo(this.video);
  }

  private bindVideo(video: HTMLVideoElement) {
    this.video = video;
    video.addEventListener('timeupdate', () => {
      const next = this.nextCheckpoint();
      if (next && video.currentTime >= next.at) this.open(next);
    });
  }

  status() {
    return { active: true, title: this.manifest.title, total: this.manifest.checkpoints.length, passed: this.passed.size, hasVideo: Boolean(this.video) };
  }

  openNext() {
    const next = this.nextCheckpoint();
    if (next) this.open(next);
  }

  private nextCheckpoint() { return this.manifest.checkpoints.find((item) => !this.passed.has(item.id)); }

  private open(checkpoint: Checkpoint) {
    if (this.current?.id === checkpoint.id) return;
    this.current = checkpoint;
    this.video?.pause();
    if (!this.host) this.mount();
    this.render(checkpoint);
  }

  private mount() {
    this.host = document.createElement('aside');
    this.host.id = 'run-before-next-root';
    this.host.setAttribute('aria-label', 'Run Before Next checkpoint');
    this.shadow = this.host.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = `<style>${styles}</style><div class="shell" role="dialog" aria-modal="true" aria-labelledby="rbn-title"><div id="app"></div></div>`;
    this.sandbox = document.createElement('iframe');
    this.sandbox.src = chrome.runtime.getURL('/sandbox.html');
    this.sandbox.title = 'Code sandbox';
    this.sandbox.hidden = true;
    this.shadow.append(this.sandbox);
    document.documentElement.append(this.host);
    window.addEventListener('message', (event) => {
      if (event.source !== this.sandbox?.contentWindow) return;
      if (event.data?.type === 'RBN_READY') { this.sandboxReady = true; return; }
      if (event.data?.type !== 'RBN_RESULT' || event.data.id !== this.runId) return;
      this.handleResult(event.data.output || '', event.data.error);
    });
  }

  private render(checkpoint: Checkpoint) {
    const app = this.shadow!.querySelector<HTMLDivElement>('#app')!;
    const at = `${Math.floor(checkpoint.at / 60)}:${String(checkpoint.at % 60).padStart(2, '0')}`;
    app.innerHTML = `<header><div><p class="eyebrow">Checkpoint · ${at}</p><h2 id="rbn-title">Change it, then run it</h2></div><span class="count">${this.passed.size}/${this.manifest.checkpoints.length} passed</span></header><p>${escapeHtml(checkpoint.prompt)}</p><label for="rbn-code">JavaScript</label><textarea id="rbn-code" spellcheck="false">${escapeHtml(checkpoint.starterCode)}</textarea><div class="actions"><button class="run" id="rbn-run">▶ Run check <kbd>Ctrl ↵</kbd></button><button class="reset" id="rbn-reset">Reset code</button></div><div id="rbn-result" class="result" role="status" aria-live="polite">Output will appear here.</div>`;
    const input = app.querySelector<HTMLTextAreaElement>('#rbn-code')!;
    const run = () => this.run(input.value);
    app.querySelector('#rbn-run')!.addEventListener('click', run);
    app.querySelector('#rbn-reset')!.addEventListener('click', () => { input.value = checkpoint.starterCode; input.focus(); });
    input.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); run(); } });
    window.setTimeout(() => input.focus(), 0);
  }

  private run(code: string) {
    const result = this.shadow!.querySelector<HTMLDivElement>('#rbn-result')!;
    if (code === this.current!.starterCode) {
      result.className = 'result fail';
      result.textContent = 'Change the starter code before you run the check.';
      return;
    }
    result.className = 'result running';
    result.textContent = 'Running in the JavaScript sandbox…';
    this.runId = crypto.randomUUID();
    const send = () => this.sandbox!.contentWindow?.postMessage({ type: 'RBN_RUN', id: this.runId, code }, '*');
    if (this.sandboxReady) send(); else window.setTimeout(send, 120);
    window.setTimeout(() => {
      if (result.classList.contains('running')) {
        result.className = 'result fail';
        result.textContent = 'The code ran for too long. Check for an endless loop.';
        this.sandboxReady = false;
        this.sandbox!.src = chrome.runtime.getURL('/sandbox.html');
      }
    }, 1500);
  }

  private async handleResult(output: string, error?: string) {
    const result = this.shadow!.querySelector<HTMLDivElement>('#rbn-result')!;
    if (error) {
      result.className = 'result fail';
      result.textContent = `The code stopped: ${error} Fix it, then run the check again.`;
      return;
    }
    if (output.trim() !== this.current!.expectedOutput.trim()) {
      result.className = 'result fail';
      result.textContent = `Output: ${output || '(nothing)'}. Expected: ${this.current!.expectedOutput}. Change the code and run it again.`;
      return;
    }
    const id = this.current!.id;
    this.passed.add(id);
    await browser.storage.local.set({ [this.storageKey]: [...this.passed] });
    result.className = 'result pass';
    result.textContent = `Passed. Output: ${output}`;
    const run = this.shadow!.querySelector<HTMLButtonElement>('#rbn-run')!;
    run.textContent = 'Resume lesson';
    run.onclick = () => {
      this.host?.remove(); this.host = undefined; this.shadow = undefined; this.sandbox = undefined; this.current = undefined;
      void this.video?.play();
    };
    run.focus();
  }
}

function escapeHtml(value: string) { const span = document.createElement('span'); span.textContent = value; return span.innerHTML; }

const styles = `
:host{all:initial;color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;color:#f2f7ed}
*{box-sizing:border-box}.shell{position:fixed;z-index:2147483647;right:20px;bottom:20px;width:min(560px,calc(100vw - 32px));max-height:calc(100vh - 40px);overflow:auto;padding:24px;background:rgba(12,27,24,.97);border:1px solid #4d7468;border-radius:20px 4px 20px 20px;box-shadow:0 24px 90px #000c;backdrop-filter:blur(18px)}
header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}h2{font:700 28px/1.1 'Arial Narrow',system-ui;margin:2px 0 12px}p{font:16px/1.5 system-ui;margin:0 0 16px;color:#dce9e3}.eyebrow{color:#c9ff63;font:700 12px/1.4 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em;margin:0}.count{font:12px/1.4 ui-monospace,monospace;color:#adc3b9;white-space:nowrap}label{display:block;font:700 13px/1.4 system-ui;margin-bottom:8px}textarea{display:block;width:100%;min-height:180px;resize:vertical;background:#07110f;border:1px solid #52786d;border-radius:10px;padding:14px;color:#f2f7ed;font:15px/1.55 ui-monospace,monospace;tab-size:2}textarea:focus,button:focus-visible{outline:3px solid #73e6ff;outline-offset:3px}.actions{display:flex;gap:8px;margin:16px 0}button{min-height:44px;border:1px solid #52786d;border-radius:99px;padding:0 18px;color:#f2f7ed;background:#18352d;font:700 14px system-ui;cursor:pointer}.run{background:#c9ff63;color:#112000;border-color:#c9ff63}.run:hover{background:#dcff98}.reset:hover{background:#23463c}kbd{font:11px ui-monospace;margin-left:8px}.result{padding:12px 14px;border-left:3px solid #73e6ff;background:#0a1815;color:#dce9e3;font:14px/1.45 system-ui}.result.fail{border-color:#ff9188}.result.pass{border-color:#73e6aa;color:#d8ffe9}.result.running{border-color:#ffd36c}@media(max-width:520px){.shell{right:8px;bottom:8px;width:calc(100vw - 16px);padding:18px;max-height:calc(100vh - 16px)}header{display:block}.count{display:block;margin-bottom:12px}.actions{flex-direction:column}.actions button{width:100%}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;
