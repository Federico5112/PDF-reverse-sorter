# PDF Ters Cevirici

PDF dosyalarindaki sayfa sirasini tersine ceviren basit masaustu uygulamasi.

## Mac'te calistirma

```bash
python3 -m pip install -r requirements.txt
python3 app.py
```

Apple CommandLineTools ile gelen eski Python, bazi macOS surumlerinde Tkinter
penceresini acarken cokebilir. Bu durumda Mac'te pencereyi test etmek icin
python.org veya Homebrew ile guncel Python kurun. Windows exe, GitHub Actions'ta
Windows ortaminda uretildigi icin pencereli calisir.

Komut satirindan kullanmak isterseniz:

```bash
python3 app.py input.pdf output.pdf
```

## Windows exe

GitHub Actions, her push sonrasinda Windows icin exe olusturur.

1. Kodu GitHub reposuna yukleyin.
2. GitHub'da `Actions` sekmesini acin.
3. Son calisan workflow'un `Artifacts` bolumunden `PDF-Ters-Cevirici-Windows` dosyasini indirin.

Release yayinlamak icin indirdiginiz exe dosyasini GitHub Releases'a ekleyebilirsiniz.
