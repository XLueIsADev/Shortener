const input = document.getElementById("url");
const button = document.getElementById("shorten-btn");
const result = document.getElementById("result");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

function encodeUrl(url) {
  return btoa(unescape(encodeURIComponent(url)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeUrl(value) {
  try {
    return decodeURIComponent(
      escape(
        atob(
          value
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      )
    );
  } catch {
    return null;
  }
}

function shorten() {
  const url = input.value.trim();

  if (!url) {
    showResult("Enter a URL.", true);
    return;
  }

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      showResult("Only HTTP and HTTPS URLs are supported.", true);
      return;
    }
  } catch {
    showResult("That's not a valid URL.", true);
    return;
  }

  const code = encodeUrl(url);

  const baseUrl = window.location.href.split("#")[0];
  const shortUrl = `${baseUrl}#${code}`;

  showResult(`
    <div class="result-content">
      <a href="${shortUrl}" target="_blank" rel="noopener noreferrer">
        ${shortUrl}
      </a>
      <button class="copy-btn" id="copy-btn">Copy</button>
    </div>
  `);

  document.getElementById("copy-btn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(shortUrl);

    const copyButton = document.getElementById("copy-btn");
    copyButton.textContent = "Copied";

    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1500);
  });
}

function showResult(content, error = false) {
  result.innerHTML = content;
  result.className = error ? "show error" : "show";
}

button.addEventListener("click", shorten);

input.addEventListener("keydown", (event) => {
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
