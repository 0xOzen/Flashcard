<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# WortSchatz Web App

Bu proje artik iPad ve masaustu tarayicilarda calisacak sekilde hazirlanmis bir `PWA` akisi izler.

## Hedef Mimari

- Arayuz `Vite + React` olarak calisir.
- Kullanici verileri cihazda lokal tutulur.
- Kalicilik `IndexedDB` uzerindedir; eski `localStorage` verisi otomatik migrate edilir.
- AI gorsel uretimi iki modda calisabilir: browser-key veya `/api` proxy.
- Login zorunlu degildir.

## Neden Boyle?

- iPad'de "uygulama gibi" kullanmanin en temiz yolu `PWA` kurulumudur.
- `localStorage`, base64 AI gorselleri icin cabuk dolar; bu nedenle `IndexedDB` tercih edildi.
- En kolay kisisel kullanim icin browser'da kendi key'ini lokal saklayip dogrudan AI cagrisi yapabilirsin.
- Daha guvenli kullanim istersen AI cagrisi server proxy uzerinden gecer.

## Run Locally

**Prerequisites:** Node.js

1. Bagimliliklari kur:
   `npm install`
2. Sadece web arayuzunu calistirmak istersen:
   `npm run dev:web`
3. Tarayicida ac:
   [http://localhost:3000](http://localhost:3000)
4. Uygulama icinde `Ayarlar` > `Kolay Mod: Browser API Key` alanina kendi Gemini key'ini yapistir.
5. AI gorsel uretimini dogrudan browser uzerinden kullan.

Istersen proxy/server modunu da kullanabilirsin:

- `npm run dev:api`
- `npm run dev:web`

## Build ve Serve

1. Frontend build al:
   `npm run build:web`
2. Build cikisini ve API'yi ayni sunucudan servis et:
   `npm run serve:api`

Varsayilan API portu `8787`'dir. Production ortaminda ayni server statik `dist/` klasorunu da sunar.

## Cloudflare Pages

Bu proje Cloudflare Pages Free plan icin uygundur.

Browser-key modu kullaniyorsan:

- Sadece statik site yayinlarsin
- Server veya Pages Functions gerekmez
- Build command: `npm run build:web`
- Build output directory: `dist`

Not:

- Ilk MVP icin repoda `wrangler.toml` bulundurulmuyor
- Cloudflare Pages bu projeyi saf statik Vite uygulamasi gibi deploy etmeli
- Cloudflare dashboard'da Worker entrypoint veya Functions ayari yapmana gerek yok

Cloudflare Pages Free ile ilgili pratik notlar:

- Statik asset istekleri ucretsizdir
- Statik site icin uygun bir secenektir
- Pages Free planinda aylik build limiti vardir
- Site basina dosya ve tekil dosya boyutu limitleri vardir

Bu projede ilk MVP icin en kolay Cloudflare Pages akisi:

1. Repo'yu GitHub'a push et
2. Cloudflare Pages'de `Create project` sec
3. GitHub repo'nu bagla
4. Framework preset olarak `Vite` sec
5. Build command olarak `npm run build:web` gir
6. Output directory olarak `dist` gir
7. Root directory alanini bos birak
8. Deploy et

Browser-key modu kullaniyorsan Cloudflare'a environment variable girmen gerekmez.

Eger ileride proxy/server moduna donersen:

- Pages Functions veya ayri bir Worker gerekir
- O zaman `GEMINI_API_KEY` gibi gizli degiskenleri Cloudflare dashboard uzerinden eklersin

## iPad Kurulum

1. Uygulamayi Safari veya destekleyen bir tarayicida ac.
2. Paylas menusu uzerinden `Add to Home Screen` sec.
3. Ikona tiklayarak uygulamayi tam ekran benzeri sekilde ac.

Not: iPadOS'ta klasik otomatik install prompt'u her zaman cikmaz; en guvenli akış `Add to Home Screen` yoludur.

## AI Notu

- Varsayilan model `.env` icinde `gemini-3.1-flash-image-preview` olarak ayarlanabilir.
- Daha dusuk maliyetli hizli alternatif istersen `gemini-2.5-flash-image` kullanabilirsin.
- Browser API key modu en kolay kurulumdur ama production guvenligi saglamaz.
- Public veya uzun omurlu kullanimda proxy/server modu daha dogrudur.
- Uygulama icindeki `Ayarlar` ekranindan aktif AI modeli lokal olarak degistirilebilir.
- `Ayarlar` icinde lokal JSON yedegi disa aktarip geri ice alabilirsin.
- Ust barda online/offline durumu gorunur; offline iken lokal veriler calismaya devam eder ama AI gorsel uretimi devre disi kalir.

## Resmi Kaynaklar

- Cloudflare Pages urun sayfasi: https://www.cloudflare.com/developer-platform/products/pages/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages pricing for Functions: https://developers.cloudflare.com/pages/functions/pricing/
- Cloudflare Pages framework guides: https://developers.cloudflare.com/pages/framework-guides/
