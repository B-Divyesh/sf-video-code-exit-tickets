import { defineConfig } from 'wxt';

export default defineConfig({
  outDir: '.output',
  srcDir: '.',
  manifest: {
    name: 'Run Before Next',
    description: 'Pause video lessons for one runnable code check.',
    version: '1.0.1',
    permissions: ['storage'],
    host_permissions: ['<all_urls>'],
    action: { default_title: 'Run Before Next' },
    sandbox: { pages: ['sandbox.html'] },
    web_accessible_resources: [{ resources: ['sandbox.html', 'sandbox.js'], matches: ['<all_urls>'] }],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'",
      sandbox: "sandbox allow-scripts; default-src 'none'; script-src 'self' 'unsafe-eval'; worker-src blob:; connect-src 'none'; object-src 'none'"
    }
  }
});
