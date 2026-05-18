from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader, PdfWriter


class PdfReverseError(Exception):
    """Base error for PDF reverse operations."""


class EncryptedPdfError(PdfReverseError):
    """Raised when an encrypted PDF cannot be processed."""


class InvalidPdfError(PdfReverseError):
    """Raised when the selected file is not a usable PDF."""


def default_output_path(input_path: Path) -> Path:
    candidate = input_path.with_name(f"{input_path.stem}_ters{input_path.suffix}")
    if not candidate.exists():
        return candidate

    counter = 2
    while True:
        numbered = input_path.with_name(
            f"{input_path.stem}_ters_{counter}{input_path.suffix}"
        )
        if not numbered.exists():
            return numbered
        counter += 1


def normalize_pdf_input(input_file: str | Path) -> Path:
    input_path = Path(input_file).expanduser().resolve()
    if not input_path.exists():
        raise FileNotFoundError(f"PDF bulunamadi: {input_path}")
    if input_path.suffix.lower() != ".pdf":
        raise InvalidPdfError("Lutfen bir PDF dosyasi secin.")
    return input_path


def reverse_pdf_pages(input_file: str | Path, output_file: str | Path | None = None) -> Path:
    input_path = normalize_pdf_input(input_file)
    output_path = (
        Path(output_file).expanduser().resolve()
        if output_file
        else default_output_path(input_path)
    )

    try:
        reader = PdfReader(str(input_path))
    except Exception as exc:
        raise InvalidPdfError("PDF okunamadi. Dosya bozuk olabilir.") from exc

    if reader.is_encrypted:
        try:
            decrypt_result = reader.decrypt("")
        except Exception as exc:
            raise EncryptedPdfError("Sifreli PDF dosyalari su an desteklenmiyor.") from exc
        if decrypt_result == 0:
            raise EncryptedPdfError("Sifreli PDF dosyalari su an desteklenmiyor.")

    writer = PdfWriter()
    for page in reversed(reader.pages):
        writer.add_page(page)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as output:
        writer.write(output)

    return output_path
