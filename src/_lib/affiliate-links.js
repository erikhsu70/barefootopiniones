const AFFILIATE_HOSTS = [
  "amzn.to",
  "alnk.to",
  "anrdoezrs.net",
  "avantlink.com",
  "awin1.com",
  "bit.ly",
  "buff.ly",
  "cutt.ly",
  "dpbolvw.net",
  "jdoqocy.com",
  "kqzyfj.com",
  "linksynergy.com",
  "qksrv.net",
  "ow.ly",
  "pntra.com",
  "pntrac.com",
  "redirectingat.com",
  "rebrand.ly",
  "rewardstyle.com",
  "rstyle.me",
  "shareasale.com",
  "shrsl.com",
  "shopstyle.it",
  "skimlinks.com",
  "sovrn.com",
  "tidd.ly",
  "tinyurl.com",
  "tkqlhce.com",
  "viglink.com"
];

const DESTINATION_PARAMS = [
  "url",
  "u",
  "dest",
  "destination",
  "redirect",
  "redirect_url",
  "merchanturl",
  "urllink",
  "rd_parm1"
];

const AFFILIATE_PARAMS = new Set([
  "aff",
  "aff_id",
  "affid",
  "affiliate",
  "affiliate_code",
  "affiliate_id",
  "affiliates",
  "afftrack",
  "ascsubtag",
  "clickid",
  "irclickid",
  "linkcode",
  "partner",
  "partnerid",
  "peachs_apc",
  "ref",
  "referral",
  "referral_code",
  "referring_service",
  "rfsn",
  "rs_ref",
  "sca_source",
  "sca_ref",
  "sscid",
  "spartner",
  "subid",
  "sub_id",
  "tag",
  "wickedsource"
]);

function decodeAttribute(value) {
  return String(value || "")
    .replace(/&amp;/gi, "&")
    .replace(/&#38;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function encodeAttribute(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function isAffiliateHost(hostname) {
  const host = String(hostname || "").toLowerCase().replace(/^www\./, "");
  return AFFILIATE_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function isAffiliateRedirect(url) {
  return isAffiliateHost(url.hostname) || /\/click-\d+(?:-\d+)*(?:\/|$)/i.test(url.pathname);
}

function decodeDestination(value) {
  let destination = decodeAttribute(value).trim();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (/^https?:\/\//i.test(destination)) return destination;
    try {
      const decoded = decodeURIComponent(destination);
      if (decoded === destination) break;
      destination = decoded;
    } catch {
      break;
    }
  }
  return /^https?:\/\//i.test(destination) ? destination : "";
}

function cleanDirectUrl(url) {
  let changed = false;
  const hasAffiliateUtm = [...url.searchParams.entries()].some(
    ([key, value]) => key.toLowerCase().startsWith("utm_") && value.toLowerCase().includes("affiliate")
  );
  const hasRefersion = url.searchParams.has("rfsn");
  const hasImportedTracking = [...url.searchParams.entries()].some(
    ([key, value]) =>
      (key.toLowerCase() === "utm_source" && /anya|affiliate/i.test(value)) ||
      (key.toLowerCase() === "utm_medium" && /affiliate|referral/i.test(value))
  );

  for (const [key, value] of [...url.searchParams.entries()]) {
    const normalized = key.toLowerCase();
    if (
      AFFILIATE_PARAMS.has(normalized) ||
      ((hasAffiliateUtm || hasRefersion || hasImportedTracking) && normalized.startsWith("utm_"))
    ) {
      url.searchParams.delete(key);
      changed = true;
    } else if (/\?(?:ref|rfsn|affiliate|aff_id|spartner|sca_ref)=/i.test(value)) {
      url.searchParams.set(key, value.replace(/\?(?:ref|rfsn|affiliate|aff_id|spartner|sca_ref)=.*$/i, ""));
      changed = true;
    }
  }

  if (/(^|\.)amazon\.[a-z.]+$/i.test(url.hostname)) {
    const cleanedPath = url.pathname.replace(/\/ref=[^/?#]*/i, "");
    if (cleanedPath !== url.pathname) {
      url.pathname = cleanedPath;
      changed = true;
    }
  }

  return { changed, href: url.toString() };
}

function sanitizeAffiliateHref(rawHref) {
  const decodedHref = decodeAttribute(rawHref).trim();
  if (!/^https?:\/\//i.test(decodedHref)) return { affiliate: false, href: rawHref };

  let url;
  try {
    url = new URL(decodedHref);
  } catch {
    return { affiliate: false, href: rawHref };
  }

  if (isAffiliateRedirect(url)) {
    let destination = "";
    for (const parameter of DESTINATION_PARAMS) {
      const value = [...url.searchParams.entries()].find(([key]) => key.toLowerCase() === parameter)?.[1];
      if (value) {
        destination = decodeDestination(value);
        if (destination) break;
      }
    }

    if (!destination) {
      const pathDestination = decodeDestination(decodeURIComponent(url.pathname).match(/(https?:\/\/.*)$/i)?.[1] || "");
      destination = pathDestination;
    }

    if (!destination) return { affiliate: true, href: null };
    const sanitizedDestination = sanitizeAffiliateHref(destination);
    return { affiliate: true, href: sanitizedDestination.href || null };
  }

  const cleaned = cleanDirectUrl(url);
  return { affiliate: cleaned.changed, href: cleaned.href };
}

function sanitizeAffiliateLinks(html) {
  if (!html) return "";

  const withoutExternalCtas = String(html)
    .replace(
      /<div\b[^>]*class=(?:"[^"]*\bwp-block-button\b[^"]*"|'[^']*\bwp-block-button\b[^']*')[^>]*>[\s\S]*?<\/div>/gi,
      (block) => (/href\s*=\s*(?:"https?:\/\/|'https?:\/\/)/i.test(block) ? "" : block)
    )
    .replace(
      /<div\b[^>]*class=(?:"[^"]*\bwp-block-button\b[^"]*"|'[^']*\bwp-block-button\b[^']*')[^>]*>[\s\S]*?<\/div>/gi,
      (block) => (/<a\b/i.test(block) ? block : "")
    )
    .replace(
      /<a\b(?=[^>]*class=(?:"[^"]*wp-block-button__link[^"]*"|'[^']*wp-block-button__link[^']*'))(?=[^>]*href=(?:"https?:\/\/|'https?:\/\/))[^>]*>[\s\S]*?<\/a>/gi,
      ""
    );

  return withoutExternalCtas.replace(
    /<a\b([^>]*?)href=(?:"([^"]*)"|'([^']*)')([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, before, doubleQuotedHref, singleQuotedHref, after, content) => {
      const quote = doubleQuotedHref !== undefined ? '"' : "'";
      const href = doubleQuotedHref ?? singleQuotedHref;
      const sanitized = sanitizeAffiliateHref(href);
      if (!sanitized.affiliate) return match;
      if (!sanitized.href) return content;
      return `<a${before}href=${quote}${encodeAttribute(sanitized.href)}${quote}${after}>${content}</a>`;
    }
  );
}

module.exports = {
  sanitizeAffiliateHref,
  sanitizeAffiliateLinks
};
