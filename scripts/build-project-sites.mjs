import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist-projects');

for (const name of ['threatintel', 'detkit', 'logibar', 'numbers']) {
  const target = path.join(output, name);
  await mkdir(target, { recursive: true });
  const source = name === 'numbers' ? path.join(root, name) : path.join(root, 'projects', name);
  let html = await readFile(path.join(source, 'index.html'), 'utf8');
  if (name === 'numbers') html = html.replace(/(href|src)="\.\.\//g, '$1="/');
  html = html.replace(/href="(\/|\/projects\/|\/writings\/)"/g, 'href="https://menzo.dev$1"');
  if (name === 'detkit') html = html.replaceAll('/projects/detkit/dashboard/', '/dashboard/');
  await writeFile(path.join(target, 'index.html'), html);
  for (const directory of ['css', 'fonts']) {
    await cp(path.join(root, directory), path.join(target, directory), { recursive: true });
  }
  await mkdir(path.join(target, 'js'), { recursive: true });
  await cp(path.join(root, 'js', 'theme.js'), path.join(target, 'js', 'theme.js'));
  await cp(path.join(root, 'js', 'nav.js'), path.join(target, 'js', 'nav.js'));
  await cp(path.join(root, 'favicon.ico'), path.join(target, 'favicon.ico'));
  await mkdir(path.join(target, 'assets', 'projects'), { recursive: true });
  const images = [...new Set([...html.matchAll(/\/assets\/projects\/([^"?#]+)/g)].map(match => match[1]))];
  for (const image of images) {
    await mkdir(path.dirname(path.join(target, 'assets', 'projects', image)), { recursive: true });
    await cp(path.join(root, 'assets', 'projects', image), path.join(target, 'assets', 'projects', image));
  }
  if (name === 'detkit') {
    await cp(path.join(root, 'projects', name, 'dashboard'), path.join(target, 'dashboard'), { recursive: true });
    for (const page of ['index.html', 'about.html']) {
      const file = path.join(target, 'dashboard', page);
      let dashboard = await readFile(file, 'utf8');
      dashboard = dashboard.replace(/href="(\/|\/projects\/|\/writings\/)"/g, 'href="https://menzo.dev$1"');
      dashboard = dashboard.replaceAll('href="/projects/detkit/"', 'href="/"');
      await writeFile(file, dashboard);
    }
  }
  await writeFile(path.join(target, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${name}.menzo.dev/sitemap.xml\n`);
  const dashboardUrls = name === 'detkit' ? '<url><loc>https://detkit.menzo.dev/dashboard/</loc></url><url><loc>https://detkit.menzo.dev/dashboard/about.html</loc></url>' : '';
  await writeFile(path.join(target, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://${name}.menzo.dev/</loc></url>${dashboardUrls}</urlset>\n`);
  console.log(`${name}.menzo.dev -> ${path.relative(root, target)}`);
}
