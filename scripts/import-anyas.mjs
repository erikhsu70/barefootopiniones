import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = "https://anyasreviews.com";
const API = `${SOURCE}/wp-json/wp/v2`;
const OUT_ROOT = path.join(process.cwd(), "src", "imported");
const IMPORTED_AT = new Date().toISOString();

const endpoints = [
  { type: "post", restBase: "posts", dir: "posts", sourceType: "Post" },
  { type: "page", restBase: "pages", dir: "pages", sourceType: "Page" },
  { type: "ufaq", restBase: "ufaq", dir: "faqs", sourceType: "FAQ" }
];

const FIELDS = [
  "id",
  "date",
  "date_gmt",
  "modified",
  "modified_gmt",
  "slug",
  "status",
  "type",
  "link",
  "title",
  "content",
  "excerpt",
  "yoast_head_json"
].join(",");

function decodeEntities(value = "") {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(html = "") {
  return decodeEntities(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function yamlString(value = "") {
  return JSON.stringify(decodeEntities(value));
}

function yamlArray(values = []) {
  return `[${values.map((value) => yamlString(value)).join(", ")}]`;
}

function slugFileName(slug, id) {
  return `${slug || `item-${id}`}.md`.replace(/[^a-z0-9._-]/gi, "-");
}

function permalinkFor(item) {
  const originalPath = new URL(item.link).pathname;
  return originalPath;
}

function firstImageFrom(content = "") {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

function imageAltFrom(content = "") {
  const match = content.match(/<img[^>]+alt=["']([^"']*)["']/i);
  return decodeEntities(match?.[1] || "");
}

function embeddedImage(item) {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url || media?.media_details?.sizes?.large?.source_url || "";
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "BarefootOpinionesImporter/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  const totalPages = Number(response.headers.get("x-wp-totalpages") || "1");
  const total = Number(response.headers.get("x-wp-total") || "0");
  return { data: await response.json(), totalPages, total };
}

async function fetchAll(restBase) {
  const perPage = 50;
  const firstUrl = `${API}/${restBase}?per_page=${perPage}&page=1&_fields=${encodeURIComponent(FIELDS)}`;
  const first = await fetchJson(firstUrl);
  const items = [...first.data];
  console.log(`${restBase}: page 1/${first.totalPages}`);

  for (let page = 2; page <= first.totalPages; page += 1) {
    const url = `${API}/${restBase}?per_page=${perPage}&page=${page}&_fields=${encodeURIComponent(FIELDS)}`;
    const next = await fetchJson(url);
    items.push(...next.data);
    console.log(`${restBase}: page ${page}/${first.totalPages}`);
  }

  return { items, total: first.total };
}

function toMarkdown(item, config) {
  const title = decodeEntities(item.title?.rendered || item.slug || `Item ${item.id}`);
  const content = item.content?.rendered || "";
  const excerpt = stripTags(item.excerpt?.rendered || item.yoast_head_json?.description || "");
  const image = embeddedImage(item) || firstImageFrom(content);
  const imageAlt = imageAltFrom(content) || title;
  const date = item.date_gmt || item.date || IMPORTED_AT;

  return `---
layout: layouts/imported.njk
templateEngineOverride: md
title: ${yamlString(title)}
description: ${yamlString(excerpt)}
date: ${yamlString(date)}
permalink: ${yamlString(permalinkFor(item))}
sourceType: ${yamlString(config.sourceType)}
contentType: ${yamlString(config.sourceType)}
sourceId: ${item.id}
sourceSlug: ${yamlString(item.slug)}
sourceModified: ${yamlString(item.modified_gmt || item.modified || "")}
image: ${yamlString(image)}
imageAlt: ${yamlString(imageAlt)}
tags: ${yamlArray(["englishMirror", config.dir === "posts" ? "importedPosts" : config.dir === "pages" ? "importedPages" : "importedFaqs"])}
---
${content}
`;
}

async function writeItems(config, items) {
  const dir = path.join(OUT_ROOT, config.dir);
  await mkdir(dir, { recursive: true });

  for (const item of items) {
    if (item.content?.protected || item.status !== "publish") {
      continue;
    }

    const filePath = path.join(dir, slugFileName(item.slug, item.id));
    await writeFile(filePath, toMarkdown(item, config), "utf8");
  }
}

async function main() {
  await mkdir(OUT_ROOT, { recursive: true });

  const manifest = {
    source: SOURCE,
    importedAt: IMPORTED_AT,
    endpoints: []
  };

  for (const config of endpoints) {
    const { items, total } = await fetchAll(config.restBase);
    await writeItems(config, items);
    manifest.endpoints.push({
      type: config.type,
      restBase: config.restBase,
      totalFromApi: total,
      written: items.filter((item) => item.status === "publish" && !item.content?.protected).length
    });
    console.log(`${config.sourceType}: wrote ${manifest.endpoints.at(-1).written}/${total}`);
  }

  await writeFile(
    path.join(OUT_ROOT, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
