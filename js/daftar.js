const PER_HALAMAN = 10;
const posisiHalaman = {};
const KEADAAN = {
  pesanan: { cari: "", urut: "idDesc" },
  jadwal: { cari: "", urut: "tglAsc" },
};

function potongHalaman(daftar, kunci) {
  const total = Math.max(1, Math.ceil(daftar.length / PER_HALAMAN));
  const halaman = Math.min(Math.max(1, posisiHalaman[kunci] || 1), total);
  posisiHalaman[kunci] = halaman;
  const awal = (halaman - 1) * PER_HALAMAN;
  return { isi: daftar.slice(awal, awal + PER_HALAMAN), awal, halaman, total, jumlah: daftar.length };
}

function nomorHalaman(halaman, total) {
  const s = new Set([1, total, halaman - 1, halaman, halaman + 1]);
  if (halaman <= 3) { s.add(2); s.add(3); }
  if (halaman >= total - 2) { s.add(total - 1); s.add(total - 2); }
  const a = [...s].filter((n) => n >= 1 && n <= total).sort((x, y) => x - y), hasil = [];
  a.forEach((n, i) => { if (i && n - a[i - 1] > 1) hasil.push("..."); hasil.push(n); });
  return hasil;
}

function navHalaman(kunci, pg, satuan) {
  if (!pg.jumlah) return "";
  const item = (label, tujuan, o = {}) => `<li class="page-item${o.aktif ? " active" : ""}${o.mati ? " disabled" : ""}"><button type="button" class="page-link" data-hal="${kunci}:${tujuan}"${o.aktif ? ' aria-current="page"' : ""}${o.mati ? " disabled" : ""}${o.aria ? ' aria-label="' + o.aria + '"' : ""}>${label}</button></li>`;
  const angka = nomorHalaman(pg.halaman, pg.total).map((n) => (n === "..." ? '<li class="page-item disabled"><span class="page-link">&hellip;</span></li>' : item(n, n, { aktif: n === pg.halaman })));
  return `<nav class="gs-tanpa-cetak d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3" aria-label="Navigasi halaman"><div class="small text-body-secondary">Menampilkan ${pg.awal + 1}&ndash;${pg.awal + pg.isi.length} dari ${pg.jumlah} ${satuan}</div><ul class="pagination pagination-sm mb-0">${item("&lsaquo;", "prev", { mati: pg.halaman === 1, aria: "Halaman sebelumnya" })}${angka.join("")}${item("&rsaquo;", "next", { mati: pg.halaman === pg.total, aria: "Halaman berikutnya" })}</ul></nav>`;
}
function pasangNavHalaman(wadah, setelah) {
  wadah.querySelectorAll("[data-hal]").forEach((b) => {
    b.onclick = () => {
      const [kunci, tujuan] = b.dataset.hal.split(":"), sekarang = posisiHalaman[kunci] || 1;
      posisiHalaman[kunci] = tujuan === "prev" ? sekarang - 1 : tujuan === "next" ? sekarang + 1 : Number(tujuan);
      setelah();
    };
  });
}

const urutkan = (daftar, opsi, kunci) => { const o = opsi.find((x) => x[0] === kunci) || opsi[0]; return daftar.slice().sort(o[2]); };

const tombolUrut = (menu, label, asc, desc) => {
  const s = KEADAAN[menu].urut, panah = s === asc ? "&#9650;" : s === desc ? "&#9660;" : "&#8597;";
  return `<button type="button" class="gs-th-urut" data-urut="${menu}:${asc}:${desc}" title="Urutkan berdasarkan ${label}">${label} <span>${panah}</span></button>`;
};
function pasangUrut(wadah, setelah) {
  wadah.querySelectorAll("[data-urut]").forEach((b) => {
    b.onclick = () => {
      const [menu, asc, desc] = b.dataset.urut.split(":");
      KEADAAN[menu].urut = KEADAAN[menu].urut === asc ? desc : asc;
      posisiHalaman[menu] = 1;
      setelah();
    };
  });
}

const toolbarDaftar = (menu, placeholder, opsi) => `<div class="gs-tanpa-cetak d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div class="gs-cari"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input type="search" id="cari-${menu}" class="form-control form-control-sm" placeholder="${placeholder}" value="${aman(KEADAAN[menu].cari)}" autocomplete="off" aria-label="${placeholder}"></div><div class="d-flex align-items-center gap-2"><label class="small text-body-secondary mb-0" for="urut-${menu}">Urutkan</label><select id="urut-${menu}" class="form-select form-select-sm" style="width:auto">${opsi.map((o) => `<option value="${o[0]}"${o[0] === KEADAAN[menu].urut ? " selected" : ""}>${o[1]}</option>`).join("")}</select></div></div>`;
function pasangCariUrut(menu, segarkan) {
  const c = ambil("cari-" + menu), u = ambil("urut-" + menu);
  if (c) c.oninput = () => { KEADAAN[menu].cari = c.value; posisiHalaman[menu] = 1; segarkan(); };
  if (u) u.onchange = () => { KEADAAN[menu].urut = u.value; posisiHalaman[menu] = 1; segarkan(); };
}
