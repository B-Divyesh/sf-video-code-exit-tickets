import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resolve } from 'node:path';
import { validateManifest } from '../../shared/checkpoints';

test('@claim:demo-pass runs changed code and passes the one-click sample checkpoint', async ({ page }) => {
  const main = await page.request.get('/demo');
  expect(main.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(main.headers()['content-security-policy']).not.toContain("script-src 'self' 'unsafe-eval'");
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const editor = page.getByLabel('JavaScript');
  await editor.fill((await editor.inputValue()).replace('* 1', '* 2'));
  await page.getByRole('button', { name: /Run check/ }).click();
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  await expect(page.locator('#demo-output p')).toHaveText('6, 10, 14');
  await expect(page.locator('#demo-state')).toHaveText('Passed');
});

test('@claim:timeout-recovery interrupts an endless demo run and lets the learner retry', async ({ page }) => {
  await page.goto('/demo');
  const editor = page.getByLabel('JavaScript');
  await editor.fill('while (true) {}');

  await page.evaluate(() => {
    type TimeoutTiming = { startedAt: number; renderedAt: number };
    const timing: TimeoutTiming = { startedAt: 0, renderedAt: 0 };
    const testWindow = window as Window & { __timeoutTiming?: TimeoutTiming };
    testWindow.__timeoutTiming = timing;

    document.querySelector<HTMLButtonElement>('#run-demo')?.addEventListener('click', () => {
      timing.startedAt = performance.now();
    }, { capture: true, once: true });

    const output = document.querySelector('#demo-output');
    const observer = new MutationObserver(() => {
      if (output?.textContent?.includes('The code ran for too long. Check for an endless loop.')) {
        timing.renderedAt = performance.now();
        observer.disconnect();
      }
    });
    if (output) observer.observe(output, { childList: true, subtree: true, characterData: true });
  });

  await page.getByRole('button', { name: /Run check/ }).click();
  await expect(page.locator('#demo-output')).toContainText('The code ran for too long. Check for an endless loop.', { timeout: 2500 });
  const elapsedMs = await page.evaluate(() => {
    const timing = (window as Window & { __timeoutTiming?: { startedAt: number; renderedAt: number } }).__timeoutTiming;
    if (!timing?.startedAt || !timing.renderedAt) throw new Error('Timeout rendering was not measured');
    return timing.renderedAt - timing.startedAt;
  });
  const promisedTimeoutMs = 1500;
  const browserSchedulingMarginMs = 150;
  expect(elapsedMs, `timeout rendered in ${elapsedMs.toFixed(1)} ms`).toBeLessThanOrEqual(promisedTimeoutMs + browserSchedulingMarginMs);
  await expect(page.getByRole('button', { name: /Run check/ })).toBeEnabled();
  await editor.fill("const prices = [3, 5, 7];\nconst doubled = prices.map(price => price * 2);\nconsole.log(doubled.join(', '));");
  await page.getByRole('button', { name: /Run check/ }).click();
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  await expect(page.locator('#demo-output p')).toHaveText('6, 10, 14');
});

test('Reset code re-enables Run check after a passed demo checkpoint', async ({ page }) => {
  await page.goto('/demo');
  const editor = page.getByLabel('JavaScript');
  await editor.fill((await editor.inputValue()).replace('* 1', '* 2'));
  const runButton = page.getByRole('button', { name: /Run check/ });
  await runButton.click();
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkpoint passed' })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset code' }).click();
  await expect(runButton).toBeEnabled();
  await expect(runButton).toHaveText(/Run check/);
  await expect(page.locator('#demo-state')).toHaveText('Not passed');
});

test('a cancelled demo run cannot overwrite a later pass', async ({ page }) => {
  await page.goto('/demo');
  const editor = page.getByLabel('JavaScript');
  const run = page.getByRole('button', { name: /Run check/ });
  await editor.fill('while (true) {}');
  await run.click();
  await expect(run).toBeDisabled();

  await page.getByRole('button', { name: 'Reset code' }).click();
  await editor.fill((await editor.inputValue()).replace('* 1', '* 2'));
  await run.click();
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  await page.waitForTimeout(1400);
  await expect(page.locator('#demo-state')).toHaveText('Passed');
  await expect(page.locator('#demo-output')).toContainText('6, 10, 14');
  await expect(page.getByRole('button', { name: 'Checkpoint passed' })).toBeDisabled();
});

test('@claim:sandbox-isolation production CSP keeps eval out of the app and confines it to the sandbox', async ({ page }) => {
  const [app, sandbox] = await Promise.all([page.request.get('/demo'), page.request.get('/sandbox.html')]);
  expect(app.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(app.headers()['content-security-policy']).not.toContain("'unsafe-eval'");
  expect(sandbox.headers()['content-security-policy']).toContain("script-src 'self' 'unsafe-eval'");
  expect(sandbox.headers()['content-security-policy']).toContain("worker-src blob:");
  expect(sandbox.headers()['content-security-policy']).toContain("connect-src 'none'");
  const extensionManifest = JSON.parse(await (await import('node:fs/promises')).readFile('.output/chrome-mv3/manifest.json', 'utf8'));
  expect(extensionManifest.sandbox.pages).toEqual(['sandbox.html']);
  expect(extensionManifest.content_security_policy.sandbox).toContain("connect-src 'none'");
  await page.goto('/demo');
  await page.getByLabel('JavaScript').fill('console.log("sandbox works")');
  await page.getByRole('button', { name: /Run check/ }).click();
  await expect(page.locator('#demo-output')).toContainText('Expected: 6, 10, 14');
});

test('production headers cache hashed assets immutably and keep update entry points fresh', async ({ page }) => {
  await page.goto('/');
  const script = await page.locator('script[type="module"]').getAttribute('src');
  expect(script).toMatch(/^\/assets\/.*-[\w-]+\.js$/);
  const [asset, serviceWorker, document] = await Promise.all([page.request.get(script!), page.request.get('/sw.js'), page.request.get('/index.html')]);
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  expect(serviceWorker.headers()['cache-control']).toBe('no-cache');
  expect(document.headers()['cache-control']).toBe('no-cache');
});

test('@claim:privacy-demo keeps sample data out of storage and third-party requests', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', request => outgoing.push(request.url()));
  await page.goto('/demo');
  const editor = page.getByLabel('JavaScript');
  await editor.fill((await editor.inputValue()).replace('* 1', '* 2'));
  await page.getByRole('button', { name: /Run check/ }).click();
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  expect(outgoing.every(url => {
    const request = new URL(url);
    // The killable executor is a local Blob worker. It has no network origin
    // and is not a request that can leave the device.
    return request.protocol === 'blob:' || request.origin === 'http://127.0.0.1:4173';
  })).toBe(true);
  const storage = await page.evaluate(async () => {
    const storageManager = navigator.storage as StorageManager & { getDirectory?: () => Promise<FileSystemDirectoryHandle> };
    const directory = storageManager.getDirectory ? await storageManager.getDirectory() : undefined;
    const opfsEntries: string[] = [];
    if (directory) {
      const entries = (directory as unknown as { entries: () => AsyncIterable<[string, unknown]> }).entries();
      for await (const [name] of entries) opfsEntries.push(name);
    }
    return { local: Object.keys(localStorage), session: Object.keys(sessionStorage), indexed: (await indexedDB.databases()).map(item => item.name), opfs: opfsEntries };
  });
  expect(storage).toEqual({ local: [], session: [], indexed: [], opfs: [] });
});

test('@claim:site-local-assets loads every public route without third-party assets, analytics, ads, or fonts', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', request => outgoing.push(request.url()));
  for (const path of ['/', '/demo', '/creator', '/privacy', '/terms', '/missing-page']) await page.goto(path);
  expect(outgoing.every(url => {
    const request = new URL(url);
    return request.protocol === 'blob:' || request.origin === 'http://127.0.0.1:4173';
  })).toBe(true);
});

test('@claim:license-check-cadence verifies an uncached license once daily without blocking the free download', async ({ page }) => {
  let verificationRequests = 0;
  let releaseVerification: (() => void) | undefined;
  const verificationReady = new Promise<void>(resolve => { releaseVerification = resolve; });
  await page.addInitScript(() => {
    if (!localStorage.getItem('sb_license:video-code-exit-tickets')) {
      localStorage.setItem('sb_license:video-code-exit-tickets', 'daily-license-fixture');
      localStorage.setItem('sb_license_cache:video-code-exit-tickets', JSON.stringify({ valid: true, checkedAt: 0 }));
    }
  });
  await page.route('https://api.sociobot.in/api/v1/products/video-code-exit-tickets/verify?license=daily-license-fixture', async route => {
    verificationRequests++;
    await verificationReady;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Download extension ZIP' })).toBeVisible();
  await expect.poll(() => verificationRequests).toBe(1);
  releaseVerification!();
  await expect.poll(() => page.evaluate(() => Boolean(JSON.parse(localStorage.getItem('sb_license_cache:video-code-exit-tickets') || 'null')?.checkedAt))).toBe(true);
  await page.reload();
  await page.waitForTimeout(150);
  expect(verificationRequests).toBe(1);
});

test('@claim:extension-download downloads the packaged Chrome extension', async ({ page }) => {
  await page.goto('/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download extension ZIP' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('run-before-next-chrome.zip');
  const path = await download.path();
  expect(path).toBeTruthy();
  await expect(page.locator('#install-guide')).toBeFocused();
  await expect(page.getByText('Open chrome://extensions and turn on Developer mode.')).toBeVisible();
});

test('@claim:manifest-export builds and downloads valid manifest JSON', async ({ page }) => {
  await page.goto('/');
  await page.route('https://api.sociobot.in/api/v1/products/video-code-exit-tickets/verify?license=existing-license-fixture', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.getByRole('button', { name: 'Restore an existing license' }).click();
  await page.getByLabel('License token').fill('existing-license-fixture');
  const verification = page.waitForRequest(request => request.url() === 'https://api.sociobot.in/api/v1/products/video-code-exit-tickets/verify?license=existing-license-fixture');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await verification;
  await expect(page.getByText('License verified. The checkpoint file builder is ready.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open checkpoint file builder/ })).toBeVisible();
  await page.getByRole('link', { name: /Open checkpoint file builder/ }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download checkpoint JSON' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('run-before-next.manifest.json');
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream!) text += chunk.toString();
  const manifest = JSON.parse(text);
  expect(manifest.version).toBe(1);
  expect(manifest.checkpoints[0].template).toBe('javascript-console-v1');
  expect(manifest.checkpoints[0].expectedOutput).toBe('6, 10, 14');
});

test('@claim:creator-sales-paused does not advertise the unavailable Creator Kit checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="/checkout"]')).toHaveCount(0);
  await expect(page.getByText('Creator Kit sales are paused.')).toBeVisible();
  await expect(page.getByText(/Buy Creator Kit|\$29/)).toHaveCount(0);
});

test('known app routes deep-link while unknown paths return an HTTP 404', async ({ request }) => {
  const routes = {
    '/demo': ['Demo — Run Before Next', 'Try one isolated JavaScript checkpoint with sample lesson data. Demo changes are not saved.'],
    '/creator': ['Checkpoint file builder — Run Before Next', 'Import, validate, edit, reorder, and export lesson checkpoint files in your browser.'],
    '/privacy': ['Privacy — Run Before Next', 'Learn what the Run Before Next extension checks, stores, and sends.'],
    '/terms': ['Terms — Run Before Next', 'Read the terms for using Run Before Next with lesson pages and checkpoint files.']
  } as const;
  for (const [path, [title, description]] of Object.entries(routes)) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain('<div id="app"></div>');
    expect(html, path).toContain(`rel="canonical" href="https://video-code-exit-tickets.sociobot.in${path}"`);
    expect(html, path).toContain(`<title>${title}</title>`);
    expect(html, path).toContain(`name="description" content="${description}"`);
    expect(html, path).toContain(`property="og:title" content="${title}"`);
    expect(html, path).toContain(`property="og:description" content="${description}"`);
    expect(html, path).toContain(`name="twitter:title" content="${title}"`);
    expect(html, path).toContain('rel="apple-touch-icon"');
  }
  const missing = await request.get('/missing-page');
  expect(missing.status()).toBe(404);
  const missingHtml = await missing.text();
  expect(missingHtml).toContain('<title>Page not found — Run Before Next</title>');
  expect(missingHtml).toContain('name="robots" content="noindex"');
});

test('all routes have one h1, a main landmark, and no serious axe findings', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/creator', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Download extension ZIP' })).toBeVisible();
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Try the sample checkpoint' })).toBeVisible();
  await expect(page.getByText('Built by Param Factory ↗')).toBeVisible();
});

test('mobile demo keeps the editor and actions visible at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByLabel('JavaScript')).toBeVisible();
  await expect(page.getByRole('button', { name: /Run check/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('the 390px first screen shows the job, audience, sample action, and 44px key targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const text of [
    'Prove your code before the video continues',
    'For learners using programming lessons whose author added Run Before Next code checks.',
    'Try the sample checkpoint',
    'Works on lessons with an author-provided checkpoint file.'
  ]) {
    const box = await page.getByText(text, { exact: true }).boundingBox();
    expect(box?.y, text).toBeGreaterThanOrEqual(0);
    expect((box?.y || 0) + (box?.height || 0), text).toBeLessThanOrEqual(844);
  }
  await page.getByRole('link', { name: 'Try the sample checkpoint' }).first().click();
  expect(new URL(page.url()).searchParams.get('demo')).toBe('1');
  for (const target of [page.getByRole('button', { name: 'Reset demo' }), page.getByRole('link', { name: 'Start for real' }), page.getByRole('link', { name: 'Run Before Next home' })]) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('@claim:offline-reload demo reloads after the first visit while offline', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    if (!registration.active) throw new Error('Service worker did not activate');
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Change the code before moving on');
});

test('keyboard run, history, internal links, and console stay clean', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const internal = await page.locator('a[href]').evaluateAll(links => [...new Set(links.map(link => (link as HTMLAnchorElement).href).filter(href => new URL(href).origin === location.origin).map(href => new URL(href).pathname))]);
  for (const path of internal) expect((await request.get(path)).status(), path).toBeLessThan(400);
  await page.getByRole('link', { name: 'Demo' }).first().click();
  const editor = page.getByLabel('JavaScript');
  await editor.fill((await editor.inputValue()).replace('* 1', '* 2'));
  await editor.press(process.platform === 'darwin' ? 'Meta+Enter' : 'Control+Enter');
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prove your code before the video continues');
  expect(errors).toEqual([]);
});

test('@claim:demo-exit-isolation discards sample edits on every exit and cannot read extension data', async ({ page }) => {
  await page.goto('/?demo=1');
  const starter = await page.getByLabel('JavaScript').inputValue();
  const passSample = async () => {
    const editor = page.getByLabel('JavaScript');
    await editor.fill(starter.replace('* 1', '* 2'));
    await page.getByRole('button', { name: /Run check/ }).click();
    await expect(page.locator('#demo-state')).toHaveText('Passed');
    await expect(page.locator('#demo-output')).toContainText('6, 10, 14');
  };
  const expectFreshSample = async () => {
    await expect(page.getByLabel('JavaScript')).toHaveValue(starter);
    await expect(page.locator('#demo-state')).toHaveText('Not passed');
    await expect(page.locator('#demo-output')).toContainText('Run the changed code to see its output.');
  };
  const openDemo = async () => {
    await page.getByRole('link', { name: 'Demo' }).first().click();
    await expectFreshSample();
  };

  await passSample();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await openDemo();

  await passSample();
  await page.getByRole('link', { name: 'Run Before Next home' }).click();
  await openDemo();

  await passSample();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await page.goBack();
  await expectFreshSample();

  await passSample();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prove your code before the video continues');
  await page.goForward();
  await expectFreshSample();

  const extensionPath = resolve('.output/chrome-mv3');
  let extensionContext: BrowserContext | undefined;
  try {
    extensionContext = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      headless: true,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    });
    let [serviceWorker] = extensionContext.serviceWorkers();
    if (!serviceWorker) serviceWorker = await extensionContext.waitForEvent('serviceworker');
    const realExtensionData = {
      'progress:https://private.example/lesson:Private lesson': ['private-checkpoint'],
      'private-marker': 'real-extension-data-must-stay-isolated'
    };
    await serviceWorker.evaluate(data => chrome.storage.local.set(data), realExtensionData);
    const extensionPage = await extensionContext.newPage();
    await extensionPage.goto('http://127.0.0.1:4173/?demo=1');
    await expect(extensionPage.locator('body')).not.toContainText(realExtensionData['private-marker']);
    const extensionEditor = extensionPage.getByLabel('JavaScript');
    await extensionEditor.fill((await extensionEditor.inputValue()).replace('* 1', '* 2'));
    await extensionPage.getByRole('button', { name: /Run check/ }).click();
    await expect(extensionPage.locator('#demo-state')).toHaveText('Passed');
    await extensionPage.getByRole('button', { name: 'Reset demo' }).click();
    await expect(extensionPage.locator('#demo-state')).toHaveText('Not passed');
    expect(await serviceWorker.evaluate(() => chrome.storage.local.get(null))).toEqual(realExtensionData);
  } finally {
    await extensionContext?.close();
  }
});

test('history restores visible scroll and invoking focus without moving focus to the h1', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const footerPrivacy = page.locator('[data-focus-key="footer-privacy"]');
  await footerPrivacy.scrollIntoViewIfNeeded();
  await footerPrivacy.click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(footerPrivacy).toBeFocused();
  const box = await footerPrivacy.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
});

test('@claim:sample-manifest-download downloads and validates the documented sample manifest', async ({ page }) => {
  await page.goto('/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download sample checkpoint file' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let body = '';
  for await (const chunk of stream!) body += chunk.toString();
  const checked = validateManifest(JSON.parse(body));
  expect(checked.ok).toBe(true);
  if (checked.ok) expect(checked.manifest).toMatchObject({ version: 1, title: 'JavaScript arrays: change before moving on', checkpoints: [{ id: 'double-prices', at: 47, expectedOutput: '6, 10, 14' }] });
});

test('@claim:manifest-round-trip @claim:manifest-import-recovery imports, edits, reorders, and exports several checkpoints', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license_cache:video-code-exit-tickets', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.goto('/creator');
  await page.getByLabel('Import checkpoint JSON').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await expect(page.locator('#import-status')).toContainText('could not be imported');
  await expect(page.getByLabel('Import checkpoint JSON')).toHaveAttribute('aria-invalid', 'true');

  const imported = {
    version: 1,
    title: 'Two JavaScript checks',
    checkpoints: [
      { id: 'first-check', at: 12, prompt: 'Print one.', template: 'javascript-console-v1', starterCode: 'console.log(0)', expectedOutput: '1' },
      { id: 'second-check', at: 47, prompt: 'Print two.', template: 'javascript-console-v1', starterCode: 'console.log(1)', expectedOutput: '2' }
    ]
  };
  await page.getByLabel('Import checkpoint JSON').setInputFiles({ name: 'two.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await expect(page.locator('.checkpoint-fields')).toHaveCount(2);
  const axe = await new AxeBuilder({ page: page as never }).analyze();
  expect(axe.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Move up' }).last().click();
  await page.getByRole('button', { name: 'Move down' }).first().click();
  await page.getByLabel('Learner prompt').nth(1).fill('Print two after editing.');
  await page.getByRole('button', { name: 'Add checkpoint' }).click();
  await expect(page.locator('.checkpoint-fields')).toHaveCount(3);
  await page.getByRole('button', { name: 'Remove checkpoint' }).last().click();
  await expect(page.locator('.checkpoint-fields')).toHaveCount(2);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download checkpoint JSON' }).click();
  const stream = await (await downloadPromise).createReadStream();
  let body = '';
  for await (const chunk of stream!) body += chunk.toString();
  const exported = JSON.parse(body);
  expect(exported.version).toBe(1);
  expect(exported.title).toBe(imported.title);
  expect(exported.checkpoints).toHaveLength(2);
  expect(exported.checkpoints.map((item: { id: string }) => item.id).sort()).toEqual(['first-check', 'second-check']);
  expect(exported.checkpoints.find((item: { id: string }) => item.id === 'second-check').prompt).toBe('Print two after editing.');
});

test('@claim:extension-flow @claim:source-not-saved @claim:video-pause-gate @claim:sandbox-no-extension-apis @claim:video-local-only @claim:no-manifest-inert extension crosses the marked time and gates a playable video', async () => {
  const extensionPath = resolve('.output/chrome-mv3');
  let context: BrowserContext | undefined;
  try {
    context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      headless: true,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    });
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) serviceWorker = await context.waitForEvent('serviceworker');
    expect(serviceWorker.url()).toContain('chrome-extension://');
    const noManifestPage = await context.newPage();
    const noManifestRequests: string[] = [];
    noManifestPage.on('request', request => { if (request.url().startsWith('http')) noManifestRequests.push(request.url()); });
    await noManifestPage.goto('http://127.0.0.1:4173/no-manifest-fixture.html');
    const originalMarkup = await noManifestPage.locator('body').innerHTML();
    await noManifestPage.waitForTimeout(300);
    await noManifestPage.evaluate(async () => {
      const video = document.querySelector<HTMLVideoElement>('video')!;
      const canvas = document.createElement('canvas');
      const drawing = canvas.getContext('2d')!;
      const draw = () => { drawing.fillStyle = '#c9ff63'; drawing.fillRect(0, 0, 2, 2); requestAnimationFrame(draw); };
      draw();
      video.srcObject = canvas.captureStream(30); video.muted = true; await video.play();
    });
    const before = await noManifestPage.locator('video').evaluate(video => (video as HTMLVideoElement).currentTime);
    await noManifestPage.waitForTimeout(250);
    const after = await noManifestPage.locator('video').evaluate(video => ({ paused: (video as HTMLVideoElement).paused, time: (video as HTMLVideoElement).currentTime }));
    expect(after.paused).toBe(false); expect(after.time).toBeGreaterThan(before);
    await expect(noManifestPage.locator('#run-before-next-root')).toHaveCount(0);
    expect(await noManifestPage.locator('body').innerHTML()).toBe(originalMarkup);
    await expect(noManifestPage.locator('html')).not.toHaveAttribute('data-run-before-next', 'ready');
    expect(await serviceWorker.evaluate(() => chrome.storage.local.get(null))).toEqual({});
    expect(noManifestRequests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
    expect([...new Set(noManifestRequests.map(url => new URL(url).pathname))].sort()).toEqual(['/favicon.svg', '/no-manifest-fixture.html']);
    await noManifestPage.close();

    const page = await context.newPage();
    const httpRequests: string[] = [];
    page.on('request', request => {
      if (request.url().startsWith('http')) httpRequests.push(request.url());
    });
    await page.goto('http://127.0.0.1:4173/extension-fixture.html');
    await expect(page.locator('html')).toHaveAttribute('data-run-before-next', 'ready');
    await page.locator('video').evaluate(async video => {
      const media = video as HTMLVideoElement;
      if (media.readyState < 1) await new Promise(resolve => media.addEventListener('loadedmetadata', resolve, { once: true }));
      media.currentTime = 46.8;
      await new Promise(resolve => media.addEventListener('seeked', resolve, { once: true }));
    });
    const status = await serviceWorker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/extension-fixture.html' });
      return chrome.tabs.sendMessage(tab.id!, { type: 'RBN_STATUS' });
    });
    expect(status).toMatchObject({ active: true, passed: 0, total: 1, hasVideo: true });
    const host = page.locator('#run-before-next-root');
    await expect(host).toHaveCount(0);
    await page.locator('video').evaluate(video => (video as HTMLVideoElement).play());
    await expect(host).toBeAttached();
    await expect(page.locator('video')).toHaveJSProperty('paused', true);
    expect(await page.locator('video').evaluate(video => (video as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(47);
    const editor = host.locator('textarea');
    await expect(page.locator('body')).toHaveJSProperty('inert', true);
    await editor.focus();
    await page.keyboard.press('Tab');
    await expect(host.getByRole('button', { name: /Run check/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(host.getByRole('button', { name: 'Reset code' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(editor).toBeFocused();
    const starter = await editor.inputValue();
    const stoppedAt = await page.locator('video').evaluate(video => (video as HTMLVideoElement).currentTime);
    await page.locator('video').evaluate(video => (video as HTMLVideoElement).play().catch(() => undefined));
    await page.waitForTimeout(700);
    const stillPaused = await page.locator('video').evaluate(video => ({ paused: (video as HTMLVideoElement).paused, currentTime: (video as HTMLVideoElement).currentTime }));
    expect(stillPaused.paused).toBe(true);
    expect(stillPaused.currentTime - stoppedAt).toBeLessThan(0.05);
    await editor.fill('console.log(typeof chrome)');
    await host.getByRole('button', { name: /Run check/ }).click();
    await expect(host.getByText('Output: undefined. Expected: 6, 10, 14.')).toBeVisible();
    await editor.fill('while (true) {}');
    await host.getByRole('button', { name: /Run check/ }).click();
    await expect(host.getByText('The code ran for too long. Check for an endless loop.')).toBeVisible({ timeout: 2500 });
    await editor.fill(starter.replace('* 1', '* 2'));
    await host.getByRole('button', { name: /Run check/ }).click();
    await expect(host.getByText(/Passed\. Output: 6, 10, 14/)).toBeVisible();
    const stored = await serviceWorker.evaluate(() => chrome.storage.local.get(null));
    expect(Object.keys(stored)).toHaveLength(1);
    expect(JSON.stringify(stored)).not.toContain('const prices');
    expect(JSON.stringify(stored)).toContain('double-prices');
    await host.getByRole('button', { name: 'Resume lesson' }).click();
    await expect(host).toHaveCount(0);
    await expect(page.locator('body')).toHaveJSProperty('inert', false);
    expect(httpRequests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  } finally {
    await context?.close();
  }
});
