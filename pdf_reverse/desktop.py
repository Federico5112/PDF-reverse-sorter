from __future__ import annotations

from pathlib import Path

from pdf_reverse.core import reverse_pdf_pages


APP_TITLE = "PDF Ters Cevirici"


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
