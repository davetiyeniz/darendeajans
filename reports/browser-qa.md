# Tarayıcı kalite kontrolü

Test tarihi: 30 Temmuz 2026

## Kapsam

- 20 ana URL, 360 px ve 1.440 px genişlikte gerçek tarayıcıda açıldı.
- Ana sayfa, web tasarım, işletme rehberi ve iletişim sayfaları ayrıca 768 px ve 1.024 px genişlikte açıldı.
- Toplam 48 responsive sayfa görünümü denetlendi.
- 20 ana URL’nin tamamı yerel HTTP sunucusunda 200 durum kodu verdi.

## Sonuçlar

- Yatay taşma: 0
- Kırık görsel: 0
- Eksik veya birden fazla H1: 0
- Konsol error/warning: 0
- Eksik `alt`: 0
- Etiketsiz form alanı: 0
- İsimsiz buton/bağlantı: 0
- Yinelenen `id`: 0
- Ana landmark hatası: 0

## Etkileşim testleri

- Mobil menü açıldı; `aria-expanded="true"` ve sayfa kaydırma kilidi doğrulandı.
- Dijital skor aracı 5 yanıtla çalıştırıldı; şeffaf formüle göre 60/100 sonucu ve eksik üç hizmet önerisi üretildi.
- İletişim formu dolduruldu. Endpoint boşken veri göndermedi ve sahte başarı mesajı göstermedi; telefon/e-posta kanalına yönlendirdi.
- Hava durumu butonu Open-Meteo’dan “Darende, Malatya” eşleşmesiyle güncel veri aldı; kaynak ve güncelleme saati gösterildi.
- Menü, CTA, telefon ve e-posta bağlantıları DOM ve hedef değerleriyle doğrulandı.

## JavaScript kapalı kullanım

Ana metinler ve bağlantılar ilk HTML içindedir. Mobil navigasyon için `noscript` stili bulunur; skor, hava ve form davranışları ilerici geliştirme olarak JavaScript gerektirir.
