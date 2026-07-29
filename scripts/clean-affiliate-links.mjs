import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { sanitizeAffiliateLinks } = require("../src/_lib/affiliate-links.js");
const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const contentRoots = ["src/imported", "src/posts"];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const files = contentRoots
  .flatMap((directory) => walk(path.join(root, directory)))
  .filter((file) => file.endsWith(".md"));

const changedFiles = [];
for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const cleaned = sanitizeAffiliateLinks(original);
  if (cleaned === original) continue;
  changedFiles.push(path.relative(root, file));
  if (!checkOnly) fs.writeFileSync(file, cleaned);
}

if (checkOnly && changedFiles.length) {
  console.error(`Enlaces de afiliación pendientes en ${changedFiles.length} archivos:`);
  for (const file of changedFiles.slice(0, 30)) console.error(`- ${file}`);
  process.exitCode = 1;
} else if (checkOnly) {
  console.log("OK: no quedan enlaces de afiliación en el contenido.");
} else {
  console.log(`Archivos limpiados: ${changedFiles.length}`);
}
