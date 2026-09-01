# WristWatch.uz — sof HTML/CSS/JS versiya

Bu versiya **hech qanday build (Vite, npm run build, Base directory) talab qilmaydi**. Fayllar allaqachon tayyor HTML/CSS/JS holida — Netlify ularni to'g'ridan-to'g'ri, o'zgarishsiz xizmat qiladi. Shu sababli avvalgi barcha "Base directory", "Clear cache", "nested folder" muammolari bu versiyada butunlay yo'q bo'ladi.

## Fayl tuzilishi

```
index.html          — Bosh sahifa
catalog.html         — Katalog
product.html          — Mahsulot tafsiloti (?id=... orqali)
about.html            — Biz haqimizda
contact.html          — Aloqa
404.html             — Sahifa topilmadi
admin/index.html      — Admin panel (login + boshqaruv)
assets/css/           — Barcha stillar
assets/js/            — Barcha JavaScript
assets/video/         — Video fayllar
netlify/functions/    — Telegram xabarnoma funksiyasi
supabase/schema.sql   — Baza sxemasi
netlify.toml          — Netlify sozlamalari (build kerak emas!)
```

## 1-qadam: Supabase sozlash

1. [supabase.com](https://supabase.com) da loyiha yarating (agar hali yo'q bo'lsa).
2. **SQL Editor** ga kirib, `supabase/schema.sql` faylining **to'liq matnini** joylashtirib ishga tushiring. Bu `products` va `orders` jadvallarini, xavfsizlik siyosatlarini (RLS) va 3 ta namuna mahsulotni yaratadi.
3. **Project Settings → API** bo'limiga kiring. Ikkita qiymatni nusxalang:
   - **Project URL**
   - **anon public** kaliti (⚠️ `service_role` kalitni EMAS — u maxfiy bo'lishi kerak)
4. **Authentication → Users** bo'limiga kirib, o'zingiz uchun admin foydalanuvchi yarating (email + parol). Shu email/parol bilan `/admin` panelga kirasiz.

## 2-qadam: Supabase kalitlarini kodga joylashtirish

`assets/js/supabase-config.js` faylini oching va quyidagi 2 qatorni o'z qiymatlaringiz bilan almashtiring:

```js
window.SUPABASE_URL = 'https://SIZNING-LOYIHA.supabase.co';
window.SUPABASE_ANON_KEY = 'sizning-anon-public-kalit';
```

Saqlang.

## 3-qadam: Telegram bot sozlash

1. Telegram'da @BotFather orqali bot yarating, **Bot Token**ni oling.
2. O'zingizning **Chat ID**ingizni oling (masalan @userinfobot orqali).
3. Bu ikkalasi keyingi qadamda Netlify Environment Variables'ga kiritiladi (kodga emas — bu maxfiy ma'lumot, faqat serverda saqlanadi).

## 4-qadam: Netlify'ga joylash

### Eng oson yo'l — Netlify Drop (sudrab tashlash)

1. [app.netlify.com/drop](https://app.netlify.com/drop) sahifasini oching.
2. Ushbu papkaning **BARCHA fayllarini** (index.html, catalog.html, assets/, netlify/ va h.k. — hammasini birga) sudrab, sahifaga tashlang.
3. Bir necha soniyada sayt tayyor bo'ladi va havola beriladi.
4. **Environment variables** qo'shish uchun: Site settings → Environment variables → quyidagilarni qo'shing:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
5. O'zgaruvchilarni qo'shgandan keyin **Deploys → Trigger deploy** qiling (funksiya ularni o'qishi uchun).

### Yoki — GitHub orqali

1. Ushbu papka tarkibini GitHub repo'ingizning **ILDIZIGA** (root) yuklang — endi bu yerda "Base directory" yoki "Build command" haqida umuman qayg'urish shart emas, chunki `netlify.toml`da build buyrug'i yo'q.
2. Netlify'da repo'ni ulang. Build sozlamalarini **bo'sh qoldiring** (Build command: bo'sh, Publish directory: bo'sh yoki `.`).
3. Environment variables'ni yuqoridagi kabi qo'shing.

## 5-qadam: Tekshirish

- Bosh sahifa, katalog, mahsulot sahifalarini oching — Supabase'dan mahsulotlar chiqishi kerak (agar hali mahsulot qo'shmagan bo'lsangiz, schema.sql'dagi 3 ta namuna ko'rinadi).
- `/admin` ni oching, 1-qadamda yaratgan email/parol bilan kiring.
- Admin panelda mahsulot qo'shib ko'ring, keyin katalogda paydo bo'lishini tekshiring.
- Mahsulot sahifasida "Telegram orqali buyurtma berish" formasini sinab ko'ring — Telegram botingizga xabar kelishi kerak.

## Nima uchun bu versiya ishonchli

- **Build yo'q** — Netlify hech narsani "qurish" kerak emas, shuning uchun "Base directory topilmadi", "vite: not found" kabi xatolar bu yerda mumkin emas.
- **Nested folder muammosi yo'q** — barcha fayllar repo ildizida, GitHub'ga qanday yuklasangiz ham (agar to'g'ridan-to'g'ri ildizga yuklasangiz), Netlify ularni to'g'ri topadi.
- **Kesh muammosi yo'q** — statik fayllar har doim aynan siz yozgan holatda xizmat qilinadi.

## Kelajakda yangilash

Faylni tahrirlab, xohlagan usulda qayta yuklang (GitHub push yoki Netlify Drop orqali qayta sudrab tashlang) — hech qanday build bosqichi yo'qligi sababli o'zgarish darhol ko'rinadi.
