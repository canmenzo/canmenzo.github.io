import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist-projects');

for (const name of ['threatintel', 'detkit', 'logibar']) {
  const target = path.join(output, name);
  await mkdir(target, { recursive: true });
  const html = await readFile(path.join(root, 'projects', name, 'index.html'), 'utf8');
  await writeFile(path.join(target, 'index.html'), html);
  for (const directory of ['css', 'fonts']) {
    await cp(path.join(root, directory), path.join(target, directory), { recursive: true });
  }
  await mkdir(path.join(target, 'js'), { recursive: true });
  await cp(path.join(root, 'js', 'theme.js'), path.join(target, 'js', 'theme.js'));
  await cp(path.join(root, 'favicon.ico'), path.join(target, 'favicon.ico'));
  await mkdir(path.join(target, 'assets', 'projects'), { recursive: true });
  const images = [...new Set([...html.matchAll(/src="\/assets\/projects\/([^"]+)"/g)].map(match => match[1]))];
  for (const image of images) {
    await cp(path.join(root, 'assets', 'projects', image), path.join(target, 'assets', 'projects', image));
  }
  await writeFile(path.join(target, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${name}.canmenzo.com/sitemap.xml\n`);
  await writeFile(path.join(target, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://${name}.canmenzo.com/</loc></url></urlset>\n`);
  console.log(`${name}.canmenzo.com -> ${path.relative(root, target)}`);
}
