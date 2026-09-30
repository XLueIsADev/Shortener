const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const links = new Map();

app.use(express.json());

app.post("/api/shorten", (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "A URL is required"
    });
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return res.status(400).json({
        error: "Only HTTP and HTTPS URLs are supported"
      });
    }
  } catch {
    return res.status(400).json({
      error: "Invalid URL"
    });
  }

  let code;

  do {
    code = crypto.randomBytes(4).toString("hex");
  } while (links.has(code));

  links.set(code, url);

  res.json({
    shortUrl: `${req.protocol}://${req.get("host")}/${code}`
  });
});

app.get("/:code", (req, res) => {
  const url = links.get(req.params.code);

  if (!url) {
    return res.status(404).send("Link not found");
  }

  res.redirect(url);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Shortener running on port ${port}`);
});
