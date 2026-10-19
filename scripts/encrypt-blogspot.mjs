// Usage: BLOGSPOT_PASSWORD=... node scripts/encrypt-blogspot.mjs <folder with the three original photos>
// The photos never enter the repo; only the ciphertext in blogspot/index.html does.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const password = process.env.BLOGSPOT_PASSWORD;
const photos = process.argv[2];
if (!password || !photos) {
  console.error('usage: BLOGSPOT_PASSWORD=... node scripts/encrypt-blogspot.mjs <photo folder>');
  process.exit(1);
}

const image = async name => `data:image/jpeg;base64,${(await readFile(path.join(photos, name))).toString('base64')}`;

const blog = `<!-- post text removed from history -->`;

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600000 }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(blog)));
const payload = Buffer.concat([salt, iv, ciphertext]).toString('base64');

const page = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'blogspot', 'index.html');
const html = await readFile(page, 'utf8');
await writeFile(page, html.replace(/const payload = "[^"]*";/, `const payload = "${payload}";`));
console.log(`encrypted ${blog.length} chars into blogspot/index.html`);
