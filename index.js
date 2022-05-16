const express = require("express");
const app = express();
const compression = require("compression");
const robots = require("./modules/3rd-party-costum-module/express-robots-txt/commonjs");
const minifyHTML = require("express-minify-html-2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

//options ===========================================
const { STANDARD_ROUTEN, DOMAIN, DEV_MODE, DYN_LOGO } = require("./__OPTIONS");

const {
  PATH_TO_IMG,
  LOGO_IMG,
  LOGO_LENGTH,
  LOGO_HEIGHT,
  LOGO_DYN_PART_FONT,
  LOGO_DYN_PART_COLOR,
  LOGO_DYN_PART_POS_X,
  LOGO_DYN_PART_POS_Y,
} = require("./modules/dynPic.js");

const SITE_KEY = process.env.SITE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

//costum Routes =====================================
const modRoutes = require("./modules/modulareRouten");
const sitemap = require("./modules/sitemapRoutes");

//Express relevanter Code============================
app.set("view engine", "ejs");
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

app.use(
  minifyHTML({
    override: !DEV_MODE,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);

//Root-Route ========================================
app.get(`/`, (req, res) => {
  res.render(`index`, { SITE_KEY, DOMAIN });
});

app.post("/contact-form", (req, res) => {
  if (!req.body.captcha) {
    console.log("err");
    return res.json({ success: false, msg: "Capctha is not checked" });
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${req.body.captcha}`;

  request(verifyUrl, (err, response, body) => {
    if (err) {
      console.log(err);
    }

    body = JSON.parse(body);

    if (!body.success && body.success === undefined) {
      return res.json({ success: false, msg: "captcha verification failed" });
    } else if (body.score < 0.5) {
      return res.json({
        success: false,
        msg: "you might be a bot, sorry!",
        score: body.score,
      });
    }

    // return json message or continue with your function. Example: loading new page, ect
    return res.json({
      success: true,
      msg: "captcha verification passed",
      score: body.score,
    });
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_ACCOUNT, pass: process.env.EMAIL_PASSWORD },
  });
  const mailOptions = {
    from: req.body.email,
    to: "info@solar-photovoltaikanlagen24.de",
    subject: `Anfrage von ${req.body.email}, Telefon: ${req.body.phone} über ${DOMAIN}`,
    text: req.body.text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      res.send("success");
    }
  });
});

//Statische Routen, welche immer gleich bleiben. ====
//(z.B. Über uns, FAQ, Leistungen usw.) =============
STANDARD_ROUTEN.forEach((route) => {
  app.get(`/${route}`, (req, res) => {
    res.render(`${route}/`, { SITE_KEY, DOMAIN });
  });
});

//Robots.txt-Route ==================================
app.use(
  robots({
    UserAgent: "*",
    Allow: "/",
    Sitemap: `https://${DOMAIN}/sitemap_index.xml`,
  })
);
//Sitemaps-Route ====================================
app.use(sitemap);

//Unterseiten-Routen=================================
app.use(modRoutes);

//404 Weiterleitung
app.get("*", function (req, res, next) {
  return res.status(404).render("404/index", { SITE_KEY, DOMAIN });
});

//Express relevanter Code ===========================
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
  console.log(`Open the Page with http://localhost:${port}`);
});
