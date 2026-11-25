const APP = document.getElementById("app");
const ambil = (id) => document.getElementById(id);

function tampilkan(wadah, html) {
  wadah.innerHTML = html;
  animasiSiapkan(wadah);
}
function pindah(tujuan) {
  if (location.hash === "#" + tujuan) tampilHalaman(); else location.hash = tujuan;
}

const IKON_FOOTER = {
  lokasi: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  whatsapp: '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5z"/><path d="M8.8 8.6c.3 2.6 2.6 5.2 5.6 6.2l1.2-1.3-2.1-1-.9.7c-.9-.4-1.6-1.1-2-2l.7-.9-1-2.1z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'
};
const ikonFooter = (nama) => '<svg class="gs-foot-ikon" viewBox="0 0 24 24" aria-hidden="true">' + IKON_FOOTER[nama] + "</svg>";

function renderLayout(aktif) {
  const menu = [["beranda", "#beranda", "Beranda"], ["tentang", "#tentang", "Tentang Kami"], ["portofolio", "#portofolio", "Portofolio"], ["paket", "#paket", "Paket Harga"], ["kontak", "#kontak", "Kontak"]];
  const u = userAktif();
  const kanan = u
    ? '<div class="dropdown gs-notif" data-gaya="btn-outline-light">' + isiLonceng("btn-outline-light") + "</div>" + '<a class="btn btn-primary btn-sm px-3" href="' + (u.role === "admin" ? "#admin" : "#pesanan") + '">' + (u.role === "admin" ? "Panel Admin" : "Pesanan Saya") + '</a>' + (u.role === "admin" ? "" : '<a class="btn btn-outline-light btn-sm px-3" href="#profil">Profil</a>') + '<button class="btn btn-outline-light btn-sm px-3" onclick="tanyaKeluar()">Keluar</button>'
    : '<a class="btn btn-masuk px-4" href="#login">Masuk</a>';
  ambil("site-header").innerHTML =
    '<nav class="navbar navbar-expand-lg gs-navbar sticky-top"><div class="container-fluid px-3 mx-auto gs-wadah">' +
    '<a class="navbar-brand gs-brand" href="#beranda"><img src="img/logo.png" class="gs-logo-img" alt="">GraferStyle</a>' +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Buka menu"><span class="navbar-toggler-icon"></span></button>' +
    '<div class="collapse navbar-collapse" id="menu"><ul class="navbar-nav gs-pill mx-auto">' +
    menu.map((m) => '<li class="nav-item"><a class="nav-link' + (m[0] === aktif ? " active" : "") + '" href="' + m[1] + '">' + m[2] + "</a></li>").join("") +
    '</ul><div class="d-flex gap-2 py-2 py-lg-0">' + kanan + "</div></div></div></nav>";

  const ikuti = [["Instagram", KONTAK.instagramUrl], ["WhatsApp", KONTAK.waUrl]].concat(KONTAK.tiktok ? [["TikTok", KONTAK.tiktokUrl]] : []);
  ambil("site-footer").innerHTML =
    '<footer class="bg-deep mt-5 pt-5 pb-4"><div class="container-fluid px-3 mx-auto gs-wadah"><div class="row g-4">' +
    '<div class="col-lg-5"><h2 class="gs-foot-title">Tentang Kami</h2><p class="small opacity-75">' + KONTAK.tentang + "</p></div>" +
    '<div class="col-6 col-lg-2"><h2 class="gs-foot-title">Tautan Cepat</h2><ul class="list-unstyled small">' + menu.map((m) => '<li class="mb-2"><a href="' + m[1] + '">' + m[2] + "</a></li>").join("") + '<li><a href="#beranda/faq">FAQ</a></li></ul></div>' +
    '<div class="col-6 col-lg-2"><h2 class="gs-foot-title">Ikuti</h2><ul class="list-unstyled small">' + ikuti.map((i) => '<li class="mb-2"><a href="' + i[1] + '" target="_blank" rel="noreferrer">' + i[0] + "</a></li>").join("") + "</ul></div>" +
    '<div class="col-lg-3"><h2 class="gs-foot-title">Hubungi Kami</h2><ul class="list-unstyled small opacity-75 gs-foot-kontak"><li class="mb-2">' + ikonFooter("lokasi") + '<span>' + KONTAK.alamat + '</span></li><li class="mb-2">' + ikonFooter("whatsapp") + '<a href="' + KONTAK.waUrl + '" target="_blank" rel="noreferrer">' + KONTAK.whatsapp + '</a></li><li>' + ikonFooter("email") + '<span>' + KONTAK.email + '</span></li></ul></div>' +
    '</div><hr class="opacity-25 my-4"><p class="small opacity-50 mb-0">&copy; 2026 GraferStyle. All rights reserved.</p></div></footer>' +
    '<a href="#beranda" class="gs-top" aria-label="Kembali ke atas">&uarr;</a>';
  segarkanNotif();
}
function judulHalaman(label, kata, sisa, deskripsi) {
  return '<div class="gs-head"><span class="gs-label">' + label + '</span><h1 class="font-display fw-semibold mt-3"><span class="gs-mark">' + kata + "</span> " + sisa + '</h1><p class="text-body-secondary">' + deskripsi + "</p></div>";
}

function bukaLightbox(daftar, mulai) {
  let i = mulai || 0; const banyak = daftar.length > 1, lb = document.createElement("div"); lb.className = "gs-lb";
  lb.innerHTML = '<button class="gs-lb-x" aria-label="Tutup">&times;</button>' + (banyak ? '<button class="gs-lb-n gs-lb-p" aria-label="Sebelumnya">&#8249;</button><button class="gs-lb-n gs-lb-s" aria-label="Berikutnya">&#8250;</button><div class="gs-lb-info"></div>' : "") + '<img alt="Foto">';
  const img = lb.querySelector("img"), info = lb.querySelector(".gs-lb-info");
  const tampil = () => { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; img.src = daftar[i]; if (info) info.textContent = (i + 1) + " / " + daftar.length; };
  const geser = (d) => { i = (i + d + daftar.length) % daftar.length; tampil(); };
  const kunci = (e) => { if (e.key === "Escape") tutup(); else if (banyak && e.key === "ArrowRight") geser(1); else if (banyak && e.key === "ArrowLeft") geser(-1); };
  const tutup = () => { lb.remove(); document.removeEventListener("keydown", kunci); };
  lb.onclick = (e) => { if (e.target.closest(".gs-lb-p")) geser(-1); else if (e.target.closest(".gs-lb-s")) geser(1); else tutup(); };
  document.addEventListener("keydown", kunci); document.body.appendChild(lb); tampil();
}
const bukaPoster = (src) => bukaLightbox([src], 0);
document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-poster]"); if (b) bukaPoster(b.dataset.poster); });

function tampilToast(teks) {
  const t = document.createElement("div"); t.className = "gs-toast"; t.setAttribute("role", "status"); t.textContent = teks; document.body.appendChild(t);
  setTimeout(() => { t.classList.add("keluar"); setTimeout(() => t.remove(), 400); }, 3500);
}

function tanyaKeluar() {
  const u = userAktif(); if (!u) return keluar();
  const m = document.createElement("div"); m.className = "gs-konfirm";
  m.innerHTML = '<div class="gs-konfirm-kotak" role="dialog" aria-modal="true" aria-labelledby="kjudul"><div class="gs-konfirm-ikon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="30" height="30"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9"/></svg></div><h2 id="kjudul" class="font-display">Yakin ingin keluar?</h2><p>Kamu akan keluar dari akun <strong>' + aman(u.nama) + "</strong> (" + (u.role === "admin" ? "Admin" : "Pelanggan") + ').<br>Kamu bisa masuk lagi kapan saja.</p><div class="gs-konfirm-aksi"><button type="button" class="btn btn-outline-primary" data-aksi="batal">Batal</button><button type="button" class="btn btn-primary" data-aksi="ya">Ya, Keluar</button></div></div>';
  const kunci = (e) => { if (e.key === "Escape") tutup(); };
  const tutup = (lanjut) => { document.removeEventListener("keydown", kunci); m.classList.add("gs-tutup"); setTimeout(() => { m.remove(); if (lanjut === true) keluar(); }, 200); };
  m.onclick = (e) => { const a = e.target.closest("[data-aksi]"); if (a && a.dataset.aksi === "ya") tutup(true); else if (!e.target.closest(".gs-konfirm-kotak") || (a && a.dataset.aksi === "batal")) tutup(); };
  document.addEventListener("keydown", kunci); document.body.appendChild(m); m.querySelector('[data-aksi="batal"]').focus();
}

function konfirmasi(opsi, lanjut) {
  const m = document.createElement("div"); m.className = "gs-konfirm";
  m.innerHTML = '<div class="gs-konfirm-kotak" role="alertdialog" aria-modal="true" aria-labelledby="kjudul"><div class="gs-konfirm-ikon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="30" height="30"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg></div><h2 id="kjudul" class="font-display">' + aman(opsi.judul) + "</h2><p>" + opsi.isi + '</p><div class="gs-konfirm-aksi"><button type="button" class="btn btn-outline-primary" data-aksi="batal">Batal</button><button type="button" class="btn btn-primary" data-aksi="ya">' + aman(opsi.ok || "Ya") + "</button></div></div>";
  const kunci = (e) => { if (e.key === "Escape") tutup(); };
  const tutup = (ya) => { document.removeEventListener("keydown", kunci); m.classList.add("gs-tutup"); setTimeout(() => { m.remove(); if (ya === true) lanjut(); }, 200); };
  m.onclick = (e) => { const a = e.target.closest("[data-aksi]"); if (a && a.dataset.aksi === "ya") tutup(true); else if (!e.target.closest(".gs-konfirm-kotak") || (a && a.dataset.aksi === "batal")) tutup(); };
  document.addEventListener("keydown", kunci); document.body.appendChild(m); m.querySelector('[data-aksi="batal"]').focus();
}
