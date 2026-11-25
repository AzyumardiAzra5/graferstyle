# GraferStyle - Website + Grafer Bot

Website statis (HTML/CSS/JS) dengan chatbot rule-based gratis. Tidak butuh build, API key, maupun server.

## Struktur
```
index.html          halaman utama (SPA, routing hash)
css/chatbot.css     tampilan chatbot
js/chatbot.js       logika chatbot + pengaturan (objek CHATBOT di baris atas)
img/chatbot/        logo chatbot  <-- ganti logo di sini
vercel.json         header cache & keamanan untuk Vercel
```

## Ganti logo chatbot
1. Siapkan logo persegi **512x512 px**, PNG transparan atau SVG, di bawah 50 KB.
2. Timpa file `img/chatbot/logo-chatbot.png` (nama file sama). Kalau memakai SVG, ubah `logo` di objek `CHATBOT` pada `js/chatbot.js`.
3. Kalau logo kamu sudah bulat penuh dan ingin memenuhi tombol, set `logoPenuh: true`.
4. Kalau logo gagal dimuat, chatbot otomatis memakai `img/logo.png`.

## Bandeja pertanyaan (selalu tampil di bawah chat)
Semua pertanyaan yang sudah disiapkan ada di array `PERTANYAAN` pada `js/chatbot.js`, dikelompokkan per tab (Harga, Booking, Pembayaran, Hasil, Info).
Untuk menambah pertanyaan, tambahkan `{ t: "Teks tombol", q: "kalimat yang dikirim ke bot" }` ke tab yang sesuai.
Pastikan kalimat `q` mengandung kata kunci dari array `INTENT` supaya bot bisa menjawabnya. Pertanyaan yang sudah dipilih diberi tanda centang.

## Mengubah isi jawaban
- **Harga, paket, fasilitas, FAQ, kontak** diambil dari `js/data.js`. Ubah di sana, jawaban bot ikut berubah.
- **Pertanyaan baru**: tambah satu objek di array `INTENT` pada `js/chatbot.js` (isi `kw` dengan kata kunci dan `jawab` dengan balasannya).
- **Nama bot, teks sapaan, halaman yang menyembunyikan bot**: objek `CHATBOT` di baris paling atas `js/chatbot.js`.

## Deploy ke Vercel
**Cara 1 - lewat GitHub (disarankan, auto-deploy tiap push)**
1. Buat repository di GitHub, lalu upload isi folder ini (index.html harus ada di root repo).
2. Buka vercel.com, login, klik **Add New > Project**, pilih repository tadi.
3. Framework Preset: **Other**. Kosongkan Build Command dan Output Directory. Klik **Deploy**.

**Cara 2 - lewat CLI**
```
npm i -g vercel
vercel        # ikuti pertanyaan, lalu: vercel --prod
```

## Catatan penting
- Data akun, pesanan, dan pembayaran masih disimpan di memori browser (`js/store.js`) dan kembali ke data awal saat halaman di-refresh. Untuk pemakaian nyata perlu database dan login sungguhan.
- Pengecekan tanggal oleh chatbot memakai data yang sama, jadi sifatnya indikatif. Konfirmasi final tetap oleh admin.
