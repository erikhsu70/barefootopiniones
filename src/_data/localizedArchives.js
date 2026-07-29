const anyasSitemap = require("./anyasSitemap.js");

const retiredArchivePatterns = [
  /^\/author\//,
  /^\/brand\/(?:anyas-shop|by-anya)\//,
  /^\/category\/reviews(?:\/|$)/,
  /^\/tag\/(?:black-friday-sale|coupons|discounts|free-shipping|giveaway|sales|thanksgiving-sale)\//
];

module.exports = anyasSitemap.generatedPages.filter((page) => {
  return !retiredArchivePatterns.some((pattern) => pattern.test(page.path));
});
