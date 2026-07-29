const { bySourceSlug, opinionTitle } = require("../../_lib/spanish-urls.js");

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      const record = bySourceSlug[data.sourceSlug];
      return record?.retired ? false : record?.to || data.permalink;
    },
    eleventyExcludeFromCollections: (data) => Boolean(bySourceSlug[data.sourceSlug]?.retired),
    title: (data) => opinionTitle(data.title),
    description: (data) => {
      const editorialTitle = opinionTitle(data.title);
      const details = "criterios de ajuste, materiales, comodidad, tipo de pie y uso diario";
      return editorialTitle.startsWith("Mi opinión sobre")
        ? `${editorialTitle}, con ${details}.`
        : `Guía práctica sobre ${editorialTitle}, con ${details}.`;
    },
    imageAlt: (data) => `Imagen destacada de ${opinionTitle(data.title).replace(/^Mi opinión sobre\s+/i, "")}`
  }
};
