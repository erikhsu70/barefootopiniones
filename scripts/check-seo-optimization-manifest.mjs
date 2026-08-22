import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "SEO_OPTIMIZATION_MANIFEST.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];
const activeStatuses = new Set(["QA", "Published"]);

function bodyFromMarkdown(raw) {
  const parts = raw.split(/^---\s*$/m);
  return parts.length >= 3 ? parts.slice(2).join("---") : raw;
}

function plainText(markdown) {
  return markdown
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countLinks(markdown, internal) {
  const links = [...markdown.matchAll(/(?:href=["']|\]\()((?:https?:\/\/|\/)[^"')\s]+)/gi)].map((match) => match[1]);
  return new Set(links.filter((url) => internal
    ? url.startsWith("/") || url.startsWith("https://barefootopiniones.com/")
    : /^https?:\/\//.test(url) && !url.startsWith("https://barefootopiniones.com/"))).size;
}

function fail(page, message) {
  errors.push(`${page.slug}: ${message}`);
}

if (manifest.expectedPages !== manifest.pages.length) {
  errors.push(`Manifest: expectedPages=${manifest.expectedPages}, pages=${manifest.pages.length}`);
}

const urls = manifest.pages.map((page) => page.url);
if (new Set(urls).size !== urls.length) errors.push("Manifest: hay URLs duplicadas");

for (const page of manifest.pages) {
  if (!page.url || !page.slug || !page.status) fail(page, "faltan URL, slug o status");
  if (!activeStatuses.has(page.status)) continue;

  for (const field of ["keywordPrimary", "brand", "model", "category", "wordTarget", "imageTarget", "researchDate", "handsOnEvidence", "sourceFile"]) {
    if (page[field] === "" || page[field] === null || page[field] === undefined) fail(page, `falta ${field}`);
  }
  if ((page.officialSources || []).length < 2) fail(page, "faltan fuentes oficiales");
  if ((page.competitors || []).length !== 3) fail(page, "deben registrarse tres competidores");

  const sourcePath = path.join(root, page.sourceFile);
  if (!fs.existsSync(sourcePath)) {
    fail(page, `no existe ${page.sourceFile}`);
    continue;
  }

  const raw = fs.readFileSync(sourcePath, "utf8");
  const body = bodyFromMarkdown(raw);
  const text = plainText(body);
  const words = text ? text.split(/\s+/).length : 0;
  const h1Frontmatter = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || "";
  const h2 = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => plainText(match[1]));
  const keywordTokens = page.keywordPrimary.toLowerCase().split(/\s+/).filter((token) => token.length > 3 && token !== "opiniones");
  const keywordH2 = h2.filter((heading) => keywordTokens.every((token) => heading.toLowerCase().includes(token))).length;
  const firstWords = text.split(/\s+/).slice(0, 45).join(" ").toLowerCase();

  if (!h1Frontmatter) fail(page, "falta el title que genera el H1");
  if (!keywordTokens.every((token) => firstWords.includes(token)) || !/opini[oó]n|opiniones/.test(firstWords)) fail(page, "la apertura no contiene una variante natural de la keyword");
  if (words < page.wordTarget) fail(page, `word count ${words} < target ${page.wordTarget}`);
  if (h2.length < 8) fail(page, `solo tiene ${h2.length} H2`);
  if (keywordH2 < 2) fail(page, `solo ${keywordH2} H2 contienen una variante fuerte de la keyword`);
  if (!h2.some((heading) => /\b\d+\b/.test(heading))) fail(page, "falta un H2 listicle numerado");
  if ((body.match(/^\|\s*---/gm) || []).length < 2) fail(page, "faltan dos tablas útiles");
  if ((body.match(/<img\b/gi) || []).length < page.imageTarget) fail(page, "no alcanza el imageTarget");
  if (page.videoRequired && !/youtube-nocookie\.com\/embed\//i.test(body)) fail(page, "falta vídeo con privacidad");
  if (countLinks(body, true) < 6) fail(page, "faltan enlaces internos contextuales");
  if (countLinks(body, false) < 6) fail(page, "faltan fuentes externas contextuales");
  if (!/^##\s+Preguntas frecuentes\s*$/mi.test(body)) fail(page, "falta FAQ visible");
  if ((body.match(/^###\s+¿/gm) || []).length < 4) fail(page, "faltan preguntas frecuentes útiles");
  if (!/^autoToc:\s*true\s*$/mi.test(raw)) fail(page, "falta TOC automático");
  if (!/^##\s+C[oó]mo se hizo esta opini[oó]n\s*$/mi.test(body)) fail(page, "falta disclosure de experiencia");
  if (/^##\s+(Fuentes consultadas|Fuentes|Sources)\s*$/mi.test(body)) fail(page, "las fuentes deben estar integradas en el texto");
  if (/\b(previene lesiones|cura el dolor|corrige la pisada|evita lesiones)\b/i.test(body)) fail(page, "contiene una afirmación médica fuerte");

  const outputPath = path.join(root, "dist", page.slug, "index.html");
  if (!fs.existsSync(outputPath)) {
    fail(page, "falta la página en dist; ejecuta el build");
    continue;
  }

  const html = fs.readFileSync(outputPath, "utf8");
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  if (canonical !== page.url) fail(page, `canonical incorrecto: ${canonical || "ausente"}`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) fail(page, "el build no contiene exactamente un H1");
  if (!html.includes("data-article-toc")) fail(page, "el build no contiene TOC");
  if (!/Escrito por Isabel/.test(html)) fail(page, "falta la ficha de autora");
  for (const type of ["BlogPosting", "BreadcrumbList", "FAQPage"]) {
    if (!html.includes(`\"@type\": \"${type}\"`) && !html.includes(`\"@type\":\"${type}\"`)) fail(page, `falta schema ${type}`);
  }
}

if (errors.length) {
  console.error(`SEO campaign check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const counts = manifest.pages.reduce((result, page) => {
  result[page.status] = (result[page.status] || 0) + 1;
  return result;
}, {});
console.log(`SEO campaign: ${manifest.pages.length}/${manifest.expectedPages} URLs registered; ${JSON.stringify(counts)}`);
