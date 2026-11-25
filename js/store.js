const DB = {
  akun: AKUN_AWAL.map((a) => ({ ...a })),
  pesanan: PESANAN_AWAL.map((p) => ({ ...p })),
  emailAktif: null,
  sembunyi: [],
  fotoTambah: [],
};

const semuaAkun = () => DB.akun;
const semuaPesanan = () => DB.pesanan;
const userAktif = () => DB.akun.find((a) => a.email === DB.emailAktif) || null;

function masuk(email, password) {
  const u = DB.akun.find((a) => a.email === email.trim().toLowerCase() && a.password === password);
  if (u) DB.emailAktif = u.email;
  return u || null;
}
function keluar() {
  DB.emailAktif = null;
  pindah("beranda");
  tampilToast("Kamu berhasil keluar. Sampai jumpa lagi!");
}
function daftar(nama, email, wa, password) {
  const u = { nama, email: email.trim().toLowerCase(), password, wa, role: "pelanggan", bergabung: new Date().toISOString().slice(0, 10) };
  DB.akun.push(u);
  DB.emailAktif = u.email;
  return u;
}
function ubahAkun(email, patch) {
  DB.akun = DB.akun.map((a) => (a.email === email ? { ...a, ...patch } : a));
}

const cariPaket = (p) => LAYANAN[p.kategori].paket.find((x) => x.id === p.paket) || { nama: p.paketNama || "Paket dihapus", harga: p.harga || 0 };
const namaPaketTeks = (p) => LAYANAN[p.kategori].nama + " \u00b7 " + cariPaket(p).nama;
const namaPaket = (p) => aman(namaPaketTeks(p));
const hargaPesanan = (p) => (p.harga !== undefined ? p.harga : cariPaket(p).harga);
const namaPelanggan = (p) => { const a = DB.akun.find((x) => x.email === p.email); return a ? a.nama : p.pelanggan; };
DB.transaksi = DB.transaksi || [];
const transaksiPesanan = (id) => DB.transaksi.filter((t) => t.pesananId === id).sort((a, b) => b.dibuat - a.dibuat);
const statusBayar = (p) => {
  if (p.status === "Dibatalkan") return "Dibatalkan";
  const t = transaksiPesanan(p.id);
  if (t.some((x) => x.status === "settlement")) return "Lunas";
  return t.some((x) => x.status === "pending") ? "Menunggu Pembayaran" : "Belum";
};
const NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const bulanSesi = (p) => p.tanggal.slice(0, 7);
const labelBulan = (kode) => NAMA_BULAN[Number(kode.slice(5, 7)) - 1] + " " + kode.slice(0, 4);
const daftarBulan = () => [...new Set(semuaPesanan().map(bulanSesi))].sort().reverse();
const pesananBulan = (kode) => (kode === "semua" ? semuaPesanan() : semuaPesanan().filter((p) => bulanSesi(p) === kode));
const badge = (s) => '<span class="badge gs-st-' + KELAS_STATUS[s] + '">' + s + "</span>";

const BOOKING_MIN_HARI = 1;
const BOOKING_MAKS_HARI = 365;
const MAKS_SESI_PER_HARI = 1;
const isoLokal = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const tanggalGeser = (n) => { const h = new Date(); return isoLokal(new Date(h.getFullYear(), h.getMonth(), h.getDate() + n)); };
const tglIndo = (t) => new Date(t + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const sesiPadaTanggal = (t) => DB.pesanan.filter((p) => p.tanggal === t && p.status !== "Dibatalkan").length;
const tanggalPenuh = (t) => sesiPadaTanggal(t) >= MAKS_SESI_PER_HARI;
function periksaTanggalBooking(t) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t || "")) return { ok: false, pesan: "Pilih tanggal sesi yang valid." };
  const [y, m, d] = t.split("-").map(Number), k = new Date(y, m - 1, d);
  if (k.getFullYear() !== y || k.getMonth() !== m - 1 || k.getDate() !== d) return { ok: false, pesan: "Tanggal tidak valid." };
  if (t < tanggalGeser(0)) return { ok: false, pesan: "Tanggal sesi sudah lewat. Pilih tanggal mulai " + tglIndo(tanggalGeser(BOOKING_MIN_HARI)) + "." };
  if (t < tanggalGeser(BOOKING_MIN_HARI)) return { ok: false, pesan: "Booking minimal 1 hari sebelum sesi. Pilih tanggal mulai " + tglIndo(tanggalGeser(BOOKING_MIN_HARI)) + "." };
  if (t > tanggalGeser(BOOKING_MAKS_HARI)) return { ok: false, pesan: "Booking maksimal 1 tahun ke depan." };
  if (tanggalPenuh(t)) return { ok: false, penuh: true, pesan: "Tanggal " + tglIndo(t) + " sudah terisi. Pilih tanggal lain." };
  return { ok: true };
}
function tanggalKosongTerdekat(t, jumlah = 3) {
  const hasil = [], awal = Math.max(1, BOOKING_MIN_HARI);
  for (let i = awal; i <= BOOKING_MAKS_HARI && hasil.length < jumlah; i++) { const c = tanggalGeser(i); if (c > t && !tanggalPenuh(c)) hasil.push(c); }
  return hasil;
}
function tambahPesanan(p) {
  if (!periksaTanggalBooking(p.tanggal).ok) return null;
  const u = userAktif();
  const baru = { ...p, id: "GS-" + String(DB.pesanan.length + 1).padStart(3, "0"), email: u.email, pelanggan: u.nama, harga: cariPaket(p).harga, paketNama: cariPaket(p).nama, status: "Menunggu Konfirmasi", link: "" };
  DB.pesanan.unshift(baru);
  kirimNotif("admin", "Booking baru", u.nama + " memesan " + namaPaketTeks(baru) + " untuk " + tglIndo(baru.tanggal) + ".", "#admin/pesanan");
  return baru;
}
function ubahPesanan(id, patch) {
  DB.pesanan = DB.pesanan.map((p) => (p.id === id ? { ...p, ...patch } : p));
}

const BIDANG_PROFIL = ["nama", "panggilan", "gender", "lahir", "wa", "instagram", "alamat", "kota", "provinsi"];
const kelengkapan = (u) => Math.round((BIDANG_PROFIL.filter((k) => u[k] && String(u[k]).trim()).length / BIDANG_PROFIL.length) * 100);
const inisial = (n) => String(n || "").replace(/[^\p{L}\p{N} ]/gu, "").split(" ").filter(Boolean).map((x) => x[0]).slice(0, 2).join("").toUpperCase() || "?";

function simpanHarga(kat, id, harga) {
  LAYANAN[kat].paket.find((x) => x.id === id).harga = harga;
}

const pesananPakai = (kat, id) => DB.pesanan.filter((p) => p.kategori === kat && p.paket === id).length;
function tambahPaket(kat, data) {
  const id = "p" + Date.now().toString(36) + LAYANAN[kat].paket.length;
  LAYANAN[kat].paket.push({ id, nama: data.nama, harga: data.harga, fasilitas: data.fasilitas, gambar: data.gambar || "" });
  return id;
}
function hapusPaket(kat, id) {
  const x = LAYANAN[kat].paket.find((p) => p.id === id);
  if (!x) return;
  DB.pesanan = DB.pesanan.map((p) => (p.kategori === kat && p.paket === id ? { ...p, paketNama: x.nama, harga: p.harga !== undefined ? p.harga : x.harga } : p));
  LAYANAN[kat].paket = LAYANAN[kat].paket.filter((p) => p.id !== id);
}
function setPosterPaket(kat, id, data) { const x = LAYANAN[kat].paket.find((p) => p.id === id); if (x) x.gambar = data || ""; }
function setPosterLayanan(kat, data) { if (data) LAYANAN[kat].gambar = data; }
function hapusAkun(email) {
  const a = DB.akun.find((x) => x.email === email && x.role === "pelanggan");
  if (!a) return;
  DB.pesanan = DB.pesanan.map((p) => (p.email === email ? { ...p, pelanggan: a.nama } : p));
  DB.akun = DB.akun.filter((x) => x.email !== email);
}

const fotoSembunyi = () => DB.sembunyi;
function ubahSembunyi(f) {
  DB.sembunyi = DB.sembunyi.includes(f) ? DB.sembunyi.filter((x) => x !== f) : DB.sembunyi.concat(f);
}
const fotoTambahan = () => DB.fotoTambah;
function tambahFoto(kat, data) {
  DB.fotoTambah.push({ id: "u" + Date.now() + DB.fotoTambah.length, kat, data });
}
function hapusFoto(id) {
  DB.fotoTambah = DB.fotoTambah.filter((f) => f.id !== id);
}
function fotoTampil() {
  const hasil = {};
  Object.entries(FOTO).forEach(([kat, daftar]) => { hasil[kat] = daftar.filter((f) => !DB.sembunyi.includes(f)); });
  DB.fotoTambah.forEach((f) => { hasil[f.kat].push(f.data); });
  return hasil;
}
const srcFoto = (f) => (f.startsWith("data:") ? f : "img/" + encodeURI(f));
function bacaFoto(file, selesai) {
  const pembaca = new FileReader();
  pembaca.onload = () => selesai(pembaca.result);
  pembaca.readAsDataURL(file);
}

function kecilkanGambar(file, maks, selesai) {
  bacaFoto(file, (data) => {
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(1, maks / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.width * skala)); c.height = Math.max(1, Math.round(img.height * skala));
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      selesai(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => selesai(null);
    img.src = data;
  });
}
function bacaPoster(file, selesai, galat) {
  if (!file) return galat("Pilih file poster dulu.");
  if (!/^image\//.test(file.type)) return galat("File poster harus berupa gambar (JPG, PNG, atau WEBP).");
  if (file.size > 5 * 1024 * 1024) return galat("Ukuran poster maksimal 5 MB.");
  kecilkanGambar(file, 1400, (d) => (d ? selesai(d) : galat("Gambar tidak bisa dibaca. Coba file lain.")));
}

const aman = (t) => String(t === undefined || t === null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
