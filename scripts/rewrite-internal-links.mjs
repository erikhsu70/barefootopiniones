import { readdir, readFile, stat, writeFile } from "node:fs/promises";

const SOURCE = "https://anyasreviews.com";
let changed = 0;

async function findFiles(dir, matcher) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      found.push(...await findFiles(file, matcher));
    } else if (matcher(file)) {
      found.push(file);
    }
  }

  return found;
}

function rewriteUrl(url) {
  if (!url.startsWith(SOURCE)) {
    return url;
  }

  const next = new URL(url);
  if (next.pathname.startsWith("/wp-content/") || next.pathname.startsWith("/go/")) {
    return url;
  }

  return `${next.pathname}${next.search}${next.hash}`;
}

const files = [
  ...await findFiles("src/imported", (file) => file.endsWith(".md")),
  ...await findFiles("src/_data", (file) => file.endsWith(".js"))
];

for (const file of files) {
  await stat(file);
  const raw = await readFile(file, "utf8");
  const next = raw.replace(
    /(href=["'])(https:\/\/anyasreviews\.com[^"']*)(["'])/g,
    (_, before, url, after) => `${before}${rewriteUrl(url)}${after}`
  );

  if (next !== raw) {
    await writeFile(file, next, "utf8");
    changed += 1;
  }
}

console.log(`Rewrote internal links in ${changed} files`);
