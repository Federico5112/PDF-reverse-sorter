import {
  formatFileSize,
  isLargeFile,
  outputName,
  readPdfMetadata,
  reversePdf,
} from "./pdf-service.js";
import {
  getElements,
  resetDownload,
  resetSelection,
  setBusy,
  setProcessing,
  showDownload,
  showError,
  showFileReady,
} from "./ui-state.js";


const elements = getElements();

let selectedFile = null;
let selectedBytes = null;


async function loadSelectedPdf(file) {
  resetDownload();
  selectedFile = null;
  selectedBytes = null;

  if (!file) {
    resetSelection();
    return;
  }

  elements.statusText.textContent = "Okunuyor";
  elements.pageCount.textContent = "-";
  elements.reverseButton.disabled = true;

  try {
    const metadata = await readPdfMetadata(file);
    selectedFile = file;
    selectedBytes = metadata.bytes;

    showFileReady({
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      pageCount: metadata.pageCount,
      largeFile: isLargeFile(file),
    });
  } catch (error) {
    selectedFile = null;
    selectedBytes = null;
    showError("PDF okunamadi. Sifreli, bozuk veya PDF olmayan bir dosya olabilir.");
  }
}


async function reverseSelectedPdf() {
  if (!selectedFile || !selectedBytes) {
    showError("Once bir PDF dosyasi sec.");
    return;
  }

  setBusy(true, Boolean(selectedBytes));
  setProcessing();

  try {
    const reversedBytes = await reversePdf(selectedBytes);
    const blob = new Blob([reversedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    showDownload({
      url,
      fileName: outputName(selectedFile.name),
    });
  } catch (error) {
    showError("PDF ters cevrilemedi. Baska bir dosya dene.");
  } finally {
    setBusy(false, Boolean(selectedBytes));
  }
}


function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("service-worker.js").catch(() => {
    // PWA destegi basarisiz olursa ana PDF akisi etkilenmez.
  });
}


elements.input.addEventListener("change", () => {
  loadSelectedPdf(elements.input.files?.[0]);
});

elements.reverseButton.addEventListener("click", reverseSelectedPdf);

registerServiceWorker();
