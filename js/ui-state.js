const elements = {
  input: document.querySelector("#pdf-input"),
  fileDetail: document.querySelector("#file-detail"),
  pageCount: document.querySelector("#page-count"),
  statusText: document.querySelector("#status-text"),
  reverseButton: document.querySelector("#reverse-button"),
  downloadLink: document.querySelector("#download-link"),
  notice: document.querySelector("#notice"),
};

let currentDownloadUrl = null;


export function getElements() {
  return elements;
}


export function setNotice(message, tone = "default") {
  elements.notice.textContent = message;
  elements.notice.classList.toggle("is-error", tone === "error");
  elements.notice.classList.toggle("is-warning", tone === "warning");
}


export function setBusy(isBusy, hasPdf) {
  elements.reverseButton.disabled = isBusy || !hasPdf;
  elements.reverseButton.textContent = isBusy ? "Hazirlaniyor..." : "Ters Cevir";
}


export function resetSelection() {
  elements.fileDetail.textContent =
    "Telefonundan veya bilgisayarindan bir PDF dosyasi sec.";
  elements.pageCount.textContent = "-";
  elements.statusText.textContent = "Hazir";
  elements.reverseButton.disabled = true;
  setNotice("Dosya tarayicinda islenir. Sunucuya yuklenmez.");
  resetDownload();
}


export function showFileReady({ fileName, fileSize, pageCount, largeFile }) {
  elements.fileDetail.textContent = `${fileName} (${fileSize})`;
  elements.pageCount.textContent = String(pageCount);
  elements.statusText.textContent = largeFile ? "Buyuk dosya" : "Hazir";
  elements.reverseButton.disabled = false;

  if (largeFile) {
    setNotice(
      "Bu PDF buyuk. Mobilde yavaslayabilir, takilirsa Windows exe daha uygun.",
      "warning",
    );
    return;
  }

  setNotice("Dosya hazir. Ters cevirmek icin butona bas.");
}


export function showError(message) {
  elements.statusText.textContent = "Hata";
  elements.pageCount.textContent = "-";
  elements.reverseButton.disabled = true;
  setNotice(message, "error");
}


export function setProcessing() {
  elements.statusText.textContent = "Isleniyor";
  setNotice("Sayfalar sondan basa diziliyor.");
  resetDownload();
}


export function showDownload({ url, fileName }) {
  currentDownloadUrl = url;
  elements.downloadLink.href = currentDownloadUrl;
  elements.downloadLink.download = fileName;
  elements.downloadLink.classList.remove("is-hidden");
  elements.statusText.textContent = "Tamam";
  setNotice("Hazir. Ters PDF dosyasini indirebilirsin.");
}


export function resetDownload() {
  if (currentDownloadUrl) {
    URL.revokeObjectURL(currentDownloadUrl);
    currentDownloadUrl = null;
  }

  elements.downloadLink.classList.add("is-hidden");
  elements.downloadLink.removeAttribute("href");
  elements.downloadLink.removeAttribute("download");
}
