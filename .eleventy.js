const blogTopics = require("./src/_data/blogTopics.js");
const modelImageAssignments = require("./src/_data/modelImageAssignments.js");
const {
  localizeUrl: localizeSpanishUrl,
  oldToNew: importedUrlMap
} = require("./src/_lib/spanish-urls.js");
const { sanitizeAffiliateLinks } = require("./src/_lib/affiliate-links.js");
const seoTitleOverrides = require("./src/_lib/seo-title-overrides.js");

function postSearchText(post) {
  return [
    post.url,
    post.data.title,
    post.data.description,
    post.data.sourceSlug,
    post.data.contentType,
    post.data.sourceType
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesTopic(post, topic) {
  const text = postSearchText(post);
  return topic.patterns.some((pattern) => text.includes(pattern.toLowerCase()));
}

const stylePatterns = [
  "/style/",
  "style",
  "fashion",
  "make-it-barefoot",
  "wear-this-not-that",
  "but-make-it-barefoot",
  "heels",
  "dressy",
  "formal",
  "weddings",
  "sneaker",
  "sandals",
  "boots",
  "flats",
  "loafers",
  "chelsea",
  "boat-shoes",
  "spring",
  "fall",
  "holiday"
];

const resourcePatterns = [
  "resources",
  "barefoot-resources",
  "benefits",
  "foot-type",
  "transition",
  "measure",
  "measuring",
  "fit",
  "sizing",
  "size-chart",
  "how-do",
  "why",
  "what-is",
  "walking",
  "gait",
  "alignment",
  "pain",
  "bunions",
  "foot-exercises",
  "shoe-care",
  "waterproof",
  "affordable",
  "wide-feet",
  "extra-wide",
  "faq"
];

const discountUrlPatterns = [
  "barefoot-minimalist-shoe-discounts-coupons",
  "black-friday",
  "cyber-monday",
  "sales-discounts",
  "discount",
  "discounts",
  "coupon",
  "coupons",
  "/tag/sales/",
  "/tag/discounts/",
  "/tag/coupons/",
  "/tag/black-friday-sale/"
];

const discountTextPatterns = [
  "descuento",
  "descuentos",
  "cupón",
  "cupon",
  "cupones",
  "código",
  "codigo",
  "black friday",
  "cyber monday",
  "discount",
  "discounts",
  "coupon",
  "coupons"
];

const legacyUrlMap = {
  "/2019/03/28/north-sole-insoles-barefoot-ing-your-way/": "/northsole-barefoot-insoles-review/",
  "/2019/02/08/how-to-getting-the-perfect-shoes-from-drifter-leather/": "/drifter-leather-custom-review/",
  "/mukishoes-review-chelsea-boots-wear-this-not-that/": "/mukishoes-cork-chelsea-review/",
  "/barefoot-minimalist-wedding-shoes-guide/": "/barefoot-minimalist-dress-shoes-women/",
  "/2019/06/14/shoe-care/": "/barefoot-minimalist-shoe-care-how-to/",
  "/2019/01/10/drifter-leather-vera-riding-boots/": "/drifter-leather-vera-review/",
  "/2019/04/21/unshoes-saffron/": "/unshoes-saffron-review/",
  "/luks-primavera-boots-review/": "/barefoot-minimalist-womens-boots-full-list/",
  "/2019/01/12/bobux-boots-for-kids/": "/bobux-kids-boots-review/",
  "/2019/01/24/womens-dress-shoe-roundup/": "/barefoot-minimalist-dress-shoes-women/",
  "/2019/02/13/affordable-barefoot-shoes/": "/affordable-barefoot-minimalist-shoes/",
  "/2019/02/24/zuzii-loafers-sandals/": "/zuzii-loafers-sandals-review/",
  "/2019/01/02/zuzii-oxfords/": "/zuzii-oxfords-review/",
  "/how-do-you-transition-to-barefoot-shoes/": "/ufaq/how-do-you-transition-to-barefoot-shoes/",
  "/2019/05/27/unshoes-uinta-keota-sandals/": "/unshoes-uinta-keota-sandals-review/",
  "/2019/08/28/softstar-sawyer-shoes/": "/softstar-shoes-sawyer-review/",
  "/2019/08/08/luks-barefoot-shoes/": "/barefoot-minimalist-dress-shoes-women/",
  "/how-to-walk-well-guide-to-natural-gait/": "/how-to-walk-correctly-guide-to-natural-gait/",
  "/2019/01/05/unshoes-terra-vida/": "/unshoes-terra-vida-review/",
  "/2019/01/01/chelsea-boots-and-vivobarefoots-fulham/": "/vivobarefoot-fulham-review-barefoot-chelsea-boot/",
  "/2019/05/17/xero-z-treks/": "/xero-shoes-diy-sandal-review-affordable-and-easy-to-make/",
  "/vivobarefoot-fulham-review/": "/vivobarefoot-fulham-review-barefoot-chelsea-boot/",
  "/barefoot-toe-socks-review/": "/best-foot-friendly-socks-dont-squish-your-toes/",
  "/2019/11/19/how-to-wear-boots-the-barefoot-edition/": "/barefoot-minimalist-boots-styling-guide/",
  "/the-best-shoes-for-extra-wide-feet/": "/best-shoes-for-wide-feet/",
  "/the-best-barefoot-sandals-for-kids/": "/kids-barefoot-shoes-summer/",
  "/what-is-a-barefoot-minimalist-shoe/": "/ufaq/whats-the-difference-between-barefoot-minimalist-natural-footwear/",
  "/why-barefoot/": "/benefits-barefoot-minimalist-shoes/",
  "/find-your-footing-workshop/": "/resources/"
};

const shoeListPatterns = [
  "shoe-lists",
  "complete-list",
  "full-list",
  "best-barefoot",
  "best-wide",
  "10-best",
  "best-zero-drop",
  "best-foot",
  "best-shoes",
  "top-picks",
  "favorites",
  "brands",
  "sandals",
  "boots",
  "sneakers",
  "flats",
  "loafers",
  "dress-shoes",
  "kids-shoes",
  "hiking",
  "running",
  "winter",
  "waterproof",
  "work-boots",
  "extra-wide",
  "affordable",
  "barefoot-minimalist"
];

const kidsPatterns = [
  "kids",
  "niños",
  "child",
  "children",
  "toddler",
  "baby",
  "school",
  "youth",
  "little-love-bug",
  "ten-little",
  "bobux",
  "plae",
  "zuna"
];

function matchesPatterns(post, patterns) {
  const text = postSearchText(post);
  return patterns.some((pattern) => text.includes(pattern.toLowerCase()));
}

function isDiscountUrl(url = "") {
  const normalizedUrl = String(url).toLowerCase();
  return discountUrlPatterns.some((pattern) => normalizedUrl.includes(pattern));
}

function isDiscountPost(post) {
  const text = postSearchText(post);
  return isDiscountUrl(post.url) || discountTextPatterns.some((pattern) => text.includes(pattern));
}

function publicPosts(posts) {
  return posts.filter((post) => !isDiscountPost(post));
}

function humanizeArchiveSlug(slug) {
  const fullSlugLabels = {
    "shoe-lists": "Listas de zapatos",
    "mejores-zapatos-barefoot": "Mejores zapatos barefoot",
    resources: "Recursos",
    reviews: "Opiniones",
    opiniones: "Opiniones",
    transitioning: "Transición",
    transicion: "Transición"
  };

  if (fullSlugLabels[slug]) return fullSlugLabels[slug];

  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      const special = {
        faq: "FAQ",
        kids: "Niños",
        womens: "Mujer",
        mens: "Hombre",
        "shoe-lists": "Listas de zapatos",
        resources: "Recursos",
        reviews: "Opiniones",
        opiniones: "Opiniones",
        transitioning: "Transición",
        transicion: "Transición",
        barefoot: "Barefoot"
      };
      return special[word] || word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function archivePosts(posts, archive = {}) {
  const path = archive.path || "";
  const [, taxonomy = "", rawSlug = ""] = path.match(/^\/([^/]+)\/([^/]+)\//) || [];
  const slug = rawSlug.toLowerCase();
  const textSlug = slug.replace(/-/g, " ");

  const cleanPosts = publicPosts(posts);

  if (!slug) return cleanPosts.slice(0, 24);

  const categoryPatterns = {
    "shoe-lists": shoeListPatterns,
    resources: resourcePatterns,
    reviews: ["review", "reseña", "reviews"],
    kids: ["kids", "niños", "baby", "toddler", "youth"],
    womens: ["womens", "women", "mujer", "flats", "heels", "sandals", "dress"],
    mens: ["mens", "men", "hombre", "dress-shoes-men"]
  };

  const styleCategoryPatterns = {
    boots: ["boots", "boot", "botas", "chelsea", "winter"],
    flats: ["flats", "ballet", "bailarinas", "mary-jane"],
    insoles: ["insoles", "plantillas"],
    "lace-up": ["lace-up", "oxford", "derby", "cordones"],
    sandals: ["sandals", "sandalias", "huaraches"],
    "slip-ons": ["slip-on", "slip-ons", "loafers", "mocasines"],
    slippers: ["slippers", "zapatillas de casa"],
    sneakers: ["sneakers", "zapatillas", "trainer"],
    socks: ["socks", "calcetines"]
  };

  let patterns = [slug, textSlug];

  if (taxonomy === "category") {
    patterns = categoryPatterns[slug] || patterns;
  } else if (taxonomy === "style") {
    patterns = styleCategoryPatterns[slug] || patterns;
  } else if (taxonomy === "age-group") {
    patterns = categoryPatterns[slug] || patterns;
  } else if (taxonomy === "tag") {
    patterns = [slug, textSlug];
    if (slug === "transitioning") {
      patterns = ["transition", "transitioning", "transición", "transicion", "foot-exercises", "beginner"];
    }
  } else if (taxonomy === "brand") {
    patterns = [slug, textSlug];
  }

  return cleanPosts.filter((post) => matchesPatterns(post, patterns));
}

function archiveTypeLabel(archive = {}) {
  const path = archive.path || "";
  if (path.startsWith("/category/")) return "Categoría";
  if (path.startsWith("/tag/")) return "Etiqueta";
  if (path.startsWith("/brand/")) return "Marca";
  if (path.startsWith("/style/")) return "Estilo";
  if (path.startsWith("/age-group/")) return "Edad";
  return "Colección";
}

function archiveDisplayTitle(archive = {}) {
  const path = localizeSpanishUrl(archive.path || "");
  const [, , rawSlug = ""] = path.match(/^\/([^/]+)\/([^/]+)\//) || [];
  if (!rawSlug) return archive.title || "Contenido";
  if (["review", "reviews", "resena", "resenas"].includes(rawSlug.toLowerCase())) return "Opiniones";
  return humanizeArchiveSlug(rawSlug);
}

function useOpinionTerminology(value = "") {
  return String(value)
    .replace(/\b(?:Revisiones|Reseñas)\b/g, "Opiniones")
    .replace(/\b(?:revisiones|reseñas)\b/g, "opiniones")
    .replace(/\b(?:Revisión|Reseña)\b/g, "Mi opinión")
    .replace(/\b(?:revisión|reseña)\b/g, "opinión")
    .replace(/\bMi opinión\s+de\s+(?:la|las|los)\b/g, (match) => match.replace(/\s+de\s+/, " sobre "))
    .replace(/\bMi opinión\s+del\b/g, "Mi opinión sobre el")
    .replace(/\bMi opinión\s+de\b/g, "Mi opinión sobre")
    .replace(/\bmi\s+Mi opinión\b/g, "mi opinión");
}

function cleanImportedHtml(html, removeAmazonLinks = false) {
  if (!html) return "";

  const emptyToken = "(?:\\s|&nbsp;|&#160;|<br\\s*\\/?>)*";
  const emptyInlineToken = "(?:\\s|&nbsp;|&#160;|<br\\s*\\/?>|<!--(?:[\\s\\S]*?)-->|<(?:a|span|strong|em|b|i|code|small)(?:\\s[^>]*)?>\\s*<\\/(?:a|span|strong|em|b|i|code|small)>)*";
  const dashToken = "(?:\\s|&nbsp;|&#160;|[-–—•·|]|&ndash;|&mdash;)+";
  const discountHref = "(?:barefoot-minimalist-shoe-discounts-coupons|black-friday|cyber-monday|sales-discounts|discount|discounts|coupon|coupons|\\/tag\\/sales\\/|\\/tag\\/discounts\\/|\\/tag\\/coupons\\/|\\/tag\\/black-friday-sale\\/)";
  const discountText = "(?:descuento|descuentos|cup[oó]n|cupones|c[oó]digo|black friday|cyber monday|discount|discounts|coupon|coupons)";
  const externalMediaHref = "(?:youtube\\.com|youtu\\.be|vimeo\\.com|player\\.vimeo\\.com)";
  const pdfHref = "(?:\\.pdf(?:[?#][^\"']*)?)";
  const externalAssetHref = `(?:${externalMediaHref}|${pdfHref})`;
  const externalAssetText = "(?:youtube|vimeo|v[íi]deo|video|replay|descargar\\s+pdf|pdf)";
  const amazonHref = "(?:amzn\\.to|amazon\\.[a-z.]+)";
  const tiddlyHref = "(?:https?:\\/\\/(?:www\\.)?tidd\\.ly\\/[^\"']*)";
  const personalExperienceText = "(?:\\b(?:Anya|Ania|Justin|Samantha|Miranda|mi marido|mi esposo|mi hijo|mi hija|mis hijos|mi pod[oó]loga|nuestra casa|en mi familia)\\b|(?:Isabel aqu[ií]|yo,? Isabel|por Isabel|hijo de Isabel|Isabel y su|tienda de Isabel|reseñas? de Isabel))";
  let cleaned = String(html)
    .replace(/\s(?:srcset|sizes)=["'][^"']*["']/gi, "")
    .replace(/\saria-describedby=["'][^"']*["']/gi, "")
    .replace(/\s(width|height)="\d+"\s*/gi, " ")
    .replace(/([?&amp;])enablejsapi=1/gi, "")
    .replace(/([?&amp;])origin=https?:\/\/[^"'&]+/gi, "")
    .replace(/href=["']\/wp-json\/[^"']*["']/gi, 'href="/articulos/"')
    .replace(/value=["']\/wp-json\/[^"']*["']/gi, 'value=""')
    .replace(/<h1\b[^>]*>[\s\S]*(?:Tabla de contenidos|TableOfContents)[\s\S]*?<\/h1>/gi, "")
    .replace(/<h1\b([^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<div\b[^>]*class=["'][^"']*(?:wp-block-uagb-table-of-contents|uagb-toc__wrap)[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, "")
    .replace(/<form\b[\s\S]*?<\/form>/gi, "")
    .replace(/<input\b[^>]*>/gi, "")
    .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, "")
    .replace(/<button\b[\s\S]*?<\/button>/gi, "")
    .replace(/<nav\b[^>]*class=["'][^"']*(?:elementor-pagination|page-numbers)[^"']*["'][^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<div\b[^>]*data-widget_type=["']wp-widget-archives\.default["'][^>]*>[\s\S]*?<\/script>\s*<\/div>\s*<\/div>/gi, "")
    .replace(/<ul\b[^>]*class=["'][^"']*(?:wp-block-social-links|elementor-social-icons)[^"']*["'][^>]*>[\s\S]*?<\/ul>/gi, "")
    .replace(/<a\b[^>]*class=["'][^"']*(?:elementor-social-icon|wp-block-social-link-anchor)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<figure\b[^>]*class=["'][^"']*(?:wp-block-embed|wp-block-video|wp-block-embed-youtube|wp-block-embed-vimeo|wp-block-embed-instagram)[^"']*["'][^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<video\b[\s\S]*?<\/video>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*wp-block-button[^"']*["'][^>]*>(?:(?!<\\/div>)[\\s\\S])*href=["']${tiddlyHref}["'](?:(?!<\\/div>)[\\s\\S])*<\\/div>`, "gi"), "")
    .replace(new RegExp(`<a\\b(?=[^>]*href=["']${tiddlyHref}["'])[^>]*>([\\s\\S]*?)<\\/a>`, "gi"), "$1")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*(?:elementor-widget-video|wp-block-embed|wp-block-video|ast-oembed-container)[^"']*["'][^>]*>[\\s\\S]*?<\\/div>`, "gi"), "")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*(?:elementor-widget-button|wp-block-button)[^"']*["'][^>]*>(?:(?!<\\/div>)[\\s\\S])*${externalAssetText}(?:(?!<\\/div>)[\\s\\S])*<\\/div>`, "gi"), "")
    .replace(new RegExp(`<a\\b[^>]*href=["'][^"']*${externalAssetHref}[^"']*["'][^>]*>(?:(?!<\\/a>)[\\s\\S])*<\\/a>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>(?:(?!<\\/p>)[\\s\\S])*${externalAssetHref}(?:(?!<\\/p>)[\\s\\S])*<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>(?:(?!<\\/li>)[\\s\\S])*${externalAssetHref}(?:(?!<\\/li>)[\\s\\S])*<\\/li>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>(?:(?!<\\/p>)[\\s\\S])*${externalAssetText}(?:(?!<\\/p>)[\\s\\S])*<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>(?:(?!<\\/li>)[\\s\\S])*${externalAssetText}(?:(?!<\\/li>)[\\s\\S])*<\\/li>`, "gi"), "")
    .replace(new RegExp(`<a\\b[^>]*href=["'][^"']*${discountHref}[^"']*["'][^>]*>(?:(?!<\\/a>)[\\s\\S])*<\\/a>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>(?:(?!<\\/p>)[\\s\\S])*${discountText}(?:(?!<\\/p>)[\\s\\S])*<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>(?:(?!<\\/li>)[\\s\\S])*${discountText}(?:(?!<\\/li>)[\\s\\S])*<\\/li>`, "gi"), "")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*(?:wp-block-button|uagb-infobox|eael-grid-post-holder-inner)[^"']*["'][^>]*>(?:(?!<\\/div>)[\\s\\S])*${discountText}(?:(?!<\\/div>)[\\s\\S])*<\\/div>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>(?:(?!<\\/p>)[\\s\\S])*${personalExperienceText}(?:(?!<\\/p>)[\\s\\S])*<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>(?:(?!<\\/li>)[\\s\\S])*${personalExperienceText}(?:(?!<\\/li>)[\\s\\S])*<\\/li>`, "gi"), "")
    .replace(new RegExp(`<figcaption\\b[^>]*>(?:(?!<\\/figcaption>)[\\s\\S])*${personalExperienceText}(?:(?!<\\/figcaption>)[\\s\\S])*<\\/figcaption>`, "gi"), "")
    .replace(new RegExp(`<li([^>]*)>${emptyInlineToken}<\\/li>`, "gi"), "")
    .replace(new RegExp(`<li([^>]*)>${emptyToken}<\\/li>`, "gi"), "")
    .replace(new RegExp(`<li([^>]*)>${dashToken}<\\/li>`, "gi"), "")
    .replace(new RegExp(`<p([^>]*)>${emptyInlineToken}<\\/p>`, "gi"), "")
    .replace(new RegExp(`<p([^>]*)>${emptyToken}<\\/p>`, "gi"), "")
    .replace(new RegExp(`<p([^>]*)>${dashToken}<\\/p>`, "gi"), "")
    .replace(new RegExp(`<p([^>]*)>${emptyInlineToken}<\\/p>`, "gi"), "")
    .replace(new RegExp(`<p([^>]*)>${emptyToken}<\\/p>`, "gi"), "")
    .replace(new RegExp(`<p([^>]*)>${dashToken}<\\/p>`, "gi"), "");

  for (const [from, to] of Object.entries(legacyUrlMap)) {
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    cleaned = cleaned.replace(new RegExp(`href=["']${escapedFrom}["']`, "g"), `href="${to}"`);
  }

  for (const [from, to] of Object.entries(importedUrlMap)) {
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    cleaned = cleaned.replace(new RegExp(`href=["']${escapedFrom}([?#][^"']*)?["']`, "g"), (_match, suffix = "") => {
      return `href="${to}${suffix}"`;
    });
  }

  cleaned = cleaned.replace(/href=(["'])(\/[^"']*)\1/gi, (match, quote, href) => {
    return `href=${quote}${localizeSpanishUrl(href)}${quote}`;
  });

  cleaned = cleaned.replace(/href=["'](\/[^"']*)["']/g, (_match, href) => {
    return `href="${localizeSpanishUrl(href)}"`;
  });

  if (removeAmazonLinks) {
    cleaned = cleaned
      .replace(new RegExp(`<a\\b[^>]*href=["'][^"']*${amazonHref}[^"']*["'][^>]*>([\\s\\S]*?)<\\/a>`, "gi"), "$1")
      .replace(/\s+\(AMAZON\)/gi, "");
  }

  let previous;
  do {
    previous = cleaned;
    cleaned = cleaned
      .replace(new RegExp(`<ul([^>]*)>${emptyToken}<\\/ul>`, "gi"), "")
      .replace(new RegExp(`<ol([^>]*)>${emptyToken}<\\/ol>`, "gi"), "")
      .replace(new RegExp(`<((?:div|section|figure|aside))\\b[^>]*>${emptyInlineToken}<\\/\\1>`, "gi"), "");
  } while (cleaned !== previous);

  return useOpinionTerminology(sanitizeAffiliateLinks(cleaned));
}

function cleanSummaryText(text) {
  if (!text) return "";

  const cleaned = useOpinionTerminology(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/https?:\/\/\S*(?:youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|\.pdf)\S*/gi, " ")
    .replace(/\bREPLAY\b/gi, " ")
    .replace(/Demand\s+90-MIN\.\s+WORKSHOP\s+REPLAY/gi, " ")
    .replace(/Descargar\s+PDF/gi, " ")
    .replace(/\[cadalip\]/gi, " ")
    .replace(/Presented by Barefoot Opiniones\s*&quot;\s*Petra Fisher Movement/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length <= 165) return cleaned;
  const shortened = cleaned.slice(0, 162).replace(/\s+\S*$/, "");
  return `${shortened}...`;
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function seoTitle(title, siteName = "Barefoot Opiniones", pageUrl = "") {
  let cleanTitle = decodeHtmlEntities(seoTitleOverrides[pageUrl] || title || siteName)
    .replace(/\s+/g, " ")
    .replace(/\s*\|\s*Archivo\b/gi, "")
    .replace(/^Archivo(?:\s+de)?\s+/i, "")
    .trim();

  if (!seoTitleOverrides[pageUrl] && cleanTitle.startsWith("Mi opinión sobre ") && cleanTitle.includes(":")) {
    cleanTitle = cleanTitle.split(":", 1)[0].trim();
  }

  if (!cleanTitle || cleanTitle === siteName) return siteName;

  const suffix = ` | ${siteName}`;
  const brandedTitle = `${cleanTitle}${suffix}`;
  return brandedTitle.length > 52 ? cleanTitle : brandedTitle;
}

function absoluteSiteUrl(site, url = "") {
  if (!url) return site.url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${site.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

function localizeUrl(url = "") {
  return localizeSpanishUrl(url);
}

function schemaText(value = "") {
  return decodeHtmlEntities(String(value || ""))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function schemaFaqAnswer(value = "", fallback = "") {
  let answerHtml = String(value || "");
  const bodyMarker = answerHtml.indexOf('data-article-content');
  if (bodyMarker !== -1) {
    const bodyStart = answerHtml.indexOf(">", bodyMarker);
    const bodyEnd = answerHtml.indexOf('<aside class="article-author-card"', bodyStart);
    answerHtml = answerHtml.slice(bodyStart + 1, bodyEnd === -1 ? undefined : bodyEnd);
  }
  return schemaText(answerHtml).slice(0, 5000) || fallback;
}

function schemaDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function schemaPageType(relativePageUrl = "/", contentType = "", page = {}, pageClass = "") {
  if (relativePageUrl === "/sobre-mi/") return "ProfilePage";
  if (relativePageUrl === "/contacto/") return "ContactPage";
  if (contentType === "FAQ" || page.inputPath?.includes("/faqs/")) return "FAQPage";
  if (contentType === "Artículo" || page.inputPath?.includes("/posts/")) return "BlogPosting";
  if (
    pageClass?.includes("archive") ||
    /^\/(?:articulos|opiniones|recursos|ninos|mujeres|estilo|mejores-zapatos-barefoot|preguntas-frecuentes-barefoot)(?:\/|$)/.test(relativePageUrl) ||
    /^\/(?:temas|tema|categoria|preguntas\/categoria)(?:\/|$)/.test(relativePageUrl)
  ) return "CollectionPage";
  return "WebPage";
}

function schemaBreadcrumbs(relativePageUrl, pageUrl, pageTitle, site) {
  const items = [{
    "@type": "ListItem",
    position: 1,
    name: "Inicio",
    item: `${site.url}/`
  }];
  if (relativePageUrl === "/") return items;

  const articlePath = relativePageUrl !== "/articulos/" && !relativePageUrl.startsWith("/preguntas/");
  const isArticle = articlePath && !relativePageUrl.startsWith("/pagina/");
  if (isArticle && !/^\/(?:sobre-mi|contacto|privacy-policy|terms-of-service|disclaimers)\/$/.test(relativePageUrl)) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Artículos",
      item: `${site.url}/articulos/`
    });
  }
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: pageTitle,
    item: pageUrl
  });
  return items;
}

function validAggregateRating(value = {}) {
  if (!value || typeof value !== "object") return null;
  const ratingValue = Number(value.ratingValue);
  const ratingCount = Number(value.ratingCount || value.reviewCount);
  const bestRating = Number(value.bestRating || 5);
  const worstRating = Number(value.worstRating || 1);
  if (![ratingValue, ratingCount, bestRating, worstRating].every(Number.isFinite)) return null;
  if (ratingCount < 1 || bestRating <= worstRating || ratingValue < worstRating || ratingValue > bestRating) return null;
  return {
    "@type": "AggregateRating",
    ratingValue,
    ratingCount,
    bestRating,
    worstRating
  };
}

function schemaGraph(
  page = {}, site = {}, title, description, image, contentType, date, sourceModified,
  content = "", pageClass = "", aggregateRating = null, reviewedItem = null, faqItems = []
) {
  const relativePageUrl = typeof page.url === "string" ? page.url : "/";
  const pageUrl = absoluteSiteUrl(site, relativePageUrl);
  const cleanDescription = cleanSummaryText(description || site.description);
  const pageTitle = title || site.name;
  const imageUrl = absoluteSiteUrl(site, image || site.heroImage || "");
  const pageType = schemaPageType(relativePageUrl, contentType, page, pageClass);
  const personId = `${site.url}/sobre-mi/#isabel`;
  const organizationId = `${site.url}/#organization`;
  const websiteId = `${site.url}/#website`;
  const webpageId = `${pageUrl}#webpage`;
  const author = site.authorProfile || { name: site.author || "Isabel", url: "/sobre-mi/" };
  const published = schemaDate(date);
  const modified = schemaDate(sourceModified || date);

  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      alternateName: "BarefootOpiniones",
      url: site.url,
      description: cleanSummaryText(site.description),
      foundingDate: "2018",
      founder: { "@id": personId },
      logo: {
        "@type": "ImageObject",
        "@id": `${site.url}/#logo`,
        url: absoluteSiteUrl(site, "/assets/brand/barefoot-opiniones-mark.svg"),
        contentUrl: absoluteSiteUrl(site, "/assets/brand/barefoot-opiniones-mark.svg"),
        width: 128,
        height: 128,
        caption: site.name
      }
    },
    {
      "@type": "Person",
      "@id": personId,
      name: author.name || "Isabel",
      url: absoluteSiteUrl(site, author.url || "/sobre-mi/"),
      image: {
        "@type": "ImageObject",
        url: absoluteSiteUrl(site, author.image || "/assets/images/isabel-author.png"),
        contentUrl: absoluteSiteUrl(site, author.image || "/assets/images/isabel-author.png"),
        width: 1920,
        height: 1920,
        caption: author.name || "Isabel"
      },
      jobTitle: author.jobTitle || "Autora y editora",
      description: author.description,
      worksFor: { "@id": organizationId },
      knowsAbout: [
        "calzado barefoot",
        "calzado minimalista",
        "puntera ancha",
        "transición al calzado barefoot"
      ]
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${site.url}/`,
      name: site.name,
      alternateName: "BarefootOpiniones",
      description: cleanSummaryText(site.description),
      publisher: { "@id": organizationId },
      creator: { "@id": personId },
      inLanguage: "es-ES"
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: schemaBreadcrumbs(relativePageUrl, pageUrl, pageTitle, site)
    },
    {
      "@type": pageType,
      "@id": webpageId,
      url: pageUrl,
      name: pageTitle,
      headline: pageTitle,
      description: cleanDescription,
      isPartOf: { "@id": websiteId },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "es-ES",
      primaryImageOfPage: imageUrl ? { "@id": `${pageUrl}#primaryimage` } : undefined
    }
  ];

  if (imageUrl) {
    graph.splice(3, 0, {
      "@type": "ImageObject",
      "@id": `${pageUrl}#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
      caption: pageTitle
    });
  }

  const primary = graph[graph.length - 1];
  if (imageUrl) primary.image = { "@id": `${pageUrl}#primaryimage` };
  if (pageType === "BlogPosting") {
    primary.mainEntityOfPage = { "@id": webpageId };
    primary.author = { "@id": personId };
    primary.publisher = { "@id": organizationId };
    primary.isAccessibleForFree = true;
    primary.wordCount = schemaText(content).split(/\s+/).filter(Boolean).length;
    if (published) primary.datePublished = published;
    if (modified) primary.dateModified = modified;
  }
  if (pageType === "ProfilePage") {
    primary.mainEntity = { "@id": personId };
    primary.about = { "@id": personId };
  }
  if (pageType === "FAQPage") {
    const answerText = schemaFaqAnswer(content, cleanDescription);
    primary.author = { "@id": personId };
    primary.publisher = { "@id": organizationId };
    if (published) primary.datePublished = published;
    if (modified) primary.dateModified = modified;
    primary.mainEntity = [{
      "@type": "Question",
      name: pageTitle,
      acceptedAnswer: {
        "@type": "Answer",
        text: answerText
      }
    }];
  }

  // Aggregate ratings are emitted only with real, visible scores and a
  // specifically identified reviewed item. This avoids invalid site-wide stars.
  const rating = validAggregateRating(aggregateRating);
  if (rating && reviewedItem?.name) {
    const reviewedItemId = `${pageUrl}#reviewed-item`;
    graph.push({
      "@type": reviewedItem.type || "Product",
      "@id": reviewedItemId,
      name: reviewedItem.name,
      url: absoluteSiteUrl(site, reviewedItem.url || relativePageUrl),
      brand: reviewedItem.brand ? { "@type": "Brand", name: reviewedItem.brand } : undefined,
      image: imageUrl || undefined,
      aggregateRating: rating
    });
    primary.about = { "@id": reviewedItemId };
  }

  const visibleFaqItems = Array.isArray(faqItems)
    ? faqItems.filter((item) => item?.question && item?.answer)
    : [];
  if (pageType !== "FAQPage" && visibleFaqItems.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      url: pageUrl,
      inLanguage: "es-ES",
      mainEntity: visibleFaqItems.map((item) => ({
        "@type": "Question",
        name: cleanSummaryText(item.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: cleanSummaryText(item.answer)
        }
      }))
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)
    .replace(/</g, "\\u003c");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.ignores.add("src/descuentos.md");
  eleventyConfig.ignores.add("src/imported/posts/*black-friday*.md");
  eleventyConfig.ignores.add("src/imported/posts/*cyber-monday*.md");
  eleventyConfig.ignores.add("src/imported/posts/*discount*.md");
  eleventyConfig.ignores.add("src/imported/posts/*coupon*.md");
  eleventyConfig.ignores.add("src/imported/posts/*sales*.md");

  eleventyConfig.addFilter("readableDate", (date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  });

  eleventyConfig.addFilter("htmlDateString", (date) => {
    return date.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("cleanImportedHtml", cleanImportedHtml);
  eleventyConfig.addFilter("cleanSummary", cleanSummaryText);
  eleventyConfig.addFilter("featuredImage", (post) => {
    return modelImageAssignments[post?.data?.sourceSlug]?.featured?.src || post?.data?.image || "";
  });
  eleventyConfig.addFilter("featuredImageAlt", (post) => {
    return modelImageAssignments[post?.data?.sourceSlug]?.featured?.alt || post?.data?.imageAlt || post?.data?.title || "";
  });
  eleventyConfig.addFilter("seoTitle", seoTitle);
  eleventyConfig.addFilter("seoDescription", (description, fallback) => {
    const cleaned = cleanSummaryText(description);
    if (cleaned && cleaned.length >= 45) return cleaned;
    return cleanSummaryText(fallback || "Guías, opiniones y recursos de Isabel para elegir zapatos barefoot bonitos, cómodos y con forma de pie.");
  });
  eleventyConfig.addFilter("schemaJson", (value) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("isDiscountUrl", isDiscountUrl);
  eleventyConfig.addFilter("uniqueLocalizedSitemapUrls", (items = []) => {
    const seen = new Set();
    return items.filter((item) => {
      const localizedPath = localizeSpanishUrl(item.path);
      if (seen.has(localizedPath)) return false;
      seen.add(localizedPath);
      return true;
    });
  });
  eleventyConfig.addFilter("localizeUrl", localizeUrl);
  eleventyConfig.addFilter("pageNumbers", (total, size = 24) => {
    return Array.from({ length: Math.ceil(Number(total || 0) / Number(size || 24)) }, (_, index) => index + 1);
  });
  eleventyConfig.addFilter("articlePageUrl", (pageNumber) => {
    return Number(pageNumber) === 1 ? "/articulos/" : `/articulos/pagina/${pageNumber}/`;
  });
  eleventyConfig.addFilter("guidePageUrl", (pageNumber) => {
    return Number(pageNumber) === 1 ? "/recursos/" : `/recursos/pagina/${pageNumber}/`;
  });
  eleventyConfig.addShortcode("schemaGraph", schemaGraph);

  eleventyConfig.addFilter("topicPosts", (posts, topic) => {
    return publicPosts(posts).filter((post) => matchesTopic(post, topic));
  });

  eleventyConfig.addFilter("sortByTitle", (posts) => {
    return [...posts].sort((a, b) => a.data.title.localeCompare(b.data.title, "es"));
  });

  eleventyConfig.addFilter("featuredPosts", (posts) => {
    const seen = new Set();
    const featured = [];
    for (const topic of blogTopics.categories) {
      const post = publicPosts(posts).find((item) => !seen.has(item.url) && matchesTopic(item, topic));
      if (post) {
        seen.add(post.url);
        featured.push(post);
      }
      if (featured.length >= 10) {
        break;
      }
    }
    return featured;
  });

  eleventyConfig.addFilter("stylePosts", (posts) => {
    return publicPosts(posts).filter((post) => matchesPatterns(post, stylePatterns));
  });

  eleventyConfig.addFilter("resourcePosts", (posts) => {
    return publicPosts(posts).filter((post) => matchesPatterns(post, resourcePatterns));
  });

  eleventyConfig.addFilter("shoeListPosts", (posts) => {
    return publicPosts(posts).filter((post) => matchesPatterns(post, shoeListPatterns));
  });

  eleventyConfig.addFilter("kidsPosts", (posts) => {
    return publicPosts(posts).filter((post) => matchesPatterns(post, kidsPatterns));
  });

  eleventyConfig.addFilter("postsMatchingPatterns", (posts, patterns) => {
    return publicPosts(posts).filter((post) => matchesPatterns(post, patterns || []));
  });

  eleventyConfig.addFilter("archivePosts", archivePosts);
  eleventyConfig.addFilter("archiveTypeLabel", archiveTypeLabel);
  eleventyConfig.addFilter("archiveDisplayTitle", archiveDisplayTitle);

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("importedPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob(["src/imported/posts/*.md", "src/posts/*.md"])
      .filter((post) => !isDiscountPost(post))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("importedPostsAfterFirstPage", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob(["src/imported/posts/*.md", "src/posts/*.md"])
      .filter((post) => !isDiscountPost(post))
      .sort((a, b) => b.date - a.date)
      .slice(24);
  });

  eleventyConfig.addCollection("topicArchivePages", (collectionApi) => {
    const posts = publicPosts(
      collectionApi
        .getFilteredByGlob(["src/imported/posts/*.md", "src/posts/*.md"])
        .filter((post) => !isDiscountPost(post))
        .sort((a, b) => b.date - a.date)
    );
    const pageSize = 24;

    return blogTopics.categories.flatMap((topic) => {
      const topicItems = posts.filter((post) => matchesTopic(post, topic));
      const totalPages = Math.max(1, Math.ceil(topicItems.length / pageSize));
      const pageUrls = Array.from({ length: totalPages }, (_, index) =>
        topic.key === "opiniones"
          ? `/opiniones/${index + 1}/`
          : index === 0 ? topic.url : `${topic.url}pagina/${index + 1}/`
      );
      return Array.from({ length: totalPages }, (_, index) => ({
        topic,
        posts: topicItems.slice(index * pageSize, (index + 1) * pageSize),
        total: topicItems.length,
        pageNumber: index + 1,
        totalPages,
        url: pageUrls[index],
        previousUrl: index > 0 ? pageUrls[index - 1] : null,
        nextUrl: index + 1 < totalPages ? pageUrls[index + 1] : null,
        pageLinks: pageUrls.map((url, pageIndex) => ({ number: pageIndex + 1, url }))
      }));
    });
  });

  eleventyConfig.addCollection("resourcePosts", (collectionApi) => {
    return publicPosts(
      collectionApi
        .getFilteredByGlob(["src/imported/posts/*.md", "src/posts/*.md"])
        .filter((post) => !isDiscountPost(post))
        .sort((a, b) => b.date - a.date)
    ).filter((post) => matchesPatterns(post, resourcePatterns));
  });

  eleventyConfig.addCollection("resourcePostsAfterFirstPage", (collectionApi) => {
    return publicPosts(
      collectionApi
        .getFilteredByGlob(["src/imported/posts/*.md", "src/posts/*.md"])
        .filter((post) => !isDiscountPost(post))
        .sort((a, b) => b.date - a.date)
    ).filter((post) => matchesPatterns(post, resourcePatterns)).slice(24);
  });

  eleventyConfig.addCollection("importedPages", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/imported/pages/*.md")
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  eleventyConfig.addCollection("importedFaqs", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/imported/faqs/*.md")
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  eleventyConfig.addTransform("localizeInternalUrls", function (content) {
    if (typeof this.page.outputPath !== "string" || !this.page.outputPath.endsWith(".html")) return content;
    return content.replace(/href=(["'])(\/[^"']*)\1/gi, (match, quote, href) => {
      return `href=${quote}${localizeSpanishUrl(href)}${quote}`;
    });
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
