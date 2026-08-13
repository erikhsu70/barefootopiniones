import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const assignments = require("../src/_data/modelImageAssignments.js");
const { bySourceSlug } = require("../src/_lib/spanish-urls.js");
const outputRoot = path.resolve(process.env.SITE_OUTPUT_DIR || "dist");
const failures = [];
const uniqueImages = new Set();

for (const [sourceSlug, media] of Object.entries(assignments)) {
  const record = bySourceSlug[sourceSlug];
  if (!record?.to) {
    failures.push(`${sourceSlug}: no tiene artículo público`);
    continue;
  }

  const articleFile = path.join(outputRoot, record.to.replace(/^\/+|\/+$/g, ""), "index.html");
  if (!fs.existsSync(articleFile)) {
    failures.push(`${sourceSlug}: no existe ${record.to}`);
    continue;
  }

  const html = fs.readFileSync(articleFile, "utf8");
  for (const modelImage of [media.featured, ...(media.gallery || [])]) {
    uniqueImages.add(modelImage.src);
    const sourceFile = path.join("src", modelImage.src.replace(/^\//, ""));
    const builtFile = path.join(outputRoot, modelImage.src.replace(/^\//, ""));
    if (!fs.existsSync(sourceFile)) failures.push(`${sourceSlug}: falta ${sourceFile}`);
    if (!fs.existsSync(builtFile)) failures.push(`${sourceSlug}: falta ${builtFile}`);
    if (!html.includes(`src="${modelImage.src}"`) && !html.includes(`src="${modelImage.src}?`)) {
      failures.push(`${sourceSlug}: la página no usa ${modelImage.src}`);
    }
    if (!html.includes(`alt="${modelImage.alt}"`)) failures.push(`${sourceSlug}: falta el alt de ${modelImage.src}`);
  }
}

console.log(`Artículos con imágenes reales: ${Object.keys(assignments).length}`);
console.log(`Imágenes reales distintas: ${uniqueImages.size}`);
console.log(`Errores de asociación: ${failures.length}`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length) process.exitCode = 1;
