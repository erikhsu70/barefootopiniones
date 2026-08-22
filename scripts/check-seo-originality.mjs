import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("SEO_OPTIMIZATION_MANIFEST.json", "utf8"));
const active = manifest.pages.filter((page) => ["QA", "Published"].includes(page.status) && page.sourceFile);
const occurrences = new Map();

function normalize(value, page) {
  let text = value
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`|~-]/g, " ")
    .toLowerCase();
  for (const term of [page.brand, page.model, page.keywordPrimary].filter(Boolean).sort((a, b) => b.length - a.length)) {
    text = text.replaceAll(term.toLowerCase(), " {producto} ");
  }
  return text.replace(/\s+/g, " ").trim();
}

for (const page of active) {
  const raw = fs.readFileSync(page.sourceFile, "utf8");
  const body = raw.split(/^---\s*$/m).slice(2).join("---");
  for (const block of body.split(/\n\s*\n/)) {
    if (/^(?:#|\||<figure|<div|<iframe|[-*]\s|\d+\.\s)/.test(block.trim())) continue;
    const paragraph = normalize(block, page);
    if (paragraph.length < 180) continue;
    if (!occurrences.has(paragraph)) occurrences.set(paragraph, new Set());
    occurrences.get(paragraph).add(page.slug);
  }
}

const repeated = [...occurrences.entries()].filter(([, pages]) => pages.size >= 3);
if (repeated.length) {
  console.error(`Originality check failed: ${repeated.length} long paragraph(s) repeated in at least three pages.`);
  for (const [paragraph, pages] of repeated.slice(0, 20)) {
    console.error(`- ${[...pages].join(", ")}: ${paragraph.slice(0, 220)}...`);
  }
  process.exit(1);
}

console.log(`Originality check: ${active.length} optimized page(s), 0 long paragraphs repeated in three or more pages.`);
