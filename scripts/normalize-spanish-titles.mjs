import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { contentRecords } = require("../src/_lib/spanish-urls.js");

const overrides = {
  "10-best-stylish-barefoot-sandals-for-women": "Las mejores sandalias barefoot con estilo para mujer",
  "15-barefoot-sneakers-that-are-better-than-vans": "15 zapatillas barefoot con más espacio que unas Vans",
  "affordable-barefoot-minimalist-shoes": "Lista completa de calzado barefoot y minimalista asequible",
  "affordable-barefoot-shoes-for-kids": "Calzado barefoot asequible para niños y todos los presupuestos",
  "bahe-barefoot-running-walking-shoes-grounding": "Bahe: zapatillas barefoot para correr y caminar con conexión a tierra",
  "barefoot-boots-top-picks": "Mis botas barefoot favoritas",
  "barefoot-dress-shoes-for-kids": "20 zapatos barefoot de vestir para niños",
  "barefoot-loafers-that-dont-pinch-your-toes": "Los mejores mocasines barefoot que no aprietan los dedos",
  "barefoot-minimalist-dress-shoes-women": "Lista completa de zapatos barefoot de vestir para mujer",
  "barefoot-sandals-brand-review": "Mi opinión sobre seis marcas de sandalias barefoot",
  "barefoot-sandals-top-picks": "Mis sandalias barefoot favoritas",
  "belenka-icon-review": "Be Lenka Icon opiniones en 2026: tallas y alternativas actuales",
  "benefits-barefoot-minimalist-shoes": "¿Puede el calzado barefoot ayudar con el dolor de pies?",
  "best-barefoot-minimalist-kids-shoes": "El mejor calzado barefoot para niños según temporada y presupuesto",
  "best-barefoot-minimalist-shoe-brands": "Las mejores marcas de calzado barefoot y minimalista",
  "best-barefoot-shoes-foot-type": "Las mejores marcas de calzado barefoot según tu tipo de pie",
  "best-zero-drop-barefoot-combat-boots": "Las mejores botas militares barefoot con puntera ancha",
  "better-than-birkenstocks-the-sandals-im-wearing-instead": "Alternativas barefoot a las sandalias Birkenstock",
  "boat-shoes-but-with-a-wide-toe-box": "Zapatos náuticos con puntera ancha",
  "bohempia-review-time-to-throw-away-your-converse-vans": "Bohempia opiniones 2026: tallas y alternativas barefoot a Vans",
  "carets-victoria-wingtip-minimalist-womens-brogue": "Carets Victoria Wingtip: un zapato brogue minimalista para mujer",
  "chala-sandals-review-classic-barefoot-sandals": "Mi opinión sobre Chala: sandalias barefoot clásicas",
  "correct-toes-review": "Mi opinión sobre Correct Toes: ¿merecen la pena?",
  "crupon-barefoot-sandals-for-the-perfect-vintage-look": "Sandalias barefoot Crupon con estilo vintage",
  "cycling-shoes-but-foot-shaped-strong-feet-athletics-review": "Mi opinión sobre Strong Feet Athletics: zapatillas de ciclismo con horma anatómica",
  "davinci-footwear-review": "Mi opinión sobre DaVinci Footwear: calzado barefoot elegante",
  "ditch-these-popular-shoes-for-comfortable-barefoot": "Alternativas barefoot cómodas a cinco zapatos populares",
  "earthing-moccasins-review-barefoot-shoes-you-can-make-yourself": "Mi opinión sobre Earthing Moccasins: mocasines barefoot para hacer en casa",
  "fall-fashion-edit-barefoot-shoes-youll-get-compliments-on": "Zapatos barefoot de otoño que elevan cualquier look",
  "feelgrounds-highrise-review": "Mi opinión sobre Feelgrounds Highrise",
  "fun-funky-but-make-it-barefoot-shoes": "Calzado barefoot original y lleno de color",
  "gait-analysis-how-to-move-without-pain": "Qué aprendí de un análisis de la marcha para moverme sin dolor",
  "getting-to-know-the-experts-from-natural-footgear": "Conoce a los expertos de Natural Footgear",
  "groundies-liverprool-gx1-boots-a-mini-review": "Mi opinión sobre las botas Groundies Liverpool GX1",
  "holiday-party-looks-but-make-it-barefoot-shoes": "Looks de fiesta con zapatos barefoot",
  "lems-chelsea-boots-like-blundstones-but-better": "Botas Lems Chelsea como alternativa barefoot a Blundstone",
  "like-clogs-but-make-it-barefoot-shoes": "Los mejores zuecos barefoot con puntera amplia",
  "lisbeth-joe-london-review-barefoot-loafers": "Mi opinión sobre Lisbeth Joe London: mocasines barefoot con estilo",
  "little-love-bug-review": "Mi opinión sobre Little Love Bug: calzado infantil asequible y respetuoso",
  "magical-shoes-ballerina-review": "Mi opinión sobre las bailarinas barefoot de Magical Shoes",
  "minimalist-summer-sandals": "Lista completa de sandalias barefoot para el verano de 2026",
  "new-wide-but-not-barefoot-sneakers-from-tolos": "Nuevas zapatillas Tolos con puntera ancha y suela amortiguada",
  "nons-review-charming-barefoot-shoe-brand": "Mi opinión sobre No(N)s: una marca barefoot con mucho encanto",
  "paperkrane-barefoot-shoes-with-spunk": "PaperKrane: calzado barefoot con personalidad",
  "pretty-spring-shoes-but-make-it-barefoot-part-2": "Zapatos barefoot bonitos para primavera: segunda parte",
  "replace-your-high-heels-with-these-fancy-barefoot-shoes": "Alternativas barefoot elegantes a los tacones altos",
  "shamma-sandals-review-barefoot-running": "Mi opinión sobre las sandalias Shamma para correr",
  "softstar-camino-comfort-sandals-for-the-barefoot-shoe-wearer": "Softstar Camino: sandalias cómodas para quienes usan calzado barefoot",
  "spring-2026-favorites-but-make-it-barefoot-shoes": "Mis zapatos barefoot favoritos para la primavera de 2026",
  "spring-fashion-but-make-it-barefoot-shoes": "Zapatos barefoot de primavera para caminar con comodidad",
  "spring-style-but-make-it-barefoot-shoes-2026": "Los zapatos barefoot que más me ilusionan para la primavera de 2026",
  "summer-style-but-make-it-barefoot-shoes": "Ideas de estilo para llevar zapatos barefoot en verano",
  "swap-these-popular-brands-for-barefoot-shoes-your-feet-will-thank-you": "Alternativas barefoot a varias marcas de calzado populares",
  "ten-little-kids-rain-boots-review-affordable-barefoot-rubber-boots": "Mi opinión sobre Ten Little: botas de lluvia barefoot asequibles para niños",
  "the-best-barefoot-slip-on-shoes": "Los mejores zapatos barefoot sin cordones para el día a día",
  "the-best-shoes-for-extra-wide-feet": "Los mejores zapatos de uso diario para pies extraanchos",
  "the-best-wide-toe-box-shoes-that-arent-barefoot": "Los mejores zapatos con puntera ancha que no son barefoot",
  "the-newest-barefoot-clog-on-the-block-barebound": "Barebound opiniones 2026: zuecos Vulcan, tallas y ajuste",
  "this-seasons-best-fall-shoes-but-make-it-barefoot": "Los mejores zapatos barefoot para este otoño",
  "trending-fall-boots-but-make-it-wide-toe-box": "Botas de otoño actuales con puntera ancha",
  "trending-spring-fashion-but-make-it-barefoot-shoes": "Tendencias de primavera con zapatos barefoot",
  "vegan-barefoot-shoes": "Lista completa de calzado barefoot vegano para 2026",
  "vivobarefoot-motus-flex-review": "Mi opinión sobre Vivobarefoot Motus Flex para entrenar",
  "vivobarefoot-opanka-review-barefoot-slip-on": "Mi opinión sobre Vivobarefoot Opanka: un zapato barefoot suave y flexible",
  "warmest-barefoot-winter-boots-zero-drop": "Las botas barefoot más cálidas para caminar sobre nieve",
  "why-barefoot-shoes-arent-the-full-solution-with-katy-bowman": "Por qué el calzado barefoot no es toda la solución según Katy Bowman",
  "wildling-ranidae-the-best-wide-rain-boot-around": "Wildling Ranidae: botas de lluvia barefoot con puntera ancha",
  "xero-shoes-fall-2024-review": "Mi opinión sobre la colección de otoño 2024 de Xero Shoes",
  "xero-shoes-spring-2026-collection-review": "Mi opinión sobre la colección de primavera 2026 de Xero Shoes",
  "zero-drop-barefoot-running-shoes": "Lista completa de zapatillas barefoot para correr con zero drop",
  "14-tween-teen-approved-barefoot-shoes": "13 zapatos barefoot aprobados por preadolescentes y adolescentes",
  "barefoot-minimalist-boots-styling-guide": "Guía de estilo para combinar botas barefoot y minimalistas",
  "barefoot-minimalist-dress-shoes-men": "Los mejores zapatos barefoot de vestir para hombre",
  "barefoot-shoe-brands-by-region": "Marcas de calzado barefoot por regiones del mundo",
  "best-holiday-gifts-barefoot-shoe-foot-health-2022": "Los mejores regalos para amantes del calzado barefoot y la salud de los pies",
  "better-walking-exercise": "Mejora tu forma de caminar con un ejercicio sencillo",
  "birchbury-carnforth-wide-toe-box-shoes": "Birchbury Carnforth: zapatos cómodos con puntera ancha",
  "drifter-leather-custom-review": "Cómo encargar zapatos personalizados a The Drifter Leather",
  "groundies-performance-review-retro-barefoot-sneakers": "Mi opinión sobre Groundies Performance: zapatillas barefoot de estilo retro",
  "how-to-help-your-bunions-if-you-dont-want-surgery": "Cómo aliviar los juanetes sin recurrir a la cirugía",
  "how-to-walk-correctly-guide-to-natural-gait": "Cómo caminar mejor y recuperar una marcha natural",
  "jan-jul-affordable-healthy-kids-shoe-review": "Mi opinión sobre Jan & Jul: calzado infantil asequible y respetuoso",
  "softstar-shoes-review-primal-merry-jane": "Mi opinión sobre Softstar Primal Merry Jane",
  "the-10-best-stylish-barefoot-dress-shoes-for-women": "Los 10 mejores zapatos barefoot de vestir con estilo para mujer",
  "the-8-best-vegan-barefoot-winter-boots": "Las 8 mejores botas barefoot veganas para el invierno",
  "the-ultimate-barefoot-shoe-black-friday-sales-discounts-in-2023": "Ofertas de calzado barefoot para Black Friday de 2023",
  "what-you-really-want-this-year-foot-nerd-edition": "Los regalos que quiere cualquier amante del barefoot en 2025",
  "why-i-wear-thin-soled-shoes-even-on-pavement": "Por qué uso zapatos de suela fina incluso sobre asfalto",
  "xero-shoes-spring-2022-review": "Mi opinión sobre la colección de primavera 2022 de Xero Shoes",
  "xero-shoes-winter-2022-all-new-models-reviewed-here": "Mi opinión sobre la colección de invierno 2022 de Xero Shoes"
};

const monthNames = {
  april: "abril",
  august: "agosto",
  december: "diciembre",
  february: "febrero",
  january: "enero",
  july: "julio",
  june: "junio",
  march: "marzo",
  may: "mayo",
  november: "noviembre",
  october: "octubre",
  september: "septiembre"
};

function decode(value) {
  return value
    .replace(/&amp;/gi, "y")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function normalizeTitle(slug, original) {
  if (overrides[slug]) return overrides[slug];

  const fashion = slug.match(/^fashion-but-make-it-barefoot(?:-([a-z]+)-(\d{4}))?$/);
  if (fashion) {
    return fashion[1]
      ? `Ideas de estilo barefoot para ${monthNames[fashion[1]] || fashion[1]} de ${fashion[2]}`
      : "Ideas de moda en versión barefoot";
  }

  let title = decode(original)
    .replace(/\bAngles Fashion Review\b/i, "Mi opinión sobre Angles Fashion")
    .replace(/^The Storehouse Flats Review\b/i, "Mi opinión sobre The Storehouse Flats")
    .replace(/^Gea Soles Yrsa Flat Review$/i, "Mi opinión sobre las bailarinas Gea Soles Yrsa")
    .replace(/^Revisi[oó]n de la marca\s+/i, "Mi opinión sobre ")
    .replace(/^Revisi[oó]n del\s+/i, "Mi opinión sobre el ")
    .replace(/^Revisi[oó]n de las\s+/i, "Mi opinión sobre las ")
    .replace(/^Revisi[oó]n de los\s+/i, "Mi opinión sobre los ")
    .replace(/^Revisi[oó]n de\s+/i, "Mi opinión sobre ")
    .replace(/^Revisi[oó]n\s+/i, "Mi opinión sobre ")
    .replace(/^Reseña del\s+/i, "Mi opinión sobre el ")
    .replace(/^Reseña de\s+/i, "Mi opinión sobre ")
    .replace(/^Reseña\s+/i, "Mi opinión sobre ")
    .replace(/^Repaso de\s+/i, "Mi opinión sobre ")
    .replace(/:\s*una (?:revisi[oó]n|opini[oó]n)\b/i, ": mi opinión")
    .replace(/\bmini (?:revisi[oó]n|reseña)\b/gi, "opinión breve")
    .replace(/\bZapatos barefoot\b/g, "zapatos barefoot")
    .replace(/\bZapatos de barefoot\b/gi, "zapatos barefoot")
    .replace(/\bzapatos de pie\b/gi, "zapatos barefoot")
    .replace(/\bcalzado de pie\b/gi, "calzado barefoot")
    .replace(/\bde barefoot\b/gi, "barefoot")
    .replace(/\bzero drop\b/gi, "zero drop")
    .replace(/\bpara Mujeres\b/g, "para mujer")
    .replace(/\bSneakers\b/g, "zapatillas")
    .replace(/\bFall\b/g, "otoño")
    .replace(/\bSpring\b/g, "primavera")
    .replace(/\bReview\b/gi, "mi opinión")
    .replace(/\bRepaso\b/gi, "mi opinión")
    .replace(/[–—]/g, ":")
    .replace(/\s+-\s+/g, ": ")
    .replace(/\s*:\s*/g, ": ")
    .replace(/:{2,}/g, ":")
    .replace(/\s+/g, " ")
    .trim();

  title = title
    .replace(/\b(botas?|sandalias?|zapatillas?|mocasines?|calzado|zapatos?) descalz(?:o|a|os|as)\b/gi, "$1 barefoot")
    .replace(/\bpara correr descalzos\b/gi, "barefoot para correr")
    .replace(/\busuarios descalzos\b/gi, "usuarios de calzado barefoot")
    .replace(/(?<!pies )\bdescalz(?:o|a|os|as)\b/gi, "barefoot")
    .replace(/\brevisados\b/gi, "probados")
    .replace(/\s*\+\s*/g, " y ")
    .replace(/[¡!]/g, "")
    .replace(/\bEXTRA ANCHAS\b/g, "extraanchas")
    .replace(/\bVEGANAS\b/g, "veganas")
    .replace(/\bAVENTURAS\b/g, "aventuras")
    .replace(/\s+([,.:;!?])/g, "$1")
    .replace(/[.!]+$/g, "")
    .trim();

  return title;
}

function titleRange(lines) {
  const start = lines.findIndex((line) => line.startsWith("title:"));
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && /^\s+/.test(lines[end]) && !/^\s+-\s/.test(lines[end])) end += 1;
  return { start, end };
}

function unquoteTitle(lines, range) {
  return [lines[range.start].slice("title:".length).trim(), ...lines.slice(range.start + 1, range.end).map((line) => line.trim())]
    .join(" ")
    .replace(/^(['"])([\s\S]*)\1$/, "$2");
}

const activeSlugs = new Set(
  contentRecords.filter((record) => record.section === "posts" && !record.retired).map((record) => record.sourceSlug)
);
const importedRoot = path.resolve("src/imported/posts");
const write = process.argv.includes("--write");
const changes = [];
const failures = [];

for (const filename of fs.readdirSync(importedRoot).filter((name) => name.endsWith(".md")).sort()) {
  const slug = path.basename(filename, ".md");
  if (!activeSlugs.has(slug)) continue;
  const file = path.join(importedRoot, filename);
  const source = fs.readFileSync(file, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) continue;
  const lines = frontmatter[1].split("\n");
  const range = titleRange(lines);
  if (!range) continue;
  const original = unquoteTitle(lines, range);
  const normalized = normalizeTitle(slug, original);
  if (original !== normalized) {
    changes.push({ slug, original, normalized });
    if (write) {
      lines.splice(range.start, range.end - range.start, `title: ${JSON.stringify(normalized)}`);
      const nextFrontmatter = `---\n${lines.join("\n")}\n---`;
      fs.writeFileSync(file, source.replace(frontmatter[0], nextFrontmatter));
    }
  }
  if (/[–—]|\s-\s|revisi[oó]n|reseña|\bReview\b|\bRepaso\b/i.test(normalized)) {
    failures.push(`${slug}: ${normalized}`);
  }
}

console.log(`Títulos revisados: ${activeSlugs.size}`);
console.log(`Títulos ${write ? "actualizados" : "por actualizar"}: ${changes.length}`);
console.log(`Títulos con terminología o rayas prohibidas: ${failures.length}`);
for (const failure of failures) console.error(`- ${failure}`);
if (!write && changes.length) {
  for (const change of changes.slice(0, 20)) console.log(`- ${change.original} -> ${change.normalized}`);
}
if (failures.length) process.exit(1);
