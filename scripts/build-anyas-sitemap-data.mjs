import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITEMAP_ROOT = "/tmp";
const OUT_FILE = path.join(process.cwd(), "src", "_data", "anyasSitemap.js");
const SOURCE = "https://anyasreviews.com";

const SITEMAPS = [
  { key: "post", file: "post-sitemap.xml", source: "anyas-post-sitemap.xml", title: "Artículos" },
  { key: "page", file: "page-sitemap.xml", source: "anyas-page-sitemap.xml", title: "Páginas" },
  { key: "ufaq", file: "ufaq-sitemap.xml", source: "anyas-ufaq-sitemap.xml", title: "FAQ" },
  { key: "category", file: "category-sitemap.xml", source: "anyas-category-sitemap.xml", title: "Categorías" },
  { key: "post_tag", file: "post_tag-sitemap.xml", source: "anyas-post_tag-sitemap.xml", title: "Etiquetas" },
  { key: "ufaq-category", file: "ufaq-category-sitemap.xml", source: "anyas-ufaq-category-sitemap.xml", title: "Categorías FAQ" },
  { key: "ufaq-tag", file: "ufaq-tag-sitemap.xml", source: "anyas-ufaq-tag-sitemap.xml", title: "Etiquetas FAQ" },
  { key: "age_group", file: "age_group-sitemap.xml", source: "anyas-age_group-sitemap.xml", title: "Grupos de edad" },
  { key: "brand", file: "brand-sitemap.xml", source: "anyas-brand-sitemap.xml", title: "Marcas" },
  { key: "style", file: "style-sitemap.xml", source: "anyas-style-sitemap.xml", title: "Estilos" },
  { key: "author", file: "author-sitemap.xml", source: "anyas-author-sitemap.xml", title: "Autores" }
];

function extractUrlEntries(xml) {
  const entries = [];
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];

  for (const block of blocks) {
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
    if (!loc || !loc.startsWith(SOURCE)) {
      continue;
    }
    const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || "";
    const pathName = new URL(loc).pathname;
    entries.push({
      path: pathName.endsWith("/") ? pathName : `${pathName}/`,
      lastmod
    });
  }

  return entries;
}

function labelFromPath(pathName) {
  const parts = pathName.split("/").filter(Boolean);
  const slug = parts.at(-1) || "inicio";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generatedTitle(group, pathName) {
  if (pathName === "/brand/anyas-shop/") {
    return "Marca";
  }
  if (pathName === "/brand/by-anya/") {
    return "Marca";
  }
  if (pathName === "/ufaq/") {
    return "FAQ";
  }
  const label = labelFromPath(pathName);
  const prefixes = {
    category: "Categoría",
    post_tag: "Etiqueta",
    "ufaq-category": "Categoría FAQ",
    "ufaq-tag": "Etiqueta FAQ",
    age_group: "Grupo",
    brand: "Marca",
    style: "Estilo",
    author: "Autor"
  };
  return `${prefixes[group.key] || group.title}: ${label}`;
}

const groups = [];
const generatedPages = [];

for (const sitemap of SITEMAPS) {
  const xml = await readFile(path.join(SITEMAP_ROOT, sitemap.source), "utf8");
  const urls = extractUrlEntries(xml);
  const group = { ...sitemap, urls };
  groups.push(group);

  if (sitemap.key === "ufaq") {
    const index = urls.find((url) => url.path === "/ufaq/");
    if (index) {
      generatedPages.push({
        group: sitemap.key,
        path: index.path,
        title: generatedTitle(group, index.path),
        description: "Preguntas frecuentes sobre zapatos barefoot, ajuste, transición y cuidado."
      });
    }
    continue;
  }

  if (!["post", "page"].includes(sitemap.key)) {
    for (const url of urls) {
      generatedPages.push({
        group: sitemap.key,
        path: url.path,
        title: generatedTitle(group, url.path),
        description: `Archivo de ${sitemap.title.toLowerCase()} en Barefoot Opiniones.`
      });
    }
  }
}

await mkdir(path.dirname(OUT_FILE), { recursive: true });
await writeFile(
  OUT_FILE,
  `module.exports = ${JSON.stringify({ groups, generatedPages }, null, 2)};\n`,
  "utf8"
);

console.log(`Wrote ${OUT_FILE}`);
console.log(`${groups.reduce((sum, group) => sum + group.urls.length, 0)} sitemap URLs`);
console.log(`${generatedPages.length} generated archive pages`);
