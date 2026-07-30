JITTER VIDEO DOSYALARI

1) hero-banner.mp4
   Kullanım: Ana sayfanın ilk ekranını tamamen kaplayan sinematik banner.
   Öncelik: Mobil ve tablette ilk yüklenen video; ardından masaüstü.
   Davranış: Autoplay, muted, loop, playsinline; poster ve hata yedeği bulunur.

2) site-background.mp4
   Kaynak: Repeater-Animation.mp4
   Kullanım: Sayfa boyunca düşük opaklıklı, sabit hareketli atmosfer.
   Davranış: Banner ile ağ yarışına girmemesi için kısa gecikmeyle yüklenir.

3) services-orbit.mp4
   Kullanım: Ürün ve hizmet kategorileri bölümündeki kart/kategori geçişleri.
   Davranış: Bölüm ekrana yaklaşınca lazy-load edilir.

Tüm videolar mobil, tablet ve masaüstünde çalışır. Veri tasarrufu veya
prefers-reduced-motion etkinse poster ve CSS yedeği gösterilir.
