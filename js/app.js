/**
 * app.js
 * Ana uygulama: Akilli dosya algilama, ekran gecisleri, olay yonetimi.
 */

import {
  MAX_FILE_SIZE,
  WARN_FILE_SIZE,
  formatFileSize,
  getFileExtension,
  getFileCategory,
  getAvailableTools,
  convert,
} from "./converter-service.js?v=converter9";


// ---- DOM Referansları ----
const $ = (sel) => document.querySelector(sel);

const screens = {
  dropzone: $("#screen-dropzone"),
  tools: $("#screen-tools"),
  processing: $("#screen-processing"),
  result: $("#screen-result"),
  error: $("#screen-error"),
};

const dom = {
  dropzone: $("#dropzone"),
  fileInput: $("#file-input"),
  fileInfoIcon: $("#file-info-icon"),
  fileInfoName: $("#file-info-name"),
  fileInfoMeta: $("#file-info-meta"),
  fileRemoveBtn: $("#file-remove-btn"),
  toolsHeading: $("#tools-heading"),
  toolsGrid: $("#tools-grid"),
  sizeWarning: $("#size-warning"),
  processingTitle: $("#processing-title"),
  processingDetail: $("#processing-detail"),
  progressBar: $("#progress-bar"),
  resultDetail: $("#result-detail"),
  downloadLink: $("#download-link"),
  downloadText: $("#download-text"),
  newFileBtn: $("#new-file-btn"),
  retryBtn: $("#retry-btn"),
  errorDetail: $("#error-detail"),
};


// ---- Durum ----
let currentFile = null;
let currentDownloadUrl = null;


// ---- Ekran Yönetimi ----

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("active", key === name);
  });

  // Yeni ekrana geçişte animasyonu yeniden tetikle
  const target = screens[name];
  target.style.animation = "none";
  // eslint-disable-next-line no-unused-expressions
  target.offsetHeight; // reflow
  target.style.animation = "";
}


function resetState() {
  if (currentDownloadUrl) {
    URL.revokeObjectURL(currentDownloadUrl);
    currentDownloadUrl = null;
  }
  currentFile = null;
  dom.fileInput.value = "";
  dom.progressBar.style.width = "0%";
  dom.sizeWarning.classList.add("is-hidden");
}


// ---- Dosya Algılama ----

function handleFile(file) {
  if (!file) return;

  // Boyut kontrolü (hard limit)
  if (file.size > MAX_FILE_SIZE) {
    showScreen("error");
    dom.errorDetail.textContent =
      `Dosya cok buyuk (${formatFileSize(file.size)}). Maksimum 200 MB yukleyebilirsiniz.`;
    return;
  }

  const ext = getFileExtension(file.name);
  const category = getFileCategory(ext);

  if (category === "unknown") {
    showScreen("error");
    dom.errorDetail.textContent =
      `Bu dosya formati desteklenmiyor (.${ext}). PDF, gorsel, metin, CSV, JSON, Markdown veya EPUB dosyasi yukleyin.`;
    return;
  }

  currentFile = file;

  // Dosya bilgisi kartını güncelle
  updateFileInfoCard(file, ext, category);

  // Araç kartlarını oluştur
  const tools = getAvailableTools(ext);
  renderToolCards(tools);

  // Boyut uyarısı (soft limit)
  if (file.size > WARN_FILE_SIZE) {
    dom.sizeWarning.classList.remove("is-hidden");
  } else {
    dom.sizeWarning.classList.add("is-hidden");
  }

  showScreen("tools");
}


function updateFileInfoCard(file, ext, category) {
  dom.fileInfoName.textContent = file.name;
  dom.fileInfoMeta.textContent = formatFileSize(file.size);

  // İkon tipini belirle
  const iconClasses = {
    pdf: "type-pdf",
    image: "type-image",
    text: "type-text",
    data: "type-data",
    epub: "type-epub",
  };

  const iconLabels = {
    pdf: "PDF",
    image: ext.toUpperCase(),
    text: ext.toUpperCase(),
    data: ext.toUpperCase(),
    epub: "EPUB",
  };

  dom.fileInfoIcon.className = `file-info-icon ${iconClasses[category] || "type-text"}`;
  dom.fileInfoIcon.textContent = iconLabels[category] || ext.toUpperCase();
}


function renderToolCards(tools) {
  dom.toolsGrid.innerHTML = "";

  tools.forEach((tool, idx) => {
    const card = document.createElement("button");
    card.className = "tool-card";
    card.type = "button";
    card.style.animationDelay = `${idx * 60}ms`;
    card.innerHTML = `
      <span class="tool-card-icon">${tool.emoji}</span>
      <span class="tool-card-label">${tool.label}</span>
    `;
    card.addEventListener("click", () => startConversion(tool));
    dom.toolsGrid.appendChild(card);
  });
}


// ---- Dönüştürme ----

async function startConversion(tool) {
  if (!currentFile) return;

  showScreen("processing");
  dom.processingTitle.textContent = "Isleniyor...";
  dom.processingDetail.textContent = `${tool.label} donusturuluyor.`;
  dom.progressBar.style.width = "0%";

  try {
    const result = await convert(currentFile, tool.id, (progress) => {
      dom.progressBar.style.width = `${Math.min(progress, 100)}%`;
    });

    // Sonuç URL'i oluştur
    if (currentDownloadUrl) {
      URL.revokeObjectURL(currentDownloadUrl);
    }
    currentDownloadUrl = URL.createObjectURL(result.blob);

    // Sonuç ekranını göster
    dom.downloadLink.href = currentDownloadUrl;
    dom.downloadLink.download = result.fileName;
    dom.downloadText.textContent = `${result.fileName} indir`;
    dom.resultDetail.textContent =
      `${tool.label} islemi tamamlandi. Dosya boyutu: ${formatFileSize(result.blob.size)}`;

    showScreen("result");
  } catch (error) {
    console.error("Donusturme hatasi:", error);
    dom.errorDetail.textContent =
      error.message || "Dosya donusturme sirasinda beklenmeyen bir hata olustu.";
    showScreen("error");
  }
}


// ---- Olay Dinleyiciler ----

// Dosya seçim (tıklama)
dom.fileInput.addEventListener("change", () => {
  handleFile(dom.fileInput.files?.[0]);
});

// Dropzone tıklama (inputu tetikler)
dom.dropzone.addEventListener("click", (e) => {
  if (e.target !== dom.fileInput) {
    dom.fileInput.click();
  }
});

// Sürükle-bırak
dom.dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dom.dropzone.classList.add("drag-over");
});

dom.dropzone.addEventListener("dragleave", () => {
  dom.dropzone.classList.remove("drag-over");
});

dom.dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dom.dropzone.classList.remove("drag-over");
  const file = e.dataTransfer?.files?.[0];
  if (file) handleFile(file);
});

// Dosyayı kaldır
dom.fileRemoveBtn.addEventListener("click", () => {
  resetState();
  showScreen("dropzone");
});

// Yeni dosya
dom.newFileBtn.addEventListener("click", () => {
  resetState();
  showScreen("dropzone");
});

// Tekrar dene
dom.retryBtn.addEventListener("click", () => {
  resetState();
  showScreen("dropzone");
});

// Klavye desteği (Enter/Space ile dropzone)
dom.dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    dom.fileInput.click();
  }
});


// ---- PWA / Service Worker ----

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  navigator.serviceWorker.register("service-worker.js").then((registration) => {
    registration.update();
  }).catch(() => {
    // PWA destegi basarisiz olursa ana akis etkilenmez.
  });
}

registerServiceWorker();
