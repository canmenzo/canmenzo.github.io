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

const blog = `
<div id="header"><h1 id="blog-title">Mehmet Can Ozmen</h1></div>
<div id="description"><p><em>Babam geldiiiiiiiiii Ben çok Mutluyum.Okullarda sonunda açıldı.</em></p></div>
<div id="content">
  <div id="main"><div id="main2">
    <h2 class="date-header">Sunday, February 12, 2006</h2>
    <div class="post" id="113978484921440163">
      <div class="post-body">
        <img alt="" src="${await image('Image(374).jpg')}">
        <span style="color:#ff0000;">Bizim evin spiderman'i canım can.</span><br>
        <img alt="" src="${await image('Image(375).jpg')}">
        <span style="color:#3333ff;">İşte burdaaaaaaaaaaayım!!!!!!!!! </span>
      </div>
      <p class="post-footer"><em>posted by MEHMET CAN OZMEN at <a href="#113978484921440163">12:47 AM</a></em> | 0 comments</p>
    </div>
    <h2 class="date-header">Friday, January 27, 2006</h2>
    <div class="post" id="113839225672372911">
      <div class="post-body">
        <img alt="" src="${await image('DSC00091.0.jpg')}">
        CANIM ve BEN
      </div>
      <p class="post-footer"><em>posted by MEHMET CAN OZMEN at <a href="#113839225672372911">11:59 AM</a></em> | 0 comments</p>
    </div>
  </div></div>
  <div id="sidebar"><div id="sidebar2">
    <h2 class="sidebar-title">About Me</h2>
    <dl class="profile-datablock">
      <dd>MEHMET CAN OZMEN</dd>
      <dd>izmir, turkey, Türkiye</dd>
    </dl>
    <h2 class="sidebar-title">Links</h2>
    <ul>
      <li><a href="https://news.google.com/">Google News</a></li>
      <li>Edit-Me</li>
      <li>Edit-Me</li>
    </ul>
    <h2 class="sidebar-title">Previous Posts</h2>
    <ul>
      <li><a href="#113978484921440163">Bizim evin spiderman'i canım can.İşte burdaaaaaaaa...</a></li>
      <li><a href="#113839225672372911">CANIM ve BEN</a></li>
    </ul>
    <h2 class="sidebar-title">Archives</h2>
    <ul>
      <li>January 2006</li>
      <li>February 2006</li>
    </ul>
    <p>Powered by Blogger</p>
  </div></div>
</div>`;

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
