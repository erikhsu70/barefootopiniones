import { readdir, readFile, writeFile } from "node:fs/promises";

async function findFiles(dir, matcher) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await findFiles(file, matcher));
    } else if (matcher(file)) {
      files.push(file);
    }
  }

  return files;
}

function localizeOriginalUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}

function clean(raw) {
  let next = raw;

  next = next.replace(/^originalUrl:\s*.*(?:\n|$)/gm, "");
  next = next.replace(/\srel=["']https:\/\/anyasreviews\.com[^"']*["']/gi, "");
  next = next.replace(/origin=https:\/\/anyasreviews\.com/gi, "origin=https://barefootopiniones.com");
  next = next.replace(/info@anyasreviews\.com/gi, "info@barefootopiniones.com");

  next = next.replace(/https:\/\/anyasreviews\.com\/go\/[^"'<\s)]+/gi, "#");
  next = next.replace(/https:\/\/anyasreviews\.com(\/[^"'<\s)]*)?/gi, (match) =>
    localizeOriginalUrl(match)
  );

  next = next.replace(/<a\b([^>]*?)href=["']#["']([^>]*)>([\s\S]*?)<\/a>/gi, "$3");
  next = next.replace(/\n{3,}/g, "\n\n");

  return next;
}

const files = [
  ...await findFiles("src/imported", (file) => file.endsWith(".md")),
  ...await findFiles("src/_data", (file) => file.endsWith(".js"))
];

let changed = 0;
for (const file of files) {
  const raw = await readFile(file, "utf8");
  const next = clean(raw);
  if (next !== raw) {
    await writeFile(file, next, "utf8");
    changed += 1;
  }
}

console.log(`Removed original references in ${changed} files`);
