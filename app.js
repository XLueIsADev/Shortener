const input = document.getElementById("url");
const button = document.getElementById("shorten-btn");
const result = document.getElementById("result");

document.getElementById("year").textContent =
  new Date().getFullYear();


async function shortenUrl() {

  const url = input.value.trim();

  result.className = "";

  if (!url) {
    showError("enter a URL");
    return;
  }

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      showError("only http and https URLs are supported");
      return;
    }

  } catch {
    showError("that's not a valid URL");
    return;
  }


  button.disabled = true;
  button.textContent = "...";


  try {

    const response = await fetch("/api/shorten", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        url
      })
    });


    const data = await response.json();


    if (!response.ok) {
      throw new Error(
        data.error || "something went wrong"
      );
    }


    result.innerHTML = `
      <a
        href="${escapeHtml(data.shortUrl)}"
        target="_blank"
        rel="noopener noreferrer"
      >${escapeHtml(data.shortUrl)}</a>
    `;

    result.className = "show";


  } catch (error) {

    showError(
      error.message || "something went wrong"
    );

  } finally {

    button.disabled = false;
    button.textContent = "Shorten";

  }
}


function showError(message) {

  result.textContent = message;

  result.className = "show error";
}


function escapeHtml(value) {

  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}


input.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {
    shortenUrl();
  }

});
