const {
  DOMAIN,
  UPLOAD_DATE,
  STANDARD_ROUTEN,
  KEYWORD_REVERSE,
} = require("../__OPTIONS");

const dBase = require("./dataBase");

const sitemap_contents = (keyword, counter, nenner, starter) => {
  const urlLoc = `https://${DOMAIN}/`;
  const stadt = dBase;
  const urlLocs = [];
  if (starter == 0) {
    urlLocs.push(urlLoc);
    STANDARD_ROUTEN.forEach((route) => {
      urlLocs.push(`${urlLoc}${route}`);
    });
  }
  if (KEYWORD_REVERSE) {
    stadt.forEach((route) => {
      urlLocs.push(`${urlLoc}${route.hauptortUrl}/${keyword}${route.ortUrl}`);
    });
  } else {
    stadt.forEach((route) => {
      urlLocs.push(`${urlLoc}${keyword}${route.hauptortUrl}/${route.ortUrl}`);
    });
  }

  const sitemap_content = [];

  for (let i = 0; i < urlLocs.length; i++) {
    sitemap_content.push({
      url: urlLocs[i],
      lastmod: UPLOAD_DATE,
      changefreq: "monthly",
      priority: 0.9,
    });
  }

  return sitemap_content.splice(
    sitemap_content.length * ((counter - 1) / nenner),
    sitemap_content.length * (counter / nenner)
  );
};

module.exports = sitemap_contents;
