import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist/site');
const shell = await readFile(join(root, 'index.html'), 'utf8');
const origin = 'https://video-code-exit-tickets.sociobot.in';
const videoBase64 = await readFile(join(process.cwd(), 'site/public/fixture-50s.mp4.b64'), 'utf8');
await writeFile(join(root, 'fixture-50s.mp4'), Buffer.from(videoBase64.trim(), 'base64'));
await unlink(join(root, 'fixture-50s.mp4.b64'));

const routes = {
  demo: ['Demo — Run Before Next', 'Try one isolated JavaScript checkpoint with sample lesson data. Demo changes are not saved.'],
  creator: ['Checkpoint file builder — Run Before Next', 'Import, validate, edit, reorder, and export lesson checkpoint files in your browser.'],
  privacy: ['Privacy — Run Before Next', 'Learn what the Run Before Next extension checks, stores, and sends.'],
  terms: ['Terms — Run Before Next', 'Read the terms for using Run Before Next with lesson pages and checkpoint files.']
};

function metadata(html, path, title, description, noindex = false) {
  const canonical = `${origin}/${path}`;
  let output = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`);
  if (noindex) output = output.replace('</head>', '    <meta name="robots" content="noindex">\n  </head>');
  return output;
}

for (const [path, [title, description]] of Object.entries(routes)) {
  const directory = join(root, path);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), metadata(shell, path, title, description));
}

const notFound = metadata(shell, '404.html', 'Page not found — Run Before Next', 'This Run Before Next address does not exist. Return home or try the sample checkpoint.', true);
await writeFile(join(root, '404.html'), notFound);
