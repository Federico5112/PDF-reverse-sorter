from __future__ import annotations

import argparse
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter


APP_TITLE = "PDF Ters Cevirici"


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


def reverse_pdf_pages(input_file: str | Path, output_file: str | Path | None = None) -> Path:
    input_path = Path(input_file).expanduser().resolve()
    if not input_path.exists():
        raise FileNotFoundError(f"PDF bulunamadi: {input_path}")
    if input_path.suffix.lower() != ".pdf":
        raise ValueError("Lutfen bir PDF dosyasi secin.")

    output_path = (
        Path(output_file).expanduser().resolve()
        if output_file
        else default_output_path(input_path)
    )

    reader = PdfReader(str(input_path))
    if reader.is_encrypted:
        try:
            reader.decrypt("")
        except Exception as exc:
            raise ValueError("Sifreli PDF dosyalari su an desteklenmiyor.") from exc

    writer = PdfWriter()
    for page in reversed(reader.pages):
        writer.add_page(page)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as output:
        writer.write(output)

    return output_path


def is_apple_command_line_tools_python() -> bool:
    return sys.platform == "darwin" and "CommandLineTools" in sys.executable


def print_mac_tkinter_help() -> None:
    print(
        "Bu Mac'teki Apple CommandLineTools Python, Tkinter penceresini "
        "acarken cokebiliyor.\n\n"
        "PDF cevirmeyi terminalden kullanabilirsiniz:\n"
        "  python3 app.py input.pdf output.pdf\n\n"
        "Mac'te pencereyi test etmek icin python.org veya Homebrew ile "
        "guncel Python kurun. Windows icin GitHub Actions'in urettigi exe "
        "pencereli calisacaktir."
    )


def create_gui_app():
    import tkinter as tk
    from tkinter import filedialog, messagebox

    class PdfReverseApp(tk.Tk):
        def __init__(self) -> None:
            super().__init__()
            self.title(APP_TITLE)
            self.geometry("520x260")
            self.minsize(480, 240)
            self.resizable(False, False)

            self.selected_pdf: Path | None = None
            self.status = tk.StringVar(value="PDF secerek baslayin.")
            self.file_label = tk.StringVar(value="Henuz dosya secilmedi.")

            self._build_ui()

        def _build_ui(self) -> None:
            wrapper = tk.Frame(self, padx=24, pady=22)
            wrapper.pack(fill=tk.BOTH, expand=True)

            title = tk.Label(
                wrapper,
                text=APP_TITLE,
                font=("Arial", 20, "bold"),
                anchor="w",
            )
            title.pack(fill=tk.X)

            subtitle = tk.Label(
                wrapper,
                text="PDF sayfalarini sondan basa siralar.",
                font=("Arial", 12),
                anchor="w",
            )
            subtitle.pack(fill=tk.X, pady=(4, 18))

            file_box = tk.Label(
                wrapper,
                textvariable=self.file_label,
                anchor="w",
                relief=tk.GROOVE,
                padx=10,
                pady=10,
            )
            file_box.pack(fill=tk.X)

            buttons = tk.Frame(wrapper)
            buttons.pack(fill=tk.X, pady=(18, 14))

            select_button = tk.Button(
                buttons,
                text="PDF Sec",
                width=18,
                command=self.select_pdf,
            )
            select_button.pack(side=tk.LEFT)

            reverse_button = tk.Button(
                buttons,
                text="Sayfalari Ters Cevir",
                width=24,
                command=self.reverse_selected_pdf,
            )
            reverse_button.pack(side=tk.LEFT, padx=(12, 0))

            status = tk.Label(
                wrapper,
                textvariable=self.status,
                anchor="w",
                fg="#255a33",
            )
            status.pack(fill=tk.X, pady=(8, 0))

        def select_pdf(self) -> None:
            filename = filedialog.askopenfilename(
                title="PDF sec",
                filetypes=[("PDF dosyalari", "*.pdf"), ("Tum dosyalar", "*.*")],
            )
            if not filename:
                return

            self.selected_pdf = Path(filename)
            self.file_label.set(self.selected_pdf.name)
            self.status.set("PDF secildi. Ters cevirmek icin butona basin.")

        def reverse_selected_pdf(self) -> None:
            if self.selected_pdf is None:
                messagebox.showwarning(APP_TITLE, "Once bir PDF dosyasi secin.")
                return

            try:
                output_path = reverse_pdf_pages(self.selected_pdf)
            except Exception as exc:
                messagebox.showerror(APP_TITLE, str(exc))
                self.status.set("Islem tamamlanamadi.")
                return

            self.status.set(f"Olusturuldu: {output_path.name}")
            messagebox.showinfo(
                APP_TITLE,
                f"Ters cevrilmis PDF olusturuldu:\n{output_path}",
            )

    return PdfReverseApp()


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

    app = create_gui_app()
    app.mainloop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
