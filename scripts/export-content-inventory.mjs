import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const blogTopics = require("../src/_data/blogTopics.js");
const postPermalinks = require("../src/_data/postPermalinks.json");
const { contentRecords } = require("../src/_lib/spanish-urls.js");

const root = process.cwd();
const distRoot = path.join(root, "dist");
const csvPath = path.join(root, "CONTENT_INVENTORY.csv");
const markdownPath = path.join(root, "CONTENT_INVENTORY.md");

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function text(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, " y ")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function csv(value) {
  const normalized = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${normalized.replace(/"/g, '""')}"`;
}

function readSchemaGraphs(html) {
  const graphs = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      graphs.push(...(Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed]));
    } catch {
      // Invalid schema is covered by the dedicated schema check.
    }
  }
  return graphs;
}

const sourceSlugsByUrl = new Map();
for (const [slug, url] of Object.entries(postPermalinks)) {
  const normalized = url.startsWith("/") ? url : `/${url}`;
  const slugs = sourceSlugsByUrl.get(normalized) || [];
  slugs.push(slug);
  sourceSlugsByUrl.set(normalized, slugs);
}
for (const record of contentRecords) {
  if (record.section !== "posts" || record.retired || !record.to) continue;
  const slugs = sourceSlugsByUrl.get(record.to) || [];
  if (!slugs.includes(record.sourceSlug)) slugs.push(record.sourceSlug);
  sourceSlugsByUrl.set(record.to, slugs);
}

function topicsFor(article) {
  const sourceSlugs = sourceSlugsByUrl.get(article.url) || [];
  const haystack = [article.url, article.title, article.description, ...sourceSlugs].join(" ").toLowerCase();
  return blogTopics.categories
    .filter((topic) => topic.patterns.some((pattern) => haystack.includes(pattern.toLowerCase())))
    .map((topic) => topic.label);
}

function formatFor(article, topics) {
  const haystack = `${article.url} ${article.title}`.toLowerCase();
  if (topics.includes("Opiniones de marcas") || /\bopini[oó]n\b|\breview\b|\breseña\b/.test(haystack)) return "Opinión";
  if (topics.includes("Listas y comparativas") || /\bmejores\b|\blista\b|\bcomparativa\b/.test(haystack)) return "Lista o comparativa";
  if (/\bgu[ií]a\b|\bc[oó]mo\b|\bpor qu[eé]\b|\bqu[eé] es\b/.test(haystack)) return "Guía";
  return "Artículo";
}

const articlesByUrl = new Map();
for (const file of walk(distRoot).filter((entry) => entry.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  const article = readSchemaGraphs(html).find((node) => node?.["@type"] === "BlogPosting");
  if (!article?.url || !article?.headline) continue;

  let articleUrl;
  try {
    articleUrl = new URL(article.url).pathname;
  } catch {
    continue;
  }

  const record = {
    title: text(article.headline),
    url: articleUrl,
    absoluteUrl: article.url,
    description: text(article.description),
    date: String(article.datePublished || "").slice(0, 10),
    modified: String(article.dateModified || "").slice(0, 10),
    words: Number(article.wordCount || 0)
  };
  record.topics = topicsFor(record);
  record.format = formatFor(record, record.topics);
  articlesByUrl.set(record.url, record);
}

const articles = [...articlesByUrl.values()].sort((a, b) =>
  a.title.localeCompare(b.title, "es", { sensitivity: "base" })
);

const csvRows = [
  ["title", "url", "topics", "primary_topic", "format", "date_published", "date_modified", "word_count", "description"],
  ...articles.map((article) => [
    article.title,
    article.absoluteUrl,
    article.topics.join(" | ") || "Sin clasificar",
    article.topics[0] || "Sin clasificar",
    article.format,
    article.date,
    article.modified,
    article.words,
    article.description
  ])
];
fs.writeFileSync(csvPath, `${csvRows.map((row) => row.map(csv).join(",")).join("\n")}\n`);

const topicGroups = new Map(blogTopics.categories.map((topic) => [topic.label, []]));
topicGroups.set("Sin clasificar", []);
for (const article of articles) {
  const primary = article.topics[0] || "Sin clasificar";
  topicGroups.get(primary).push(article);
}

const formatCounts = new Map();
for (const article of articles) formatCounts.set(article.format, (formatCounts.get(article.format) || 0) + 1);
const topicCoverage = new Map(
  blogTopics.categories.map((topic) => [
    topic.label,
    articles.filter((article) => article.topics.includes(topic.label)).length
  ])
);

const markdown = [
  "# Inventario de contenido de BarefootOpiniones",
  "",
  `Generado desde la web estática publicada. Total: **${articles.length} artículos únicos**.`,
  "",
  "El CSV `CONTENT_INVENTORY.csv` incluye título, URL canónica, temáticas, formato, fechas, número de palabras y descripción.",
  "",
  "## Resumen por temática principal",
  "",
  "La columna de cobertura cuenta también los artículos que encajan en varias temáticas.",
  "",
  "| Temática | Principal | Cobertura total |",
  "|---|---:|---:|",
  ...[...topicGroups].map(([topic, items]) =>
    `| ${topic} | ${items.length} | ${topicCoverage.get(topic) ?? items.length} |`
  ),
  "",
  "## Resumen por formato",
  "",
  "| Formato | Artículos |",
  "|---|---:|",
  ...[...formatCounts].sort((a, b) => b[1] - a[1]).map(([format, count]) => `| ${format} | ${count} |`),
  "",
  "## Contenido por temática principal",
  ""
];

for (const [topic, items] of topicGroups) {
  markdown.push(`### ${topic} (${items.length})`, "");
  for (const article of items) {
    markdown.push(`- [${article.title}](${article.absoluteUrl}) (${article.words.toLocaleString("es-ES")} palabras)`);
  }
  markdown.push("");
}

fs.writeFileSync(markdownPath, `${markdown.join("\n")}\n`);
console.log(`Inventario exportado: ${articles.length} artículos únicos.`);
console.log(path.relative(root, csvPath));
console.log(path.relative(root, markdownPath));
