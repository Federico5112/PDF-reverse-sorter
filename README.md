# 🚀 Universal Client-Side File Converter (Dosya Dönüştürücü)

**🔗 Live Demo (Canlı Oyna):** [https://federico5112.github.io/PDF-reverse-sorter/](https://federico5112.github.io/PDF-reverse-sorter/)

Eskiden sadece bir "PDF Sayfa Ters Çevirici" olan bu proje, artık tarayıcınızın gücünü sonuna kadar kullanan, **%100 gizlilik odaklı, sıfır sunucu maliyetli ve çok yönlü** dev bir Evrensel Dosya Dönüştürücüsüne evrildi!

---

## ✨ Neden Bu Araç? (Özellikler)

Piyasadaki diğer dönüştürücülerin aksine bu sistem dosyalarınızı asla internete, bir sunucuya veya bir bulut servisine **yüklemez.** Bütün dönüştürme işlemleri bilgisayarınızın işlemcisi (CPU) kullanılarak anında **tarayıcınızın içinde** gerçekleşir.

*   🔒 **Maksimum Gizlilik:** Belgeleriniz cihazınızdan asla dışarı çıkmaz.
*   ⚡ **Işık Hızında Dönüşüm:** Dosyaların yüklenmesi ve indirilmesi için beklemeye gerek yoktur.
*   🌐 **Çevrimdışı Çalışma (PWA):** Sayfayı bir kere yükledikten sonra, internetinizi kapatsanız bile dönüştürücü çalışmaya devam eder!
*   🛡️ **OOM (Bellek) Koruması:** Devasa görsel ve verilerde tarayıcının çökmesini engelleyen akıllı RAM yönetimi.
*   🌍 **Sınırsız Dil Desteği:** EPUB ve TXT dönüşümlerinde, Japonca, Arapça, Rusça veya Türkçe fark etmeksizin tüm dilleri kusursuzca destekleyen özel entegre Unicode font motoru (`fontkit` & Roboto).

---

## 🛠️ Desteklenen Dönüşümler (25+ Format)

Tek bir modern arayüz üzerinden aşağıdaki tüm dönüşümleri anında yapabilirsiniz:

### 🔴 PDF Araçları
*   **PDF Ters Çevir:** PDF sayfalarını baştan sona tersine çevirir.
*   **PDF → JPG / PNG:** PDF sayfalarını yüksek kaliteli görsellere dönüştürür ve ZIP olarak indirir.

### 🟢 Görsel Dönüştürme (Resim)
*   **JPG / PNG / WebP:** Bu üç format arasında kalite kaybı olmadan sınırsız geçiş yapabilirsiniz.
*   **GIF / BMP / SVG → JPG / PNG:** Eski veya vektörel formatları yaygın görsel formatlara çevirir.
*   **Görsel → PDF:** Herhangi bir görseli anında PDF belgesi içine gömer. (Anti-OOM desteğiyle devasa görseller bile anında PDF olur).

### 🔵 Belge Dönüştürme
*   **TXT → PDF:** Düz metinleri profesyonel Helvetica / Roboto fontlarıyla PDF'e döker.
*   **MD (Markdown) → HTML:** Markdown belgelerini stilize edilmiş modern HTML sayfalarına dönüştürür.
*   **MD (Markdown) → PDF:** Markdown belgelerini PDF formatına dönüştürür.

### 🟡 Veri Dönüştürme
*   **CSV ↔ JSON:** Excel (CSV) verilerini web formatına (JSON) veya tam tersine kayıpsız dönüştürür. (Gelişmiş karakter akış motoru sayesinde satır içi boşluklar ve Enter karakterleri bozulmaz).

### 🟣 E-Kitap (E-Book)
*   **EPUB → PDF:** E-kitaplarınızı telefon veya bilgisayarda okuyabilmek için PDF'e dönüştürür.
*   **EPUB → TXT:** E-kitapların içindeki salt metni tek bir dosya olarak dışa aktarır.

---

## 💻 Teknolojiler

Bu uygulama sıfır Backend felsefesiyle tasarlanmıştır.

*   **Arayüz:** Vanilla HTML5, Vanilla JS, CSS3 (Modern Glassmorphism & State Machine UI)
*   **PDF Motoru:** [pdf-lib](https://pdf-lib.js.org/) (Sıfırdan PDF inşası ve sayfa düzenleme)
*   **Görsel Motoru:** Native HTML5 `<canvas>` API
*   **Font Motoru:** `@pdf-lib/fontkit` & Google Roboto
*   **Zipleme:** [JSZip](https://stuk.github.io/jszip/)
*   **PWA:** Service Workers & Web Manifest

---

## 🚀 Geliştiriciler İçin (Kurulum)

Uygulamayı kendi bilgisayarınızda çalıştırmak isterseniz:

1. Repoyu klonlayın: `git clone https://github.com/Federico5112/PDF-reverse-sorter.git`
2. Klonladığınız klasöre girin.
3. Klasörde herhangi bir basit HTTP sunucusu başlatın (Örn: `python3 -m http.server 8080`)
4. Tarayıcınızdan `http://localhost:8080` adresine gidin.

*(Not: Her şey statik olduğu için Node.js veya veritabanı kurmanıza gerek yoktur.)*
