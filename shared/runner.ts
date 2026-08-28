export interface RunResult {
  output: string;
  error?: string;
}

export function runJavaScript(code: string, timeoutMs = 1200): Promise<RunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    const id = crypto.randomUUID();
    iframe.src = '/sandbox.html';
    iframe.sandbox.add('allow-scripts');
    iframe.hidden = true;
    iframe.title = 'JavaScript sandbox';
    iframe.setAttribute('aria-hidden', 'true');

    let settled = false;
    const finish = (result: RunResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener('message', receive);
      // Removing the sandbox also terminates its dedicated execution worker.
      // A learner loop can therefore never occupy the page's event loop.
      iframe.remove();
      resolve(result);
    };

    const timeout = window.setTimeout(() => finish({ output: '', error: 'The code ran for too long. Check for an endless loop.' }), timeoutMs);
    const send = () => iframe.contentWindow?.postMessage({ type: 'RBN_RUN', id, code }, '*');
    const receive = (event: MessageEvent<RunResult & { type?: string; id?: string }>) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.type === 'RBN_READY') { send(); return; }
      if (event.data?.type !== 'RBN_RESULT' || event.data.id !== id) return;
      finish({ output: event.data.output || '', error: event.data.error });
    };
    window.addEventListener('message', receive);
    document.body.append(iframe);
  });
}
