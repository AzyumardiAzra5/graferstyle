const BATAS_BAYAR_JAM = 24;
const STATUS_BUTUH_LUNAS = ["Pembayaran Terverifikasi", "Sesi Selesai", "Hasil Dikirim", "Selesai"];
const METODE = {
  qris:       { grup: "QRIS", nama: "QRIS", jenis: "qris", menit: 15, ket: "Scan dari GoPay, OVO, DANA, ShopeePay, atau m-banking" },
  va_bca:     { grup: "Virtual Account", nama: "BCA Virtual Account", bank: "BCA", jenis: "va", prefix: "39358", jam: 24 },
  va_bni:     { grup: "Virtual Account", nama: "BNI Virtual Account", bank: "BNI", jenis: "va", prefix: "8808", jam: 24 },
  va_bri:     { grup: "Virtual Account", nama: "BRI Virtual Account", bank: "BRI", jenis: "va", prefix: "26215", jam: 24 },
  va_mandiri: { grup: "Virtual Account", nama: "Mandiri Virtual Account", bank: "Mandiri", jenis: "va", prefix: "70012", jam: 24 },
  gopay:      { grup: "E-Wallet", nama: "GoPay", jenis: "ewallet", menit: 15 },
  ovo:        { grup: "E-Wallet", nama: "OVO", jenis: "ewallet", menit: 15 },
  dana:       { grup: "E-Wallet", nama: "DANA", jenis: "ewallet", menit: 15 },
  shopeepay:  { grup: "E-Wallet", nama: "ShopeePay", jenis: "ewallet", menit: 15 },
};
const namaPenerima = () => (semuaAkun().find((a) => a.role === "admin") || {}).nama || "GraferStyle";
const linkWABantuan = (p) => KONTAK.waUrl.split("?")[0] + "?text=" + encodeURIComponent("Halo GraferStyle, saya butuh bantuan pembayaran untuk pesanan " + p.id + " (" + rupiah(hargaPesanan(p)) + ").");
const nomorAcak = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
const dua = (n) => String(n).padStart(2, "0");
const idTransaksi = () => { const d = new Date(); return "TRX-" + d.getFullYear() + dua(d.getMonth() + 1) + dua(d.getDate()) + "-" + nomorAcak(6); };
const transaksiLunas = (p) => transaksiPesanan(p.id).find((t) => t.status === "settlement");
const metodeBayar = (p) => { const t = transaksiLunas(p); return t ? METODE[t.metode].nama : ""; };
const kodeVA = (m) => m.prefix + nomorAcak(16 - m.prefix.length);
const WAKTU = { timeZone: "Asia/Jakarta", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
const waktuLengkap = (ms) => new Date(ms).toLocaleString("id-ID", WAKTU).replace(/\./g, ":") + " WIB";

function batalkanTransaksiPending(id) { DB.transaksi.forEach((t) => { if (t.pesananId === id && t.status === "pending") t.status = "cancel"; }); }

function periksaKedaluwarsa(sekarang = Date.now()) {
  DB.transaksi.forEach((t) => { if (t.status === "pending" && t.kedaluwarsa <= sekarang) t.status = "expire"; });
  DB.pesanan = DB.pesanan.map((p) => {
    if (p.status === "Dikonfirmasi" && p.batasBayar && p.batasBayar <= sekarang && statusBayar(p) !== "Lunas") {
      batalkanTransaksiPending(p.id);
      kirimNotif(p.email, "Pesanan dibatalkan otomatis", "Pesanan " + p.id + " dibatalkan karena batas waktu pembayaran habis.", "#pesanan");
      kirimNotif("admin", "Pesanan dibatalkan otomatis", p.pelanggan + " (" + p.id + ") tidak membayar sampai batas waktu. Tanggal " + tglIndo(p.tanggal) + " kembali tersedia.", "#admin/pesanan");
      return { ...p, status: "Dibatalkan", alasanBatal: "Batas waktu pembayaran habis" };
    }
    return p;
  });
}

function ubahStatusPesanan(id, status) {
  periksaKedaluwarsa();
  const p = DB.pesanan.find((x) => x.id === id);
  if (!p) return { ok: false, pesan: "Pesanan tidak ditemukan." };
  const lunas = statusBayar(p) === "Lunas";
  if (p.status === "Dibatalkan") return { ok: false, pesan: "Pesanan yang sudah dibatalkan tidak bisa diubah lagi." };
  if (STATUS_BUTUH_LUNAS.includes(status) && !lunas) return { ok: false, pesan: "Pesanan belum lunas. Status ini baru bisa dipilih setelah pelanggan membayar." };
  if (lunas && (status === "Menunggu Konfirmasi" || status === "Dikonfirmasi")) return { ok: false, pesan: "Pesanan sudah lunas, statusnya tidak bisa dikembalikan." };
  if (lunas && status === "Dibatalkan") return { ok: false, pesan: "Pesanan sudah lunas dan tidak bisa dibatalkan (pengembalian dana belum didukung)." };
  const patch = { status };
  if (status === "Dikonfirmasi" && !p.batasBayar) patch.batasBayar = Date.now() + BATAS_BAYAR_JAM * 3600000;
  if (status === "Dibatalkan") { patch.alasanBatal = "Dibatalkan oleh admin"; batalkanTransaksiPending(id); }
  if (status === "Dikonfirmasi" && p.status !== "Dikonfirmasi") kirimNotif(p.email, "Pesanan dikonfirmasi", "Pesanan " + id + " sudah dikonfirmasi. Bayar sebelum " + waktuLengkap(patch.batasBayar || p.batasBayar) + ".", "#bayar/" + id);
  if (status === "Dibatalkan") kirimNotif(p.email, "Pesanan dibatalkan", "Pesanan " + id + " dibatalkan oleh admin.", "#pesanan");
  ubahPesanan(id, patch);
  return { ok: true };
}
function batalkanPesananPelanggan(id) {
  periksaKedaluwarsa();
  const p = DB.pesanan.find((x) => x.id === id);
  if (!p || p.email !== userAktif().email) return { ok: false, pesan: "Pesanan tidak ditemukan." };
  if (!["Menunggu Konfirmasi", "Dikonfirmasi"].includes(p.status) || statusBayar(p) === "Lunas") return { ok: false, pesan: "Pesanan ini sudah tidak bisa dibatalkan." };
  batalkanTransaksiPending(id);
  ubahPesanan(id, { status: "Dibatalkan", alasanBatal: "Dibatalkan oleh pelanggan" });
  kirimNotif("admin", "Pesanan dibatalkan pelanggan", p.pelanggan + " membatalkan " + id + ". Tanggal " + tglIndo(p.tanggal) + " kembali tersedia.", "#admin/pesanan");
  return { ok: true };
}

function buatTransaksi(id, kunci, hp) {
  periksaKedaluwarsa();
  const p = DB.pesanan.find((x) => x.id === id && x.email === userAktif().email), m = METODE[kunci];
  if (!p || !m) return { ok: false, pesan: "Data pembayaran tidak valid." };
  if (p.status !== "Dikonfirmasi") return { ok: false, pesan: "Pesanan ini belum bisa dibayar." };
  if (statusBayar(p) === "Lunas") return { ok: false, pesan: "Pesanan ini sudah lunas." };
  if (m.jenis === "ewallet" && !/^08\d{8,11}$/.test(hp || "")) return { ok: false, pesan: "Nomor HP tidak valid. Contoh: 081234567890." };
  batalkanTransaksiPending(id);
  const sekarang = Date.now(), durasi = m.jenis === "va" ? m.jam * 3600000 : m.menit * 60000;
  const t = { id: idTransaksi(), pesananId: id, metode: kunci, nominal: hargaPesanan(p), status: "pending", dibuat: sekarang, kedaluwarsa: Math.min(sekarang + durasi, p.batasBayar || sekarang + durasi), dibayar: null, kode: "" };
  t.kode = m.jenis === "va" ? kodeVA(m) : m.jenis === "qris" ? "GRAFERSTYLE.QRIS|" + t.id + "|" + p.id + "|" + t.nominal : hp;
  DB.transaksi.push(t);
  return { ok: true, trx: t };
}

function gatewayWebhook(trxId, hasil) {
  const t = DB.transaksi.find((x) => x.id === trxId);
  if (!t || t.status !== "pending") return null;
  if (hasil === "settlement") {
    t.status = "settlement"; t.dibayar = Date.now();
    const p = DB.pesanan.find((x) => x.id === t.pesananId);
    if (p && p.status === "Dikonfirmasi") ubahPesanan(p.id, { status: "Pembayaran Terverifikasi" });
    if (p) {
      kirimNotif(p.email, "Pembayaran berhasil", "Pembayaran " + rupiah(t.nominal) + " untuk pesanan " + p.id + " lewat " + METODE[t.metode].nama + " sudah diterima.", "#invoice/" + p.id);
      kirimNotif("admin", "Pembayaran masuk", p.pelanggan + " membayar " + rupiah(t.nominal) + " (" + METODE[t.metode].nama + ") untuk " + p.id + ".", "#admin/pesanan");
    }
  } else t.status = hasil === "deny" ? "deny" : "expire";
  return t;
}

(function siapkanDataPembayaran() {
  const urut = ["qris", "va_bca", "gopay", "va_bni", "dana", "va_mandiri", "ovo", "va_bri"];
  DB.pesanan.forEach((p, i) => {
    if (p.status === "Dikonfirmasi" && !p.batasBayar) p.batasBayar = Date.now() + BATAS_BAYAR_JAM * 3600000;
    if (STATUS_BUTUH_LUNAS.includes(p.status) && !transaksiLunas(p)) {
      const kunci = urut[i % urut.length], m = METODE[kunci], bayar = new Date(p.tanggal + "T10:00:00").getTime() - 5 * 86400000;
      DB.transaksi.push({ id: "TRX-" + p.tanggal.replace(/-/g, "") + "-" + nomorAcak(6), pesananId: p.id, metode: kunci, nominal: hargaPesanan(p), status: "settlement", dibuat: bayar - 600000, kedaluwarsa: bayar + 86400000, dibayar: bayar, kode: m.jenis === "va" ? kodeVA(m) : m.jenis === "qris" ? "GRAFERSTYLE.QRIS|" + p.id : "08123456789" });
    }
  });
})();
