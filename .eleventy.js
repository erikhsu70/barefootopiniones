const blogTopics = require("./src/_data/blogTopics.js");

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
    resources: "Recursos",
    reviews: "Reseñas",
    transitioning: "Transición"
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
        reviews: "Reseñas",
        transitioning: "Transición",
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
  return "Archivo";
}

function archiveDisplayTitle(archive = {}) {
  const path = archive.path || "";
  const [, , rawSlug = ""] = path.match(/^\/([^/]+)\/([^/]+)\//) || [];
  if (!rawSlug) return archive.title || "Archivo";
  return humanizeArchiveSlug(rawSlug);
}

function cleanImportedHtml(html, removeAmazonLinks = false) {
  if (!html) return "";

  const emptyToken = "(?:\\s|&nbsp;|&#160;|<br\\s*\\/?>)*";
  const emptyInlineToken = "(?:\\s|&nbsp;|&#160;|<br\\s*\\/?>|<(?:span|strong|em|b|i|code)(?:\\s[^>]*)?>\\s*<\\/(?:span|strong|em|b|i|code)>)*";
  const dashToken = "(?:\\s|&nbsp;|&#160;|[-–—•·|]|&ndash;|&mdash;)+";
  const discountHref = "(?:barefoot-minimalist-shoe-discounts-coupons|black-friday|cyber-monday|sales-discounts|discount|discounts|coupon|coupons|\\/tag\\/sales\\/|\\/tag\\/discounts\\/|\\/tag\\/coupons\\/|\\/tag\\/black-friday-sale\\/)";
  const discountText = "(?:descuento|descuentos|cup[oó]n|cupones|c[oó]digo|black friday|cyber monday|discount|discounts|coupon|coupons)";
  const externalMediaHref = "(?:youtube\\.com|youtu\\.be|vimeo\\.com|player\\.vimeo\\.com)";
  const pdfHref = "(?:\\.pdf(?:[?#][^\"']*)?)";
  const externalAssetHref = `(?:${externalMediaHref}|${pdfHref})`;
  const externalAssetText = "(?:youtube|vimeo|v[íi]deo|video|replay|descargar\\s+pdf|pdf)";
  const amazonHref = "(?:amzn\\.to|amazon\\.[a-z.]+)";
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
    .replace(/<form\b[\s\S]*?<\/form>/gi, "")
    .replace(/<input\b[^>]*>/gi, "")
    .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, "")
    .replace(/<button\b[\s\S]*?<\/button>/gi, "")
    .replace(/<nav\b[^>]*class=["'][^"']*(?:elementor-pagination|page-numbers)[^"']*["'][^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<ul\b[^>]*class=["'][^"']*(?:wp-block-social-links|elementor-social-icons)[^"']*["'][^>]*>[\s\S]*?<\/ul>/gi, "")
    .replace(/<a\b[^>]*class=["'][^"']*(?:elementor-social-icon|wp-block-social-link-anchor)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<figure\b[^>]*class=["'][^"']*(?:wp-block-embed|wp-block-video|wp-block-embed-youtube|wp-block-embed-vimeo|wp-block-embed-instagram)[^"']*["'][^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<video\b[\s\S]*?<\/video>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*(?:elementor-widget-video|wp-block-embed|wp-block-video|ast-oembed-container)[^"']*["'][^>]*>[\\s\\S]*?<\\/div>`, "gi"), "")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*(?:elementor-widget-button|wp-block-button)[^"']*["'][^>]*>[\\s\\S]*${externalAssetText}[\\s\\S]*?<\\/div>`, "gi"), "")
    .replace(new RegExp(`<a\\b[^>]*href=["'][^"']*${externalAssetHref}[^"']*["'][^>]*>[\\s\\S]*?<\\/a>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>[\\s\\S]*${externalAssetHref}[\\s\\S]*?<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>[\\s\\S]*${externalAssetHref}[\\s\\S]*?<\\/li>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>[\\s\\S]*${externalAssetText}[\\s\\S]*?<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>[\\s\\S]*${externalAssetText}[\\s\\S]*?<\\/li>`, "gi"), "")
    .replace(new RegExp(`<a\\b[^>]*href=["'][^"']*${discountHref}[^"']*["'][^>]*>[\\s\\S]*?<\\/a>`, "gi"), "")
    .replace(new RegExp(`<p\\b[^>]*>[\\s\\S]*${discountText}[\\s\\S]*?<\\/p>`, "gi"), "")
    .replace(new RegExp(`<li\\b[^>]*>[\\s\\S]*${discountText}[\\s\\S]*?<\\/li>`, "gi"), "")
    .replace(new RegExp(`<div\\b[^>]*class=["'][^"']*(?:wp-block-button|uagb-infobox|eael-grid-post-holder-inner)[^"']*["'][^>]*>[\\s\\S]*${discountText}[\\s\\S]*?<\\/div>`, "gi"), "")
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
      .replace(new RegExp(`<ol([^>]*)>${emptyToken}<\\/ol>`, "gi"), "");
  } while (cleaned !== previous);

  return cleaned;
}

function cleanSummaryText(text) {
  if (!text) return "";

  const cleaned = String(text)
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

function seoTitle(title, siteName = "Barefoot Opiniones") {
  const cleanTitle = decodeHtmlEntities(title || siteName).replace(/\s+/g, " ").trim();
  if (!cleanTitle || cleanTitle === siteName) return siteName;

  const suffix = ` | ${siteName}`;
  const maxTitlePart = 70 - suffix.length;
  const titlePart =
    cleanTitle.length > maxTitlePart
      ? `${cleanTitle.slice(0, Math.max(20, maxTitlePart - 1)).replace(/\s+\S*$/, "")}...`
      : cleanTitle;

  return `${titlePart}${suffix}`;
}

function absoluteSiteUrl(site, url = "") {
  if (!url) return site.url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${site.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

function schemaGraph(page = {}, site = {}, title, description, image, contentType, date, sourceModified) {
  const pageUrl = absoluteSiteUrl(site, page.url || "/");
  const cleanDescription = cleanSummaryText(description || site.description);
  const pageTitle = title || site.name;
  const imageUrl = absoluteSiteUrl(site, image || site.heroImage || "");
  const pageType =
    contentType === "FAQ"
      ? "FAQPage"
      : contentType === "Artículo" || page.url?.startsWith("/ufaq/") || page.inputPath?.includes("/posts/")
        ? "Article"
        : "WebPage";

  const graph = [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: absoluteSiteUrl(site, "/assets/brand/barefoot-opiniones-mark.svg")
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: cleanSummaryText(site.description),
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "es"
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: site.url
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageTitle,
          item: pageUrl
        }
      ]
    },
    {
      "@type": pageType,
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageTitle,
      headline: pageTitle,
      description: cleanDescription,
      isPartOf: { "@id": `${site.url}/#website` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "es"
    }
  ];

  const primary = graph[3];
  if (imageUrl) primary.image = imageUrl;
  if (pageType === "Article") {
    primary.author = { "@type": "Person", name: site.author || "Isabel" };
    primary.publisher = { "@id": `${site.url}/#organization` };
    if (date) primary.datePublished = new Date(date).toISOString();
    if (sourceModified || date) primary.dateModified = new Date(sourceModified || date).toISOString();
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
  eleventyConfig.addFilter("seoTitle", seoTitle);
  eleventyConfig.addFilter("seoDescription", (description, fallback) => {
    const cleaned = cleanSummaryText(description);
    if (cleaned && cleaned.length >= 45) return cleaned;
    return cleanSummaryText(fallback || "Guías, reseñas y recursos de Isabel para elegir zapatos barefoot bonitos, cómodos y con forma de pie.");
  });
  eleventyConfig.addFilter("schemaJson", (value) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("isDiscountUrl", isDiscountUrl);
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
      .getFilteredByGlob("src/imported/posts/*.md")
      .filter((post) => !isDiscountPost(post))
      .sort((a, b) => b.date - a.date);
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
