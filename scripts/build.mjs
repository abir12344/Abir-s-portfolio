// Production build: copies only the files the site actually uses into dist/,
// and fails if any referenced local file is missing.
// No dependencies — runs on Node 18+.
import { readFile, mkdir, copyFile, rm, writeFile, stat } from 'node:fs/promises';
import { dirname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');

// Files that are served but not referenced from the page itself.
const ALWAYS = ['index.html', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'og-image.png', 'Abir.jpg'];

const isLocal = (ref) =>
  ref &&
  !/^(?:[a-z]+:)?\/\//i.test(ref) &&
  !/^(?:data|mailto|tel|javascript):/i.test(ref) &&
  !ref.startsWith('#');

const clean = (ref) => decodeURIComponent(ref.split('#')[0].split('?')[0]).replace(/^\.?\//, '');

const collect = (text, patterns) => {
  const refs = new Set();
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const ref = m[1].trim();
      if (isLocal(ref)) refs.add(clean(ref));
    }
  }
  return refs;
};

const html = await readFile(join(root, 'index.html'), 'utf8');
const files = new Set(ALWAYS);

// <script src>, <link href>, <img src>, <source src>
collect(html, [/<(?:script|img|source)\b[^>]*\bsrc="([^"]+)"/gi, /<link\b[^>]*\bhref="([^"]+)"/gi]).forEach((f) => files.add(f));

// url(...) in CSS
for (const css of [...files].filter((f) => f.endsWith('.css'))) {
  const text = await readFile(join(root, css), 'utf8');
  collect(text, [/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi]).forEach((f) => files.add(join(dirname(css), f)));
}

// Image paths in data.js (image: '...')
if (files.has('data.js')) {
  const text = await readFile(join(root, 'data.js'), 'utf8');
  collect(text, [/\bimage:\s*'([^']+)'/g, /\bimage:\s*"([^"]+)"/g]).forEach((f) => files.add(f));
}

// Verify everything exists before copying anything.
const missing = [];
for (const f of files) {
  const p = normalize(join(root, f));
  if (!p.startsWith(root)) { missing.push(`${f} (outside project)`); continue; }
  try { await stat(p); } catch { missing.push(f); }
}
if (missing.length) {
  console.error('Build failed — referenced files not found:\n  ' + missing.join('\n  '));
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
let bytes = 0;
for (const f of [...files].sort()) {
  const dest = join(out, f);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(join(root, f), dest);
  bytes += (await stat(dest)).size;
}
await writeFile(join(out, '.build-manifest.txt'), [...files].sort().join('\n') + '\n');

console.log(`Built ${files.size} files (${(bytes / 1024).toFixed(0)} KB) → dist/`);
