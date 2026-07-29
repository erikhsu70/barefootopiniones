import fs from "node:fs";

const origin = process.argv[2];
if (!origin) throw new Error("Indica el origen del despliegue que se debe conservar.");

const sitemapResponse = await fetch(`${origin}/post-sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`No se pudo leer el sitemap: ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]+)<\/loc>/g)].map((match) => match[1]);
const mapping = {};
let cursor = 0;

async function worker() {
  while (cursor < paths.length) {
    const pathname = paths[cursor++];
    const response = await fetch(`${origin}${pathname}`);
    if (!response.ok) continue;
    const html = await response.text();
    const slug = html.match(/\/assets\/generated\/featured\/posts\/([^/"']+)\.(?:jpg|jpeg|png|webp)/i)?.[1];
    if (slug && !mapping[slug]) mapping[slug] = pathname;
  }
}

await Promise.all(Array.from({ length: 12 }, worker));
const ordered = Object.fromEntries(Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync("src/_data/postPermalinks.json", `${JSON.stringify(ordered, null, 2)}\n`);
console.log(`URLs del sitemap: ${paths.length}`);
console.log(`Permalinks de artículos capturados: ${Object.keys(ordered).length}`);
