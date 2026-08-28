import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resolve } from 'node:path';

test('@claim:demo-pass runs changed code and passes the sample checkpoint', async ({ page }) => {
  const main = await page.request.get('/demo');
  expect(main.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(main.headers()['content-security-policy']).not.toContain("script-src 'self' 'unsafe-eval'");
  await page.goto('/demo');
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
  await page.getByRole('button', { name: /Run check/ }).click();
  await expect(page.locator('#demo-output')).toContainText('The code ran for too long. Check for an endless loop.', { timeout: 2500 });
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

test('production CSP keeps eval out of the app and confines it to the sandbox', async ({ page }) => {
  const [app, sandbox] = await Promise.all([page.request.get('/demo'), page.request.get('/sandbox.html')]);
  expect(app.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(app.headers()['content-security-policy']).not.toContain("'unsafe-eval'");
  expect(sandbox.headers()['content-security-policy']).toContain("script-src 'self' 'unsafe-eval'");
  expect(sandbox.headers()['content-security-policy']).toContain("worker-src blob:");
  expect(sandbox.headers()['content-security-policy']).toContain("connect-src 'none'");
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
  const storage = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
  expect(storage).toEqual({ local: [], session: [] });
});

test('@claim:extension-download downloads the packaged Chrome extension', async ({ page }) => {
  await page.goto('/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download extension' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('run-before-next-chrome.zip');
  const path = await download.path();
  expect(path).toBeTruthy();
});

test('@claim:manifest-export builds and downloads valid manifest JSON', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('sb_license_cache:video-code-exit-tickets', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.goto('/creator');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download manifest JSON' }).click();
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

test('all routes have one h1, a main landmark, and no serious axe findings', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/creator', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
});

test('mobile demo keeps the editor and actions visible at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByLabel('JavaScript')).toBeVisible();
  await expect(page.getByRole('button', { name: /Run check/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('demo reloads after the first visit while offline', async ({ page, context }) => {
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
  await page.getByRole('link', { name: 'Demo' }).click();
  const editor = page.getByLabel('JavaScript');
  await editor.fill((await editor.inputValue()).replace('* 1', '* 2'));
  await editor.press(process.platform === 'darwin' ? 'Meta+Enter' : 'Control+Enter');
  await expect(page.getByText('OUTPUT · PASSED')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Prove your code before the video continues');
  expect(errors).toEqual([]);
});

test('@claim:extension-flow @claim:source-not-saved extension opens the checkpoint and releases it after a passing run', async () => {
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
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/extension-fixture.html');
    await expect(page.locator('html')).toHaveAttribute('data-run-before-next', 'ready');
    const status = await serviceWorker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/extension-fixture.html' });
      return chrome.tabs.sendMessage(tab.id!, { type: 'RBN_STATUS' });
    });
    expect(status).toMatchObject({ active: true, passed: 0, total: 1, hasVideo: true });
    const host = page.locator('#run-before-next-root');
    await serviceWorker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/extension-fixture.html' });
      await chrome.tabs.sendMessage(tab.id!, { type: 'RBN_OPEN' });
    });
    await expect(host).toBeAttached();
    const editor = host.locator('textarea');
    const starter = await editor.inputValue();
    await editor.fill('while (true) {}');
    await host.getByRole('button', { name: /Run check/ }).click();
    await expect(host.getByText('The code ran for too long. Check for an endless loop.')).toBeVisible({ timeout: 2500 });
    await editor.fill(starter.replace('* 1', '* 2'));
    await host.getByRole('button', { name: /Run check/ }).click();
    await expect(host.getByText(/Passed\. Output: 6, 10, 14/)).toBeVisible();
    const stored = await serviceWorker.evaluate(() => chrome.storage.local.get(null));
    expect(JSON.stringify(stored)).not.toContain('const prices');
    expect(JSON.stringify(stored)).toContain('double-prices');
    await host.getByRole('button', { name: 'Resume lesson' }).click();
    await expect(host).toHaveCount(0);
  } finally {
    await context?.close();
  }
});
