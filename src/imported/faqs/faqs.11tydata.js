const { bySourceSlug } = require("../../_lib/spanish-urls.js");

module.exports = {
  eleventyComputed: {
    permalink: (data) => bySourceSlug[data.sourceSlug]?.to || data.permalink
  }
};
