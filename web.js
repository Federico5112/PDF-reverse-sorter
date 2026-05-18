const input = document.querySelector("#pdf-input");
const fileDetail = document.querySelector("#file-detail");
const pageCount = document.querySelector("#page-count");
const statusText = document.querySelector("#status-text");
const reverseButton = document.querySelector("#reverse-button");
const downloadLink = document.querySelector("#download-link");
const notice = document.querySelector("#notice");

let selectedFile = null;
let selectedBytes = null;
let currentDownloadUrl = null;

function setNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle("is-error", isError);
}

function setBusy(isBusy) {
  reverseButton.disabled = isBusy || !selectedBytes;
  reverseButton.textContent = isBusy ? "Hazirlaniyor..." : "Ters Cevir";
}

function resetDownload() {
  if (currentDownloadUrl) {
    URL.revokeObjectURL(currentDownloadUrl);
    currentDownloadUrl = null;
  }

  downloadLink.classList.add("is-hidden");
  downloadLink.removeAttribute("href");
  downloadLink.removeAttribute("download");
}

function outputName(fileName) {
  const cleanName = fileName.replace(/\.pdf$/i, "");
  return `${cleanName || "pdf"}_ters.pdf`;
}

async function loadSelectedPdf(file) {
  resetDownload();
  selectedFile = null;
  selectedBytes = null;
  pageCount.textContent = "-";
  statusText.textContent = "Okunuyor";
  reverseButton.disabled = true;

  if (!file) {
    fileDetail.textContent = "Telefonundan veya bilgisayarindan bir PDF dosyasi sec.";
    statusText.textContent = "Hazir";
    return;
  }

  if (file.type && file.type !== "application/pdf") {
    statusText.textContent = "Hata";
    setNotice("Lutfen PDF dosyasi sec.", true);
    return;
  }

  try {
    selectedBytes = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(selectedBytes, {
      ignoreEncryption: false,
    });

    selectedFile = file;
    fileDetail.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    pageCount.textContent = String(pdfDoc.getPageCount());
    statusText.textContent = "Hazir";
    reverseButton.disabled = false;
    setNotice("Dosya hazir. Ters cevirmek icin butona bas.");
  } catch (error) {
    selectedFile = null;
    selectedBytes = null;
    pageCount.textContent = "-";
    statusText.textContent = "Hata";
    setNotice(
      "PDF okunamadi. Sifreli veya bozuk bir dosya olabilir.",
      true,
    );
  }
}

async function reverseSelectedPdf() {
  if (!selectedFile || !selectedBytes) {
    setNotice("Once bir PDF dosyasi sec.", true);
    return;
  }

  setBusy(true);
  resetDownload();
  statusText.textContent = "Isleniyor";
  setNotice("Sayfalar sondan basa diziliyor.");

  try {
    const source = await PDFLib.PDFDocument.load(selectedBytes);
    const target = await PDFLib.PDFDocument.create();
    const pageIndexes = source.getPageIndices().reverse();
    const copiedPages = await target.copyPages(source, pageIndexes);

    copiedPages.forEach((page) => target.addPage(page));

    const reversedBytes = await target.save();
    const blob = new Blob([reversedBytes], { type: "application/pdf" });
    currentDownloadUrl = URL.createObjectURL(blob);

    downloadLink.href = currentDownloadUrl;
    downloadLink.download = outputName(selectedFile.name);
    downloadLink.classList.remove("is-hidden");
    statusText.textContent = "Tamam";
    setNotice("Hazir. Ters PDF dosyasini indirebilirsin.");
  } catch (error) {
    statusText.textContent = "Hata";
    setNotice("PDF ters cevrilemedi. Baska bir dosya dene.", true);
  } finally {
    setBusy(false);
  }
}

input.addEventListener("change", () => {
  loadSelectedPdf(input.files?.[0]);
});

reverseButton.addEventListener("click", reverseSelectedPdf);
