# PDF Ters Cevirici

PDF dosyalarindaki sayfa sirasini tersine ceviren basit arac.

## Hemen kullan

Web uygulamasini ac:

https://federico5112.github.io/PDF-reverse-sorter/

Android, iPhone, Windows ve Mac tarayicilarinda calisir.

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
