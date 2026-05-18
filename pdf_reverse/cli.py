from __future__ import annotations

import argparse
import sys

from pdf_reverse.core import reverse_pdf_pages
from pdf_reverse.desktop import create_gui_app


def is_apple_command_line_tools_python() -> bool:
    return sys.platform == "darwin" and "CommandLineTools" in sys.executable


def print_mac_tkinter_help() -> None:
    print(
        "Bu Mac'teki Python, Tkinter penceresini acamiyor.\n\n"
        "PDF cevirmeyi terminalden kullanabilirsiniz:\n"
        "  python3 app.py /dosya/yolu/input.pdf /dosya/yolu/output.pdf\n\n"
        "Mac'te pencereyi test etmek icin Tkinter destekli Python gerekir. "
        "Windows icin GitHub Actions'in urettigi exe pencereli calisacaktir."
    )


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PDF sayfa sirasini ters cevirir.")
    parser.add_argument("input", nargs="?", help="Ters cevrilecek PDF dosyasi")
    parser.add_argument("output", nargs="?", help="Olusturulacak PDF dosyasi")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    if args.input:
        output_path = reverse_pdf_pages(args.input, args.output)
        print(f"Olusturuldu: {output_path}")
        return 0

    if is_apple_command_line_tools_python():
        print_mac_tkinter_help()
        return 2

    try:
        app = create_gui_app()
    except ModuleNotFoundError as exc:
        if exc.name == "_tkinter":
            print_mac_tkinter_help()
            return 2
        raise

    app.mainloop()
    return 0
