import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { bySourceSlug } = require("../src/_lib/spanish-urls.js");
const modelImageAssignments = require("../src/_data/modelImageAssignments.js");

const ROOT = process.cwd();
const POSTS_ROOT = path.join(ROOT, "src", "imported", "posts");
const SRC_ROOT = path.join(ROOT, "src");
const DIST_ROOT = path.resolve(process.env.SITE_OUTPUT_DIR || path.join(ROOT, "dist"));

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

const posts = walk(POSTS_ROOT);
const problems = [];

for (const postPath of posts) {
  const fm = frontmatter(fs.readFileSync(postPath, "utf8"));
  const sourceSlug = field(fm, "sourceSlug") || path.basename(postPath, ".md");
  const modelMedia = modelImageAssignments[sourceSlug];
  const image = modelMedia?.featured?.src || field(fm, "image");
  const imageAlt = modelMedia?.featured?.alt || field(fm, "imageAlt");
  const record = bySourceSlug[sourceSlug];
  const permalink = record?.to || field(fm, "permalink");

  if (record?.retired) continue;

  if (!image) {
    problems.push({ postPath, permalink, problem: "Falta image" });
    continue;
  }

  if (!imageAlt) {
    problems.push({ postPath, permalink, image, problem: "Falta imageAlt" });
  }

  const relativeImage = image.replace(/^\//, "");
  const sourceImage = path.join(SRC_ROOT, relativeImage);
  const distImage = path.join(DIST_ROOT, relativeImage);

  if (!fs.existsSync(sourceImage)) {
    problems.push({ postPath, permalink, image, problem: "No existe en src" });
  }

  if (fs.existsSync(DIST_ROOT) && !fs.existsSync(distImage)) {
    problems.push({ postPath, permalink, image, problem: "No existe en dist" });
  }

  if (fs.existsSync(DIST_ROOT) && permalink) {
    const htmlPath = path.join(DIST_ROOT, permalink.replace(/^\/|\/$/g, ""), "index.html");
    if (!fs.existsSync(htmlPath)) {
      problems.push({ postPath, permalink, image, problem: "No existe HTML en dist" });
    } else {
      const html = fs.readFileSync(htmlPath, "utf8");
      if (!html.includes(`src="${image}"`)) {
        problems.push({ postPath, permalink, image, problem: "La imagen no aparece en el HTML" });
      }
    }
  }
}

if (problems.length) {
  console.error(`Imagenes destacadas incompletas: ${problems.length}`);
  for (const problem of problems.slice(0, 20)) {
    console.error(`- ${path.relative(ROOT, problem.postPath)}: ${problem.problem}${problem.image ? ` (${problem.image})` : ""}`);
  }
  process.exit(1);
}

console.log(`OK: ${posts.length} articulos tienen imagen destacada, alt y archivo existente.`);
