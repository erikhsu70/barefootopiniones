import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = "src/imported/posts";
const titles = {};

for (const filename of fs.readdirSync(root).filter((name) => name.endsWith(".md")).sort()) {
  const repoPath = `${root}/${filename}`;
  let source;
  try {
    source = execFileSync("git", ["show", `HEAD:${repoPath}`], { encoding: "utf8" });
  } catch {
    continue;
  }
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!frontmatter) continue;
  const lines = frontmatter.split("\n");
  const start = lines.findIndex((line) => line.startsWith("title:"));
  if (start === -1) continue;
  let end = start + 1;
  while (end < lines.length && /^\s+/.test(lines[end]) && !/^\s+-\s/.test(lines[end])) end += 1;
  const title = [lines[start].slice("title:".length).trim(), ...lines.slice(start + 1, end).map((line) => line.trim())]
    .join(" ")
    .replace(/^(['"])([\s\S]*)\1$/, "$2");
  titles[path.basename(filename, ".md")] = title;
}

fs.writeFileSync("src/_data/postLegacyTitles.json", `${JSON.stringify(titles, null, 2)}\n`);
console.log(`Títulos históricos capturados: ${Object.keys(titles).length}`);
