
const CHATBOT = {
  nama: "Grafer Bot",
  status: "Asisten GraferStyle · balas instan",
  logo: "img/chatbot/logo-chatbot.png",
  logoCadangan: "img/logo.png",
  logoPenuh: true,
  sapaanTeaser: "Halo! Ada yang bisa aku bantu soal paket & jadwal?",
  sembunyiDi: ["login", "daftar", "admin"],
  kunciSesi: "gs-chat-v1",
};

(function () {
  "use strict";

  const $ = (s, a) => (a || document).querySelector(s);
  const IKON = {
    kirim: '<svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    tutup: '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    ulang: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    silang: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    panah: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  };
  const kurangiGerakBot = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const simpan = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {  } };
  const baca = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const hapus = (k) => { try { sessionStorage.removeItem(k); } catch (e) {  } };

  const bersih = (t) => " " + String(t).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
  const waDasar = () => KONTAK.waUrl.split("?")[0];
  const waLink = (teks) => waDasar() + "?text=" + encodeURIComponent(teks);
  const tombolWA = (teks, label) => '<a class="gs-chat-btn-wa" href="' + waLink(teks) + '" target="_blank" rel="noreferrer">' + (label || "Chat Admin via WhatsApp") + "</a>";
  const tautan = (hash, label) => '<a href="' + hash + '" data-nav>' + label + "</a>";
  const hrg = (n) => '<span class="harga">' + rupiah(n) + "</span>";
  const faq = (kata) => { const f = FAQ.find((x) => x[0].toLowerCase().includes(kata)); return f ? aman(f[1]) : ""; };
  const sudahMasuk = () => { try { return !!userAktif(); } catch (e) { return false; } };

  const KATA_KATEGORI = {
    wisuda: ["wisuda", "graduation", "graduate", "toga", "lulus", "kelulusan"],
    prewedding: ["prewedding", "pre wedding", "prewed", "pranikah", "pre-wedding"],
    couple: ["couple", "date session", "pacar", "berdua", "couple date"],
    produk: ["foto produk", "produk", "product", "katalog", "jualan", "umkm", "olshop", "dagangan"],
  };
  function deteksiKategori(q) {
    for (const k in KATA_KATEGORI) if (LAYANAN[k] && KATA_KATEGORI[k].some((w) => q.includes(" " + bersih(w).trim() + " ") || (w.length > 5 && q.includes(bersih(w).trim())))) return k;
    return null;
  }
  function deteksiTipe(q) {
    const foto = /\bfoto\b/.test(q), video = /\bvideo\b|videografi/.test(q);
    if (/foto video|foto dan video|foto n video|combo|komplit|paket lengkap|keduanya|dua duanya/.test(q) || (foto && video)) return "fotovideo";
    if (video) return "video";
    if (/foto only|foto saja|foto aja|cuma foto|hanya foto/.test(q)) return "foto";
    return null;
  }
  const daftarFasilitas = (p) => "<ul>" + p.fasilitas.map((f) => "<li>" + aman(f) + "</li>").join("") + "</ul>";
  const kunciKat = () => Object.keys(LAYANAN);

  function jawabSemuaHarga() {
    const baris = kunciKat().map((k) => {
      const L = LAYANAN[k];
      return "<li><b>" + aman(L.nama) + "</b><br>" + L.paket.map((p) => aman(p.nama) + " " + hrg(p.harga)).join(" &middot; ") + "</li>";
    }).join("");
    return {
      h: "<p>Berikut daftar paket GraferStyle:</p><ul>" + baris + "</ul><p class='kecil'>Mau lihat fasilitas lengkap? Pilih salah satu layanan di bawah.</p>",
      c: kunciKat().map((k) => ({ t: LAYANAN[k].nama, q: "harga " + LAYANAN[k].nama })).concat([{ t: "Cara booking" }]),
    };
  }
  function jawabKategori(k) {
    const L = LAYANAN[k];
    const isi = L.paket.map((p) => "<p><b>" + aman(p.nama) + "</b> &mdash; " + hrg(p.harga) + daftarFasilitas(p) + "</p>").join("");
    return {
      h: "<p><b>" + aman(L.nama) + "</b> (" + aman(L.tagline) + ")<br>" + aman(L.deskripsi) + "</p>" + isi + "<p class='kecil'>Siap pesan? " + tautan("#booking", "Buka halaman Booking") + ".</p>",
      c: [{ t: "Cek tanggal" }, { t: "Cara booking" }, { t: "Semua harga", q: "harga semua paket" }],
    };
  }
  function jawabTipe(id) {
    const contoh = kunciKat().map((k) => LAYANAN[k].paket.find((p) => p.id === id)).filter(Boolean);
    if (!contoh.length) return jawabSemuaHarga();
    const baris = kunciKat().map((k) => { const p = LAYANAN[k].paket.find((x) => x.id === id); return p ? "<li>" + aman(LAYANAN[k].nama) + ": " + hrg(p.harga) + "</li>" : ""; }).join("");
    return {
      h: "<p><b>" + aman(contoh[0].nama) + "</b></p><ul>" + baris + "</ul><p>Fasilitas:</p>" + daftarFasilitas(contoh[0]),
      c: [{ t: "Semua harga", q: "harga semua paket" }, { t: "Cara booking" }, { t: "Cek tanggal" }],
    };
  }

  const p2 = (n) => String(n).padStart(2, "0");
  function susunIso(y, bln, tgl) {
    const hariIni = tanggalGeser(0);
    const iso = (yy) => yy + "-" + p2(bln) + "-" + p2(tgl);
    if (y) return iso(y);
    const tahun = new Date().getFullYear();
    return iso(iso(tahun) < hariIni ? tahun + 1 : tahun);
  }
  const BLN = { jan: 1, feb: 2, peb: 2, mar: 3, apr: 4, mei: 5, jun: 6, jul: 7, agu: 8, agt: 8, sep: 9, okt: 10, nov: 11, des: 12 };
  function uraiTanggal(teks) {
    const s = teks.toLowerCase();
    let m;
    if (/\bhari ini\b/.test(s)) return tanggalGeser(0);
    if (/\bbesok\b/.test(s)) return tanggalGeser(1);
    if (/\blusa\b/.test(s)) return tanggalGeser(2);
    if ((m = s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/))) return susunIso(+m[1], +m[2], +m[3]);
    if ((m = s.match(/\b(\d{1,2})\s*(jan|feb|peb|mar|apr|mei|jun|jul|agu|agt|sep|okt|nov|des)[a-z]*\.?\s*(\d{4})?/))) return susunIso(m[3] ? +m[3] : null, BLN[m[2]], +m[1]);
    if ((m = s.match(/\b(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?\b/))) {
      let y = m[3] ? +m[3] : null; if (y && y < 100) y += 2000;
      return susunIso(y, +m[2], +m[1]);
    }
    if ((m = s.match(/\btanggal\s*(\d{1,2})\b/))) {
      const n = new Date(); let bln = n.getMonth() + 1, y = n.getFullYear();
      if (susunIso(y, bln, +m[1]) < tanggalGeser(0)) { bln++; if (bln > 12) { bln = 1; y++; } }
      return y + "-" + p2(bln) + "-" + p2(+m[1]);
    }
    return null;
  }
  function jawabTanggal(iso) {
    const r = periksaTanggalBooking(iso);
    const catatan = "<p class='kecil'>Ketersediaan final dikonfirmasi admin saat pesananmu diproses.</p>";
    if (r.ok) {
      return {
        h: "<p>Tanggal <b>" + tglIndo(iso) + "</b> masih kosong dan bisa dibooking.</p><p>" + (sudahMasuk() ? "" : "Kamu perlu masuk atau daftar akun dulu, ") + tautan("#booking", "lanjut ke halaman Booking") + ".</p>" + catatan,
        c: [{ t: "Cara booking" }, { t: "Lihat harga", q: "harga semua paket" }],
      };
    }
    if (r.penuh) {
      const sar = tanggalKosongTerdekat(iso, 3);
      return {
        h: "<p>" + aman(r.pesan) + "</p>" + (sar.length ? "<p>Tanggal kosong terdekat: " + sar.map((t) => "<b>" + tglIndo(t) + "</b>").join(", ") + ".</p>" : "") + catatan,
        c: sar.map((t) => ({ t: tglIndo(t), q: "cek tanggal " + t })).concat([{ t: "Hubungi admin" }]),
      };
    }
    return { h: "<p>" + aman(r.pesan) + "</p>", c: [{ t: "Syarat booking", q: "cara booking" }, { t: "Cek tanggal lain", q: "cek tanggal" }] };
  }

  const CHIP_UTAMA = [{ t: "Harga paket", q: "harga semua paket" }, { t: "Cara booking" }, { t: "Cek tanggal" }, { t: "Pembayaran" }, { t: "Portofolio" }, { t: "Hubungi admin" }];
  const salamWaktu = () => { const j = new Date().getHours(); return j < 11 ? "Selamat pagi" : j < 15 ? "Selamat siang" : j < 18 ? "Selamat sore" : "Selamat malam"; };

  const INTENT = [
    { id: "salam", kw: ["halo", "hai", "hi", "hello", "hey", "pagi", "siang", "sore", "malam", "assalamualaikum", "permisi", "selamat pagi", "selamat siang", "selamat sore", "selamat malam"], pendek: true,
      jawab: () => ({ h: "<p>" + salamWaktu() + "! Aku " + aman(CHATBOT.nama) + ". Aku bisa bantu info paket, cara booking, cek tanggal, dan pembayaran. Mau tanya apa?</p>", c: CHIP_UTAMA }) },
    { id: "terimakasih", kw: ["makasih", "terima kasih", "thanks", "thank you", "thx", "tengkyu", "mantap", "oke siap"], pendek: true,
      jawab: () => ({ h: "<p>Sama-sama! Kalau masih ada yang ingin ditanyakan, aku di sini.</p>", c: CHIP_UTAMA.slice(0, 4) }) },
    { id: "pamit", kw: ["bye", "dadah", "sampai jumpa", "udah dulu", "cukup"], pendek: true,
      jawab: () => ({ h: "<p>Terima kasih sudah mampir ke GraferStyle. Sampai jumpa di sesi foto!</p>", c: [] }) },
    { id: "identitas", kw: ["kamu siapa", "siapa kamu", "kamu bot", "robot", "manusia", "bot atau", "nama kamu"],
      jawab: () => ({ h: "<p>Aku " + aman(CHATBOT.nama) + ", asisten otomatis GraferStyle. Jawabanku berdasarkan informasi di website ini. Untuk hal di luar itu, admin siap membantu langsung.</p>" + tombolWA("Halo GraferStyle, saya ingin bicara dengan admin."), c: CHIP_UTAMA.slice(0, 4) }) },
    { id: "harga", kw: ["harga", "biaya", "tarif", "price", "pricelist", "daftar harga", "paket", "berapa", "murah", "mahal", "rate card", "budget"],
      jawab: (ctx) => ctx.kategori ? jawabKategori(ctx.kategori) : (ctx.tipe ? jawabTipe(ctx.tipe) : jawabSemuaHarga()) },
    { id: "layanan", kw: ["layanan", "jasa", "service", "apa saja", "jenis", "tersedia apa", "ada apa saja", "bisa foto apa"],
      jawab: (ctx) => ctx.kategori ? jawabKategori(ctx.kategori) : ({
        h: "<p>" + faq("layanan apa") + "</p><ul>" + kunciKat().map((k) => "<li><b>" + aman(LAYANAN[k].nama) + "</b>: " + aman(LAYANAN[k].deskripsi) + "</li>").join("") + "</ul>",
        c: kunciKat().map((k) => ({ t: LAYANAN[k].nama, q: "harga " + LAYANAN[k].nama })),
      }) },
    { id: "booking", kw: ["booking", "book", "pesan", "order", "reservasi", "cara pesan", "mau foto", "mau pesan", "syarat booking", "gimana pesan", "cara daftar sesi", "jadwalkan"],
      jawab: () => ({
        h: "<p>Caranya mudah:</p><ol><li>Masuk atau daftar akun di website.</li><li>Buka " + tautan("#booking", "halaman Booking") + " lalu isi paket, tanggal, lokasi, konsep, dan properti.</li><li>Tunggu admin mengonfirmasi pesananmu.</li><li>Bayar lewat website maksimal " + BATAS_BAYAR_JAM + " jam setelah dikonfirmasi.</li><li>Datang di hari sesi. Hasil dikirim lewat Google Drive.</li></ol><p class='kecil'>Aturan tanggal: booking minimal " + BOOKING_MIN_HARI + " hari sebelum sesi dan maksimal " + Math.round(BOOKING_MAKS_HARI / 365) + " tahun ke depan. Satu tanggal menerima " + MAKS_SESI_PER_HARI + " sesi.</p>",
        c: [{ t: "Cek tanggal" }, { t: "Pembayaran" }, { t: "Buat akun", q: "cara daftar akun" }],
      }) },
    { id: "tanggal", kw: ["tanggal", "jadwal", "kosong", "penuh", "slot", "available", "ketersediaan", "hari apa", "ada slot", "bisa tanggal", "cek tanggal", "bulan depan", "minggu depan", "tersedia"],
      jawab: (ctx) => { if (ctx.tanggal) return jawabTanggal(ctx.tanggal); ctx.tunggu("tanggal"); return { h: "<p>Ketik tanggal yang kamu inginkan, ya. Contoh: <b>25 Desember</b>, <b>12/01/2027</b>, atau <b>besok</b>. Nanti aku cek apakah masih kosong.</p>", c: [{ t: "Besok" }, { t: "Cara booking" }] }; } },
    { id: "bayar", kw: ["bayar", "pembayaran", "qris", "transfer", "virtual account", "gopay", "ovo", "dana", "shopeepay", "ewallet", "e wallet", "metode", "bank", "bca", "bni", "bri", "mandiri", "lunas"],
      jawab: () => {
        const menitQ = (METODE.qris || {}).menit || 15, jamVA = (METODE.va_bca || {}).jam || 24;
        return {
          h: "<p>" + faq("pembayaran") + "</p><p class='kecil'>Batas bayar: " + BATAS_BAYAR_JAM + " jam setelah pesanan dikonfirmasi. Kode QRIS dan e-wallet berlaku " + menitQ + " menit, Virtual Account " + jamVA + " jam.</p>",
          c: [{ t: "Invoice" }, { t: "DP / cicilan", q: "bisa dp" }, { t: "Hubungi admin" }],
        };
      } },
    { id: "dp", kw: ["dp", "cicil", "cicilan", "termin", "uang muka", "bayar nanti", "pelunasan", "bayar di tempat", "cash", "tunai"],
      jawab: () => ({ h: "<p>Di website, pembayaran dilakukan untuk total tagihan pesanan setelah dikonfirmasi admin. Untuk skema DP, cicilan, atau bayar tunai, silakan tanyakan langsung ke admin.</p>" + tombolWA("Halo GraferStyle, saya ingin menanyakan skema pembayaran (DP/cicilan/tunai)."), c: [{ t: "Metode bayar", q: "pembayaran" }, { t: "Cara booking" }] }) },
    { id: "invoice", kw: ["invoice", "kwitansi", "bukti bayar", "struk", "bukti pembayaran", "nota"],
      jawab: () => ({ h: "<p>Invoice bisa dicetak setelah pembayaran lunas lewat halaman " + tautan("#pesanan", "Pesanan Saya") + ". Pastikan kamu sudah masuk ke akunmu.</p>", c: [{ t: "Pembayaran" }, { t: "Hubungi admin" }] }) },
    { id: "durasi", kw: ["durasi", "berapa durasi", "durasi sesi", "berapa jam", "lama sesi", "lama foto", "lama pemotretan", "jam berapa lama", "berapa lama sesi", "berapa lama foto"],
      jawab: () => ({ h: "<p>" + faq("durasi") + "</p>", c: [{ t: "Berapa foto diedit?", q: "berapa foto diedit" }, { t: "Harga paket", q: "harga semua paket" }] }) },
    { id: "fotoedit", kw: ["berapa foto", "jumlah foto", "foto edit", "foto diedit", "diedit", "unlimited", "pilih foto", "file mentah", "raw"],
      jawab: () => ({ h: "<p>" + faq("berapa foto") + "</p>", c: [{ t: "Hasil dikirim lewat apa?", q: "hasil dikirim lewat apa" }, { t: "Revisi" }] }) },
    { id: "revisi", kw: ["revisi", "edit ulang", "perbaikan", "tidak puas", "kurang bagus", "ganti edit"],
      jawab: () => ({ h: "<p>" + faq("revisi") + "</p>", c: [{ t: "Berapa lama hasil jadi?", q: "berapa lama hasil selesai" }, { t: "Hubungi admin" }] }) },
    { id: "pengiriman", kw: ["dikirim", "kirim hasil", "google drive", "gdrive", "drive", "link hasil", "terima hasil", "download hasil", "soft file", "softfile", "cetak"],
      jawab: () => ({ h: "<p>" + faq("dikirim") + "</p>", c: [{ t: "Berapa lama hasil jadi?", q: "berapa lama hasil selesai" }, { t: "Revisi" }] }) },
    { id: "lamaselesai", kw: ["berapa lama", "kapan jadi", "kapan hasil", "kapan selesai", "estimasi", "berapa hari", "lama editing", "hasil selesai", "waktu pengerjaan", "pengerjaan"],
      jawab: () => ({ h: "<p>" + faq("berapa lama") + "</p>", c: [{ t: "Hasil dikirim lewat apa?", q: "hasil dikirim lewat apa" }, { t: "Revisi" }] }) },
    { id: "konsep", kw: ["konsep", "properti", "tema", "outfit", "baju", "bawa apa", "persiapan", "kostum", "make up", "makeup"],
      jawab: () => ({ h: "<p>Konsep dan properti kamu isi saat booking, contohnya: <b>Cinematic</b> untuk konsep dan <b>toga, bunga</b> untuk properti. Untuk saran lebih detail soal outfit dan lokasi, admin siap membantu.</p>" + tombolWA("Halo GraferStyle, saya ingin berdiskusi soal konsep dan properti sesi foto."), c: [{ t: "Cara booking" }, { t: "Portofolio" }] }) },
    { id: "lokasi", kw: ["area", "lokasi", "kuningan", "luar kota", "cirebon", "jauh", "outstation", "alamat", "studio", "daerah", "wilayah", "majalengka", "datang ke"],
      jawab: () => ({ h: "<p>Area layanan kami: <b>" + aman(KONTAK.area) + "</b> (" + aman(KONTAK.alamat) + "). Lokasi sesi kamu tentukan sendiri saat booking. Untuk lokasi di luar area, konfirmasi dulu ke admin ya.</p>" + tombolWA("Halo GraferStyle, saya ingin menanyakan layanan di lokasi di luar area."), c: [{ t: "Jam operasional" }, { t: "Cara booking" }] }) },
    { id: "jam", kw: ["jam buka", "jam operasional", "buka jam", "operasional", "tutup jam", "jam kerja", "hari libur", "buka hari"],
      jawab: () => ({ h: "<p>Jam operasional: <b>" + aman(KONTAK.jam) + "</b>.</p>", c: [{ t: "Hubungi admin" }, { t: "Cek tanggal" }] }) },
    { id: "kontak", kw: ["kontak", "admin", "wa", "whatsapp", "hubungi", "telepon", "telp", "nomor", "cs", "customer service", "email", "instagram", "ig", "tiktok", "sosmed", "bicara dengan"],
      jawab: () => ({
        h: "<p>Kamu bisa menghubungi kami lewat:</p><ul><li>WhatsApp: <a href='" + KONTAK.waUrl + "' target='_blank' rel='noreferrer'>" + aman(KONTAK.whatsapp) + "</a></li><li>Instagram: <a href='" + KONTAK.instagramUrl + "' target='_blank' rel='noreferrer'>" + aman(KONTAK.instagram) + "</a></li>" + (KONTAK.tiktok ? "<li>TikTok: <a href='" + KONTAK.tiktokUrl + "' target='_blank' rel='noreferrer'>" + aman(KONTAK.tiktok) + "</a></li>" : "") + "<li>Email: " + aman(KONTAK.email) + "</li></ul><p class='kecil'>Jam operasional: " + aman(KONTAK.jam) + "</p>",
        c: [{ t: "Jam operasional" }, { t: "Cara booking" }],
      }) },
    { id: "portofolio", kw: ["portofolio", "portfolio", "contoh hasil", "hasil karya", "karya", "galeri", "gallery", "contoh foto", "lihat hasil", "sample"],
      jawab: () => ({ h: "<p>Lihat hasil karya kami di halaman " + tautan("#portofolio", "Portofolio") + ", atau kunjungi Instagram <a href='" + KONTAK.instagramUrl + "' target='_blank' rel='noreferrer'>" + aman(KONTAK.instagram) + "</a>.</p>", c: [{ t: "Harga paket", q: "harga semua paket" }, { t: "Cara booking" }] }) },
    { id: "akun", kw: ["login", "masuk", "daftar akun", "registrasi", "register", "buat akun", "sign up", "signup", "lupa password", "lupa sandi", "akun", "password", "kata sandi", "cara daftar"],
      jawab: () => ({ h: "<p>Belum punya akun? " + tautan("#daftar", "Daftar di sini") + ". Sudah punya? " + tautan("#login", "Masuk di sini") + ". Akun dibutuhkan untuk booking, membayar, dan melihat pesanan.</p><p class='kecil'>Lupa password? Hubungi admin agar dibantu.</p>", c: [{ t: "Cara booking" }, { t: "Hubungi admin" }] }) },
    { id: "status", kw: ["status pesanan", "pesanan saya", "cek pesanan", "sudah dikonfirmasi", "konfirmasi", "pesanan saya mana", "lacak"],
      jawab: () => ({ h: "<p>Status pesananmu bisa dipantau di halaman " + tautan("#pesanan", "Pesanan Saya") + " (perlu masuk akun). Setelah kamu booking, admin akan mengonfirmasi pesananmu, dan kamu akan menerima notifikasi di website.</p>", c: [{ t: "Pembayaran" }, { t: "Hubungi admin" }] }) },
    { id: "batal", kw: ["batal", "cancel", "refund", "uang kembali", "reschedule", "ubah jadwal", "ganti tanggal", "ganti jadwal", "mundur", "tunda", "pindah tanggal"],
      jawab: () => ({ h: "<p>Untuk pembatalan atau perubahan jadwal, mohon hubungi admin agar dibantu langsung sesuai kondisi pesananmu.</p>" + tombolWA("Halo GraferStyle, saya ingin menanyakan pembatalan / perubahan jadwal pesanan saya."), c: [{ t: "Cek tanggal" }, { t: "Status pesanan" }] }) },
    { id: "promo", kw: ["diskon", "promo", "potongan", "nego", "tawar", "voucher", "bonus", "gratis", "murahin", "kurangin harga", "harga teman", "paket hemat"],
      jawab: () => ({ h: "<p>Untuk promo, diskon, atau penawaran khusus, silakan tanyakan langsung ke admin ya.</p>" + tombolWA("Halo GraferStyle, apakah ada promo atau penawaran khusus saat ini?"), c: [{ t: "Harga paket", q: "harga semua paket" }, { t: "Cara booking" }] }) },
  ];

  function skor(q, kw) {
    let s = 0;
    for (const k of kw) {
      const w = bersih(k);
      const t = w.trim();
      const cocok = t.length <= 4 ? q.includes(w) : q.includes(t);
      if (cocok) s += t.split(" ").length * 2;
    }
    return s;
  }

  const status = { tunggu: null, gagal: 0 };

  function proses(teks) {
    const q = bersih(teks);
    const ctx = {
      kategori: deteksiKategori(q),
      tipe: deteksiTipe(q),
      tanggal: uraiTanggal(teks),
      tunggu: (v) => { status.tunggu = v; },
    };

    if (status.tunggu === "tanggal") {
      status.tunggu = null;
      if (ctx.tanggal) { status.gagal = 0; return jawabTanggal(ctx.tanggal); }
    }

    let terbaik = null, nilai = 0;
    const kata = q.trim().split(" ").length;
    for (const it of INTENT) {
      let s = skor(q, it.kw);
      if (it.pendek && kata > 4) s = Math.max(0, s - 3);
      if (it.id === "tanggal" && ctx.tanggal) s += 5;
      if (s > nilai) { nilai = s; terbaik = it; }
    }

    if (!terbaik || nilai === 0) {
      if (ctx.tanggal) { status.gagal = 0; return jawabTanggal(ctx.tanggal); }
      if (ctx.kategori) { status.gagal = 0; return jawabKategori(ctx.kategori); }
      if (ctx.tipe) { status.gagal = 0; return jawabTipe(ctx.tipe); }
    }
    if (terbaik && nilai > 0) { status.gagal = 0; return terbaik.jawab(ctx); }

    status.gagal++;
    const lanjut = status.gagal >= 2 ? "Sepertinya pertanyaanmu perlu dijawab admin langsung." : "Maaf, aku belum paham maksudnya.";
    return {
      h: "<p>" + lanjut + " Coba pilih topik di bawah, atau tanyakan langsung ke admin.</p>" + tombolWA("Halo GraferStyle, saya mau tanya: " + teks.slice(0, 180), "Tanya Admin via WhatsApp"),
      c: CHIP_UTAMA,
    };
  }

  const PERTANYAAN = [
    { id: "harga", label: "Harga", item: [
      { t: "Semua harga paket", q: "harga semua paket" },
      { t: "Graduation", q: "harga graduation" },
      { t: "Prewedding", q: "harga prewedding" },
      { t: "Couple Date", q: "harga couple date" },
      { t: "Foto Produk", q: "harga foto produk" },
      { t: "Foto Only", q: "harga foto only" },
      { t: "Video Only", q: "harga video only" },
      { t: "Foto & Video", q: "harga foto dan video" },
      { t: "Ada promo?", q: "ada promo atau diskon" },
    ] },
    { id: "booking", label: "Booking", item: [
      { t: "Cara booking", q: "cara booking" },
      { t: "Cek tanggal", q: "cek tanggal" },
      { t: "Cara buat akun", q: "cara daftar akun" },
      { t: "Cek status pesanan", q: "cek status pesanan" },
      { t: "Konsep & properti", q: "konsep dan properti" },
      { t: "Ubah / batalkan jadwal", q: "batalkan atau ubah jadwal" },
    ] },
    { id: "bayar", label: "Pembayaran", item: [
      { t: "Metode pembayaran", q: "metode pembayaran" },
      { t: "Batas waktu bayar", q: "batas waktu bayar" },
      { t: "Bisa DP / cicilan?", q: "bisa dp atau cicilan" },
      { t: "Cara dapat invoice", q: "cara dapat invoice" },
    ] },
    { id: "hasil", label: "Hasil", item: [
      { t: "Durasi sesi", q: "berapa durasi sesi" },
      { t: "Berapa foto diedit?", q: "berapa foto diedit" },
      { t: "Bisa revisi?", q: "bisa revisi" },
      { t: "Berapa lama hasil jadi?", q: "berapa lama hasil selesai" },
      { t: "Hasil dikirim lewat apa?", q: "hasil dikirim lewat apa" },
      { t: "Lihat portofolio", q: "lihat portofolio" },
    ] },
    { id: "info", label: "Info & Kontak", item: [
      { t: "Area layanan", q: "area lokasi layanan" },
      { t: "Jam operasional", q: "jam operasional" },
      { t: "Hubungi admin", q: "hubungi admin" },
      { t: "Instagram & TikTok", q: "instagram tiktok" },
    ] },
  ];
  const JUMLAH_PERTANYAAN = PERTANYAAN.reduce((a, g) => a + g.item.length, 0);

  let akar, log, tabsEl, qsEl, bandeja, input, fab, panel, teaser;
  let riwayat = [], terbuka = false, sibuk = false, antri = [], ketikAktif = null, timerTutup = 0;
  let tabAktif = PERTANYAAN[0].id, bandejaTutup = false, sudahSapa = false;
  const ditanya = new Set();

  function bangun() {
    akar = document.createElement("div");
    akar.id = "gs-chat";
    akar.className = "gs-chat" + (CHATBOT.logoPenuh ? " logo-penuh" : "");
    akar.innerHTML =
      '<div class="gs-chat-teaser" role="button" tabindex="-1">' + aman(CHATBOT.sapaanTeaser) + "</div>" +
      '<section class="gs-chat-panel" role="dialog" aria-label="Chat ' + aman(CHATBOT.nama) + '" inert>' +
        '<header class="gs-chat-head"><div class="gs-chat-avatar"><img alt="" data-logo></div>' +
          '<div><div class="gs-chat-judul">' + aman(CHATBOT.nama) + '</div><div class="gs-chat-status">' + aman(CHATBOT.status) + "</div></div>" +
          '<div class="gs-chat-aksi"><button type="button" class="gs-chat-ikon" data-aksi="ulang" aria-label="Mulai percakapan baru" title="Mulai ulang">' + IKON.ulang + "</button>" +
          '<button type="button" class="gs-chat-ikon" data-aksi="tutup" aria-label="Tutup chat" title="Tutup">' + IKON.tutup + "</button></div></header>" +
        '<div class="gs-chat-log" role="log" aria-live="polite"></div>' +
        '<div class="gs-chat-bandeja">' +
          '<button type="button" class="gs-chat-bandeja-toggle" aria-expanded="true"><span>Pilih pertanyaan</span><span class="jumlah">' + JUMLAH_PERTANYAAN + " tersedia</span>" + IKON.panah + "</button>" +
          '<div class="gs-chat-bandeja-isi"><div><div class="gs-chat-tabs" role="tablist"></div><div class="gs-chat-qs"></div></div></div>' +
        "</div>" +
        '<form class="gs-chat-form" autocomplete="off"><input class="gs-chat-input" type="text" maxlength="200" placeholder="Atau ketik pertanyaanmu..." aria-label="Tulis pesan"><button class="gs-chat-kirim" type="submit" aria-label="Kirim">' + IKON.kirim + "</button></form>" +
        '<div class="gs-chat-foot">Bot otomatis &middot; butuh manusia? <a href="' + KONTAK.waUrl + '" target="_blank" rel="noreferrer">Chat admin</a></div>' +
      "</section>" +
      '<button type="button" class="gs-chat-fab" aria-label="Buka chat ' + aman(CHATBOT.nama) + '" aria-expanded="false">' +
        '<span class="fab-lapis fab-logo"><img alt="" data-logo></span><span class="fab-lapis fab-x" aria-hidden="true">' + IKON.silang + "</span></button>";
    document.body.appendChild(akar);

    log = $(".gs-chat-log", akar); tabsEl = $(".gs-chat-tabs", akar); qsEl = $(".gs-chat-qs", akar); bandeja = $(".gs-chat-bandeja", akar);
    input = $(".gs-chat-input", akar); fab = $(".gs-chat-fab", akar); panel = $(".gs-chat-panel", akar); teaser = $(".gs-chat-teaser", akar);

    akar.querySelectorAll("img[data-logo]").forEach((img) => {
      img.src = CHATBOT.logo;
      img.addEventListener("error", () => { if (img.getAttribute("src") !== CHATBOT.logoCadangan) img.src = CHATBOT.logoCadangan; });
    });

    fab.addEventListener("click", () => { riak(); atur(!terbuka); });
    teaser.addEventListener("click", () => { riak(); atur(true); });
    akar.addEventListener("click", (e) => {
      const a = e.target.closest("[data-aksi]");
      if (a && a.dataset.aksi === "tutup") atur(false);
      if (a && a.dataset.aksi === "ulang") ulang();
      const c = e.target.closest(".gs-chat-chip, .gs-chat-q");
      if (c) kirim(c.dataset.q || c.textContent);
      const t = e.target.closest(".gs-chat-tab");
      if (t) { tabAktif = t.dataset.tab; renderBandeja(); simpanRiwayat(); }
      if (e.target.closest(".gs-chat-bandeja-toggle")) { bandejaTutup = !bandejaTutup; aturBandeja(); simpanRiwayat(); }
      const n = e.target.closest("a[data-nav]");
      if (n && window.innerWidth < 576) atur(false);
    });
    $(".gs-chat-form", akar).addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (v) { input.value = ""; kirim(v); } });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && terbuka) { atur(false); fab.focus(); } });
    window.addEventListener("hashchange", aturTampil);
    renderBandeja(); aturBandeja();
  }

  function renderBandeja() {
    tabsEl.innerHTML = PERTANYAAN.map((g) => '<button type="button" class="gs-chat-tab' + (g.id === tabAktif ? " aktif" : "") + '" role="tab" aria-selected="' + (g.id === tabAktif) + '" data-tab="' + g.id + '">' + aman(g.label) + "</button>").join("");
    const g = PERTANYAAN.find((x) => x.id === tabAktif) || PERTANYAAN[0];
    qsEl.innerHTML = g.item.map((it, i) => '<button type="button" class="gs-chat-q' + (ditanya.has(it.q) ? " sudah" : "") + '" style="--i:' + i + '" data-q="' + aman(it.q) + '">' + aman(it.t) + "</button>").join("");
  }
  function aturBandeja() {
    bandeja.classList.toggle("tutup", bandejaTutup);
    $(".gs-chat-bandeja-toggle", akar).setAttribute("aria-expanded", String(!bandejaTutup));
  }

  function aturTampil() {
    const rute = location.hash.replace(/^#\/?/, "").split("/")[0] || "beranda";
    const sembunyi = CHATBOT.sembunyiDi.includes(rute);
    if (sembunyi && terbuka) { atur(false); akar.classList.remove("menutup"); }
    akar.hidden = sembunyi;
  }

  function atur(buka) {
    if (buka === terbuka) return;
    terbuka = buka;
    clearTimeout(timerTutup);
    fab.setAttribute("aria-expanded", String(buka));
    fab.setAttribute("aria-label", (buka ? "Tutup chat " : "Buka chat ") + CHATBOT.nama);
    if (buka) {
      akar.classList.remove("menutup"); akar.classList.add("buka");
      panel.removeAttribute("inert"); teaser.classList.remove("tampil");
      simpan(CHATBOT.kunciSesi + "-teaser", "1");
      if (!sudahSapa) setTimeout(sapaAwal, kurangiGerakBot ? 0 : 520);
      setTimeout(() => { input.focus({ preventScroll: true }); gulung(); }, kurangiGerakBot ? 0 : 600);
    } else {
      akar.classList.remove("buka"); akar.classList.add("menutup");
      panel.setAttribute("inert", "");
      timerTutup = setTimeout(() => akar.classList.remove("menutup"), 340);
    }
    simpanRiwayat();
  }

  function riak() {
    if (kurangiGerakBot) return;
    const r = document.createElement("span"); r.className = "gs-chat-riak";
    akar.appendChild(r); setTimeout(() => r.remove(), 750);
  }

  const gulung = () => { log.scrollTop = log.scrollHeight; };

  function tambahUser(teks, tenang) {
    const d = document.createElement("div");
    d.className = "gs-chat-msg user" + (tenang ? " tenang" : "");
    d.textContent = teks; log.appendChild(d); gulung();
    if (!tenang) { riwayat.push({ r: "user", h: teks }); simpanRiwayat(); }
  }

  function redupkan() {
    const semua = log.querySelectorAll(".gs-chat-lanjut");
    semua.forEach((el, i) => el.classList.toggle("lama", i < semua.length - 1));
  }

  function pasangChip(d, daftar) {
    if (!daftar || !daftar.length) return;
    const w = document.createElement("div"); w.className = "gs-chat-lanjut";
    daftar.forEach((c, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "gs-chat-chip"; b.textContent = c.t; b.dataset.q = c.q || c.t; b.style.setProperty("--i", i);
      w.appendChild(b);
    });
    d.appendChild(w); redupkan(); gulung();
  }

  function tambahBot(h, chipsArr, opsi) {
    opsi = opsi || {};
    const d = document.createElement("div");
    d.className = "gs-chat-msg bot" + (opsi.tenang ? " tenang" : "");
    d.innerHTML = h; log.appendChild(d); gulung();
    if (!opsi.tenang) { riwayat.push({ r: "bot", h: h, c: chipsArr || [] }); simpanRiwayat(); }
    const beres = () => { pasangChip(d, chipsArr); if (opsi.setelah) opsi.setelah(); };
    if (opsi.animasi && !kurangiGerakBot) ketikBertahap(d, beres); else beres();
  }

  function ketikBertahap(el, selesai) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), semua = [], bagian = [];
    let n; while ((n = w.nextNode())) semua.push(n);
    semua.forEach((tn) => {
      const full = tn.nodeValue; if (!full.trim()) return;
      const hid = document.createElement("span"); hid.className = "gs-chat-sembunyi"; hid.textContent = full;
      const vis = document.createTextNode("");
      tn.parentNode.replaceChild(vis, tn); vis.parentNode.insertBefore(hid, vis.nextSibling);
      bagian.push({ vis, hid, full });
    });
    const total = bagian.reduce((a, b) => a + b.full.length, 0);
    if (!total) { selesai(); return; }
    const durasi = Math.min(1500, Math.max(550, total * 16));
    let mulai = null, raf = 0, beresFlag = false;
    const tulis = (k) => { let sisa = k; bagian.forEach((b) => { const t = Math.max(0, Math.min(b.full.length, sisa)); sisa -= b.full.length; b.vis.nodeValue = b.full.slice(0, t); b.hid.firstChild.nodeValue = b.full.slice(t); }); };
    const beres = () => {
      if (beresFlag) return; beresFlag = true; cancelAnimationFrame(raf);
      bagian.forEach((b) => { b.vis.nodeValue = b.full; b.hid.remove(); });
      el.removeEventListener("click", beres); ketikAktif = null; selesai(); gulung();
    };
    el.addEventListener("click", beres);
    ketikAktif = beres;
    const langkah = (t) => { if (mulai === null) mulai = t; const p = Math.min(1, (t - mulai) / durasi); tulis(Math.round(total * p)); if (p < 1) raf = requestAnimationFrame(langkah); else beres(); };
    tulis(0); raf = requestAnimationFrame(langkah);
  }

  function indikator() {
    const k = document.createElement("div");
    k.className = "gs-chat-ketik"; k.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(k); gulung(); return k;
  }

  function balas(daftar, selesai) {
    let i = 0;
    const lanjut = () => {
      if (i >= daftar.length) { if (selesai) selesai(); return; }
      const item = daftar[i++];
      const ind = kurangiGerakBot ? null : indikator();
      const jeda = kurangiGerakBot ? 0 : 380 + Math.min(item.h.length * 0.6, 420);
      setTimeout(() => {
        if (ind) ind.remove();
        tambahBot(item.h, item.c, { animasi: true, setelah: () => setTimeout(lanjut, kurangiGerakBot ? 0 : 160) });
      }, jeda);
    };
    lanjut();
  }

  function kirim(teks) {
    teks = String(teks).slice(0, 200);
    if (sibuk) { antri.push(teks); return; }
    if (ketikAktif) ketikAktif();
    ditanya.add(teks); renderBandeja();
    tambahUser(teks);
    sibuk = true;
    let hasil;
    try { hasil = proses(teks); }
    catch (err) { hasil = { h: "<p>Maaf, ada kendala teknis di sisiku. Silakan hubungi admin ya.</p>" + tombolWA("Halo GraferStyle, saya butuh bantuan."), c: CHIP_UTAMA }; }
    balas([hasil], () => { sibuk = false; if (antri.length) kirim(antri.shift()); });
  }

  function sapaAwal() {
    if (sudahSapa) return;
    sudahSapa = true; sibuk = true;
    balas([
      { h: "<p>Halo, aku <b>" + aman(CHATBOT.nama) + "</b>, asisten GraferStyle.</p>", c: [] },
      { h: "<p>Aku bisa bantu info <b>paket &amp; harga</b>, <b>cara booking</b>, <b>cek tanggal</b>, dan <b>pembayaran</b>.</p><p>Pilih salah satu pertanyaan di bawah, atau ketik sendiri ya.</p>", c: [] },
    ], () => { sibuk = false; if (antri.length) kirim(antri.shift()); });
  }

  function ulang() {
    if (ketikAktif) ketikAktif();
    riwayat = []; antri = []; log.innerHTML = ""; ditanya.clear(); renderBandeja();
    status.tunggu = null; status.gagal = 0; sudahSapa = false; sibuk = false;
    hapus(CHATBOT.kunciSesi); sapaAwal(); input.focus({ preventScroll: true });
  }

  function simpanRiwayat() {
    simpan(CHATBOT.kunciSesi, JSON.stringify({ log: riwayat.slice(-40), buka: terbuka, ditanya: Array.from(ditanya), tab: tabAktif, bandejaTutup: bandejaTutup }));
  }

  function pulihkan() {
    let data = null;
    try { data = JSON.parse(baca(CHATBOT.kunciSesi) || "null"); } catch (e) { data = null; }
    if (!data || !Array.isArray(data.log) || !data.log.length) return false;
    if (Array.isArray(data.ditanya)) data.ditanya.forEach((q) => ditanya.add(String(q)));
    if (PERTANYAAN.some((g) => g.id === data.tab)) tabAktif = data.tab;
    bandejaTutup = !!data.bandejaTutup; aturBandeja(); renderBandeja();
    data.log.forEach((m) => {
      if (!m) return;
      riwayat.push(m.r === "bot" ? { r: "bot", h: String(m.h), c: Array.isArray(m.c) ? m.c : [] } : { r: "user", h: String(m.h) });
      if (m.r === "user") tambahUser(String(m.h), true);
      else if (m.r === "bot") tambahBot(String(m.h), Array.isArray(m.c) ? m.c : [], { tenang: true });
    });
    sudahSapa = true;
    if (data.buka) atur(true);
    return true;
  }

  function mulai() {
    bangun();
    aturTampil();
    pulihkan();
    if (!kurangiGerakBot) setInterval(() => {
      if (terbuka || akar.hidden || document.hidden) return;
      fab.classList.remove("goyang"); void fab.offsetWidth; fab.classList.add("goyang");
      setTimeout(() => fab.classList.remove("goyang"), 1000);
    }, 14000);
    if (!baca(CHATBOT.kunciSesi + "-teaser") && !terbuka) {
      setTimeout(() => { if (!terbuka && !akar.hidden) { teaser.classList.add("tampil"); setTimeout(() => teaser.classList.remove("tampil"), 8000); } }, 3500);
    }
  }

  mulai();
})();
