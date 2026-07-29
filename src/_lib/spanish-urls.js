const fs = require("node:fs");
const path = require("node:path");
const postPermalinks = require("../_data/postPermalinks.json");
const postLegacyTitles = require("../_data/postLegacyTitles.json");

const PROJECT_ROOT = path.resolve(__dirname, "../..");

const retiredPostSlugs = new Set([
  "about-me",
  "anyas-barefoot-shoe-try-on-event-survey-2023",
  "anyas-shop-barefoot-shoe-try-on-event-minneapolis",
  "anyas-shop-inaugural-barefoot-shoe-try-on-event",
  "being-me-a-journey-to-barefoot",
  "how-i-turned-my-living-room-into-foot-health-haven",
  "barefoot-minimalist-shoe-discounts-coupons",
  "barefoot-shoe-black-friday-sales-discounts-2021",
  "barefoot-shoe-black-friday-sales-discounts-2022",
  "black-friday-2019-sales-barefoot-minimalist-shoes",
  "black-friday-sales-discounts-barefoot-shoes-2020",
  "the-ultimate-barefoot-shoe-black-friday-sales-discounts-in-2023",
  "the-ultimate-guide-to-barefoot-shoe-black-friday-sales-2025",
  "ultimate-barefoot-shoe-black-friday-sales-2024"
]);

const pageDestinations = {
  home: "/",
  "barefoot-shoes-faq": "/preguntas-frecuentes-barefoot/",
  kids: "/ninos/",
  resources: "/recursos/",
  reviews: "/opiniones/1/",
  "shoe-lists": "/mejores-zapatos-barefoot/",
  style: "/estilo/",
  womens: "/mujeres/",
  "barefoot-dress-shoes": "/zapatos-barefoot-de-vestir/"
};

const legacyMainPaths = Object.fromEntries(
  Object.entries(pageDestinations)
    .filter(([sourceSlug, destination]) => sourceSlug !== "home" && `/${sourceSlug}/` !== destination)
    .map(([sourceSlug, destination]) => [`/${sourceSlug}/`, destination])
);

const retiredPageDestinations = {
  "barefoot-shoe-expo-chicago-2024": "/articulos/",
  "best-of-shoe-lists": "/mejores-zapatos-barefoot/",
  "complete-shoe-lists": "/mejores-zapatos-barefoot/",
  "find-your-footing-evergreen": "/recursos/",
  "find-your-footing-evergreen-thank-you": "/recursos/",
  "find-your-footing-replay": "/recursos/",
  "find-your-footing-thank-you": "/recursos/",
  "find-your-footing-workshop-emails-opt-out": "/recursos/",
  "kids-faq": "/preguntas-frecuentes-barefoot/",
  popular: "/articulos/",
  subscribe: "/articulos/",
  "thank-you-for-subscribing": "/articulos/"
};

const postSlugOverrides = {
  "boat-shoes-but-with-a-wide-toe-box": "zapatos-nauticos-puntera-ancha",
  "cycling-shoes-but-foot-shaped-strong-feet-athletics-review": "opinion-strong-feet-athletics",
  "the-best-wide-toe-box-court-shoes": "mejores-zapatillas-pista-puntera-ancha",
  "the-best-barefoot-sandals-for-kids": "mejores-sandalias-barefoot-ninos",
  "spring-2026-favorites-but-make-it-barefoot-shoes": "favoritos-barefoot-primavera-2026",
  "xero-shoes-spring-2026-collection-review": "opinion-xero-primavera-2026",
  "the-best-wide-toe-box-shoes-that-arent-barefoot": "mejores-zapatos-puntera-ancha-no-barefoot",
  "replace-your-high-heels-with-these-fancy-barefoot-shoes": "alternativas-barefoot-tacones-altos",
  "complete-list-waterproof-barefoot-shoes-rain": "mejor-calzado-barefoot-impermeable",
  "10-best-barefoot-sandals-hiking-running-walking": "mejores-sandalias-barefoot-aventura-2026",
  "10-best-stylish-barefoot-sandals-for-women": "mejores-sandalias-barefoot-mujer",
  "spring-style-but-make-it-barefoot-shoes-2026": "estilo-barefoot-primavera-2026",
  "better-than-birkenstocks-the-sandals-im-wearing-instead": "sandalias-barefoot-alternativas-birkenstock",
  "15-barefoot-sneakers-that-are-better-than-vans": "zapatillas-barefoot-alternativas-vans",
  "the-newest-barefoot-clog-on-the-block-barebound": "opinion-barebound-zuecos-barefoot",
  "barefoot-minimalist-dress-shoes-men": "mejores-zapatos-barefoot-vestir-hombre",
  "paperkrane-barefoot-shoes-with-spunk": "paperkrane-barefoot",
  "faye-is-here-and-shes-making-your-other-boots-jealous": "botas-barefoot-faye",
  "new-wide-but-not-barefoot-sneakers-from-tolos": "zapatillas-tolos-puntera-ancha",
  "what-you-really-want-this-year-foot-nerd-edition": "regalos-amantes-barefoot-2025",
  "holiday-party-looks-but-make-it-barefoot-shoes": "looks-fiesta-barefoot",
  "warmest-barefoot-winter-boots-zero-drop": "botas-barefoot-invierno-nieve",
  "barefoot-minimalist-kids-boots": "mejores-botas-barefoot-ninos",
  "the-foot-shaped-woven-ballerina": "bailarinas-tejidas-puntera-ancha"
};

const segmentTranslations = {
  affordable: "asequible",
  alignment: "alineacion",
  athletic: "deportivo",
  "barefoot-running": "correr-barefoot",
  "best-of-list": "mejores-listas",
  boot: "bota",
  boots: "botas",
  budget: "presupuesto",
  "but-make-it-barefoot": "version-barefoot",
  casual: "informal",
  cheap: "barato",
  "complete-list": "lista-completa",
  coupons: "cupones",
  custom: "personalizado",
  "custom-footwear": "calzado-personalizado",
  discounts: "descuentos",
  dressy: "arreglado",
  "extra-wide": "extra-ancho",
  favorites: "favoritos",
  "featured-resource": "recurso-destacado",
  flats: "zapatos-planos",
  formal: "formal",
  "free-shipping": "envio-gratis",
  "gift-guide": "guia-de-regalos",
  giveaway: "sorteo",
  grounding: "conexion-a-tierra",
  handmade: "hecho-a-mano",
  health: "salud",
  "how-to": "como-hacerlo",
  insoles: "plantillas",
  kids: "ninos",
  "lace-up": "con-cordones",
  leather: "cuero",
  mens: "hombres",
  "most-popular": "mas-popular",
  movement: "movimiento",
  performance: "rendimiento",
  "popular-post": "articulo-popular",
  "rain-boots": "botas-de-lluvia",
  resources: "recursos",
  reviews: "opiniones",
  running: "correr",
  sales: "ofertas",
  sandals: "sandalias",
  "shoe-care": "cuidado-del-calzado",
  "shoe-lists": "mejores-zapatos-barefoot",
  sneaker: "zapatillas",
  sneakers: "zapatillas",
  socks: "calcetines",
  "style-guide": "guia-de-estilo",
  "style-tips": "consejos-de-estilo",
  summer: "verano",
  sustainable: "sostenible",
  "toe-spacers": "separadores-de-dedos",
  transitioning: "transicion",
  vegan: "vegano",
  "water-shoes": "calzado-de-agua",
  waterproof: "impermeable",
  "wear-this-not-that": "alternativas-barefoot",
  weatherproof: "resistente-al-clima",
  weddings: "bodas",
  winter: "invierno",
  womens: "mujeres",
  ballet: "ballet",
  "big-kids": "ninos-mayores",
  dancing: "baile",
  diy: "hazlo-tu-mismo",
  "dress-shoes": "zapatos-de-vestir",
  exercise: "ejercicio",
  fitness: "entrenamiento",
  "leather-soles": "suelas-de-cuero",
  measurement: "medicion",
  size: "talla",
  "skin-care": "cuidado-de-la-piel",
  youth: "jovenes",
  "barefoot-shoes-overview": "que-es-el-calzado-barefoot",
  "are-they-right-for-me": "es-el-barefoot-para-mi",
  "how-do-i-get-started": "como-empezar",
  "finding-the-right-barefoot-shoes-for-me": "encontrar-el-calzado-adecuado",
  "changing-more-than-your-shoes": "movimiento-y-habitos",
  "shoe-care-and-fit-hacks": "ajuste-y-cuidado",
  "categories-barefoot-shoes-hard-to-find-options": "opciones-dificiles-de-encontrar",
  "barefoot-shoes-for-kids": "calzado-barefoot-para-ninos",
  slippers: "zapatillas-de-casa",
  "slip-ons": "sin-cordones"
};

function decodeEntities(value = "") {
  return String(value)
    .replace(/&amp;/g, " y ")
    .replace(/&quot;|&#34;/g, "")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function slugifySpanish(value = "") {
  const localized = decodeEntities(value)
    .toLowerCase()
    .replace(/[-–—]+/g, " ")
    .replace(/\bhow do i\b/g, "como")
    .replace(/\bhow do you\b/g, "como")
    .replace(/\bwhere can i find\b/g, "donde encontrar")
    .replace(/\bare there\b/g, "hay")
    .replace(/\bdo i need\b/g, "necesito")
    .replace(/\bcan i\b/g, "puedo")
    .replace(/\bwhat if\b/g, "que pasa si")
    .replace(/\bwhat are\b/g, "cuales son")
    .replace(/\bwhat is\b/g, "que es")
    .replace(/\bwhy are\b/g, "por que son")
    .replace(/\bwhy should i\b/g, "por que deberia")
    .replace(/\bwho shouldnt\b/g, "quien no deberia")
    .replace(/\bwill my\b/g, "cambiaran mis")
    .replace(/\bwill barefoot shoes\b/g, "pueden los zapatos barefoot")
    .replace(/\btransition to\b/g, "hacer la transicion a")
    .replace(/\bbarefoot shoes\b/g, "zapatos barefoot")
    .replace(/\bshoe care\b/g, "cuidado del calzado")
    .replace(/\bwide toe box\b/g, "puntera ancha")
    .replace(/\bfit hacks\b/g, "trucos de ajuste")
    .replace(/\bhigh volume feet\b/g, "pies de alto volumen")
    .replace(/\blow volume feet\b/g, "pies de poco volumen")
    .replace(/\bnarrow heels\b/g, "talones estrechos")
    .replace(/\bwide foot\b/g, "pies anchos")
    .replace(/\bfoot nerd\b/g, "fanatica de los pies")
    .replace(/\bfor kids\b/g, "para ninos")
    .replace(/\bfor women\b/g, "para mujeres")
    .replace(/\bfor men\b/g, "para hombres")
    .replace(/\breview\b/g, "resena")
    .replace(/\bstyling\b/g, "estilo")
    .replace(/\bguide\b/g, "guia")
    .replace(/\bapproved\b/g, "aprobado")
    .replace(/\bcharming\b/g, "atractiva")
    .replace(/\bbrand\b/g, "marca")
    .replace(/\bfall\b/g, "otono")
    .replace(/\bwinter\b/g, "invierno")
    .replace(/\bwhy\b/g, "por que")
    .replace(/\blove\b/g, "nos encanta")
    .replace(/\bthis\b/g, "esta")
    .replace(/\bwe\b/g, "nosotros")
    .replace(/\bbest\b/g, "mejores")
    .replace(/\bshoes\b/g, "zapatos")
    .replace(/\bshoe\b/g, "zapato")
    .replace(/\bboots\b/g, "botas")
    .replace(/\bsandals\b/g, "sandalias")
    .replace(/\bsneakers\b/g, "zapatillas")
    .replace(/\bkids\b/g, "ninos")
    .replace(/\bwomens\b/g, "mujeres")
    .replace(/\bmens\b/g, "hombres")
    .replace(/\bwith\b/g, "con")
    .replace(/\bwithout\b/g, "sin")
    .replace(/\bfrom\b/g, "de")
    .replace(/\band\b/g, "y")
    .replace(/\bthe\b/g, "")
    .replace(/\bto\b/g, "a")
    .replace(/\bfor\b/g, "para");

  return localized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 88)
    .replace(/-+$/g, "");
}

function slugifyNativeSpanish(value = "") {
  return decodeEntities(value)
    .toLowerCase()
    .replace(/[-–—]+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 88)
    .replace(/-+$/g, "");
}

function opinionTitle(value = "") {
  let title = decodeEntities(value).replace(/\s+/g, " ").trim();

  title = title
    .replace(/^revisi[oó]n\s+(?:original\s+)?(?:de|del|de la|de las|de los)\s+/i, "Mi opinión sobre ")
    .replace(/^rese[nñ]a\s+(?:de|del|de la|de las|de los)\s+/i, "Mi opinión sobre ")
    .replace(/^repaso\s+(?:de|del)\s+/i, "Mi opinión sobre ")
    .replace(/^(.+?)\s+review\s*([:–—-])/i, "Mi opinión sobre $1 $2")
    .replace(/^(.+?)\s+review$/i, "Mi opinión sobre $1")
    .replace(/^(.+?)\s*[:–—-]\s*una\s+mini\s+(?:rese[nñ]a|revisi[oó]n)\b/i, "Mi opinión sobre $1")
    .replace(/\bmini\s+(?:rese[nñ]a|revisi[oó]n)\b/gi, "opinión breve")
    .replace(/\b(?:rese[nñ]a|revisi[oó]n)\b/gi, "opinión");

  return title.replace(/\s+([:;,])/g, "$1").trim();
}

function trimSlug(slug = "", maxLength = 52) {
  if (slug.length <= maxLength) return slug;
  return slug.slice(0, maxLength + 1).replace(/-[^-]*$/, "").replace(/-+$/, "");
}

function legacyCompactSpanishSlug(title = "") {
  let slug = slugifySpanish(opinionTitle(title))
    .replace(/^mi-opinion-sobre-/, "")
    .replace(/^(?:los|las|el|la)-/, "")
    .replace(/^\d+-/, "")
    .replace(/^(?:los|las|el|la)-/, "")
    .replace(/zapatos-barefoot/g, "barefoot")
    .replace(/calzado-barefoot/g, "barefoot")
    .replace(/-(?:de|del|para|por|en|con|y|un|una|unos|unas)-/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.startsWith("mejores-")) {
    slug = slug.replace(/^mejores-(?:zapatos-)?/, "mejores-");
  }

  if (slug.length > 72) {
    slug = slug.slice(0, 72).replace(/-[^-]*$/, "");
  }

  return slug;
}

const slugStopWords = new Set([
  "a", "al", "de", "del", "el", "en", "he", "la", "las", "lo", "los", "mi", "mis",
  "para", "por", "que", "se", "su", "sus", "tu", "tus", "un", "una", "unos", "unas", "y"
]);

const slugFillerWords = new Set([
  "aqui", "ahora", "edicion", "hacer", "hacen", "hecho", "misma", "mismo", "nueva",
  "nuevas", "nuevo", "nuevos", "principal", "realmente", "usted"
]);

function conciseTokens(value = "", removeFillers = true) {
  return value
    .split("-")
    .filter(Boolean)
    .filter((token) => !slugStopWords.has(token))
    .filter((token) => !removeFillers || !slugFillerWords.has(token));
}

function compactSpanishSlug(title = "") {
  let slug = slugifyNativeSpanish(opinionTitle(title))
    .replace(/^mi-opinion-sobre-/, "opinion-")
    .replace(/^\d+-/, "")
    .replace(/-(?:shoes|shoe)(?=-|$)/g, "")
    .replace(/-kids(?=-|$)/g, "-ninos")
    .replace(/-flats(?=-|$)/g, "-bailarinas")
    .replace(/-diy(?=-|$)/g, "-hazlo-tu-mismo")
    .replace(/zapatos-de-barefoot/g, "barefoot")
    .replace(/zapatos-barefoot/g, "barefoot")
    .replace(/zapatos-descalzos/g, "barefoot")
    .replace(/calzado-barefoot/g, "barefoot")
    .replace(/pies-descalzos/g, "barefoot")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  slug = conciseTokens(slug).join("-");
  if (slug.startsWith("mejores-zapatos-")) slug = slug.replace(/^mejores-zapatos-/, "mejores-");
  return trimSlug(slug, 46);
}

function compactFaqSlug(title = "") {
  let slug = slugifySpanish(title)
    .replace(/donde-puedo-encontrar/g, "donde-encontrar")
    .replace(/como-puedo/g, "como")
    .replace(/^como-encontrar-zapatos-cuando-usted-tiene-bunions$/, "como-encontrar-zapatos-juanetes")
    .replace(/^cuando-necesito-comprar-zapatos-nuevos-de-mi-hijo$/, "cuando-cambiar-zapatos-nino")
    .replace(/^donde-encontrar-zapatos-de-vestido-de-barefoot-para-ninos$/, "donde-encontrar-barefoot-vestir-ninos")
    .replace(/^donde-encontrar-zapatos-extra-grandes-o-extra-pequenos-descalzos$/, "donde-encontrar-barefoot-tallas-extremas")
    .replace(/^necesito-cambiar-todos-mis-zapatos-a-las-opciones-de-barefoot$/, "cambiar-todo-calzado-barefoot")
    .replace(/^cual-es-la-diferencia-entre/g, "diferencia")
    .replace(/^no-puedo-encontrar/g, "no-encuentro")
    .replace(/suficientemente/g, "muy")
    .replace(/para-mis-pies/g, "pies")
    .replace(/que-hago$/g, "solucion")
    .replace(/para-trabajar-o-una-boda/g, "trabajo-boda")
    .replace(/zapatos-estrechos-descalzos/g, "barefoot-estrechos")
    .replace(/zapatos-de-barefoot/g, "barefoot")
    .replace(/zapatos-barefoot/g, "barefoot")
    .replace(/zapatos-descalzos/g, "barefoot")
    .replace(/calzado-barefoot/g, "barefoot")
    .replace(/zapatos-minimalistas/g, "minimalistas")
    .replace(/calzado-natural/g, "natural")
    .replace(/zapatos-de-vestido/g, "zapatos-vestir")
    .replace(/pueden-ser-usados/g, "sirven")
    .replace(/puesta-en-tierra/g, "conexion-tierra")
    .replace(/todo-el-dia/g, "todo-dia")
    .replace(/tamano-de-zapatos/g, "talla")
    .replace(/tamano/g, "talla")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  const faqFillers = new Set(["es", "estar", "pueda", "pueden", "ser", "si", "son", "tengo", "tiene", "tienes", "usados"]);
  slug = conciseTokens(slug, false).filter((token) => !faqFillers.has(token)).join("-");
  return trimSlug(slug, 44);
}

function legacyReviewSlug(sourceSlug = "") {
  const normalized = sourceSlug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
  const reviewIndex = normalized.split("-").indexOf("review");
  if (reviewIndex === -1) return "";
  return normalized.split("-").slice(0, reviewIndex + 1).join("-");
}

function reviewSlug(sourceSlug = "") {
  const normalized = sourceSlug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
  const parts = normalized.split("-");
  const reviewIndex = parts.indexOf("review");
  if (reviewIndex === -1) return "";

  const reviewFillers = new Set([
    "a", "actually", "affordable", "an", "are", "barefoot", "best", "brand", "but", "collection",
    "custom", "cycling", "foot", "for", "healthy", "mini", "newest", "shaped", "shoe", "shoes", "that", "the", "with"
  ]);
  const subject = parts.slice(0, reviewIndex).filter((part) => part && !reviewFillers.has(part));
  if (subject.length <= 1) {
    subject.push(...parts.slice(reviewIndex + 1).filter((part) => part && !reviewFillers.has(part)).slice(0, 2));
  }
  return `${trimSlug(subject.join("-"), 38)}-review`;
}

function legacySeoPostSlug(sourceSlug = "", title = "") {
  const existingReviewSlug = legacyReviewSlug(sourceSlug);
  if (existingReviewSlug) return existingReviewSlug;

  if (/(?:review|revisi[oó]n|rese[nñ]a|repaso)/i.test(title)) {
    const reviewBase = sourceSlug
      .toLowerCase()
      .split("-")
      .filter((part) => part && !["version", "review"].includes(part))
      .join("-");
    return `${reviewBase}-review`;
  }

  return legacyCompactSpanishSlug(title) || sourceSlug;
}

function seoPostSlug(sourceSlug = "", title = "") {
  return compactSpanishSlug(title) || sourceSlug;
}

function parseFrontMatter(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const keyMatch = lines[index].match(/^([A-Za-z][A-Za-z0-9]*):(?:\s*(.*))?$/);
    if (!keyMatch) continue;
    const [, key] = keyMatch;
    let value = keyMatch[2] || "";
    while (index + 1 < lines.length && /^\s+\S/.test(lines[index + 1])) {
      value += ` ${lines[index + 1].trim()}`;
      index += 1;
    }
    value = value.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return data;
}

function importedFiles(section) {
  const directory = path.join(PROJECT_ROOT, "src", "imported", section);
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(directory, file));
}

function buildContentRecords() {
  const records = [];
  const usedDestinations = new Set();

  for (const section of ["posts", "faqs", "pages"]) {
    for (const file of importedFiles(section)) {
      const data = parseFrontMatter(file);
      const sourceSlug = data.sourceSlug || path.basename(file, ".md");
      const from = data.permalink || `/${sourceSlug}/`;
      let to;
      let retired = false;

      if (section === "posts") {
        retired = retiredPostSlugs.has(sourceSlug);
        const generatedSlug = seoPostSlug(sourceSlug, data.title || sourceSlug);
        to = retired ? "/articulos/" : `/${postSlugOverrides[sourceSlug] || generatedSlug}/`;
      } else if (section === "faqs") {
        to = `/preguntas/${compactFaqSlug(data.title || sourceSlug)}/`;
      } else if (pageDestinations[sourceSlug]) {
        to = pageDestinations[sourceSlug];
      } else if (retiredPageDestinations[sourceSlug]) {
        to = retiredPageDestinations[sourceSlug];
        retired = true;
      } else {
        to = `/${slugifySpanish(data.title || sourceSlug)}/`;
      }

      if (!retired && to !== "/" && usedDestinations.has(to)) {
        to = to.replace(/\/$/, `-${data.sourceId || sourceSlug}/`);
      }
      if (!retired) usedDestinations.add(to);

      const previousTos = [];
      if (!retired && section === "posts") {
        const legacyTitle = postLegacyTitles[sourceSlug];
        previousTos.push(
          postPermalinks[sourceSlug],
          `/${slugifySpanish(data.title || sourceSlug)}/`,
          `/${legacySeoPostSlug(sourceSlug, data.title || sourceSlug)}/`,
          `/${seoPostSlug(sourceSlug, data.title || sourceSlug)}/`
        );
        if (legacyTitle) {
          previousTos.push(
            `/${slugifySpanish(legacyTitle)}/`,
            `/${legacySeoPostSlug(sourceSlug, legacyTitle)}/`,
            `/${seoPostSlug(sourceSlug, legacyTitle)}/`
          );
        }
      }
      if (!retired && section === "faqs") {
        previousTos.push(`/preguntas/${slugifySpanish(data.title || sourceSlug)}/`);
      }
      records.push({
        section,
        sourceSlug,
        from,
        to,
        previousTo: previousTos[0] || null,
        previousTos: [...new Set(previousTos.filter((item) => item && item !== to))],
        retired,
        title: data.title || sourceSlug
      });
    }
  }

  return records;
}

const contentRecords = buildContentRecords();
const bySourceSlug = Object.fromEntries(contentRecords.map((record) => [record.sourceSlug, record]));
const oldToNew = Object.fromEntries(
  contentRecords.flatMap((record) => {
    const entries = [[record.from, record.to]];
    for (const previousTo of record.previousTos || []) entries.push([previousTo, record.to]);
    return entries;
  })
);
const faqLegacyPaths = Object.fromEntries(
  contentRecords
    .filter((record) => record.section === "faqs")
    .flatMap((record) => [
      [`/preguntas/${record.sourceSlug}`, record.to],
      [`/preguntas/${record.sourceSlug}/`, record.to]
    ])
);
const customLegacyPaths = {
  "/lems-shoes-opinion-tallas-modelos/": "/lems-opinion-tallas-modelos/",
  "/origo-shoes-opinion-tallas/": "/origo-opinion-tallas/",
  "/opiniones/": "/opiniones/1/",
  "/resenas/": "/opiniones/1/",
  "/temas/resenas/": "/opiniones/1/",
  "/categoria/resenas/": "/opiniones/1/",
  "/category/reviews/": "/opiniones/1/",
  "/category/reviews/kids/": "/opiniones/1/",
  "/category/reviews/mens/": "/opiniones/1/",
  "/category/reviews/womens/": "/opiniones/1/",
  "/preguntas/hay-zapatos-barefoot-para-los-deportes-cleats-court-climbing-o-zapatos-gym/": "/preguntas/existen-zapatillas-barefoot-practicar/",
  "/preguntas/are-there-barefoot-sandals-for-kids": "/las-mejores-sandalias-de-barefoot-para-ninos/",
  "/preguntas/are-there-barefoot-sandals-for-kids/": "/las-mejores-sandalias-de-barefoot-para-ninos/",
  "/feetsutra-khussa-review-zero-drop-leather-loafers/": "/articulos/",
  "/2019/04/02/cinderollies/": "/revision-de-las-bailarinas-cinderollies/",
  "/2019/03/28/grecian-sandals/": "/revision-de-etsy-de-sandalias-griegas/",
  "/2019/06/05/the-storehouse-flats/": "/storehouse-flats-resena-asequible-y-bueno-para-los-pies/",
  "/2019/11/14/vivobarefoot-gobi-hi-iii/": "/revision-de-vivobarefoot-gobi-hi-bota-iconica-de-invierno-barefoot/",
  "/2020/02/10/my-most-worn-boots-of-winter-2020/": "/lista-completa-de-botas-barefoot-para-hombres-y-mujeres/",
  "/2020/02/13/vivobarefoot-ra-slip-on/": "/resena-vivobarefoot-ra-slip-on/",
  "/2020/01/21/zaqq-brand-review/": "/revision-de-la-marca-zaqq-barefoot/",
  "/2020/02/23/the-feelgrounds-original/": "/revision-original-de-feelgrounds-hacer-que-los-zapatos-barefoot-sean-geniales/",
  "/2020/01/16/luks-primavera-boots/": "/lista-completa-de-botas-barefoot-para-hombres-y-mujeres/",
  "/descuentos-de-zapato-de-barefoot-todos-los-cupones-de-ventas-actuales-en-one-place/": "/articulos/"
};

function translateSegments(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part) => segmentTranslations[part] || part).join("/");
}

function compactBrandSlug(slug = "") {
  return slug
    .replace(/-(?:running-)?(?:shoes|sandals)$/, "")
    .replace(/-kids$/, "");
}

function localizeUrl(url = "") {
  const raw = String(url || "");
  if (!raw.startsWith("/") || raw.startsWith("//")) return raw;
  const [pathname, suffix = ""] = raw.split(/(?=[?#])/);
  if (customLegacyPaths[pathname]) return `${customLegacyPaths[pathname]}${suffix}`;
  if (faqLegacyPaths[pathname]) return `${faqLegacyPaths[pathname]}${suffix}`;
  if (/^\/(?:brand|marca)\/(?:by-anya|anyas-shop)\/?$/.test(pathname)) return `/articulos/${suffix}`;
  if (/^\/(?:tag|tema)\/(?:black-friday-sale|coupons|cupones|discounts|descuentos|free-shipping|envio-gratis|giveaway|sorteo|sales|ofertas|thanksgiving-sale)\/?$/.test(pathname)) {
    return `/articulos/${suffix}`;
  }
  if (pathname === "/wide-foot-aprobado-los-mejores-zapatos-diarios-para-pies-extra-anchos/") {
    return `/pies-anchos-aprobado-los-mejores-zapatos-diarios-para-pies-extra-anchos/${suffix}`;
  }
  if (legacyMainPaths[pathname]) return `${legacyMainPaths[pathname]}${suffix}`;
  if (oldToNew[pathname]) return `${oldToNew[pathname]}${suffix}`;
  const localizedArchiveMatch = pathname.match(/^\/(preguntas\/(?:categoria|tema)|categoria|tema|estilo|grupo|marca)\/(.+?)\/?$/);
  if (localizedArchiveMatch) {
    const [, prefix, tail] = localizedArchiveMatch;
    const translatedTail = translateSegments(tail);
    return `/${prefix}/${prefix === "marca" ? compactBrandSlug(translatedTail) : translatedTail}/${suffix}`;
  }

  const prefixRules = [
    ["/ufaq-category/", "/preguntas/categoria/"],
    ["/ufaq-tag/", "/preguntas/tema/"],
    ["/ufaq/", "/preguntas/"],
    ["/category/", "/categoria/"],
    ["/tag/", "/tema/"],
    ["/style/", "/estilo/"],
    ["/age-group/", "/grupo/"],
    ["/brand/", "/marca/"]
  ];

  for (const [from, to] of prefixRules) {
    if (!pathname.startsWith(from)) continue;
    const tail = pathname.slice(from.length);
    const translatedTail = from === "/brand/"
      ? compactBrandSlug(translateSegments(tail))
      : translateSegments(tail);
    return `${to}${translatedTail}${translatedTail ? "/" : ""}${suffix}`;
  }

  if (pathname.startsWith("/author/")) return `/sobre-mi/${suffix}`;
  return raw;
}

module.exports = {
  bySourceSlug,
  contentRecords,
  customLegacyPaths,
  faqLegacyPaths,
  localizeUrl,
  legacyMainPaths,
  oldToNew,
  retiredPostSlugs,
  opinionTitle,
  seoPostSlug,
  slugifySpanish
};
