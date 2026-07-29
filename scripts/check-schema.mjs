import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve(process.env.SITE_OUTPUT_DIR || "dist");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

const failures = [];
const htmlFiles = walk(distRoot).filter((file) => file.endsWith(".html"));
let graphs = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  if (html.includes('name="robots" content="noindex, follow"')) continue;
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) {
    failures.push(`${path.relative(distRoot, file)}: ${blocks.length} bloques JSON-LD`);
    continue;
  }

  try {
    const data = JSON.parse(blocks[0][1]);
    const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [];
    const types = new Set(nodes.flatMap((node) => Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
    for (const required of ["Organization", "Person", "WebSite", "BreadcrumbList"]) {
      if (!types.has(required)) failures.push(`${path.relative(distRoot, file)}: falta ${required}`);
    }
    if (types.has("BlogPosting")) {
      const article = nodes.find((node) => node["@type"] === "BlogPosting");
      if (!article.author?.["@id"] || !article.publisher?.["@id"] || !article.headline || !article.image) {
        failures.push(`${path.relative(distRoot, file)}: BlogPosting incompleto`);
      }
    }
    if (types.has("ProfilePage")) {
      const profile = nodes.find((node) => node["@type"] === "ProfilePage");
      if (!profile.mainEntity?.["@id"]) failures.push(`${path.relative(distRoot, file)}: ProfilePage sin mainEntity`);
    }
    if (types.has("FAQPage")) {
      const faq = nodes.find((node) => node["@type"] === "FAQPage");
      if (!faq.mainEntity?.[0]?.acceptedAnswer?.text) failures.push(`${path.relative(distRoot, file)}: FAQPage sin respuesta`);
    }
    graphs += 1;
  } catch (error) {
    failures.push(`${path.relative(distRoot, file)}: JSON-LD inválido (${error.message})`);
  }
}

console.log(`Grafos Schema.org validados: ${graphs}`);
console.log(`Errores de datos estructurados: ${failures.length}`);
for (const failure of failures.slice(0, 50)) console.error(`- ${failure}`);
if (failures.length) process.exit(1);
