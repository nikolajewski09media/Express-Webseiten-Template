const express = require("express");
const router = express.Router();

const sitemap = require("./3rd-party-costum-module/express-simple-sitemap");
const sitemap_index = require("./3rd-party-costum-module/express-simple-sitemap_index/index");

const sitemap_contents = require("./sitemap_contents");
let sitemap_index_array = [];

const { KEYWORDS, UPLOAD_DATE, DOMAIN } = require("../__OPTIONS");

let sitemapLimiter = 0;

KEYWORDS.forEach((keyword) => {
  sitemapLimiter += Math.ceil(sitemap_contents(keyword, 1, 1).length / 1000);
});

for (let i = 1; i <= sitemapLimiter; i++) {
  sitemap_index_array.push({
    url: `https://${DOMAIN}/sitemap_${i}.xml`,
    lastmod: UPLOAD_DATE,
  });
}

router.use(
  sitemap_index({
    sitemapUrl: `/sitemap_index.xml`,
    urls: sitemap_index_array,
  })
);

for (let i = 0; i <= KEYWORDS.length; i++) {
  const steps = sitemapLimiter / KEYWORDS.length;
  let starter = 0;
  if (i < 0) {
    starter += steps;
  }
  for (let j = i * steps + 1; j <= (i + 1) * steps; j++) {
    router.use(
      sitemap({
        sitemapUrl: `/sitemap_${j}.xml`,
        urls: sitemap_contents(KEYWORDS[i], j, sitemapLimiter, starter),
      })
    );
  }
}

module.exports = router;
