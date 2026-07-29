import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { contentRecords } = require("../src/_lib/spanish-urls.js");
const oldPermalinks = require("../src/_data/postPermalinks.json");
const outputRoot = process.env.SITE_OUTPUT_DIR || "dist";

const forbiddenTokens = new Set([
  "best", "boot", "boots", "clogs", "dress", "fall", "guide", "hiking", "kids",
  "men", "mens", "review", "reviews", "running", "sandals", "shoe", "shoes",
  "sneakers", "spring", "summer", "walking", "wide", "winter", "women", "womens"
]);

const posts = contentRecords.filter((record) => record.section === "posts" && !record.retired);
const englishUrls = posts.filter((record) => {
  const tokens = record.to.split(/[\/-]/).filter(Boolean);
  return tokens.some((token) => forbiddenTokens.has(token));
});

const missingRedirects = [];
for (const post of posts) {
  const oldUrl = oldPermalinks[post.sourceSlug];
  if (!oldUrl || oldUrl === post.to) continue;
  const redirectFile = path.join(outputRoot, oldUrl.replace(/^\/+|\/+$/g, ""), "index.html");
  if (!fs.existsSync(redirectFile)) {
    missingRedirects.push(`${oldUrl} -> ${post.to}`);
    continue;
  }
  const html = fs.readFileSync(redirectFile, "utf8");
  if (!html.includes(`url=${post.to}`) || !html.includes(`href="https://barefootopiniones.com${post.to}"`)) {
    missingRedirects.push(`${oldUrl} -> ${post.to}`);
  }
}

console.log(`URLs de artículos revisadas: ${posts.length}`);
console.log(`URLs con términos ingleses: ${englishUrls.length}`);
console.log(`Redirecciones históricas ausentes: ${missingRedirects.length}`);

for (const record of englishUrls) console.error(`- ${record.to}`);
for (const redirect of missingRedirects) console.error(`- ${redirect}`);

if (englishUrls.length || missingRedirects.length) process.exitCode = 1;
