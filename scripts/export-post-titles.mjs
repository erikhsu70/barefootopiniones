import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const POSTS_ROOT = path.join(ROOT, "src", "imported", "posts");
const OUT_FILE = path.join(ROOT, "docs", "post-titles.md");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(entryPath);
    }
    return entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function frontmatter(raw) {
  return raw.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
}

function field(frontmatterText, key) {
  const match = frontmatterText.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?`, "m"));
  return match?.[1]?.trim() || "";
}

const posts = walk(POSTS_ROOT)
  .map((postPath) => {
    const fm = frontmatter(fs.readFileSync(postPath, "utf8"));
    return {
      title: field(fm, "title"),
      permalink: field(fm, "permalink"),
      date: field(fm, "date").replace(/^'|'$/g, ""),
      file: path.relative(ROOT, postPath)
    };
  })
  .filter((post) => post.title && post.permalink)
  .sort((a, b) => a.title.localeCompare(b.title, "es"));

const lines = [
  "# Titles de todos los posts",
  "",
  `Total: ${posts.length} posts importados.`,
  "",
  "| # | Title | URL | Fecha |",
  "|---:|---|---|---|",
  ...posts.map((post, index) => {
    const safeTitle = post.title.replace(/\|/g, "\\|");
    return `| ${index + 1} | ${safeTitle} | ${post.permalink} | ${post.date.slice(0, 10)} |`;
  }),
  ""
];

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, lines.join("\n"));

console.log(`Exported ${posts.length} post titles to ${path.relative(ROOT, OUT_FILE)}`);
