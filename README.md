# Darende Ajans — statik web sitesi

Bu paket doğrudan yayınlanabilir statik HTML, CSS ve JavaScript çıktısıdır. `index.html` paket kökündedir; PHP, veritabanı veya sunucu tarafı çalışma zamanı gerekmez.

## İçerik

- 20 indexlenebilir ana sayfa
- Gizlilik, KVKK, çerez ve özel 404 yardımcı sayfaları
- Yerel CSS, JavaScript, görsel ve font varlıkları
- robots.txt, sitemap.xml, manifest, CNAME ve .nojekyll
- SEO araştırma/brief/kontrol dosyaları
- Test ve paket raporları

## GitHub Pages’e elle yükleme

1. ZIP’i açın ve içeriğin depo kökünde olduğundan emin olun; `index.html` üst klasör içinde kalmamalıdır.
2. Tüm dosya ve klasörleri aynı yolları koruyarak yükleyin.
3. Pages kaynağını depo kökü olarak seçin.
4. Özel alan adı kullanılacaksa paketteki `CNAME` yalnız `darendeajans.com` değerini içerir. DNS değişikliklerini yalnız alan adı sahibi yapmalıdır.

## Hostinger / standart barındırma

Paket içeriğini alan adının belge köküne (`public_html` gibi) yükleyin. Sunucu `index.html` dosyasını varsayılan belge olarak sunmalıdır. Temiz URL klasörleri kendi `index.html` dosyalarını içerir.

## Yapılandırılmayı bekleyen alanlar

`assets/js/config.js` içinde ikinci telefon, WhatsApp, açık adres, harita embed URL’si, form endpoint’i, Search Console doğrulaması ve Analytics kimliği boş bırakılmıştır. Gerçek değerler doğrulanmadan etkinleştirilmemelidir.

## Form ve hava durumu

İletişim formu endpoint boşken veri göndermez ve sahte başarı mesajı göstermez. Hava durumu, kullanıcı butona bastığında Open-Meteo geocoding ve forecast API’lerine bağlanır; başarısızlıkta veri uydurmaz.

## Üçüncü taraf varlıklar

CDN kullanılmaz. Grid dosyası proje için kullanılan sınıfları içeren yerel Bootstrap 5 uyumlu bir alt kümedir. Liberation Sans font dosyaları Mozilla PDF.js dağıtımındaki açık lisanslı varlıklardan, görsel işlemleme Sharp paketinden yararlanılarak hazırlanmıştır. Ayrıntı: `reports/third-party-packages.md`.
