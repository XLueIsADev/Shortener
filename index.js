const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

/* Serve index.html, style.css, app.js, etc. */
app.use(express.static(__dirname));


/* =========================
   URL STORAGE
========================= */

const urls = new Map();

const CODE_LENGTH = 6;

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


function generateCode() {

  let code = "";

  for (let i = 0; i < CODE_LENGTH; i++) {

    code += ALPHABET[
      Math.floor(
        Math.random() * ALPHABET.length
      )
    ];

  }

  return code;
}


/* =========================
   SHORTEN API
========================= */

app.post("/api/shorten", (req, res) => {

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "Invalid URL"
    });
  }

  let code = generateCode();

  while (urls.has(code)) {
    code = generateCode();
  }

  urls.set(code, url);

  const protocol =
    req.headers["x-forwarded-proto"] ||
    req.protocol;

  const host = req.get("host");

  const shortUrl =
    `${protocol}://${host}/${code}`;

  res.json({
    shortUrl
  });

});


/* =========================
   REDIRECT
========================= */

app.get("/:code", (req, res) => {

  const target = urls.get(req.params.code);

  if (!target) {
    return res
      .status(404)
      .send("Short URL not found.");
  }

  res.redirect(target);

});


/* =========================
   START
========================= */

app.listen(PORT, () => {

  console.log(
    `Shortener running on port ${PORT}`
  );

});
