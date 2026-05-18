# PDF Ters Cevirici

PDF dosyalarindaki sayfa sirasini tersine ceviren basit masaustu uygulamasi.

## Mobil web uygulamasi

Android veya iPhone'da tarayicidan ac:

https://federico5112.github.io/PDF-reverse-sorter/

Sayfa uzerinden PDF secilir, ters cevrilir ve yeni PDF indirilir. Dosya
tarayici icinde islenir, sunucuya yuklenmez.

## Mac'te calistirma

```bash
python3 -m pip install -r requirements.txt
python3 app.py
```

Mac'te pencereyi test etmek icin Tkinter destekli Python gerekir. Homebrew ile
kurulan bazi Python surumlerinde `_tkinter` ayrica kurulmadigi icin pencere
acilmayabilir. Windows exe, GitHub Actions'ta Windows ortaminda uretildigi icin
pencereli calisir.

Komut satirindan kullanmak isterseniz:

```bash
python3 app.py /dosya/yolu/input.pdf /dosya/yolu/output.pdf
```

## Windows exe

GitHub Actions, her push sonrasinda Windows icin exe olusturur.

1. Kodu GitHub reposuna yukleyin.
2. GitHub'da `Actions` sekmesini acin.
3. Son calisan workflow'un `Artifacts` bolumunden `PDF-Ters-Cevirici-Windows` dosyasini indirin.

Release yayinlamak icin indirdiginiz exe dosyasini GitHub Releases'a ekleyebilirsiniz.
