const anyasSitemap = require("./anyasSitemap.js");
const { contentRecords, customLegacyPaths, faqLegacyPaths, legacyMainPaths, localizeUrl } = require("../_lib/spanish-urls.js");

const redirects = [
  { from: "/privacy-policy/", to: "/politica-de-privacidad/" },
  { from: "/terms-of-service/", to: "/condiciones-de-uso/" },
  { from: "/disclaimers/", to: "/avisos-legales/" },
  { from: "/categoria/primeros-pasos/", to: "/recursos/" },
  { from: "/marca/by-anya/", to: "/articulos/" },
  { from: "/marca/anyas-shop/", to: "/articulos/" },
  ...Object.entries(customLegacyPaths)
    .filter(([from]) => from.endsWith("/"))
    .map(([from, to]) => ({ from, to })),
  ...Object.entries(faqLegacyPaths)
    .filter(([from]) => from.endsWith("/"))
    .map(([from, to]) => ({ from, to })),
  ...Object.entries(legacyMainPaths).map(([from, to]) => ({ from, to })),
  ...contentRecords
    .filter((record) => record.from !== record.to && record.from !== "/")
    .map((record) => ({ from: record.from, to: record.to })),
  ...contentRecords
    .flatMap((record) => (record.previousTos || []).map((from) => ({ from, to: record.to }))),
  ...Array.from({ length: 6 }, (_, index) => ({
    from: `/temas/resenas/pagina/${index + 2}/`,
    to: `/opiniones/${index + 2}/`
  })),
  ...Array.from({ length: 6 }, (_, index) => ({
    from: `/opiniones/pagina/${index + 2}/`,
    to: `/opiniones/${index + 2}/`
  })),
  ...anyasSitemap.generatedPages
    .map((page) => ({ from: page.path, to: localizeUrl(page.path) }))
    .filter((redirect) => redirect.from !== redirect.to)
];

const activeDestinations = new Set(
  contentRecords.filter((record) => !record.retired).map((record) => record.to)
);

const uniqueRedirects = new Map();
for (const redirect of redirects) {
  if (!uniqueRedirects.has(redirect.from)) uniqueRedirects.set(redirect.from, redirect);
}

module.exports = [...uniqueRedirects.values()]
  .filter((redirect) => !activeDestinations.has(redirect.from));
