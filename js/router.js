const RUTE = {
  beranda:    { fn: halamanBeranda,    judul: "Beranda",      aktif: "beranda",    jangkar: true },
  tentang:    { fn: halamanTentang,    judul: "Tentang Kami", aktif: "tentang" },
  portofolio: { fn: halamanPortofolio, judul: "Portofolio",   aktif: "portofolio" },
  paket:      { fn: halamanPaket,      judul: "Paket Harga",  aktif: "paket",      jangkar: true },
  kontak:     { fn: halamanKontak,     judul: "Kontak",       aktif: "kontak" },
  login:      { fn: halamanLogin,      judul: "Masuk",        mode: "auth",  kelas: "row g-0 min-vh-100" },
  daftar:     { fn: halamanDaftar,     judul: "Registrasi",   mode: "auth",  kelas: "row g-0 min-vh-100" },
  booking:    { fn: halamanBooking,    judul: "Booking",      role: "pelanggan", kelas: "container-fluid px-3 mx-auto gs-wadah py-5", lebar: "720px" },
  pesanan:    { fn: halamanPesanan,    judul: "Pesanan Saya", role: "pelanggan", kelas: "container-fluid px-3 mx-auto gs-wadah py-5", lebar: "860px" },
  profil:     { fn: halamanProfil,     judul: "Profil",       role: "pelanggan", kelas: "container-fluid px-3 mx-auto gs-wadah py-5", lebar: "900px" },
  bayar:      { fn: halamanBayar,      judul: "Pembayaran",   role: "pelanggan", kelas: "container-fluid px-3 mx-auto gs-wadah py-5", lebar: "1040px" },
  invoice:    { fn: halamanInvoice,    judul: "Invoice",      role: ["pelanggan", "admin"], kelas: "container-fluid px-3 mx-auto gs-wadah py-5", lebar: "820px" },
  admin:      { fn: halamanAdmin,      judul: "Panel Admin",  role: "admin", mode: "admin" },
};
let nextRute = null;

function tampilHalaman() {
  hentikanTimerBayar();
  const bagian = location.hash.replace(/^#\/?/, "").split("/");
  const nama = RUTE[bagian[0]] ? bagian[0] : "beranda";
  const r = RUTE[nama], mode = r.mode || "publik", u = userAktif();

  if (r.role && !u) { nextRute = bagian.join("/"); location.hash = "login"; return; }
  const ditolak = r.role && ![].concat(r.role).includes(u.role);

  document.body.classList.toggle("gs-fit", mode === "auth");
  ambil("site-header").hidden = ambil("site-footer").hidden = mode !== "publik" && !ditolak;
  if (mode === "publik" || ditolak) renderLayout(r.aktif || ""); else { ambil("site-header").innerHTML = ""; ambil("site-footer").innerHTML = ""; }
  document.title = r.judul + " - GraferStyle";

  const slider = ambil("slider"), carousel = slider && bootstrap.Carousel.getInstance(slider);
  if (carousel) carousel.dispose();
  APP.className = ditolak ? "" : (r.kelas || "");
  APP.style.maxWidth = !ditolak && r.lebar ? r.lebar : "";
  APP.classList.remove("gs-ganti"); void APP.offsetWidth; APP.classList.add("gs-ganti");

  if (ditolak) {
    tampilkan(APP, '<div class="container py-5 text-center"><div class="eyebrow">403</div><h1 class="font-display">Akses ditolak</h1><p class="text-secondary">Halaman ini bukan untuk peranmu (' + u.role + ').</p><a class="btn btn-primary" href="' + (u.role === "admin" ? "#admin" : "#beranda") + '">Kembali</a></div>');
  } else {
    r.fn(bagian);
  }

  const tujuan = r.jangkar && bagian[1] ? ambil(bagian[1]) : null;
  if (tujuan) tujuan.scrollIntoView(); else window.scrollTo(0, 0);
  aturScroll();
}

window.addEventListener("hashchange", tampilHalaman);
tampilHalaman();
