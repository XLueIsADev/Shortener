const input = document.getElementById("url");
const button = document.getElementById("shorten-btn");
const result = document.getElementById("result");

document.getElementById("year").textContent = new Date().getFullYear();

function encodeUrl(url) {
  return btoa(unescape(encodeURIComponent(url)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeUrl(value) {
  try {
    return decodeURIComponent(
      escape(atob(value.replace(/-/g, "+").replace(/_/g, "/")))
    );
  } catch {
    return null;
  }
}

function getBaseUrl() {
  return window.location.href.split("#")[0];
}

function shorten() {
  const url = input.value.trim();

  if (!url) {
    showResult("enter a URL", true);
    return;
  }

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      showResult("only http and https URLs are supported", true);
      return;
    }
  } catch {
    showResult("that's not a valid URL", true);
    return;
  }

  const code = encodeUrl(url);
  const shortUrl = `${getBaseUrl()}#${code}`;

  showResult(`
    <a href="${shortUrl}" target="_blank" rel="noopener noreferrer">
      ${shortUrl}
    </a>
  `);
}

function showResult(content, error = false) {
  result.innerHTML = content;
  result.className = error ? "show error" : "show";
}

button.addEventListener("click", shorten);

input.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    shorten();
  }
});

const hash = window.location.hash.slice(1);

if (hash) {
  const url = decodeUrl(hash);

  if (url) {
    window.location.replace(url);
  }
}
