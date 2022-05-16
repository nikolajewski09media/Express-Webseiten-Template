"use strict";

const validChangeFreq = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
];

const sitemap_index = (options) => {
  const sitemapUrl =
    options && options.sitemapUrl ? options.sitemapUrl : "/sitemap.xml";
  const urls = options && options.urls ? options.urls : [];

  return (req, res, next) => {
    if (req.url === sitemapUrl) {
      res.header("Content-Type", "application/xml");

      let xmlUrls = "";
      urls.forEach((url) => {
        if (!("url" in url) || !url.url) {
          return;
        }

        const lineUrl = `<loc>${url.url}</loc>`;
        const lineLastMod =
          "lastmod" in url ? `<lastmod>${url.lastmod}</lastmod>` : "";
        const lineChangeFreq =
          "changefreq" in url && validChangeFreq.indexOf(url.changefreq) !== -1
            ? `<changefreq>${url.changefreq}</changefreq>`
            : "";
        const linePriority =
          "priority" in url && url.priority >= 0 && url.priority <= 1
            ? `<priority>${url.priority}</priority>`
            : "";

        xmlUrls += getSitemaps(
          lineUrl,
          lineLastMod,
          lineChangeFreq,
          linePriority
        );
      });

      //res.send(getXml(xmlUrls));
      return res.send(getXmlIndex(xmlUrls));
    }

    next();
  };
};

const getUrl = (url, lastMod, changeFreq, priority) => {
  let result = `
<url>
    ${url}`;

  if (lastMod) {
    result += `
    ${lastMod}`;
  }

  if (changeFreq) {
    result += `
    ${changeFreq}`;
  }

  if (priority) {
    result += `
    ${priority}`;
  }

  result += `
</url>`;

  return result;
};
const getSitemaps = (url, lastMod, changeFreq, priority) => {
  let result = `
<sitemap>
    ${url}`;

  if (lastMod) {
    result += `
    ${lastMod}`;
  }

  if (changeFreq) {
    result += `
    ${changeFreq}`;
  }

  if (priority) {
    result += `
    ${priority}`;
  }

  result += `
</sitemap>`;

  return result;
};

const getXml = (urls) => {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>
    `.trim();
};
const getXmlIndex = (urls) => {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${urls}
</sitemapindex>
      `.trim();
};

module.exports = sitemap_index;

module.exports.default = module.exports;
