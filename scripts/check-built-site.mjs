import fs from "node:fs";
import path from "node:path";

const DIST_ROOT = path.resolve(process.env.SITE_OUTPUT_DIR || "dist");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const htmlFiles = walk(DIST_ROOT).filter((file) => file.endsWith(".html"));
const brokenLinks = new Map();
const shortArticles = [];
const editorialLeaks = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");

  for (const match of html.matchAll(/href=["']([^"'#]+)["']/g)) {
    const href = match[1].split(/[?#]/)[0];
    if (!href.startsWith("/") || href.startsWith("//")) continue;

    let target = path.join(DIST_ROOT, href.replace(/^\//, ""));
    if (href.endsWith("/")) target = path.join(target, "index.html");
    if (fs.existsSync(target)) continue;

    if (!brokenLinks.has(href)) brokenLinks.set(href, []);
    if (brokenLinks.get(href).length < 3) brokenLinks.get(href).push(path.relative(DIST_ROOT, file));
  }

  if (!html.includes("Contenido editado / Artículo")) continue;
  const body = html.match(/<div class="article-body imported-content"[^>]*>([\s\S]*?)<aside class="article-author-card"/i)?.[1] || "";
  if (/segunda revisi[oó]n editorial/i.test(stripHtml(body))) {
    editorialLeaks.push(path.relative(DIST_ROOT, file));
  }
  const words = stripHtml(body).split(/\s+/).filter(Boolean).length;
  if (words < 1200) shortArticles.push({ file: path.relative(DIST_ROOT, file), words });
}

console.log(`HTML revisados: ${htmlFiles.length}`);
console.log(`Enlaces internos rotos: ${brokenLinks.size}`);
console.log(`Artículos publicados por debajo de 1200 palabras: ${shortArticles.length}`);
console.log(`Artículos con instrucciones editoriales filtradas: ${editorialLeaks.length}`);

for (const [href, sources] of [...brokenLinks].slice(0, 25)) {
  console.error(`- ${href} <- ${sources.join(", ")}`);
}
for (const article of shortArticles.slice(0, 25)) {
  console.error(`- ${article.file}: ${article.words} palabras`);
}
for (const file of editorialLeaks.slice(0, 25)) {
  console.error(`- ${file}: contiene "Segunda revisión editorial"`);
}

if (brokenLinks.size || shortArticles.length || editorialLeaks.length) process.exit(1);
