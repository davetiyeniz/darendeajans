# Lighthouse ve performans raporu

Test tarihi: 30 Temmuz 2026

## Önemli açıklama

Resmî Lighthouse aracı yerel ortamda kurulu değildi. Aracı indirmek, harici paket kaynağına bağlanmayı gerektirdiği ve proje talimatı tüm harici platform işlemlerini yasakladığı için Lighthouse skoru üretilmedi. Aşağıdaki sonuçlar Lighthouse skoru değildir; skor veya eşik sonucu uydurulmamıştır.

## Üç bağımsız kalite koşusu

1. Statik yapı ve SEO denetimi: 1.405 kontrol, 20 ana sayfa, 0 hata.
2. Gerçek tarayıcı responsive denetimi: 20 sayfa × 360 px, yatay taşma 0, kırık görsel 0, H1 hatası 0.
3. Gerçek tarayıcı responsive denetimi: 20 sayfa × 1.440 px, yatay taşma 0, kırık görsel 0, H1 hatası 0.

Ek olarak ana sayfa, hizmet, rehber ve iletişim sayfaları 768 px ve 1.024 px genişliklerde test edildi; hata bulunmadı.

## Statik performans bütçesi

- Ana sayfa HTML: yaklaşık 27 KB
- Ana CSS: yaklaşık 26 KB
- Grid CSS: yaklaşık 1,4 KB
- Ana JavaScript: yaklaşık 12,4 KB
- LCP AVIF görseli (480 px): yaklaşık 10,5 KB
- Tüm teslim paketi: yaklaşık 2,6 MB
- CDN veya render engelleyen harici CSS/JS: yok
- Ana JavaScript: `defer`
- Hero dışı görseller: `loading="lazy"`
- AVIF/WebP ve responsive `srcset`: etkin
- Animasyon azaltma: `prefers-reduced-motion` ve düşük güç kontrolü etkin

## Canlı yayın sonrası önerilen doğrulama

Alan adı ve barındırma yanıt süreleri yerel testte ölçülemez. Yayın sonrası Lighthouse mobil testi üç kez çalıştırılmalı; medyan Performance, Accessibility, Best Practices ve SEO skorları bu dosyaya eklenmelidir.
