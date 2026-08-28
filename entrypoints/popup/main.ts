import { browser } from 'wxt/browser';

const title = document.querySelector<HTMLHeadingElement>('#title')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const open = document.querySelector<HTMLButtonElement>('#open')!;

async function load() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) return showEmpty();
  try {
    const result = await browser.tabs.sendMessage(tab.id, { type: 'RBN_STATUS' });
    if (!result?.active) return showEmpty();
    title.textContent = result.title;
    status.textContent = result.hasVideo ? `${result.passed} of ${result.total} checkpoints passed.` : 'The manifest loaded, but this page has no video yet.';
    open.hidden = result.passed >= result.total;
    open.addEventListener('click', async () => { await browser.tabs.sendMessage(tab.id!, { type: 'RBN_OPEN' }); window.close(); });
  } catch { showEmpty(); }
}

function showEmpty() {
  title.textContent = 'No checkpoints on this page';
  status.textContent = 'Open a lesson with a Run Before Next manifest. Nothing is collected here.';
}

void load();
