const ADMIN_IKON = { pendapatan: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14.5h2"/>', dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', pesanan: '<path d="M5 7h14l-1.2 12H6.2z"/><path d="M9 7a3 3 0 0 1 6 0"/>', jadwal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', paket: '<path d="M12 3l9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>', portofolio: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 17l-5-5-9 8"/>', pelanggan: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .6 3.2 2.4 3.5 5"/>', keluar: '<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9"/>' };
const adminSvg = (k) => '<svg viewBox="0 0 24 24">' + ADMIN_IKON[k] + "</svg>";
const ADMIN_MENU = [["dashboard", "Dashboard"], ["pesanan", "Pesanan"], ["pendapatan", "Pendapatan"], ["jadwal", "Jadwal"], ["paket", "Paket"], ["portofolio", "Portofolio"], ["pelanggan", "Pelanggan"]];
let adminTab = "dashboard";
let pilihanBulanPesanan = "semua";
let pilihanBulanPendapatan = "";

function adminDashboard() {
  const u = userAktif(), l = semuaPesanan(), a = semuaAkun().filter((x) => x.role === "pelanggan"), n = (f) => l.filter(f).length;
  const pendapatan = l.filter((p) => statusBayar(p) === "Lunas").reduce((t, p) => t + hargaPesanan(p), 0);
  const tgl = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const kartu = (judul, nilai, ket, fmt) => `<div><div class="gs-card p-3 h-100"><div class="small text-body-secondary">${judul}</div><div class="h4 font-display fw-semibold mb-0 mt-1"><span class="gs-num" data-to="${nilai}" data-fmt="${fmt || ""}">${fmt ? rupiah(nilai) : nilai}</span></div><div class="small text-body-secondary">${ket}</div></div></div>`;
  const tile = (j, v) => `<div><div class="gs-tile"><div class="small opacity-75 text-uppercase">${j}</div><div class="h3 font-display mb-0 fw-normal"><span class="gs-num" data-to="${v}">${v}</span></div></div></div>`;
  return `<div class="gs-banner p-4 mb-4"><div class="small opacity-75">${tgl}</div><h2 class="h3 font-display fw-semibold mb-3">Selamat Datang Kembali, ${aman(u.nama)}</h2><div class="row row-cols-2 row-cols-lg-4 g-3">${tile("Pesanan baru", n((p) => p.status === "Menunggu Konfirmasi"))}${tile("Sesi mendatang", n((p) => ["Dikonfirmasi", "Pembayaran Terverifikasi"].includes(p.status)))}${tile("Menunggu pembayaran", n((p) => p.status === "Dikonfirmasi" && statusBayar(p) !== "Lunas"))}${tile("Pelanggan terdaftar", a.length)}</div></div>
  <div class="row row-cols-1 row-cols-md-3 g-3 mb-4">${kartu("Total pesanan", l.length, "semua status")}${kartu("Hasil terkirim", n((p) => p.link), "tautan Drive sudah diisi")}${kartu("Pendapatan terverifikasi", pendapatan, "pesanan berstatus lunas", "rupiah")}</div>
  <div class="row g-3"><div class="col-lg-8"><div class="gs-card p-4 h-100"><h2 class="h5 font-display fw-semibold">Aktivitas Pesanan</h2><p class="small text-body-secondary">Pesanan terbaru dari seluruh pelanggan</p>${l.slice(0, 5).map((p) => `<div class="d-flex justify-content-between align-items-center py-2 border-top"><div><div class="fw-semibold small">${p.id} &middot; ${aman(namaPelanggan(p))}</div><div class="small text-body-secondary">${namaPaket(p)} &middot; ${p.tanggal}</div></div>${badge(p.status)}</div>`).join("")}</div></div>
  <div class="col-lg-4"><div class="gs-card p-4 h-100"><h2 class="h5 font-display fw-semibold">Ringkasan</h2><p class="small text-body-secondary">Kondisi layanan secara umum</p>${[["Total pelanggan", a.length], ["Total layanan", Object.keys(LAYANAN).length], ["Total paket", Object.values(LAYANAN).reduce((t, x) => t + x.paket.length, 0)], ["Foto di portofolio", Object.values(fotoTampil()).flat().length]].map((r) => `<div class="d-flex justify-content-between py-2 border-top small"><span>${r[0]}</span><strong>${r[1]}</strong></div>`).join("")}</div></div></div>`;
}
const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const IKON_KAL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
const labelPilihBulan = (k) => (k === "semua" ? "Semua bulan" : labelBulan(k));
const kalenderBulan = (id, terpilih, denganSemua) => `<div class="gs-kal" data-kal="${id}" data-pilih="${terpilih}" data-semua="${denganSemua ? 1 : 0}"><button type="button" class="btn btn-outline-primary btn-sm gs-kal-btn" id="${id}" aria-haspopup="true" aria-expanded="false">${IKON_KAL}<span>${labelPilihBulan(terpilih)}</span><span aria-hidden="true">&#9662;</span></button><div class="gs-kal-pop" hidden></div></div>`;
const barisFilter = (id, terpilih, denganSemua) => `<div class="gs-tanpa-cetak d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div class="d-flex align-items-center gap-2"><span class="form-label small mb-0">Bulan sesi</span>${kalenderBulan(id, terpilih, denganSemua)}</div><button class="btn btn-outline-primary btn-sm" id="cetak">Cetak</button></div>`;

function pasangKalender(el, pilih) {
  const id = el.dataset.kal, denganSemua = el.dataset.semua === "1", terpilih = el.dataset.pilih;
  const btn = el.querySelector(".gs-kal-btn"), pop = el.querySelector(".gs-kal-pop");
  const awal = terpilih !== "semua" && terpilih ? terpilih : daftarBulan()[0] || new Date().toISOString().slice(0, 7);
  let tahun = Number(awal.slice(0, 4));
  const gambar = () => {
    pop.innerHTML = `<div class="gs-kal-head"><button type="button" data-th="-1" aria-label="Tahun sebelumnya">&#8249;</button><strong>${tahun}</strong><button type="button" data-th="1" aria-label="Tahun berikutnya">&#8250;</button></div>` +
      `<div class="gs-kal-grid">${BULAN_PENDEK.map((n, i) => { const kode = tahun + "-" + String(i + 1).padStart(2, "0"), jml = pesananBulan(kode).length; return `<button type="button" data-bln="${kode}" class="${kode === terpilih ? "on" : ""} ${jml ? "ada" : ""}" title="${jml ? jml + " pesanan" : "Belum ada pesanan"}">${n}${jml ? `<small>${jml}</small>` : ""}</button>`; }).join("")}</div>` +
      (denganSemua ? `<button type="button" class="gs-kal-semua ${terpilih === "semua" ? "on" : ""}" data-bln="semua">Semua bulan</button>` : "");
    pop.querySelectorAll("[data-th]").forEach((b) => { b.onclick = (e) => { e.stopPropagation(); tahun += Number(b.dataset.th); gambar(); }; });
    pop.querySelectorAll("[data-bln]").forEach((b) => { b.onclick = () => pilih(id, b.dataset.bln); });
  };
  btn.onclick = (e) => {
    e.stopPropagation();
    const buka = pop.hidden;
    document.querySelectorAll(".gs-kal-pop").forEach((x) => { x.hidden = true; });
    if (buka) { gambar(); pop.hidden = false; }
    btn.setAttribute("aria-expanded", buka ? "true" : "false");
  };
  pop.onclick = (e) => e.stopPropagation();
}
if (!window.__kalLuar) {
  window.__kalLuar = true;
  document.addEventListener("click", () => document.querySelectorAll(".gs-kal-pop").forEach((x) => { x.hidden = true; }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".gs-kal-pop").forEach((x) => { x.hidden = true; }); });
}
const BAYAR_URUT = { Dibatalkan: 0, Belum: 0, "Menunggu Pembayaran": 1, Lunas: 2 };
const noPesanan = (p) => parseInt(String(p.id).slice(3), 10) || 0;
const URUT_PESANAN = [
  ["idDesc", "Pesanan terbaru", (a, b) => noPesanan(b) - noPesanan(a)],
  ["idAsc", "Pesanan terlama", (a, b) => noPesanan(a) - noPesanan(b)],
  ["bayarAsc", "Pembayaran: Belum dulu", (a, b) => BAYAR_URUT[statusBayar(a)] - BAYAR_URUT[statusBayar(b)] || noPesanan(b) - noPesanan(a)],
  ["bayarDesc", "Pembayaran: Lunas dulu", (a, b) => BAYAR_URUT[statusBayar(b)] - BAYAR_URUT[statusBayar(a)] || noPesanan(b) - noPesanan(a)],
];
function pesananData() {
  const k = KEADAAN.pesanan.cari.trim().toLowerCase();
  return urutkan(pesananBulan(pilihanBulanPesanan).filter((p) => !k || namaPelanggan(p).toLowerCase().includes(k)), URUT_PESANAN, KEADAAN.pesanan.urut);
}
function pesananWilayah() {
  const semua = pesananData(), pg = potongHalaman(semua, "pesanan");
  const lunas = semua.filter((p) => statusBayar(p) === "Lunas").length;
  const periode = pilihanBulanPesanan === "semua" ? "Semua bulan" : labelBulan(pilihanBulanPesanan);
  const kosong = (n) => `<tr><td colspan="${n}" class="text-center text-body-secondary py-4">Tidak ada pesanan yang cocok.</td></tr>`;
  const baris = pg.isi.map((p, i) => `<tr><td class="small text-body-secondary">${pg.awal + i + 1}</td><td class="small">${p.id}<br><span class="text-body-secondary">${aman(namaPelanggan(p))}</span></td><td class="small">${namaPaket(p)}<br>${p.tanggal}</td>
      <td><select class="form-select form-select-sm" data-status="${p.id}">${STATUS.map((s) => `<option ${s === p.status ? "selected" : ""} ${STATUS_BUTUH_LUNAS.includes(s) && statusBayar(p) !== "Lunas" ? "disabled" : ""}>${s}</option>`).join("")}</select></td>
      <td class="small"><span data-bayar="${p.id}">${statusBayar(p)}</span>${statusBayar(p) === "Lunas" ? `<br><span class="text-body-secondary">${metodeBayar(p)}</span> <a href="#invoice/${p.id}" class="gs-tautan">Invoice</a>` : ""}</td>
      <td><div class="input-group input-group-sm"><input class="form-control" placeholder="Link Google Drive" value="${aman(p.link)}" data-link="${p.id}"><button class="btn btn-primary" data-simpan="${p.id}">Simpan</button></div></td></tr>`).join("");
  const cetak = `<div class="gs-hanya-cetak"><table class="table"><thead><tr><th>No</th><th>Pesanan</th><th>Sesi</th><th>Status</th><th>Pembayaran</th></tr></thead><tbody>${semua.map((p, i) => `<tr><td>${i + 1}</td><td>${p.id}<br>${aman(namaPelanggan(p))}</td><td>${namaPaket(p)}<br>${p.tanggal}</td><td>${p.status}</td><td>${statusBayar(p)}</td></tr>`).join("")}</tbody></table></div>`;
  return `<p class="small text-body-secondary mb-2" id="ringkasPesanan">${periode}: ${semua.length} pesanan, ${lunas} Lunas</p>` +
    `<div class="table-responsive gs-tanpa-cetak"><table class="table table-hover align-middle bg-white"><thead><tr><th>No</th><th>${tombolUrut("pesanan", "Pesanan", "idAsc", "idDesc")}</th><th>Sesi</th><th>Status</th><th>${tombolUrut("pesanan", "Pembayaran", "bayarAsc", "bayarDesc")}</th><th>Tautan hasil</th></tr></thead><tbody>${baris || kosong(6)}</tbody></table></div>` +
    navHalaman("pesanan", pg, "pesanan") + cetak;
}
function adminPesanan() {
  const periode = pilihanBulanPesanan === "semua" ? "Semua bulan" : labelBulan(pilihanBulanPesanan);
  return `<div class="gs-judul-cetak">Rekap Pesanan - ${periode}</div>` + barisFilter("bulanPesanan", pilihanBulanPesanan, true) +
    toolbarDaftar("pesanan", "Cari nama pelanggan...", URUT_PESANAN) + `<div id="areaDaftar">${pesananWilayah()}</div>`;
}

function pendapatanWilayah() {
  const l = pesananBulan(pilihanBulanPendapatan).filter((p) => statusBayar(p) === "Lunas");
  const total = l.reduce((t, p) => t + hargaPesanan(p), 0), pg = potongHalaman(l, "pendapatan");
  const baris = (arr) => arr.map((p) => `<tr><td>${p.id}</td><td>${aman(namaPelanggan(p))}</td><td class="small">${namaPaket(p)}</td><td>${p.tanggal}</td><td class="small">${metodeBayar(p)}</td><td>${rupiah(hargaPesanan(p))}</td></tr>`).join("");
  const kepala = "<thead><tr><th>Pesanan</th><th>Pelanggan</th><th>Paket</th><th>Tanggal sesi</th><th>Metode</th><th>Harga</th></tr></thead>";
  const kaki = `<tfoot><tr><td colspan="5" class="fw-semibold">Total</td><td class="fw-semibold">${rupiah(total)}</td></tr></tfoot>`;
  const kosong = '<tr><td colspan="6" class="text-center text-body-secondary">Belum ada pembayaran Lunas di bulan ini.</td></tr>';
  return `<div class="table-responsive gs-tanpa-cetak"><table class="table align-middle bg-white">${kepala}<tbody>${l.length ? baris(pg.isi) : kosong}</tbody>${kaki}</table></div>` +
    navHalaman("pendapatan", pg, "transaksi") + `<div class="gs-hanya-cetak"><table class="table">${kepala}<tbody>${l.length ? baris(l) : kosong}</tbody>${kaki}</table></div>`;
}
function adminPendapatan() {
  if (!pilihanBulanPendapatan) {
    pilihanBulanPendapatan = daftarBulan().find((b) => pesananBulan(b).some((p) => statusBayar(p) === "Lunas")) || daftarBulan()[0];
  }
  const periode = labelBulan(pilihanBulanPendapatan), semuaBulanIni = pesananBulan(pilihanBulanPendapatan);
  const l = semuaBulanIni.filter((p) => statusBayar(p) === "Lunas"), total = l.reduce((t, p) => t + hargaPesanan(p), 0);
  const kartu = (judul, isi, ket) => `<div><div class="gs-card p-3 h-100"><div class="small text-body-secondary">${judul}</div><div class="h4 font-display fw-semibold mb-0 mt-1">${isi}</div><div class="small text-body-secondary">${ket}</div></div></div>`;
  return `<div class="gs-judul-cetak">Rekap Pendapatan - ${periode}</div>` + barisFilter("bulanPendapatan", pilihanBulanPendapatan, false) +
    `<div class="row row-cols-1 row-cols-md-3 g-3 mb-4">${kartu("Pendapatan " + periode, `<span class="gs-num" data-to="${total}" data-fmt="rupiah">${rupiah(total)}</span>`, "dari pesanan berstatus Lunas")}${kartu("Transaksi Lunas", `<span class="gs-num" data-to="${l.length}">${l.length}</span>`, "terverifikasi otomatis oleh gateway")}${kartu("Pesanan bulan ini", `<span class="gs-num" data-to="${semuaBulanIni.length}">${semuaBulanIni.length}</span>`, "semua status")}</div>` +
    `<div id="areaDaftar">${pendapatanWilayah()}</div>`;
}

const cmpPaket = (a, b) => namaPaketTeks(a).localeCompare(namaPaketTeks(b), "id");
const cmpTgl = (a, b) => a.tanggal.localeCompare(b.tanggal);
const URUT_JADWAL = [
  ["tglAsc", "Tanggal terawal", (a, b) => cmpTgl(a, b) || cmpPaket(a, b) || noPesanan(a) - noPesanan(b)],
  ["tglDesc", "Tanggal terakhir", (a, b) => cmpTgl(b, a) || cmpPaket(a, b) || noPesanan(a) - noPesanan(b)],
  ["paketAsc", "Paket A-Z", (a, b) => cmpPaket(a, b) || cmpTgl(a, b) || noPesanan(a) - noPesanan(b)],
  ["paketDesc", "Paket Z-A", (a, b) => cmpPaket(b, a) || cmpTgl(a, b) || noPesanan(a) - noPesanan(b)],
];
function jadwalData() {
  const k = KEADAAN.jadwal.cari.trim().toLowerCase();
  return urutkan(semuaPesanan().filter((p) => p.status !== "Dibatalkan").filter((p) => !k || (namaPelanggan(p) + " " + namaPaketTeks(p)).toLowerCase().includes(k)), URUT_JADWAL, KEADAAN.jadwal.urut);
}
function jadwalWilayah() {
  const semua = jadwalData(), pg = potongHalaman(semua, "jadwal"), k = KEADAAN.jadwal.cari.trim();
  const baris = pg.isi.length
    ? pg.isi.map((p, i) => `<tr><td class="small text-body-secondary">${pg.awal + i + 1}</td><td>${p.tanggal}</td><td>${aman(namaPelanggan(p))}</td><td class="small">${namaPaket(p)}</td><td>${aman(p.lokasi)}</td><td>${badge(p.status)}</td><td><div class="form-check"><input type="checkbox" class="form-check-input" id="i${p.id}" data-ingat="${p.id}" ${p.ingat ? "checked" : ""}><label class="form-check-label small" for="i${p.id}">Terkirim</label></div></td></tr>`).join("")
    : `<tr><td colspan="7" class="text-center text-body-secondary py-4">Tidak ada jadwal yang cocok dengan "${aman(k)}".</td></tr>`;
  return `<div class="table-responsive"><table class="table align-middle bg-white"><thead><tr><th>No</th><th>${tombolUrut("jadwal", "Tanggal", "tglAsc", "tglDesc")}</th><th>Pelanggan</th><th>${tombolUrut("jadwal", "Paket", "paketAsc", "paketDesc")}</th><th>Lokasi</th><th>Status</th><th>Pengingat H-3</th></tr></thead><tbody id="isiJadwal">${baris}</tbody></table></div>` + navHalaman("jadwal", pg, "jadwal");
}
const adminJadwal = () => toolbarDaftar("jadwal", "Cari nama pelanggan atau paket...", URUT_JADWAL) + `<div id="areaDaftar">${jadwalWilayah()}</div>`;

function adminPaket() {
  const opsi = Object.entries(LAYANAN).map(([k, l]) => `<option value="${k}">${aman(l.nama)}</option>`).join("");
  const label = (t) => `<label class="form-label small">${t}</label>`;
  const form = `<div class="gs-card p-3 mb-4"><h2 class="h6 fw-semibold mb-3">Tambah Paket Baru</h2><div class="row g-2"><div class="col-md-4">${label("Layanan")}<select id="pkLayanan" class="form-select form-select-sm">${opsi}</select></div><div class="col-md-5">${label("Nama paket")}<input id="pkNama" class="form-control form-control-sm" maxlength="40" placeholder="Contoh: Paket Hemat"></div><div class="col-md-3">${label("Harga (Rp)")}<input id="pkHarga" type="number" min="1" class="form-control form-control-sm" placeholder="500000"></div><div class="col-md-8">${label("Fasilitas (satu baris satu fasilitas)")}<textarea id="pkFas" rows="3" class="form-control form-control-sm" placeholder="20 foto edit&#10;Durasi 1 jam"></textarea></div><div class="col-md-4">${label("Poster (opsional)")}<input id="pkPoster" type="file" accept="image/*" class="form-control form-control-sm"><div class="form-text">JPG/PNG/WEBP, maks 5 MB.</div></div><div class="col-12"><button class="btn btn-primary btn-sm" id="pkTambah">Tambah Paket</button></div></div></div>`;
  const poster = (src, nama, lebar) => src ? `<button type="button" class="gs-zoom poster-btn" data-poster="${src}" aria-label="Perbesar poster ${aman(nama)}" style="width:${lebar}px;flex-shrink:0;border-radius:.4rem"><img src="${src}" alt="Poster ${aman(nama)}"></button>` : `<div class="gs-poster-kosong" style="width:${lebar}px">Belum ada poster</div>`;
  const kartu = (k, p) => `<div><div class="gs-card p-3 h-100"><div class="d-flex gap-2 mb-2">${poster(p.gambar, p.nama, 56)}<div class="small">${aman(p.nama)} <span class="text-body-secondary">(saat ini ${rupiah(p.harga)})</span></div></div><div class="input-group input-group-sm"><span class="input-group-text">Rp</span><input type="number" class="form-control" value="${p.harga}" data-harga="${k}.${p.id}"><button class="btn btn-primary" data-hsimpan="${k}.${p.id}">Simpan</button></div><div class="d-flex flex-wrap gap-2 mt-2 align-items-center"><label class="btn btn-outline-primary btn-sm mb-0">${p.gambar ? "Ganti Poster" : "Pasang Poster"}<input type="file" accept="image/*" hidden data-pposter="${k}.${p.id}"></label>${p.gambar ? `<button class="btn btn-outline-primary btn-sm" data-pposterhapus="${k}.${p.id}">Hapus Poster</button>` : ""}<button class="btn btn-outline-danger btn-sm ms-auto" data-hapuspaket="${k}.${p.id}">Hapus Paket</button></div></div></div>`;
  return `<div id="notif"></div>` + form + Object.entries(LAYANAN).map(([k, l]) => `<div class="d-flex align-items-center gap-3 mt-4 mb-3">${poster(l.gambar, l.nama, 48)}<div><h2 class="h6 fw-semibold mb-1">${aman(l.nama)}</h2><label class="btn btn-outline-primary btn-sm mb-0">Ganti poster layanan<input type="file" accept="image/*" hidden data-lposter="${k}"></label></div></div><div class="row row-cols-1 row-cols-md-3 g-3 mb-3">${l.paket.map((p) => kartu(k, p)).join("")}</div>`).join("");
}

function portofolioWilayah() {
  const s = fotoSembunyi(), ex = potongHalaman(fotoTambahan(), "fotoTambah");
  const bawaan = potongHalaman(Object.entries(FOTO).flatMap(([k, a]) => a.map((f) => [k, f])), "fotoBawaan");
  const kartuFoto = (k, f, src, tombol) => `<div><div class="gs-card overflow-hidden"><img src="${src}" alt="${k}" class="w-100 object-fit-cover" style="aspect-ratio:1;opacity:${s.includes(f) ? 0.3 : 1}"><div class="p-2 text-center"><div class="small">${k}</div>${tombol}</div></div></div>`;
  return (ex.jumlah ? `<h2 class="h6 fw-semibold">Foto yang kamu tambahkan</h2><div class="row row-cols-3 row-cols-md-6 g-2">${ex.isi.map((f) => kartuFoto(f.kat, f.id, f.data, `<button class="btn btn-sm btn-outline-primary" data-hapus="${f.id}">Hapus</button>`)).join("")}</div>${navHalaman("fotoTambah", ex, "foto")}<div class="mb-4"></div>` : "") +
    `<h2 class="h6 fw-semibold">Foto bawaan</h2><div class="row row-cols-3 row-cols-md-6 g-2">${bawaan.isi.map(([k, f]) => kartuFoto(k, f, srcFoto(f), `<button class="btn btn-sm ${s.includes(f) ? "btn-primary" : "btn-outline-primary"}" data-foto="${f}">${s.includes(f) ? "Tampilkan" : "Sembunyikan"}</button>`)).join("")}</div>` + navHalaman("fotoBawaan", bawaan, "foto");
}
function adminPortofolio() {
  return `<div id="notif"></div>
  <div class="gs-card p-3 mb-4"><div class="row g-2 align-items-end"><div class="col-md-5"><label class="form-label small">Pilih foto</label><input type="file" id="fileFoto" accept="image/*" class="form-control form-control-sm"></div><div class="col-md-4"><label class="form-label small">Kategori</label><select id="katFoto" class="form-select form-select-sm">${Object.keys(FOTO).map((k) => `<option>${k}</option>`).join("")}</select></div><div class="col-md-3"><button class="btn btn-primary btn-sm w-100" id="tambahFoto">Tambah Foto</button></div></div><div class="form-text">Foto hanya tersimpan sementara di memori halaman (hilang saat halaman di-refresh).</div></div><div id="areaDaftar">${portofolioWilayah()}</div>`;
}

function pelangganWilayah() {
  const l = semuaAkun().filter((a) => a.role === "pelanggan"), pg = potongHalaman(l, "pelanggan");
  const baris = pg.isi.map((a, i) => `<tr><td class="small text-body-secondary">${pg.awal + i + 1}</td><td>${aman(a.nama)}</td><td class="small">${aman(a.email)}</td><td class="small">${aman(a.wa) || "-"}</td><td class="small">${aman(a.kota) || "-"}</td><td>${semuaPesanan().filter((p) => p.email === a.email).length}</td><td><button class="btn btn-outline-danger btn-sm" data-hapusakun="${aman(a.email)}" aria-label="Hapus pelanggan ${aman(a.nama)}">Hapus</button></td></tr>`).join("");
  return `<div class="table-responsive"><table class="table align-middle bg-white"><thead><tr><th>No</th><th>Nama</th><th>Email</th><th>WhatsApp</th><th>Kota</th><th>Pesanan</th><th>Aksi</th></tr></thead><tbody>${baris || '<tr><td colspan="7" class="text-center text-body-secondary py-4">Belum ada pelanggan terdaftar.</td></tr>'}</tbody></table></div>` + navHalaman("pelanggan", pg, "pelanggan");
}
const adminPelanggan = () => `<div id="areaDaftar">${pelangganWilayah()}</div>`;

const WILAYAH = { pesanan: pesananWilayah, pendapatan: pendapatanWilayah, jadwal: jadwalWilayah, portofolio: portofolioWilayah, pelanggan: pelangganWilayah };
function segarkanDaftar() {
  const w = ambil("areaDaftar");
  if (!w || !WILAYAH[adminTab]) return;
  w.innerHTML = WILAYAH[adminTab]();
  ["pesanan", "jadwal"].forEach((m) => { const u = ambil("urut-" + m); if (u) u.value = KEADAAN[m].urut; });
  pasangAksiDaftar(w);
}

function pasangAksiDaftar(wadah) {
  const q = (s) => wadah.querySelectorAll(s);
  q("[data-status]").forEach((s) => {
    s.onchange = () => {
      const r = ubahStatusPesanan(s.dataset.status, s.value);
      if (!r.ok) { tampilToast(r.pesan); segarkanDaftar(); return; }
      segarkanDaftar();
    };
  });
  q("[data-simpan]").forEach((b) => {
    b.onclick = () => {
      const v = document.querySelector('[data-link="' + b.dataset.simpan + '"]').value.trim();
      if (!v) return;
      const r = ubahStatusPesanan(b.dataset.simpan, "Hasil Dikirim");
      if (!r.ok) { tampilToast("Tautan hasil belum bisa dikirim. " + r.pesan); return; }
      ubahPesanan(b.dataset.simpan, { link: v }); segarkanDaftar();
    };
  });
  q("[data-ingat]").forEach((c) => { c.onchange = () => ubahPesanan(c.dataset.ingat, { ingat: c.checked }); });
  q("[data-foto]").forEach((b) => { b.onclick = () => { ubahSembunyi(b.dataset.foto); segarkanDaftar(); }; });
  q("[data-hapus]").forEach((b) => { b.onclick = () => { hapusFoto(b.dataset.hapus); segarkanDaftar(); }; });
  q("[data-hapusakun]").forEach((b) => {
    b.onclick = () => {
      const a = semuaAkun().find((x) => x.email === b.dataset.hapusakun);
      if (!a) return;
      const n = semuaPesanan().filter((p) => p.email === a.email).length;
      konfirmasi({ judul: "Hapus pelanggan?", isi: "Akun <strong>" + aman(a.nama) + "</strong> (" + aman(a.email) + ") akan dihapus dan tidak bisa masuk lagi." + (n ? "<br>" + n + " pesanan miliknya tetap tersimpan sebagai riwayat." : ""), ok: "Ya, Hapus" }, () => {
        hapusAkun(a.email); segarkanDaftar(); tampilToast("Pelanggan " + a.nama + " dihapus.");
      });
    };
  });
  pasangNavHalaman(wadah, segarkanDaftar);
  pasangUrut(wadah, segarkanDaftar);
}

function pasangAksiPaket() {
  if (!ambil("pkTambah")) return;
  const pesan = (t, k) => { const n = ambil("notif"); if (n) n.innerHTML = '<div class="alert alert-' + k + ' py-2 small">' + t + "</div>"; };
  const gagal = (t) => pesan(t, "danger");
  ambil("pkTambah").onclick = () => {
    const kat = ambil("pkLayanan").value, nama = ambil("pkNama").value.trim().replace(/\s+/g, " "), harga = Number(ambil("pkHarga").value);
    const fas = ambil("pkFas").value.split("\n").map((s) => s.trim()).filter(Boolean), file = ambil("pkPoster").files[0];
    if (!nama) return gagal("Nama paket wajib diisi.");
    if (LAYANAN[kat].paket.some((p) => p.nama.toLowerCase() === nama.toLowerCase())) return gagal("Nama paket sudah ada di layanan " + aman(LAYANAN[kat].nama) + ".");
    if (!Number.isInteger(harga) || harga <= 0 || harga > 1000000000) return gagal("Harga harus berupa angka bulat lebih dari 0.");
    if (!fas.length) return gagal("Isi minimal 1 fasilitas (satu baris satu fasilitas).");
    if (fas.length > 12 || fas.some((f) => f.length > 80)) return gagal("Maksimal 12 fasilitas dan tiap fasilitas maksimal 80 karakter.");
    const simpan = (gambar) => { tambahPaket(kat, { nama, harga, fasilitas: fas, gambar }); adminTampil(); pesan("Paket <strong>" + aman(nama) + "</strong> ditambahkan ke " + aman(LAYANAN[kat].nama) + " dan tampil di halaman Paket Harga.", "success"); };
    if (file) bacaPoster(file, simpan, gagal); else simpan("");
  };
  document.querySelectorAll("[data-hsimpan]").forEach((b) => {
    b.onclick = () => {
      const [k, id] = b.dataset.hsimpan.split("."), v = Number(document.querySelector('[data-harga="' + b.dataset.hsimpan + '"]').value);
      if (v > 0) { simpanHarga(k, id, v); adminTampil(); pesan("Harga diperbarui dan tampil di halaman publik.", "success"); }
    };
  });
  document.querySelectorAll("[data-pposter]").forEach((i) => {
    i.onchange = () => bacaPoster(i.files[0], (d) => { const [k, id] = i.dataset.pposter.split("."); setPosterPaket(k, id, d); adminTampil(); pesan("Poster paket dipasang.", "success"); }, gagal);
  });
  document.querySelectorAll("[data-pposterhapus]").forEach((b) => { b.onclick = () => { const [k, id] = b.dataset.pposterhapus.split("."); setPosterPaket(k, id, ""); adminTampil(); pesan("Poster paket dihapus.", "success"); }; });
  document.querySelectorAll("[data-lposter]").forEach((i) => {
    i.onchange = () => bacaPoster(i.files[0], (d) => { setPosterLayanan(i.dataset.lposter, d); adminTampil(); pesan("Poster layanan diganti.", "success"); }, gagal);
  });
  document.querySelectorAll("[data-hapuspaket]").forEach((b) => {
    b.onclick = () => {
      const [k, id] = b.dataset.hapuspaket.split("."), p = LAYANAN[k].paket.find((x) => x.id === id);
      if (!p) return;
      if (LAYANAN[k].paket.length <= 1) return gagal("Setiap layanan minimal punya 1 paket, jadi paket ini tidak bisa dihapus.");
      const n = pesananPakai(k, id);
      konfirmasi({ judul: "Hapus paket?", isi: "Paket <strong>" + aman(p.nama) + "</strong> dari layanan " + aman(LAYANAN[k].nama) + " akan dihapus dari halaman Paket Harga." + (n ? "<br>" + n + " pesanan yang memakai paket ini tetap tersimpan sebagai riwayat." : ""), ok: "Ya, Hapus" }, () => {
        hapusPaket(k, id); adminTampil(); pesan("Paket <strong>" + aman(p.nama) + "</strong> dihapus.", "success");
      });
    };
  });
}

const ADMIN_HALAMAN = { dashboard: adminDashboard, pesanan: adminPesanan, pendapatan: adminPendapatan, jadwal: adminJadwal, paket: adminPaket, portofolio: adminPortofolio, pelanggan: adminPelanggan };

let adminSidePasang = false;

function adminBangunKerangka() {
  const u = userAktif();
  APP.innerHTML = `<div class="d-flex flex-column flex-lg-row">
  <div class="gs-side-latar" id="latarSide"></div>
  <aside class="gs-side p-3 flex-shrink-0" id="sideAdmin">
    <div class="d-flex align-items-center gap-2 py-3 mb-2 px-1"><img src="img/logo.png" class="gs-logo-img" alt=""><div><div class="font-display fw-semibold text-white lh-1" style="font-size:1.15rem">GraferStyle</div><div class="small" style="color:#A8C8B5">Panel Admin</div></div><button type="button" class="gs-side-tutup ms-auto" id="tutupSide" aria-label="Tutup menu"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <ul class="nav flex-column gap-1 flex-grow-1" id="menuAdmin"></ul>
    <div class="mt-4 pt-3" style="border-top:1px solid rgba(255,255,255,.12)"><div class="d-flex align-items-center gap-2 mb-3"><div class="gs-avatar">${inisial(u.nama)}</div><div class="text-white fw-semibold">${aman(u.nama)}</div></div>
    <a href="#admin" class="nav-link" id="keluarAdmin">${adminSvg("keluar")}Keluar</a></div>
  </aside>
  <main class="flex-grow-1" style="min-width:0"><header class="gs-topbar"><div class="d-flex align-items-center gap-2"><button type="button" class="gs-side-buka" id="bukaSide" aria-label="Buka menu"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button><div class="gs-topbar-judul font-display" id="judulHalaman">Dashboard</div></div><div class="gs-topbar-kanan d-flex align-items-center gap-3"><div class="dropdown gs-notif" data-gaya="btn-outline-primary"></div><span class="gs-topbar-tgl">${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></div></header><div id="isiAdmin" class="gs-isi"></div></main>
</div>`;
  ambil("keluarAdmin").onclick = (e) => { e.preventDefault(); tanyaKeluar(); };
  const side = ambil("sideAdmin"), latar = ambil("latarSide");
  const aturSide = (buka) => { side.classList.toggle("buka", buka); latar.classList.toggle("buka", buka); document.body.classList.toggle("gs-kunci", buka); };
  ambil("bukaSide").onclick = () => aturSide(true);
  ambil("tutupSide").onclick = () => aturSide(false);
  latar.onclick = () => aturSide(false);
  side.addEventListener("click", (e) => { if (e.target.closest("a.nav-link")) aturSide(false); });
  if (!adminSidePasang) {
    adminSidePasang = true;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".gs-side.buka, .gs-side-latar.buka").forEach((el) => el.classList.remove("buka"));
      document.body.classList.remove("gs-kunci");
    });
    window.addEventListener("hashchange", () => document.body.classList.remove("gs-kunci"));
  }
}

function adminTampil() {
  periksaKedaluwarsa();
  segarkanNotif();
  ambil("menuAdmin").innerHTML = ADMIN_MENU.map((m) => `<li><a class="nav-link ${m[0] === adminTab ? "active" : ""}" href="#admin/${m[0]}">${adminSvg(m[0])}${m[1]}</a></li>`).join("");
  ambil("judulHalaman").textContent = ADMIN_MENU.find((m) => m[0] === adminTab)[1];
  tampilkan(ambil("isiAdmin"), ADMIN_HALAMAN[adminTab]());
  pasangAksiDaftar(document);
  pasangCariUrut("pesanan", segarkanDaftar);
  pasangCariUrut("jadwal", segarkanDaftar);
  pasangAksiPaket();
  document.querySelectorAll(".gs-kal").forEach((el) => pasangKalender(el, (id, nilai) => {
    if (id === "bulanPesanan") { pilihanBulanPesanan = nilai; posisiHalaman.pesanan = 1; } else { pilihanBulanPendapatan = nilai; posisiHalaman.pendapatan = 1; }
    adminTampil();
  }));
  const tombolCetak = ambil("cetak");
  if (tombolCetak) tombolCetak.onclick = () => window.print();
  const tombolTambah = ambil("tambahFoto");
  if (tombolTambah) {
    tombolTambah.onclick = () => {
      const pesan = (t, k) => { ambil("notif").innerHTML = '<div class="alert alert-' + k + ' py-2 small">' + t + "</div>"; };
      const file = ambil("fileFoto").files[0];
      if (!file) return pesan("Pilih foto dulu.", "danger");
      bacaFoto(file, (data) => {
        const kat = ambil("katFoto").value;
        tambahFoto(kat, data);
        adminTampil();
        pesan("Foto berhasil ditambahkan ke kategori " + kat + ".", "success");
      });
    };
  }
}

function halamanAdmin(bagian) {
  adminTab = ADMIN_HALAMAN[bagian[1]] ? bagian[1] : "dashboard";
  if (!ambil("isiAdmin")) adminBangunKerangka();
  adminTampil();
}
