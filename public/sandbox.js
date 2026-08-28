window.addEventListener('message', (event) => {
  if (event.source !== window.parent || !event.data || event.data.type !== 'RBN_RUN') return;
  const lines = [];
  const format = (value) => typeof value === 'string' ? value : JSON.stringify(value);
  const console = { log: (...values) => lines.push(values.map(format).join(' ')) };
  try {
    const execute = new Function('console', '"use strict";\n' + event.data.code);
    execute(console);
    window.parent.postMessage({ type: 'RBN_RESULT', id: event.data.id, output: lines.join('\n') }, '*');
  } catch (error) {
    window.parent.postMessage({ type: 'RBN_RESULT', id: event.data.id, output: lines.join('\n'), error: error instanceof Error ? error.message : String(error) }, '*');
  }
});
window.parent.postMessage({ type: 'RBN_READY' }, '*');
