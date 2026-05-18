# PDF Ters Cevirici

PDF dosyalarindaki sayfa sirasini tersine ceviren basit arac.

## Hemen kullan

Web uygulamasini ac:

https://federico5112.github.io/PDF-reverse-sorter/

Android, iPhone, Windows ve Mac tarayicilarinda calisir.
Android'de Chrome menusu uzerinden ana ekrana eklenebilir.

## Mobil web uygulamasi

Sayfa uzerinden PDF secilir, ters cevrilir ve yeni PDF indirilir. Dosya
tarayici icinde islenir, sunucuya yuklenmez.

Kullanim:

1. `PDF sec` butonuna basin.
2. PDF dosyasini secin.
3. `Ters Cevir` butonuna basin.
4. `Ters PDF indir` baglantisindan yeni dosyayi indirin.

Notlar:

- PDF dosyasi GitHub'a veya baska bir sunucuya yuklenmez.
- Islem telefonun veya bilgisayarin tarayicisinda yapilir.
- Cok buyuk PDF dosyalari mobil cihazlarda daha yavas islenebilir.
- 100 MB ve uzeri PDF'lerde uygulama uyari verir, masaustu surumu daha uygundur.

## Windows exe

GitHub Actions, her push sonrasinda Windows icin pencereli exe olusturur.

Indirmek icin:

1. GitHub'da `Actions` sekmesini acin.
2. Son basarili `Build Windows exe` calismasina girin.
3. `Artifacts` bolumunden `PDF-Ters-Cevirici-Windows` dosyasini indirin.

Release yayinlamak icin indirdiginiz exe dosyasini GitHub Releases'a
ekleyebilirsiniz.

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

## Gelistirme yapisi

Python masaustu surumu katmanlara ayrildi:

- `pdf_reverse/core.py`: PDF okuma, ters cevirme ve cikti yolu uretme
- `pdf_reverse/desktop.py`: Tkinter pencere arayuzu
- `pdf_reverse/cli.py`: komut satiri ve uygulama girisi
- `tests/test_core.py`: temel PDF ters cevirme testleri

Mobil web surumu de moduler tutulur:

- `js/pdf-service.js`: PDF metadata okuma ve ters cevirme
- `js/ui-state.js`: ekrandaki durum, hata ve indirme baglantisi
- `js/app.js`: kullanici olaylari ve PWA kaydi
- `manifest.webmanifest` ve `service-worker.js`: ana ekrana ekleme ve offline kabuk destegi

Testleri calistirmak icin:

```bash
python -m unittest discover -s tests
```
