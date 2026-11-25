<div align="center">

# GraferStyle

### Photography & Videography Service Platform

Website layanan fotografi dan videografi dengan sistem pemesanan, pengelolaan pesanan, simulasi pembayaran, serta asisten virtual untuk membantu pelanggan mendapatkan informasi layanan.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GraferStyle-477C68?style=for-the-badge&logo=vercel&logoColor=white)](#demo)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Mengabadikan momen, menghadirkan cerita.**

</div>

---

## Tentang Project

**GraferStyle** merupakan website layanan fotografi dan videografi yang dirancang untuk mempermudah pelanggan melihat layanan, memilih paket, melakukan booking, dan memantau pesanan dalam satu platform.

Project ini menyediakan dua area utama berdasarkan peran pengguna:

- **Pelanggan** — menjelajahi layanan, membuat akun, melakukan booking, melihat status pesanan, dan mengakses invoice.
- **Admin** — mengelola pesanan, jadwal, pendapatan, paket layanan, portofolio, dan data pelanggan melalui panel admin.

GraferStyle melayani kebutuhan dokumentasi visual untuk area Kuningan dan sekitarnya, dengan kategori layanan Graduation, Prewedding, Couple Date, dan Foto Produk.

## Demo

**Website:** [Kunjungi GraferStyle](https://graferstyle.vercel.app)

> Jika URL deployment berbeda, ubah tautan di atas sesuai alamat website yang aktif.

## Fitur Utama

### Halaman Publik

- Landing page dengan hero slider dan informasi layanan.
- Halaman Tentang Kami dan Kontak.
- Katalog paket dan informasi harga.
- Galeri portofolio berdasarkan kategori.
- FAQ untuk membantu menjawab pertanyaan pelanggan.

### Area Pelanggan

- Registrasi dan login akun.
- Form booking berdasarkan kategori, paket, tanggal, lokasi, konsep, dan properti.
- Validasi tanggal booking dan ketersediaan sesi.
- Riwayat pesanan beserta status prosesnya.
- Halaman profil pelanggan.
- Halaman pembayaran dan invoice.
- Akses tautan hasil dokumentasi melalui Google Drive setelah admin memasukkan tautan hasil.

### Panel Admin

- Dashboard ringkasan aktivitas.
- Pengelolaan dan pembaruan status pesanan.
- Pengelolaan jadwal sesi.
- Ringkasan pendapatan berdasarkan data pesanan.
- Pengelolaan paket dan harga layanan.
- Pengelolaan portofolio.
- Pengelolaan data pelanggan.

### Grafer Bot

- Chatbot rule-based yang merespons pertanyaan seputar layanan.
- Menyediakan informasi paket, harga, fasilitas, booking, pembayaran, hasil dokumentasi, dan kontak.
- Tombol pertanyaan cepat berdasarkan kategori.
- Terhubung dengan data layanan dan FAQ yang digunakan website.

## Alur Pemesanan

1. **Pilih layanan** — pelanggan melihat kategori dan paket yang tersedia.
2. **Buat booking** — pelanggan masuk ke akun, lalu mengisi detail sesi.
3. **Konfirmasi admin** — admin memeriksa dan memperbarui status pesanan.
4. **Pembayaran** — pelanggan membuka halaman pembayaran sesuai pesanan yang telah dikonfirmasi.
5. **Sesi dokumentasi** — sesi foto atau video dilaksanakan sesuai jadwal.
6. **Pengiriman hasil** — admin memasukkan tautan Google Drive agar dapat diakses pelanggan melalui halaman pesanan.

## Tech Stack

| Teknologi            | Penggunaan                                        |
| -------------------- | ------------------------------------------------- |
| HTML5                | Struktur halaman website                          |
| CSS3                 | Styling dan responsive layout                     |
| JavaScript (Vanilla) | Interaksi, routing, validasi, dan logika aplikasi |
| Bootstrap 5          | Komponen UI dan layout responsif                  |
| Google Fonts         | Tipografi website                                 |
| Vercel               | Deployment website statis                         |

Project ini menggunakan pendekatan **client-side**, tanpa proses build dan tanpa framework JavaScript tambahan.

## Struktur Project

```text
GraferStyle/
├── index.html
├── vercel.json
├── .gitignore
│
├── css/
│   ├── style.css
│   ├── chatbot.css
│   └── bootstrap.min.css
│
├── js/
│   ├── data.js
│   ├── store.js
│   ├── router.js
│   ├── layout.js
│   ├── halaman-publik.js
│   ├── halaman-pelanggan.js
│   ├── halaman-admin.js
│   ├── halaman-bayar.js
│   ├── pembayaran.js
│   ├── chatbot.js
│   ├── daftar.js
│   ├── foto.js
│   ├── notifikasi.js
│   ├── animasi.js
│   └── qrcode.js
│
└── img/
    ├── hero-slider/
    ├── poster/
    ├── portofolio/
    │   ├── graduation/
    │   ├── prewedding/
    │   ├── couple/
    │   └── produk/
    ├── chatbot/
    └── favicon/
```

## Menjalankan Project

GraferStyle merupakan website statis sehingga tidak memerlukan instalasi dependency atau build command.

### Opsi 1 — Visual Studio Code

1. Clone repository:

   ```bash
   git clone https://github.com/USERNAME/GraferStyle.git
   ```

2. Buka folder project di Visual Studio Code.
3. Jalankan `index.html` menggunakan ekstensi **Live Server**.
4. Website akan terbuka melalui alamat lokal yang disediakan Live Server.

### Opsi 2 — Local Server

Jika menggunakan Apache/XAMPP:

1. Salin folder project ke direktori web server, misalnya `htdocs`.
2. Jalankan Apache melalui XAMPP.
3. Buka browser dan akses:

   ```text
   http://localhost/GraferStyle/
   ```

## Konfigurasi Konten

Beberapa bagian website dapat disesuaikan melalui file berikut:

| File              | Fungsi                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `js/data.js`      | Data layanan, paket, harga, fasilitas, FAQ, dan informasi kontak    |
| `js/chatbot.js`   | Nama bot, sapaan, pertanyaan cepat, kata kunci, dan respons chatbot |
| `js/foto.js`      | Data foto portofolio bawaan                                         |
| `css/style.css`   | Tampilan utama website                                              |
| `css/chatbot.css` | Tampilan Grafer Bot                                                 |
| `vercel.json`     | Pengaturan header keamanan dan cache untuk deployment Vercel        |

## Catatan Pengembangan

GraferStyle saat ini merupakan **prototype frontend berbasis client-side** untuk demonstrasi alur layanan dan pengelolaan.

- Data akun, pesanan, transaksi, dan perubahan admin dikelola melalui objek JavaScript di memori browser. Data akan kembali ke kondisi awal ketika halaman dimuat ulang.
- Login dan pembagian hak akses merupakan simulasi di sisi frontend, belum menggunakan autentikasi server.
- Alur pembayaran dan status transaksi merupakan simulasi aplikasi; belum terhubung ke payment gateway atau proses verifikasi pembayaran sungguhan.
- Fitur yang membutuhkan penyimpanan permanen dan penggunaan operasional memerlukan backend, database, autentikasi, serta integrasi layanan terkait.
- Jangan gunakan akun contoh atau data pribadi bawaan untuk deployment publik. Ganti atau hapus data demo sebelum repository dipublikasikan.

## Pengembang

Dikembangkan oleh Ardiii sebagai project website layanan fotografi dan videografi **GraferStyle**.

<div align="center">

**GraferStyle — Every Moment Has a Story.**

</div>
