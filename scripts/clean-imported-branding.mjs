import { readdir, readFile, writeFile } from "node:fs/promises";

async function findMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await findMarkdown(file));
    } else if (entry.name.endsWith(".md")) {
      files.push(file);
    }
  }

  return files;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return [{}, raw, ""];
  }
  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    return [{}, raw, ""];
  }
  return [raw.slice(0, end + 4), raw.slice(end + 4).replace(/^\n/, ""), raw.slice(0, end + 4)];
}

function cleanFrontmatter(frontmatter) {
  return frontmatter
    .replace(/^image:[\s\S]*?(?=^[A-Za-z][A-Za-z0-9_-]*:|^---$)/gm, 'image: ""\n')
    .replace(/^imageAlt:[\s\S]*?(?=^[A-Za-z][A-Za-z0-9_-]*:|^---$)/gm, 'imageAlt: ""\n')
    .replace(/Anya'?s Shop/g, "")
    .replace(/Anya’s Shop/g, "")
    .replace(/Isabel'?s Shop/g, "")
    .replace(/Isabel’s Shop/g, "")
    .replace(/Anyas Shop/g, "")
    .replace(/Anya's Reviews/g, "Barefoot Opiniones")
    .replace(/Anya’s Reviews/g, "Barefoot Opiniones")
    .replace(/Reseñas de Anya/g, "Barefoot Opiniones")
    .replace(/Comentarios de Anya/g, "Barefoot Opiniones")
    .replace(/Soy Anya/g, "Soy Isabel")
    .replace(/Hola\. Soy Anya\./g, "Hola. Soy Isabel.")
    .replace(/\bANYASREVIEWS\b/g, "")
    .replace(/\bAnyasReviews\b/g, "")
    .replace(/\bASTRALxAnyas\b/g, "ASTRAL")
    .replace(/\bAnyas\b/g, "")
    .replace(/\bAnya\b/g, "Isabel");
}

function cleanContent(content) {
  let next = content;

  next = next.replace(/<img\b[^>]*>/gi, "");
  next = next.replace(/<source\b[^>]*>/gi, "");
  next = next.replace(/<picture\b[^>]*>\s*<\/picture>/gi, "");
  next = next.replace(/<figure\b[^>]*>\s*<\/figure>/gi, "");
  next = next.replace(/<div\b[^>]*>\s*<\/div>/gi, "");
  next = next.replace(/\s(?:src|srcset|sizes)=["'][^"']*anyasreviews\.com\/wp-content[^"']*["']/gi, "");
  next = next.replace(/https:\/\/anyasreviews\.com\/wp-content\/[^"' )<]+/gi, "");

  next = next.replace(/<a\b[^>]*href=["'][^"']*anyas-shop\.com[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "");
  next = next.replace(/<a\b[^>]*href=["'][^"']*AnyasReviews[^"']*["'][^>]*>([\s\S]*?)<\/a>/g, "$1");
  next = next.replace(/<a\b[^>]*href=["'][^"']*anyasreview[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, "$1");
  next = next.replace(/<a\b[^>]*href=["']https:\/\/anyasreviews\.com\/go\/[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "");
  next = next.replace(/<p\b[^>]*>[\s\S]*?(?:nuestra tienda|Isabel'?s Shop|Isabel’s Shop|anyas-shop\.com)[\s\S]*?<\/p>/gi, "");
  next = next.replace(/<li\b[^>]*>[\s\S]*?(?:nuestra tienda|Isabel'?s Shop|Isabel’s Shop|anyas-shop\.com)[\s\S]*?<\/li>/gi, "");
  next = next.replace(/<div\b[^>]*>\s*(?:<[^>]+>\s*)*[^<]*(?:Mira nuestra tienda|Anya'?s Shop|Anyas Shop|nuestra tienda)[\s\S]*?<\/div>/gi, "");

  next = next
    .replace(/Anya'?s Shop/g, "")
    .replace(/Anya’s Shop/g, "")
    .replace(/Anyas Shop/g, "")
    .replace(/Isabel'?s Shop/g, "")
    .replace(/Isabel’s Shop/g, "")
    .replace(/Isabel’ Shop/g, "")
    .replace(/Anya's Reviews/g, "Barefoot Opiniones")
    .replace(/Anya’s Reviews/g, "Barefoot Opiniones")
    .replace(/Reseñas de Anya/g, "Barefoot Opiniones")
    .replace(/Comentarios de Anya/g, "Barefoot Opiniones")
    .replace(/Soy Anya/g, "Soy Isabel")
    .replace(/Hola\. Soy Anya\./g, "Hola. Soy Isabel.")
    .replace(/\bAnya\b/g, "Isabel")
    .replace(/¡Mira nuestra tienda!/g, "")
    .replace(/Mira nuestra tienda/g, "")
    .replace(/\bANYASREVIEWS\b/g, "")
    .replace(/\bAnyasReviews\b/g, "")
    .replace(/\bASTRALxAnyas\b/g, "ASTRAL")
    .replace(/\bAnyas\b/g, "")
    .replace(/\bANYA([A-Z0-9_-]*)\b/g, "");

  next = next.replace(/\n{3,}/g, "\n\n");

  return next;
}

let changed = 0;
for (const file of await findMarkdown("src/imported")) {
  const raw = await readFile(file, "utf8");
  const [frontmatter, content] = splitFrontmatter(raw);
  const next = `${cleanFrontmatter(frontmatter)}\n${cleanContent(content)}`;

  if (next !== raw) {
    await writeFile(file, next, "utf8");
    changed += 1;
  }
}

console.log(`Cleaned imported branding in ${changed} files`);
