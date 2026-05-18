export const LARGE_FILE_THRESHOLD_BYTES = 100 * 1024 * 1024;


export function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}


export function isLargeFile(file) {
  return file.size >= LARGE_FILE_THRESHOLD_BYTES;
}


export function outputName(fileName) {
  const cleanName = fileName.replace(/\.pdf$/i, "");
  return `${cleanName || "pdf"}_ters.pdf`;
}


export async function readPdfMetadata(file) {
  if (file.type && file.type !== "application/pdf") {
    throw new Error("not-pdf");
  }

  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(bytes, {
    ignoreEncryption: false,
  });

  return {
    bytes,
    pageCount: pdfDoc.getPageCount(),
  };
}


export async function reversePdf(bytes) {
  const source = await PDFLib.PDFDocument.load(bytes);
  const target = await PDFLib.PDFDocument.create();
  const pageIndexes = source.getPageIndices().reverse();
  const copiedPages = await target.copyPages(source, pageIndexes);

  copiedPages.forEach((page) => target.addPage(page));

  return target.save();
}
