DB.notifikasi = DB.notifikasi || [];
let urutNotif = 0;
const kunciNotif = (u) => (u.role === "admin" ? "admin" : u.email);
const notifSaya = () => { const u = userAktif(); return u ? DB.notifikasi.filter((n) => n.untuk === kunciNotif(u)) : []; };

function kirimNotif(untuk, judul, isi, tujuan) {
  DB.notifikasi.unshift({ id: ++urutNotif, untuk, judul, isi, tujuan, waktu: Date.now(), dibaca: false });
  segarkanNotif();
}

function waktuRelatif(ms) {
  const d = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (d < 60) return "baru saja";
  if (d < 3600) return Math.floor(d / 60) + " menit lalu";
  if (d < 86400) return Math.floor(d / 3600) + " jam lalu";
  return Math.floor(d / 86400) + " hari lalu";
}

const IKON_LONCENG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>';

function isiLonceng(gaya) {
  const daftar = notifSaya(), baru = daftar.filter((n) => !n.dibaca).length;
  const item = (n) => `<a class="dropdown-item gs-notif-item text-wrap${n.dibaca ? "" : " belum"}" href="${aman(n.tujuan)}" data-notif="${n.id}"><div class="fw-semibold small">${aman(n.judul)}</div><div class="small text-body-secondary">${aman(n.isi)}</div><div class="gs-notif-waktu">${waktuRelatif(n.waktu)}</div></a>`;
  return `<button type="button" class="btn ${gaya} btn-sm px-3 position-relative" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Notifikasi${baru ? ", " + baru + " belum dibaca" : ""}">${IKON_LONCENG}${baru ? `<span class="badge rounded-pill gs-notif-badge">${baru > 9 ? "9+" : baru}</span>` : ""}</button>` +
    `<div class="dropdown-menu dropdown-menu-end gs-notif-menu p-0"><div class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"><strong class="small">Notifikasi</strong>${baru ? '<button type="button" class="btn btn-link btn-sm p-0" data-notif-semua="1">Tandai semua dibaca</button>' : ""}</div><div class="gs-notif-daftar">${daftar.length ? daftar.slice(0, 10).map(item).join("") : '<div class="px-3 py-4 text-center small text-body-secondary">Belum ada notifikasi.</div>'}</div></div>`;
}

function pasangNotif(area) {
  area.querySelectorAll("[data-notif]").forEach((el) => {
    el.onclick = () => {
      const n = DB.notifikasi.find((x) => x.id === Number(el.dataset.notif));
      if (n) n.dibaca = true;
      setTimeout(segarkanNotif, 0);
    };
  });
  const semua = area.querySelector("[data-notif-semua]");
  if (semua) semua.onclick = () => { notifSaya().forEach((n) => { n.dibaca = true; }); segarkanNotif(); };
}

function segarkanNotif() {
  document.querySelectorAll(".gs-notif").forEach((area) => { area.innerHTML = isiLonceng(area.dataset.gaya); pasangNotif(area); });
}
