// The iframe itself never evaluates learner input. It gives every run its own
// worker so its parent can remove this iframe to interrupt an endless loop.
const workerSource = `
self.addEventListener('message', ({ data }) => {
  const lines = [];
  const format = (value) => typeof value === 'string' ? value : JSON.stringify(value);
  const console = { log: (...values) => lines.push(values.map(format).join(' ')) };
  try {
    const execute = new Function('console', '"use strict";\\n' + data.code);
    execute(console);
    self.postMessage({ type: 'RBN_RESULT', id: data.id, output: lines.join('\\n') });
  } catch (error) {
    self.postMessage({ type: 'RBN_RESULT', id: data.id, output: lines.join('\\n'), error: error instanceof Error ? error.message : String(error) });
  }
});`;

let activeWorker;

window.addEventListener('message', (event) => {
  if (event.source !== window.parent || !event.data || event.data.type !== 'RBN_RUN') return;
  const id = event.data.id;
  activeWorker?.terminate();
  const workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
  const worker = activeWorker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);
  worker.addEventListener('message', ({ data }) => {
    if (worker !== activeWorker) return;
    worker.terminate();
    activeWorker = undefined;
    window.parent.postMessage(data, '*');
  });
  worker.addEventListener('error', (event) => {
    if (worker !== activeWorker) return;
    worker.terminate();
    activeWorker = undefined;
    window.parent.postMessage({ type: 'RBN_RESULT', id, output: '', error: event.message || 'The code could not run.' }, '*');
  });
  worker.postMessage({ id, code: event.data.code });
});
window.parent.postMessage({ type: 'RBN_READY' }, '*');
