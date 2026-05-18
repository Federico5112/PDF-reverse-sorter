from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from pypdf import PdfReader, PdfWriter

from pdf_reverse.core import default_output_path, reverse_pdf_pages


class ReversePdfPagesTest(unittest.TestCase):
    def test_reverses_page_order(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "source.pdf"
            output = Path(temp_dir) / "output.pdf"

            writer = PdfWriter()
            writer.add_blank_page(width=100, height=100)
            writer.add_blank_page(width=200, height=200)
            writer.add_blank_page(width=300, height=300)
            with source.open("wb") as file:
                writer.write(file)

            reverse_pdf_pages(source, output)

            reader = PdfReader(str(output))
            widths = [int(page.mediabox.width) for page in reader.pages]
            self.assertEqual(widths, [300, 200, 100])

    def test_default_output_path_avoids_overwrite(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            source = Path(temp_dir) / "document.pdf"
            first_output = Path(temp_dir) / "document_ters.pdf"
            source.touch()
            first_output.touch()

            self.assertEqual(
                default_output_path(source),
                Path(temp_dir) / "document_ters_2.pdf",
            )


if __name__ == "__main__":
    unittest.main()
