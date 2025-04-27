const urlForm = document.getElementById("url-form");
const fileForm = document.getElementById("file-form");
const urlInput = document.getElementById("url-input");
const fileUpload = document.getElementById("file-upload");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const loaderSingle = document.getElementById("loader-single");
const loaderMulti = document.getElementById("loader-multi");
const responseDiv = document.getElementById("response");

urlForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = urlInput.value;
  if (!url) return;

  responseDiv.innerHTML = "";
  showLoaderSingle();

  try {
    const res = await fetch(`/?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    responseDiv.innerHTML = res.ok
      ? `<p><a href="/download?token=${data.token}" target="_blank">Download MP3</a></p>`
      : `<p style="color:red;">Error: ${data.error}</p>`;
  } catch (err) {
    responseDiv.textContent = "Request failed.";
  } finally {
    hideLoaderSingle();
  }
});

fileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileUpload.files[0];
  if (!file) return;

  const lines = await file.text();
  const urls = lines
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  responseDiv.innerHTML = "";
  showLoaderMulti();
  showProgress();

  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(`/?url=${encodeURIComponent(urls[i])}`);
    const data = await res.json();
    if (res.ok) {
      responseDiv.innerHTML += `<p><a href="/download?token=${data.token}" target="_blank">${urls[i]} → Download</a></p>`;
    } else {
      responseDiv.innerHTML += `<p style="color:red;">${urls[i]} → Error: ${data.error}</p>`;
    }
    updateProgress(((i + 1) / urls.length) * 100);
  }

  hideLoaderMulti();
  hideProgress();
});

function showLoaderSingle() {
  loaderSingle.classList.remove("hidden");
}

function hideLoaderSingle() {
  loaderSingle.classList.add("hidden");
}

function showLoaderMulti() {
  loaderMulti.classList.remove("hidden");
}

function hideLoaderMulti() {
  loaderMulti.classList.add("hidden");
}

function showProgress() {
  progressContainer.classList.remove("hidden");
  progressBar.value = 0;
}

function hideProgress() {
  progressContainer.classList.add("hidden");
  progressBar.value = 0;
}

function updateProgress(value) {
  progressBar.value = value;
}
