import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist/site');
const config = JSON.parse(await (await import('node:fs/promises')).readFile(join(root, 'staticwebapp.config.json'), 'utf8'));
const port = Number(process.env.PORT || 4173);
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8', '.zip': 'application/zip' };

function matches(route, pathname) {
  return route === pathname || (route.endsWith('*') && pathname.startsWith(route.slice(0, -1)));
}

function headersFor(pathname) {
  const route = config.routes?.find((item) => matches(item.route, pathname));
  return { ...config.globalHeaders, ...(route?.headers || {}) };
}

createServer((request, response) => {
  const pathname = new URL(request.url || '/', `http://${request.headers.host}`).pathname;
  const requested = normalize(join(root, decodeURIComponent(pathname)));
  const safe = requested.startsWith(root) && existsSync(requested) && statSync(requested).isFile() ? requested : join(root, 'index.html');
  response.writeHead(200, { ...headersFor(pathname), 'Content-Type': types[extname(safe)] || 'application/octet-stream' });
  createReadStream(safe).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`Production fixture listening on ${port}`));
