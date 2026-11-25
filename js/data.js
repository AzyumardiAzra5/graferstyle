const PESAN_WA =
  "Halo GraferStyle, saya tertarik dengan layanan foto dan video Anda. Mohon informasi mengenai paket dan jadwal yang tersedia. Terima kasih.";
const KONTAK = {
  instagram: "@graferstyle",
  instagramUrl: "https://www.instagram.com/graferstyle/",
  whatsapp: "+62 895-4100-81418",
  waUrl: "https://wa.me/62895410081418?text=" + encodeURIComponent(PESAN_WA),
  email: "graferstyle@gmail.com",
  jam: "Setiap hari, 08.00 - 20.00 WIB",
  area: "Kuningan dan sekitarnya",
  alamat: "Kuningan, Jawa Barat",
  tiktok: "@keconstylee",
  tiktokUrl: "https://www.tiktok.com/@keconstylee",
  tentang:
    "GraferStyle adalah layanan fotografi dan videografi untuk sesi Graduation, Prewedding, Couple Date, dan Foto Produk. Setiap sesi dilengkapi pemilihan foto, editing, dan pengiriman hasil melalui Google Drive.",
};

const foto = (harga) => ({
  id: "foto",
  nama: "Foto Only",
  harga,
  fasilitas: [
    "Unlimited shoot",
    "20 foto edit",
    "Durasi 1 jam",
    "Semua file via Google Drive",
  ],
});
const video = () => ({
  id: "video",
  nama: "Video Only",
  harga: 400000,
  fasilitas: ["1 video Full HD", "Maksimal 2x revisi", "Durasi 1 jam"],
});
const combo = () => ({
  id: "fotovideo",
  nama: "Foto & Video",
  harga: 800000,
  fasilitas: [
    "Unlimited shoot foto",
    "20 foto edit",
    "1 video Full HD",
    "Video maksimal 2x revisi",
    "Durasi 3 jam",
    "Semua file via Google Drive",
  ],
});
const LAYANAN = {
  wisuda: {
    nama: "Graduation",
    tagline: "Wisuda",
    gambar: "img/poster/graduation.jpg",
    deskripsi:
      "Abadikan momen wisuda dengan foto dan video yang rapi dan penuh cerita.",
    paket: [foto(500000), video(), combo()],
  },
  prewedding: {
    nama: "Prewedding",
    tagline: "Couple Session",
    gambar: "img/poster/prewedding.jpg",
    deskripsi:
      "Sesi foto dan video pasangan sebelum hari pernikahan dengan konsep pilihanmu.",
    paket: [foto(600000), video(), combo()],
  },
  couple: {
    nama: "Couple Date",
    tagline: "Date Session",
    gambar: "img/poster/couple.jpg",
    deskripsi:
      "Sesi berdua yang santai untuk mengabadikan kebersamaan kamu dan pasangan.",
    paket: [foto(600000), video(), combo()],
  },
  produk: {
    nama: "Foto Produk",
    tagline: "Product Session",
    gambar: "img/poster/produk.jpg",
    deskripsi:
      "Foto produk yang rapi dan menarik untuk katalog, media sosial, dan promosi usahamu.",
    paket: [foto(300000), video(), combo()],
  },
};

const FAQ = [
  [
    "Bagaimana cara booking?",
    "Masuk atau daftar akun, lalu isi form booking: paket, tanggal, lokasi, konsep, dan properti. Admin akan mengonfirmasi pesananmu.",
  ],
  [
    "Layanan apa saja yang tersedia?",
    "Saat ini Graduation, Prewedding, Couple Date, dan Foto Produk, dengan pilihan Foto Only, Video Only, atau Foto & Video.",
  ],
  [
    "Bagaimana cara pembayaran?",
    "Pembayaran dilakukan langsung di website setelah pesanan dikonfirmasi admin, lewat QRIS, Virtual Account (BCA, BNI, BRI, Mandiri), atau e-wallet (GoPay, OVO, DANA, ShopeePay). Status pembayaran terverifikasi otomatis, dan invoice bisa dicetak setelah lunas.",
  ],
  [
    "Berapa lama hasil foto selesai?",
    "Editing sekitar 1 hari, dan hasil dikirim paling lambat 3 hari setelah sesi.",
  ],
  [
    "Berapa durasi sesinya?",
    "Foto Only dan Video Only 1 jam, paket Foto & Video 3 jam.",
  ],
  [
    "Berapa foto yang diedit?",
    "Kamu memilih sendiri 20 foto untuk diedit setelah sesi.",
  ],
  ["Apakah bisa revisi?", "Bisa, maksimal 2 kali setelah hasil diterima."],
  [
    "Hasil dikirim lewat apa?",
    "Lewat Google Drive. Tautannya muncul di halaman Pesanan Saya.",
  ],
];

const tglRel = (n) => {
  const h = new Date(), d = new Date(h.getFullYear(), h.getMonth(), h.getDate() + n);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const AKUN_AWAL = [
  {
    email: "azramirfah@gmail.com",
    password: "pelanggan123",
    role: "pelanggan",
    nama: "Azyumardi Azra Mirfah",
    bergabung: tglRel(-60),
    wa: "081234567890",
    kota: "Kuningan",
  },
  {
    email: "raihanfadlurrahman@gmail.com",
    password: "pelanggan123",
    role: "pelanggan",
    nama: "Raihan Fadlurrahman",
    panggilan: "Raihan",
    gender: "Laki-laki",
    bergabung: tglRel(-110),
    wa: "081234567812",
    kota: "Kuningan",
    provinsi: "Jawa Barat",
  },
  {
    email: "syifanurfadilah22@gmail.com",
    password: "pelanggan123",
    role: "pelanggan",
    nama: "Syifa Nurfadilah",
    panggilan: "Syifa",
    gender: "Perempuan",
    instagram: "@syifanurfadilah",
    bergabung: tglRel(-90),
    wa: "081234567835",
    kota: "Cirebon",
    provinsi: "Jawa Barat",
  },
  {
    email: "yogaardiansyah07@gmail.com",
    password: "pelanggan123",
    role: "pelanggan",
    nama: "Yoga Ardiansyah",
    bergabung: tglRel(-80),
    wa: "081234567849",
    kota: "Kuningan",
  },
  {
    email: "ratnakomalasari@gmail.com",
    password: "pelanggan123",
    role: "pelanggan",
    nama: "Ratna Komalasari",
    panggilan: "Ratna",
    gender: "Perempuan",
    bergabung: tglRel(-75),
    wa: "081234567863",
    kota: "Majalengka",
    provinsi: "Jawa Barat",
  },
  {
    email: "graferstyle@gmail.com",
    password: "admin123",
    role: "admin",
    nama: "Muhammad Hasan",
    bergabung: "2026-10-01",
  },
];
const PESANAN_AWAL = [
  {
    id: "GS-001",
    email: "azramirfah@gmail.com",
    pelanggan: "Azyumardi Azra Mirfah",
    kategori: "wisuda",
    paket: "foto",
    tanggal: tglRel(21),
    lokasi: "Kampus",
    konsep: "Cinematic",
    properti: "Toga, bunga",
    status: "Menunggu Konfirmasi",
    bukti: false,
    link: "",
  },
  {
    id: "GS-002",
    email: "azramirfah@gmail.com",
    pelanggan: "Azyumardi Azra Mirfah",
    kategori: "prewedding",
    paket: "fotovideo",
    tanggal: tglRel(14),
    lokasi: "Studio",
    konsep: "Clean look",
    properti: "-",
    status: "Dikonfirmasi",
    bukti: false,
    link: "",
  },
  {
    id: "GS-003",
    email: "azramirfah@gmail.com",
    pelanggan: "Azyumardi Azra Mirfah",
    kategori: "couple",
    paket: "video",
    tanggal: tglRel(-12),
    lokasi: "Taman kota",
    konsep: "Santai",
    properti: "-",
    status: "Hasil Dikirim",
    bukti: true,
    link: "https://drive.google.com/",
  },
  {
    id: "GS-004",
    email: "raihanfadlurrahman@gmail.com",
    pelanggan: "Raihan Fadlurrahman",
    kategori: "wisuda",
    paket: "fotovideo",
    tanggal: tglRel(-95),
    lokasi: "Kampus",
    konsep: "Elegan",
    properti: "Toga, selendang",
    status: "Selesai",
    bukti: true,
    link: "https://drive.google.com/",
  },
  {
    id: "GS-005",
    email: "syifanurfadilah22@gmail.com",
    pelanggan: "Syifa Nurfadilah",
    kategori: "prewedding",
    paket: "foto",
    tanggal: tglRel(-70),
    lokasi: "Taman kota",
    konsep: "Natural",
    properti: "Bunga",
    status: "Selesai",
    bukti: true,
    link: "https://drive.google.com/",
  },
  {
    id: "GS-006",
    email: "yogaardiansyah07@gmail.com",
    pelanggan: "Yoga Ardiansyah",
    kategori: "produk",
    paket: "video",
    tanggal: tglRel(-45),
    lokasi: "Studio",
    konsep: "Clean look",
    properti: "Kaos",
    status: "Hasil Dikirim",
    bukti: true,
    link: "https://drive.google.com/",
  },
  {
    id: "GS-007",
    email: "ratnakomalasari@gmail.com",
    pelanggan: "Ratna Komalasari",
    kategori: "couple",
    paket: "fotovideo",
    tanggal: tglRel(-60),
    lokasi: "Pantai",
    konsep: "Santai",
    properti: "-",
    status: "Selesai",
    bukti: true,
    link: "https://drive.google.com/",
  },
  {
    id: "GS-008",
    email: "yogaardiansyah07@gmail.com",
    pelanggan: "Yoga Ardiansyah",
    kategori: "produk",
    paket: "foto",
    tanggal: tglRel(9),
    lokasi: "Studio",
    konsep: "Katalog",
    properti: "Kaos, topi",
    status: "Dikonfirmasi",
    bukti: false,
    link: "",
  },
];

const PELANGGAN_TAMBAHAN = [
  ["Dewi Anggraini", "dewi.anggraini@gmail.com", "Kuningan", "081234567901", -150],
  ["Bagas Pratama", "bagaspratama@gmail.com", "Cirebon", "081234567902", -145],
  ["Nadia Putri Rahma", "nadiaputri.r@gmail.com", "Kuningan", "081234567903", -135],
  ["Fajar Nugraha", "fajarnugraha88@gmail.com", "Majalengka", "081234567904", -125],
  ["Intan Permatasari", "intanpermata@gmail.com", "Cirebon", "081234567905", -115],
  ["Rizky Maulana", "rizkymaulana21@gmail.com", "Kuningan", "081234567906", -100],
  ["Salsabila Azzahra", "salsabila.az@gmail.com", "Brebes", "081234567907", -95],
  ["Dimas Aditya", "dimasaditya09@gmail.com", "Kuningan", "081234567908", -60],
  ["Putri Ayu Lestari", "putriayulestari@gmail.com", "Cirebon", "081234567909", -50],
  ["Andika Saputra", "andikasaputra@gmail.com", "Kuningan", "081234567910", -45],
  ["Melati Kusumawardani", "melatikw@gmail.com", "Ciamis", "081234567911", -40],
  ["Farhan Hidayat", "farhanhidayat@gmail.com", "Kuningan", "081234567912", -35],
  ["Nabila Safitri", "nabilasafitri@gmail.com", "Majalengka", "081234567913", -30],
  ["Galih Ramadhan", "galihramadhan@gmail.com", "Kuningan", "081234567914", -25],
];
PELANGGAN_TAMBAHAN.forEach(([nama, email, kota, wa, hari]) => {
  AKUN_AWAL.splice(AKUN_AWAL.length - 1, 0, { email, password: "pelanggan123", role: "pelanggan", nama, bergabung: tglRel(hari), wa, kota });
});
const PESANAN_TAMBAHAN = [
  [0, "wisuda", "fotovideo", -140, "Kampus", "Elegan", "Toga, bunga", "Selesai"],
  [1, "prewedding", "foto", -128, "Taman kota", "Natural", "Bunga", "Selesai"],
  [2, "couple", "foto", -117, "Pantai", "Santai", "-", "Selesai"],
  [3, "produk", "fotovideo", -105, "Studio", "Katalog", "Tas, sepatu", "Selesai"],
  [4, "wisuda", "foto", -88, "Kampus", "Cinematic", "Toga", "Selesai"],
  [5, "prewedding", "fotovideo", -38, "Studio", "Clean look", "-", "Hasil Dikirim"],
  [6, "couple", "video", -26, "Taman kota", "Santai", "-", "Hasil Dikirim"],
  [7, "produk", "foto", -19, "Studio", "Katalog", "Jam tangan", "Hasil Dikirim"],
  [8, "wisuda", "video", -6, "Kampus", "Elegan", "Toga, selendang", "Sesi Selesai"],
  [9, "couple", "fotovideo", -3, "Pantai", "Romantis", "-", "Sesi Selesai"],
  [10, "prewedding", "foto", 4, "Taman kota", "Natural", "Bunga", "Pembayaran Terverifikasi"],
  [11, "wisuda", "fotovideo", 7, "Kampus", "Cinematic", "Toga", "Pembayaran Terverifikasi"],
  [12, "produk", "video", 11, "Studio", "Clean look", "Kosmetik", "Pembayaran Terverifikasi"],
  [13, "couple", "foto", 16, "Taman kota", "Santai", "-", "Dikonfirmasi"],
  [0, "prewedding", "fotovideo", 19, "Studio", "Elegan", "-", "Dikonfirmasi"],
  [1, "produk", "foto", 23, "Studio", "Katalog", "Kaos", "Dikonfirmasi"],
  [2, "wisuda", "foto", 26, "Kampus", "Natural", "Toga, bunga", "Menunggu Konfirmasi"],
  [3, "couple", "video", 29, "Pantai", "Santai", "-", "Menunggu Konfirmasi"],
  [4, "prewedding", "foto", 33, "Taman kota", "Clean look", "-", "Menunggu Konfirmasi"],
  [5, "wisuda", "video", 40, "Kampus", "Cinematic", "Toga", "Menunggu Konfirmasi"],
  [6, "couple", "foto", 12, "Pantai", "Romantis", "-", "Dibatalkan"],
  [7, "produk", "fotovideo", -22, "Studio", "Katalog", "Sepatu", "Dibatalkan"],
];
PESANAN_TAMBAHAN.forEach(([i, kategori, paket, hari, lokasi, konsep, properti, status], n) => {
  const a = PELANGGAN_TAMBAHAN[i];
  const p = { id: "GS-" + String(PESANAN_AWAL.length + 1).padStart(3, "0"), email: a[1], pelanggan: a[0], kategori, paket, tanggal: tglRel(hari), lokasi, konsep, properti, status, link: ["Hasil Dikirim", "Selesai"].includes(status) ? "https://drive.google.com/" : "" };
  if (status === "Dibatalkan") p.alasanBatal = hari < 0 ? "Batas waktu pembayaran habis" : "Dibatalkan oleh pelanggan";
  PESANAN_AWAL.push(p);
});
const STATUS = [
  "Menunggu Konfirmasi",
  "Dikonfirmasi",
  "Pembayaran Terverifikasi",
  "Sesi Selesai",
  "Hasil Dikirim",
  "Selesai",
  "Dibatalkan",
];
const KELAS_STATUS = {
  "Menunggu Konfirmasi": "menunggu",
  Dikonfirmasi: "konfirmasi",
  "Pembayaran Terverifikasi": "bayar",
  "Sesi Selesai": "proses",
  "Hasil Dikirim": "hasil",
  Selesai: "hasil",
  Dibatalkan: "batal",
};
const rupiah = (n) =>
  n.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
