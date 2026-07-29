import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve("dist");
const sourceCss = path.resolve("src/assets/css/covers.css");
const outputCss = path.join(distRoot, "assets/css/covers.css");
const stylesheet = '<link rel="stylesheet" href="/assets/css/covers.css?v=20260729">';

fs.mkdirSync(path.dirname(outputCss), { recursive: true });
fs.copyFileSync(sourceCss, outputCss);

let updated = 0;

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(file);
      continue;
    }
    if (!entry.name.endsWith(".html")) continue;

    const html = fs.readFileSync(file, "utf8");
    if (!html.includes("/assets/css/lovable.css") || html.includes("/assets/css/covers.css")) continue;

    const next = html.replace(
      /(<link rel="stylesheet" href="\/assets\/css\/lovable\.css[^>]*>)/,
      `$1\n  ${stylesheet}`
    );
    if (next === html) continue;
    fs.writeFileSync(file, next);
    updated += 1;
  }
}

visit(distRoot);
console.log(`Sistema de carátulas aplicado a ${updated} páginas HTML.`);
