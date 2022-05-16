const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

require("dotenv").config();
const mapBoxToken = process.env.MAPBOX_API_KEY;

const mapBoxApiUrl = (ort, bundesland) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${ort}%2C%20${bundesland}.json?country=de&limit=1&types=place%2Cpostcode&language=de&access_token=${mapBoxToken}`;

function httpGet(theUrl) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

const geoData = (url) => {
  try {
    return JSON.parse(httpGet(url)).features[0].geometry;
  } catch (e) {
    return { coordinates: [] };
  }
};

const geoShortCode = (url) => {
  try {
    if (
      JSON.parse(httpGet(url)).features[0].properties.short_code === undefined
    ) {
      return JSON.parse(httpGet(url)).features[0].context[0].short_code;
    } else {
      return JSON.parse(httpGet(url)).features[0].properties.short_code;
    }
  } catch (e) {
    return [];
  }
};

module.exports = { mapBoxApiUrl, geoData, geoShortCode };
