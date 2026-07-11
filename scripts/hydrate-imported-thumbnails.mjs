import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IMPORTED_ROOT = path.join(ROOT, "src", "imported");

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

function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizedPath(href) {
  if (!href || href.startsWith("#")) {
    return "";
  }
  try {
    const url = new URL(href, "https://barefootopiniones.com");
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    return "";
  }
}

const files = walk(IMPORTED_ROOT);
const byPermalink = new Map();

for (const file of files) {
  const fm = frontmatter(fs.readFileSync(file, "utf8"));
  const permalink = field(fm, "permalink");
  const image = field(fm, "image");
  const imageAlt = field(fm, "imageAlt");

  if (permalink && image) {
    byPermalink.set(normalizedPath(permalink), {
      image,
      imageAlt: imageAlt || `Imagen destacada de ${field(fm, "title") || "Barefoot Opiniones"}`
    });
  }
}

let updatedFiles = 0;
let insertedImages = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  let next = raw;

  next = next.replace(
    /(<a\b(?=[^>]*class="[^"]*\belementor-post__thumbnail__link\b[^"]*")(?=[^>]*href="([^"]+)")[^>]*>)(\s*)<\/a>/g,
    (match, openTag, href) => {
      const featured = byPermalink.get(normalizedPath(href));
      if (!featured) {
        return match;
      }
      insertedImages += 1;
      return `${openTag}\n<img src="${featured.image}" alt="${escapeAttribute(featured.imageAlt)}" loading="lazy">\n</a>`;
    }
  );

  next = next.replace(
    /(<figure\b(?=[^>]*class="[^"]*\belementor-image-box-img\b[^"]*")[^>]*>\s*<a\b(?=[^>]*href="([^"]+)")[^>]*>)(\s*)<\/a>/g,
    (match, openTag, href) => {
      const featured = byPermalink.get(normalizedPath(href));
      if (!featured) {
        return match;
      }
      insertedImages += 1;
      return `${openTag}\n<img src="${featured.image}" alt="${escapeAttribute(featured.imageAlt)}" loading="lazy">\n</a>`;
    }
  );

  if (next !== raw) {
    fs.writeFileSync(file, next);
    updatedFiles += 1;
  }
}

console.log(`Inserted ${insertedImages} imported thumbnails in ${updatedFiles} files.`);
