/**
 * converter-service.js
 * Tum dosya donusturme islemlerini icerir.
 * Tamamen tarayicida calisir, sunucu gerektirmez.
 */

// ---- Sabitler ----
export const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB
export const WARN_FILE_SIZE = 50 * 1024 * 1024;  // 50 MB

// ---- Yardimci Fonksiyonlar ----

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(name) {
  return (name || "").split(".").pop().toLowerCase();
}

export function getFileCategory(ext) {
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"].includes(ext)) return "image";
  if (["txt", "md"].includes(ext)) return "text";
  if (["csv", "json"].includes(ext)) return "data";
  if (ext === "epub") return "epub";
  return "unknown";
}

/**
 * Yüklenen dosya tipine göre dönüştürülebilecek format listesini döner.
 * Her eleman: { id, label, emoji, targetExt }
 */
export function getAvailableTools(ext) {
  const tools = [];

  switch (ext) {
    case "pdf":
      tools.push(
        { id: "pdf-reverse", label: "Sayfalari Ters Cevir", emoji: "🔄", targetExt: "pdf" },
        { id: "pdf-to-jpg", label: "PDF → JPG", emoji: "🖼️", targetExt: "jpg" },
        { id: "pdf-to-png", label: "PDF → PNG", emoji: "🖼️", targetExt: "png" },
      );
      break;

    case "jpg":
    case "jpeg":
      tools.push(
        { id: "img-to-png", label: "JPG → PNG", emoji: "🔁", targetExt: "png" },
        { id: "img-to-webp", label: "JPG → WebP", emoji: "🔁", targetExt: "webp" },
        { id: "img-to-pdf", label: "JPG → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "png":
      tools.push(
        { id: "img-to-jpg", label: "PNG → JPG", emoji: "🔁", targetExt: "jpg" },
        { id: "img-to-webp", label: "PNG → WebP", emoji: "🔁", targetExt: "webp" },
        { id: "img-to-pdf", label: "PNG → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "webp":
      tools.push(
        { id: "img-to-jpg", label: "WebP → JPG", emoji: "🔁", targetExt: "jpg" },
        { id: "img-to-png", label: "WebP → PNG", emoji: "🔁", targetExt: "png" },
        { id: "img-to-pdf", label: "WebP → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "gif":
      tools.push(
        { id: "img-to-jpg", label: "GIF → JPG", emoji: "🔁", targetExt: "jpg" },
        { id: "img-to-png", label: "GIF → PNG", emoji: "🔁", targetExt: "png" },
        { id: "img-to-pdf", label: "GIF → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "bmp":
      tools.push(
        { id: "img-to-jpg", label: "BMP → JPG", emoji: "🔁", targetExt: "jpg" },
        { id: "img-to-png", label: "BMP → PNG", emoji: "🔁", targetExt: "png" },
        { id: "img-to-pdf", label: "BMP → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "svg":
      tools.push(
        { id: "img-to-jpg", label: "SVG → JPG", emoji: "🔁", targetExt: "jpg" },
        { id: "img-to-png", label: "SVG → PNG", emoji: "🔁", targetExt: "png" },
        { id: "img-to-pdf", label: "SVG → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "txt":
      tools.push(
        { id: "txt-to-pdf", label: "TXT → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "md":
      tools.push(
        { id: "md-to-html", label: "MD → HTML", emoji: "🌐", targetExt: "html" },
        { id: "md-to-pdf", label: "MD → PDF", emoji: "📄", targetExt: "pdf" },
      );
      break;

    case "csv":
      tools.push(
        { id: "csv-to-json", label: "CSV → JSON", emoji: "📋", targetExt: "json" },
      );
      break;

    case "json":
      tools.push(
        { id: "json-to-csv", label: "JSON → CSV", emoji: "📋", targetExt: "csv" },
      );
      break;

    case "epub":
      tools.push(
        { id: "epub-to-pdf", label: "EPUB → PDF", emoji: "📚", targetExt: "pdf" },
        { id: "epub-to-txt", label: "EPUB → TXT", emoji: "📝", targetExt: "txt" },
      );
      break;
  }

  return tools;
}


// ============================================================
//  DÖNÜŞTÜRME FONKSİYONLARI
// ============================================================

/**
 * Ana dönüştürme yönlendiricisi.
 * @param {File} file - Yüklenen dosya
 * @param {string} toolId - Seçilen araç ID'si
 * @param {Function} onProgress - İlerleme callback'i (0-100)
 * @returns {Promise<{blob: Blob, fileName: string}>}
 */
export async function convert(file, toolId, onProgress = () => {}) {
  const baseName = file.name.replace(/\.[^.]+$/, "") || "dosya";

  switch (toolId) {
    // ---- PDF İşlemleri ----
    case "pdf-reverse":
      return await pdfReverse(file, baseName, onProgress);
    case "pdf-to-jpg":
      return await pdfToImages(file, baseName, "jpg", onProgress);
    case "pdf-to-png":
      return await pdfToImages(file, baseName, "png", onProgress);

    // ---- Görsel → Görsel ----
    case "img-to-jpg":
      return await imageToImage(file, baseName, "jpg", onProgress);
    case "img-to-png":
      return await imageToImage(file, baseName, "png", onProgress);
    case "img-to-webp":
      return await imageToImage(file, baseName, "webp", onProgress);

    // ---- Görsel → PDF ----
    case "img-to-pdf":
      return await imageToPdf(file, baseName, onProgress);

    // ---- Metin → PDF ----
    case "txt-to-pdf":
      return await textToPdf(file, baseName, onProgress);
    case "md-to-html":
      return await markdownToHtml(file, baseName, onProgress);
    case "md-to-pdf":
      return await markdownToPdf(file, baseName, onProgress);

    // ---- Veri Dönüşümleri ----
    case "csv-to-json":
      return await csvToJson(file, baseName, onProgress);
    case "json-to-csv":
      return await jsonToCsv(file, baseName, onProgress);

    // ---- EPUB ----
    case "epub-to-pdf":
      return await epubToPdf(file, baseName, onProgress);
    case "epub-to-txt":
      return await epubToTxt(file, baseName, onProgress);

    default:
      throw new Error("Bilinmeyen donusturme araci.");
  }
}


// ============================================================
//  PDF İŞLEMLERİ
// ============================================================

async function pdfReverse(file, baseName, onProgress) {
  onProgress(10);
  const bytes = await file.arrayBuffer();
  onProgress(30);

  let source;
  try {
    source = await PDFLib.PDFDocument.load(bytes);
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes("encrypted")) {
      throw new Error("Bu PDF sifreli (parolali) oldugu icin islenemiyor. Lutfen once parolasini kaldirin.");
    }
    throw new Error("PDF dosyasi okunamadi veya bozuk.");
  }

  const pageCount = source.getPageCount();
  if (pageCount <= 1) {
    throw new Error("Bu PDF sadece 1 sayfadan olusuyor. Ters cevirilecek bir sayfa sirasi yok.");
  }

  const target = await PDFLib.PDFDocument.create();
  const pageIndexes = source.getPageIndices().reverse();
  onProgress(50);

  const copiedPages = await target.copyPages(source, pageIndexes);
  copiedPages.forEach((page) => target.addPage(page));
  onProgress(80);

  const outputBytes = await target.save();
  onProgress(100);

  return {
    blob: new Blob([outputBytes], { type: "application/pdf" }),
    fileName: `${baseName}_ters.pdf`,
  };
}


async function pdfToImages(file, baseName, format, onProgress) {
  onProgress(5);
  const bytes = await file.arrayBuffer();

  // pdf.js dinamik olarak yüklenir
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const totalPages = pdf.numPages;
  onProgress(15);

  const zip = new JSZip();
  const mimeType = format === "png" ? "image/png" : "image/jpeg";
  const quality = format === "png" ? undefined : 0.85;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const scale = 2; // Yüksek çözünürlük
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const base64 = dataUrl.split(",")[1];
    zip.file(`${baseName}_sayfa_${i}.${format}`, base64, { base64: true });

    onProgress(15 + Math.round((i / totalPages) * 75));
  }

  onProgress(92);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  onProgress(100);

  return {
    blob: zipBlob,
    fileName: `${baseName}_sayfalar.zip`,
  };
}


// ============================================================
//  GÖRSEL DÖNÜŞÜMLER (Canvas API)
// ============================================================

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
      // URL'yi sonra temizleyeceğiz
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gorsel yuklenemedi."));
    };
    img.src = url;
  });
}

async function imageToImage(file, baseName, targetFormat, onProgress) {
  onProgress(20);
  const img = await loadImage(file);
  onProgress(50);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");

  // JPG için beyaz arka plan (şeffaflık desteklenmez)
  if (targetFormat === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(img.src);
  onProgress(70);

  const mimeMap = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
  const mime = mimeMap[targetFormat] || "image/png";
  const quality = targetFormat === "png" ? undefined : 0.88;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
  onProgress(100);

  return {
    blob,
    fileName: `${baseName}.${targetFormat}`,
  };
}


async function imageToPdf(file, baseName, onProgress) {
  onProgress(15);
  
  // Eger dosya zaten JPG veya PNG ise, Canvas uzerinden gecmeden dogrudan gom!
  // Bu hem RAM'i korur, hem de islem hizini inanilmaz artirir.
  const ext = getFileExtension(file.name);
  const pdfDoc = await PDFLib.PDFDocument.create();
  let imageEmbed;
  
  if (ext === "jpg" || ext === "jpeg") {
    const bytes = await file.arrayBuffer();
    imageEmbed = await pdfDoc.embedJpg(bytes);
    onProgress(50);
  } else if (ext === "png") {
    const bytes = await file.arrayBuffer();
    imageEmbed = await pdfDoc.embedPng(bytes);
    onProgress(50);
  } else {
    // Diger formatlar (WebP, GIF, BMP, SVG) icin mecburen Canvas uzerinden PNG'ye cevir
    const img = await loadImage(file);
    onProgress(30);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(img.src);
    onProgress(50);

    const pngDataUrl = canvas.toDataURL("image/png");
    const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), (c) => c.charCodeAt(0));
    imageEmbed = await pdfDoc.embedPng(pngBytes);
  }
  onProgress(75);

  const page = pdfDoc.addPage([imageEmbed.width, imageEmbed.height]);
  page.drawImage(imageEmbed, {
    x: 0,
    y: 0,
    width: imageEmbed.width,
    height: imageEmbed.height,
  });
  onProgress(85);

  const pdfBytes = await pdfDoc.save();
  onProgress(100);

  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    fileName: `${baseName}.pdf`,
  };
}


// ============================================================
//  METİN DÖNÜŞÜMLER
// ============================================================

async function textToPdf(file, baseName, onProgress) {
  onProgress(15);
  const text = await file.text();
  onProgress(30);

  const pdfDoc = await PDFLib.PDFDocument.create();
  
  // Fontkit kaydı ve özel Unicode destekli font yüklemesi
  pdfDoc.registerFontkit(window.fontkit);
  const fontBytes = await fetch("vendor/Roboto-Regular.ttf").then((res) => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);
  
  const fontSize = 11;
  const margin = 50;
  const lineHeight = fontSize * 1.4;

  const lines = text.split("\n");
  let pageHeight = 792; // Letter
  let pageWidth = 612;
  let y = pageHeight - margin;
  let page = pdfDoc.addPage([pageWidth, pageHeight]);

  for (let i = 0; i < lines.length; i++) {
    // Uzun satırları sar
    const words = lines[i].split(" ");
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > pageWidth - margin * 2 && currentLine) {
        page.drawText(currentLine, { x: margin, y, size: fontSize, font });
        y -= lineHeight;
        currentLine = word;
        if (y < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      page.drawText(currentLine, { x: margin, y, size: fontSize, font });
    }
    y -= lineHeight;
    if (y < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    onProgress(30 + Math.round((i / lines.length) * 60));
  }

  const pdfBytes = await pdfDoc.save();
  onProgress(100);

  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    fileName: `${baseName}.pdf`,
  };
}


// Basit Markdown parser (sunucu gerektirmez)
function parseMarkdown(md) {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // Inline code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1"/>')
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Unordered lists
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    // Line breaks -> paragraphs
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  // Wrap lists
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

  return `<p>${html}</p>`;
}


async function markdownToHtml(file, baseName, onProgress) {
  onProgress(20);
  const md = await file.text();
  onProgress(50);

  const body = parseMarkdown(md);
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${baseName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1a1a1a; }
    h1, h2, h3 { margin-top: 1.5em; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre code { background: none; padding: 0; }
    img { max-width: 100%; }
    hr { border: none; border-top: 1px solid #ddd; margin: 2em 0; }
    a { color: #4f46e5; }
  </style>
</head>
<body>
${body}
</body>
</html>`;

  onProgress(100);

  return {
    blob: new Blob([html], { type: "text/html;charset=utf-8" }),
    fileName: `${baseName}.html`,
  };
}


async function markdownToPdf(file, baseName, onProgress) {
  // Markdown'ı önce düz metne çevir, sonra PDF yap
  onProgress(10);
  const md = await file.text();
  // Basit strip: başlık işaretlerini, bold/italic işaretlerini kaldır
  const plainText = md
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "");

  onProgress(20);

  // textToPdf'i yeniden kullan
  const fakeFile = new File([plainText], `${baseName}.txt`, { type: "text/plain" });
  return await textToPdf(fakeFile, baseName, (p) => onProgress(20 + p * 0.8));
}


// ============================================================
//  VERİ DÖNÜŞÜMLER
// ============================================================

async function csvToJson(file, baseName, onProgress) {
  onProgress(20);
  const text = await file.text();
  onProgress(40);

  const rows = parseFullCsv(text);
  if (rows.length < 2) throw new Error("CSV dosyasi bos veya baslik satiri eksik.");

  const headers = rows[0].map(h => h.trim());
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i];
    // Bos satirlari atla
    if (values.length === 1 && values[0].trim() === "") continue;
    
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] !== undefined ? values[idx].trim() : "";
    });
    result.push(obj);
    onProgress(40 + Math.round((i / rows.length) * 50));
  }

  const json = JSON.stringify(result, null, 2);
  onProgress(100);

  return {
    blob: new Blob([json], { type: "application/json;charset=utf-8" }),
    fileName: `${baseName}.json`,
  };
}

function parseFullCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const nextCh = text[i+1];
    
    if (ch === '"') {
      if (inQuotes && nextCh === '"') {
        currentVal += '"';
        i++; // Cift tirnagi atla (escape)
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      currentRow.push(currentVal);
      currentVal = "";
    } else if ((ch === '\n' || (ch === '\r' && nextCh === '\n')) && !inQuotes) {
      if (ch === '\r') i++; // \r\n icindeki \n'i atla
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = "";
    } else if (ch !== '\r' || inQuotes) {
      currentVal += ch;
    }
  }
  
  if (currentVal !== "" || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }
  
  return rows;
}


async function jsonToCsv(file, baseName, onProgress) {
  onProgress(20);
  const text = await file.text();
  onProgress(40);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Gecersiz JSON dosyasi.");
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("JSON dosyasi bir dizi (array) icermeli.");
  }

  const headers = Object.keys(data[0]);
  const csvLines = [headers.join(",")];

  for (let i = 0; i < data.length; i++) {
    const values = headers.map((h) => {
      const val = String(data[i][h] ?? "");
      return val.includes(",") || val.includes('"') || val.includes("\n")
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    });
    csvLines.push(values.join(","));
    onProgress(40 + Math.round((i / data.length) * 50));
  }

  onProgress(100);

  return {
    blob: new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8" }),
    fileName: `${baseName}.csv`,
  };
}


// ============================================================
//  EPUB DÖNÜŞÜMLER
// ============================================================

async function epubToPdf(file, baseName, onProgress) {
  onProgress(5);
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  onProgress(15);

  const chapters = await extractEpubText(zip, onProgress, 15, 70);
  onProgress(70);

  const fullText = chapters.join("\n\n---\n\n");
  const fakeFile = new File([fullText], `${baseName}.txt`, { type: "text/plain" });
  return await textToPdf(fakeFile, baseName, (p) => onProgress(70 + p * 0.3));
}


async function epubToTxt(file, baseName, onProgress) {
  onProgress(5);
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  onProgress(15);

  const chapters = await extractEpubText(zip, onProgress, 15, 90);
  const fullText = chapters.join("\n\n---\n\n");
  onProgress(100);

  return {
    blob: new Blob([fullText], { type: "text/plain;charset=utf-8" }),
    fileName: `${baseName}.txt`,
  };
}


/**
 * EPUB arşivinden metin içeriklerini çıkarır.
 * EPUB = ZIP (HTML dosyaları + OPF manifest)
 */
async function extractEpubText(zip, onProgress, pStart, pEnd) {
  // OPF dosyasını bul (container.xml'den okumayı dene)
  let opfPath = null;
  const containerFile = zip.file("META-INF/container.xml");
  if (containerFile) {
    const containerXml = await containerFile.async("text");
    const rootfileMatch = containerXml.match(/full-path="([^"]+)"/);
    if (rootfileMatch) {
      opfPath = rootfileMatch[1];
    }
  }

  // OPF'den spine sırasını al
  let htmlFiles = [];
  if (opfPath) {
    const opfFile = zip.file(opfPath);
    if (opfFile) {
      const opfXml = await opfFile.async("text");
      const opfDir = opfPath.includes("/") ? opfPath.substring(0, opfPath.lastIndexOf("/") + 1) : "";

      // manifest'teki tüm HTML item'ları
      const manifestItems = {};
      const itemRegex = /<item\s[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*media-type="([^"]*)"[^>]*\/?>/g;
      let m;
      while ((m = itemRegex.exec(opfXml)) !== null) {
        if (m[3].includes("html") || m[3].includes("xhtml")) {
          manifestItems[m[1]] = opfDir + m[2];
        }
      }

      // spine sırasını al
      const spineRegex = /<itemref\s[^>]*idref="([^"]*)"[^>]*\/?>/g;
      while ((m = spineRegex.exec(opfXml)) !== null) {
        if (manifestItems[m[1]]) {
          htmlFiles.push(manifestItems[m[1]]);
        }
      }
    }
  }

  // Spine bulunamadıysa, tüm HTML dosyalarını al
  if (htmlFiles.length === 0) {
    zip.forEach((path) => {
      if (/\.(x?html?)$/i.test(path) && !path.includes("toc")) {
        htmlFiles.push(path);
      }
    });
    htmlFiles.sort();
  }

  const chapters = [];
  for (let i = 0; i < htmlFiles.length; i++) {
    const f = zip.file(htmlFiles[i]);
    if (f) {
      const html = await f.async("text");
      // HTML'den metin çıkar
      const text = stripHtmlTags(html);
      if (text.trim().length > 0) {
        chapters.push(text.trim());
      }
    }
    onProgress(pStart + Math.round(((i + 1) / htmlFiles.length) * (pEnd - pStart)));
  }

  if (chapters.length === 0) {
    throw new Error("EPUB dosyasindan metin cikarilamamistir.");
  }

  return chapters;
}


function stripHtmlTags(html) {
  // <script>, <style> etiketlerini tamamen kaldır
  let clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  // Paragraf ve satır sonu etiketlerini yeni satıra çevir
  clean = clean
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n");

  // Kalan HTML etiketlerini kaldır
  clean = clean.replace(/<[^>]+>/g, "");

  // HTML entity'lerini tarayıcının yerleşik parser'ı ile güvenle çöz
  // Bu yöntem tüm özel karakterleri ve utf-8 kodlamalarını (örn: &#351; -> ş) hatasız çevirir
  try {
    const txt = document.createElement("textarea");
    txt.innerHTML = clean;
    clean = txt.value;
  } catch (e) {
    // Fallback
  }

  // Gereksiz boş satırları temizle
  clean = clean.replace(/\n{3,}/g, "\n\n").trim();

  return clean;
}


// ============================================================
//  PDF.JS DİNAMİK YÜKLEME
// ============================================================

let _pdfjsLib = null;

async function loadPdfJs() {
  if (_pdfjsLib) return _pdfjsLib;

  // Dinamik import
  const mod = await import("../vendor/pdf.min.mjs");
  _pdfjsLib = mod;
  _pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.mjs";
  return _pdfjsLib;
}
