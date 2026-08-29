import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = (process.argv[2] || 'https://video-code-exit-tickets.sociobot.in').replace(/\/$/, '');
const evidence = process.argv[3] || '.factory/evidence/polish-3';
const expected = {
  '/': 'Run Before Next — Code checks for video lessons',
  '/demo': 'Demo — Run Before Next',
  '/creator': 'Checkpoint file builder — Run Before Next',
  '/privacy': 'Privacy — Run Before Next',
  '/terms': 'Terms — Run Before Next',
  '/missing-page': 'Page not found — Run Before Next'
};

await mkdir(evidence, { recursive: true });
const report = {
  origin: base,
  checkedAt: new Date().toISOString(),
  routes: {},
  accessibility: {
    routesChecked: Object.keys(expected),
    seriousOrCriticalAxeViolations: 0,
    oneH1AndMainPerRoute: true
  },
  mobile: { viewport: '390x844' },
  demo: {},
  focus: {},
  headers: {},
  consoleErrors: [],
  links: {}
};

for (const [path, title] of Object.entries(expected)) {
  const response = await fetch(`${base}${path}`, { headers: { 'cache-control': 'no-cache' } });
  const html = await response.text();
  const metadata = [
    'name="description"',
    'rel="canonical"',
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'name="twitter:title"',
    'name="twitter:description"',
    'rel="icon"',
    'rel="apple-touch-icon"'
  ].every((value) => html.includes(value));
  report.routes[path] = {
    status: response.status,
    title: html.match(/<title>([^<]+)<\/title>/)?.[1],
    metadata,
    ...(path === '/missing-page' ? { noindex: html.includes('name="robots" content="noindex"') } : {})
  };
  if (report.routes[path].title !== title || !metadata) throw new Error(`Cold metadata failed for ${path}`);
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => {
    const isExpected404 = new URL(page.url()).pathname === '/missing-page'
      && message.text().includes('server responded with a status of 404');
    if (message.type() === 'error' && !isExpected404) report.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => report.consoleErrors.push(String(error)));

  for (const [path, title] of Object.entries(expected)) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    const actualStatus = response?.status();
    if (path === '/missing-page' ? actualStatus !== 404 : actualStatus !== 200) {
      throw new Error(`Rendered status failed for ${path}: ${actualStatus}`);
    }
    const routeResult = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      main: document.querySelectorAll('main').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      lang: document.documentElement.lang
    }));
    if (routeResult.title !== title || routeResult.h1 !== 1 || routeResult.main !== 1 || routeResult.overflow || routeResult.lang !== 'en') {
      throw new Error(`Rendered route failed for ${path}: ${JSON.stringify(routeResult)}`);
    }
    const axe = await new AxeBuilder({ page }).analyze();
    report.accessibility.seriousOrCriticalAxeViolations += axe.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    ).length;
  }

  await page.goto(`${base}/?cold=polish-3`, { waitUntil: 'networkidle' });
  const firstScreenTexts = [
    'Prove your code before the video continues',
    'For learners using programming lessons whose author added Run Before Next code checks.',
    'Try the sample checkpoint',
    'Works on lessons with an author-provided checkpoint file.',
    'The sample reloads offline after one online visit.',
    'Learner code is not saved.',
    'The Chrome extension is free.'
  ];
  const positions = {};
  for (const value of firstScreenTexts) {
    const box = await page.getByText(value, { exact: true }).first().boundingBox();
    positions[value] = box;
    if (!box || box.y < 0 || box.y + box.height > 844) {
      throw new Error(`First-screen text is outside the fold: ${value} ${JSON.stringify(box)}`);
    }
  }
  report.mobile = {
    ...report.mobile,
    firstScreenComplete: true,
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    positions
  };
  await page.screenshot({ path: `${evidence}/live-home-mobile.png`, fullPage: true });

  await page.getByRole('link', { name: 'Try the sample checkpoint' }).first().click();
  if (new URL(page.url()).searchParams.get('demo') !== '1') throw new Error('The one-click demo URL did not use ?demo=1');
  await page.getByText('Demo — sample data, nothing is saved', { exact: true }).waitFor();
  await page.screenshot({ path: `${evidence}/live-demo-mobile.png`, fullPage: true });
  const editor = page.getByLabel('JavaScript');
  const starter = await editor.inputValue();
  await editor.fill(starter.replace('* 1', '* 2'));
  await page.getByRole('button', { name: /Run check/ }).click();
  await page.getByText('OUTPUT · PASSED', { exact: true }).waitFor();
  report.demo.sampleOutput = await page.locator('#demo-output p').textContent();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  report.demo.resetFresh = (await editor.inputValue()) === starter && (await page.locator('#demo-state').textContent()) === 'Not passed';

  await editor.fill(starter.replace('* 1', '* 2'));
  await page.getByRole('button', { name: /Run check/ }).click();
  await page.locator('#demo-state').getByText('Passed', { exact: true }).waitFor();
  await page.getByRole('link', { name: 'Run Before Next home' }).click();
  await page.getByRole('link', { name: 'Demo' }).first().click();
  report.demo.wordmarkExitFresh = (await page.getByLabel('JavaScript').inputValue()) === starter
    && (await page.locator('#demo-state').textContent()) === 'Not passed';
  report.demo.bannerPersistent = await page.getByText('Demo — sample data, nothing is saved', { exact: true }).isVisible();
  report.demo.actions = {
    reset: await page.getByRole('button', { name: 'Reset demo' }).isVisible(),
    startForReal: await page.getByRole('link', { name: 'Start for real' }).isVisible()
  };
  report.demo.storage = await page.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    indexed: (await indexedDB.databases()).map((database) => database.name)
  }));

  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  report.demo.offlineReload = (await page.getByRole('heading', { level: 1 }).textContent()) === 'Change the code before moving on';
  await context.setOffline(false);

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const footerPrivacy = page.locator('[data-focus-key="footer-privacy"]');
  await footerPrivacy.scrollIntoViewIfNeeded();
  await footerPrivacy.click();
  report.focus.newRouteFocusesHeading = await page.getByRole('heading', { level: 1 }).evaluate((heading) => document.activeElement === heading);
  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-focus-key') === 'footer-privacy');
  const focusBox = await footerPrivacy.boundingBox();
  report.focus.historyRestoresVisibleInvoker = await footerPrivacy.evaluate((link) => document.activeElement === link)
    && Boolean(focusBox && focusBox.y >= 0 && focusBox.y + focusBox.height <= 844);

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const internal = await page.locator('a[href]').evaluateAll((links, origin) => [
    ...new Set(links
      .map((link) => link.href)
      .filter((href) => new URL(href).origin === origin)
      .map((href) => new URL(href).pathname))
  ], base);
  for (const path of internal) {
    const response = await context.request.get(`${base}${path}`);
    report.links[path] = response.status();
    if (response.status() >= 400) throw new Error(`Dead internal link: ${path}`);
  }

  const homeResponse = await context.request.get(`${base}/`);
  const headers = homeResponse.headers();
  report.headers = {
    cspFrameAncestorsNone: (headers['content-security-policy'] || '').includes("frame-ancestors 'none'"),
    cspObjectSrcNone: (headers['content-security-policy'] || '').includes("object-src 'none'"),
    nosniff: headers['x-content-type-options'] === 'nosniff',
    referrerPolicy: headers['referrer-policy']
  };
  report.demo.sameOriginRequestsOnly = requests.every((raw) => {
    const url = new URL(raw);
    return url.protocol === 'blob:' || url.origin === base;
  });
  report.consoleErrors = [...new Set(report.consoleErrors)];

  if (
    report.accessibility.seriousOrCriticalAxeViolations
    || report.consoleErrors.length
    || !report.mobile.firstScreenComplete
    || report.mobile.horizontalOverflow
    || !report.demo.resetFresh
    || !report.demo.wordmarkExitFresh
    || !report.demo.offlineReload
    || !report.demo.sameOriginRequestsOnly
    || !report.focus.newRouteFocusesHeading
    || !report.focus.historyRestoresVisibleInvoker
    || !report.headers.cspFrameAncestorsNone
    || !report.headers.cspObjectSrcNone
    || !report.headers.nosniff
  ) throw new Error(`Live verification failed: ${JSON.stringify(report)}`);

  await writeFile(`${evidence}/live-cold-check.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
