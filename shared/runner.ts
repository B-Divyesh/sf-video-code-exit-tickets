export interface RunResult {
  output: string;
  error?: string;
}

export function workerSource(): string {
  return `self.onmessage = (event) => {
    const lines = [];
    const format = (value) => typeof value === 'string' ? value : JSON.stringify(value);
    const console = { log: (...values) => lines.push(values.map(format).join(' ')) };
    try {
      const execute = new Function('console', '\"use strict\";\\n' + event.data.code);
      execute(console);
      self.postMessage({ output: lines.join('\\n') });
    } catch (error) {
      self.postMessage({ output: lines.join('\\n'), error: error instanceof Error ? error.message : String(error) });
    }
  };`;
}

export function runJavaScript(code: string, timeoutMs = 1200): Promise<RunResult> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([workerSource()], { type: 'text/javascript' }));
    const worker = new Worker(url);
    const finish = (result: RunResult) => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const timeout = window.setTimeout(() => finish({ output: '', error: 'The code ran for too long. Check for an endless loop.' }), timeoutMs);
    worker.onmessage = (event: MessageEvent<RunResult>) => {
      window.clearTimeout(timeout);
      finish(event.data);
    };
    worker.onerror = () => {
      window.clearTimeout(timeout);
      finish({ output: '', error: 'The sandbox could not run this code. Check the syntax and run it again.' });
    };
    worker.postMessage({ code });
  });
}
