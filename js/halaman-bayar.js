let timerBayar = null;
const hentikanTimerBayar = () => { if (timerBayar) { clearInterval(timerBayar); timerBayar = null; } };
const hitungMundur = (ms) => { const d = Math.max(0, Math.floor(ms / 1000)); return dua(Math.floor(d / 3600)) + ":" + dua(Math.floor((d % 3600) / 60)) + ":" + dua(d % 60); };
const grupVA = (k) => k.replace(/(\d{4})(?=\d)/g, "$1 ");
const maskHP = (h) => h.slice(0, 4) + "****" + h.slice(-3);
function salin(teks) {
  const ok = () => tampilToast("Disalin: " + teks);
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(teks).then(ok, ok);
  else { const a = document.createElement("textarea"); a.value = teks; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); } catch (e) { } a.remove(); ok(); }
}
const svgQR = (isi) => { const q = qrcode(0, "M"); q.addData(isi); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); };
const IKON_CENTANG = '<svg viewBox="0 0 52 52" width="72" height="72" aria-hidden="true"><circle class="gs-centang-lingkar" cx="26" cy="26" r="24" fill="none" stroke="#477C68" stroke-width="3"/><path class="gs-centang-garis" d="M15 27l8 8 15-17" fill="none" stroke="#477C68" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function halamanBayar(bagian) {
  const id = bagian[1];
  let kunci = "", hp = "", memproses = false, tanda = "";
  const ambilPesanan = () => semuaPesanan().find((x) => x.id === id && x.email === userAktif().email);
  const trxAkhir = () => transaksiPesanan(id)[0];
  const tandaTangan = () => { const p = ambilPesanan(), t = trxAkhir(); return p ? p.status + "|" + statusBayar(p) + "|" + (t ? t.id + t.status : "") : "-"; };
  const kembali = '<a href="#pesanan" class="btn btn-outline-primary">Kembali ke Pesanan Saya</a>';
  const kartuInfo = (judul, isi, aksi) => `<div class="gs-card p-4 text-center"><h2 class="h5 font-display fw-semibold">${judul}</h2><p class="text-body-secondary">${isi}</p>${aksi || kembali}</div>`;

  const ringkasan = (p) => `<div class="gs-card p-4"><div class="eyebrow mb-2">Ringkasan Pesanan</div><h2 class="h5 font-display fw-semibold mb-1">${namaPaket(p)}</h2><div class="small text-body-secondary mb-3">${p.id} &middot; ${p.tanggal} &middot; ${aman(p.lokasi)}</div><div class="gs-garis"></div><div class="d-flex justify-content-between align-items-center mt-3"><span class="small text-body-secondary">Total tagihan</span><strong class="h4 font-display mb-0 fw-normal" id="totalTagihan">${rupiah(hargaPesanan(p))}</strong></div>${p.batasBayar ? `<div class="small text-body-secondary mt-2">Batas pembayaran pesanan: ${waktuLengkap(p.batasBayar)}</div>` : ""}<div class="gs-garis mt-3"></div><div class="small mt-3"><div class="text-body-secondary">Penerima pembayaran</div><div class="fw-semibold">GraferStyle</div><div class="text-body-secondary">a.n. ${aman(namaPenerima())}</div></div><a class="btn btn-outline-primary btn-sm w-100 mt-3" href="${linkWABantuan(p)}" target="_blank" rel="noreferrer">Hubungi Admin via WhatsApp</a><div class="small text-body-secondary text-center mt-1">${KONTAK.whatsapp}</div></div>`;

  function pilihMetode(p, t) {
    const banner = t && t.status === "expire" ? `Waktu pembayaran dengan ${METODE[t.metode].nama} sudah habis. Silakan buat pembayaran baru.` : t && t.status === "deny" ? `Pembayaran lewat ${METODE[t.metode].nama} ditolak. Silakan coba lagi atau pilih metode lain.` : "";
    const grup = ["QRIS", "Virtual Account", "E-Wallet"].map((g) => `<fieldset class="mb-3"><legend class="eyebrow mb-2">${g}</legend><div class="d-grid gap-2">${Object.entries(METODE).filter(([, m]) => m.grup === g).map(([k, m]) => `<label class="gs-metode"><input type="radio" name="metode" value="${k}" ${k === kunci ? "checked" : ""}><span class="gs-metode-kotak"><strong>${m.nama}</strong><small>${m.ket || (m.jenis === "va" ? "Transfer lewat ATM atau m-banking " + m.bank : "Konfirmasi di aplikasi " + m.nama)}</small></span></label>`).join("")}</div></fieldset>`).join("");
    return `${banner ? `<div class="alert alert-warning py-2 small" role="alert">${banner}</div>` : ""}<div class="gs-card p-4"><h2 class="h5 font-display fw-semibold mb-3">Pilih Metode Pembayaran</h2>${grup}<div id="areaHP" class="mb-3" ${METODE[kunci] && METODE[kunci].jenis === "ewallet" ? "" : "hidden"}><label class="form-label small" for="hpEwallet">Nomor HP yang terdaftar di aplikasi e-wallet</label><input id="hpEwallet" class="form-control" inputmode="numeric" maxlength="13" placeholder="081234567890" value="${aman(hp)}"></div><div id="notifBayar"></div><button class="btn btn-primary w-100" id="btnBayar" ${kunci ? "" : "disabled"}>Bayar ${rupiah(hargaPesanan(p))}</button></div>`;
  }

  function instruksi(p, t) {
    const m = METODE[t.metode], nominal = rupiah(t.nominal);
    let inti = "", langkah = [];
    if (m.jenis === "va") {
      inti = `<div class="small text-body-secondary">Nomor Virtual Account ${m.bank}</div><div class="gs-va" id="vaNomor">${grupVA(t.kode)}</div><button class="btn btn-outline-primary btn-sm" data-salin="${t.kode}">Salin nomor VA</button>`;
      langkah = [`Buka aplikasi m-banking ${m.bank} atau ATM terdekat.`, "Pilih menu Transfer, lalu Virtual Account, dan masukkan nomor VA di atas.", `Pastikan nominal ${nominal} sesuai, lalu konfirmasi pembayaran.`, "Status pesanan berubah otomatis setelah pembayaran diterima."];
    } else if (m.jenis === "qris") {
      inti = `<div class="gs-qr" id="qrBox" role="img" aria-label="Kode QR pembayaran">${svgQR(t.kode)}</div><div class="small text-body-secondary mt-2">Scan dengan aplikasi apa pun yang mendukung QRIS</div>`;
      langkah = ["Buka aplikasi e-wallet atau m-banking yang mendukung QRIS.", "Pilih Scan atau Bayar, lalu arahkan kamera ke kode QR.", `Periksa nominal ${nominal} dan nama merchant GraferStyle, lalu konfirmasi.`];
    } else {
      inti = `<div class="small text-body-secondary">Tagihan dikirim ke aplikasi ${m.nama}</div><div class="gs-va" id="hpTujuan">${maskHP(t.kode)}</div>`;
      langkah = [`Buka aplikasi ${m.nama} di nomor ${maskHP(t.kode)}.`, "Buka notifikasi atau menu tagihan dari GraferStyle.", `Periksa nominal ${nominal}, lalu masukkan PIN untuk konfirmasi.`];
    }
    return `<div class="gs-card p-4"><div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3"><div><div class="eyebrow">${m.nama}</div><h2 class="h5 font-display fw-semibold mb-0">Selesaikan Pembayaran</h2></div><div class="text-center"><div class="small text-body-secondary">Sisa waktu</div><div class="gs-hitung" id="hitung">${hitungMundur(t.kedaluwarsa - Date.now())}</div></div></div>` +
      `<div class="gs-bayar-inti text-center">${inti}</div><div class="d-flex justify-content-between align-items-center mt-3"><span class="small text-body-secondary">Jumlah yang dibayar</span><span><strong id="nominalBayar">${nominal}</strong> <button class="btn btn-link btn-sm p-2" data-salin="${t.nominal}">Salin</button></span></div><div class="d-flex justify-content-between small text-body-secondary"><span>ID Transaksi</span><span id="idTrx">${t.id}</span></div><div class="d-flex justify-content-between small text-body-secondary"><span>Nama penerima</span><span class="text-body">GraferStyle (a.n. ${aman(namaPenerima())})</span></div>${m.jenis === "va" ? `<div class="d-flex justify-content-between small text-body-secondary"><span>Bank</span><span class="text-body">${m.bank}</span></div>` : ""}${m.jenis === "ewallet" ? `<div class="d-flex justify-content-between small text-body-secondary"><span>Nomor ${m.nama} penerima</span><span class="text-body">${KONTAK.whatsapp}</span></div>` : ""}<div class="d-flex justify-content-between small text-body-secondary"><span>WhatsApp admin</span><span class="text-body">${KONTAK.whatsapp}</span></div>` +
      `<ol class="small mt-3 gs-langkah">${langkah.map((l) => `<li>${aman(l)}</li>`).join("")}</ol><button class="btn btn-outline-primary btn-sm" data-ganti="1">Ganti Metode Pembayaran</button></div>`;
  }

  function simulator() {
    return `<div class="gs-simulator mt-3"><div class="d-flex align-items-center gap-2 mb-3"><span class="badge gs-st-menunggu">MODE SIMULASI</span><strong class="small">Simulator Gateway Pembayaran</strong></div><div id="simAksi" class="d-flex flex-wrap gap-2">${memproses ? '<div class="d-flex align-items-center gap-2"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="small" id="statusProses">Memproses pembayaran...</span></div>' : '<button class="btn btn-primary btn-sm" data-sim="berhasil">Bayar Sekarang (Simulasi)</button><button class="btn btn-outline-primary btn-sm" data-sim="gagal">Simulasikan Gagal</button><button class="btn btn-outline-primary btn-sm" data-sim="kedaluwarsa">Simulasikan Kedaluwarsa</button><button class="btn btn-outline-primary btn-sm" data-sim="batas">Simulasikan Batas Waktu Pesanan Habis</button>'}</div></div>`;
  }

  function sukses(p, t) {
    return `<div class="gs-card p-4 text-center" id="suksesBayar">${IKON_CENTANG}<h2 class="h4 font-display fw-semibold mt-3">Pembayaran Berhasil</h2><p class="text-body-secondary">Pembayaran terverifikasi otomatis. Admin akan menjadwalkan sesimu sesuai jadwal yang sudah dikonfirmasi.</p><div class="gs-rincian small"><div><span>ID Transaksi</span><strong>${t.id}</strong></div><div><span>Metode</span><strong>${METODE[t.metode].nama}</strong></div><div><span>Jumlah</span><strong>${rupiah(t.nominal)}</strong></div><div><span>Waktu bayar</span><strong>${waktuLengkap(t.dibayar)}</strong></div><div><span>Status pesanan</span><strong>${p.status}</strong></div></div><div class="d-flex gap-2 justify-content-center flex-wrap mt-4"><a class="btn btn-primary" href="#invoice/${p.id}">Lihat Invoice</a>${kembali}</div></div>`;
  }

  function gambar() {
    periksaKedaluwarsa();
    const p = ambilPesanan(), t = trxAkhir();
    if (!p) { tampilkan(APP, kartuInfo("Pesanan tidak ditemukan", "Pesanan ini tidak ada atau bukan milik akunmu.")); return; }
    let isi, tampilSim = false;
    if (statusBayar(p) === "Lunas") isi = sukses(p, transaksiLunas(p));
    else if (p.status === "Dibatalkan") isi = kartuInfo("Pesanan dibatalkan", aman(p.alasanBatal || "Pesanan ini sudah dibatalkan.") + " Kamu bisa membuat booking baru kapan saja.", '<a href="#booking" class="btn btn-primary">Booking Baru</a>');
    else if (p.status !== "Dikonfirmasi") isi = kartuInfo("Belum bisa dibayar", "Pembayaran dibuka setelah admin mengonfirmasi jadwal sesimu.");
    else if (t && t.status === "pending") { isi = instruksi(p, t); tampilSim = true; }
    else isi = pilihMetode(p, t);
    tanda = tandaTangan();
    tampilkan(APP, `<div class="mb-4"><a href="#pesanan" class="gs-tautan small">&larr; Pesanan Saya</a><h1 class="font-display fw-semibold mb-0 mt-1">Pembayaran</h1></div><div class="row g-3 align-items-start"><div class="col-lg-5 order-2 order-lg-1">${ringkasan(p)}${tampilSim ? simulator() : ""}</div><div class="col-lg-7 order-1 order-lg-2">${isi}</div></div>`);
    window.scrollTo(0, 0);
    periksaAnimasi();
    pasang(p, t);
  }

  function pasang(p, t) {
    document.querySelectorAll('input[name="metode"]').forEach((r) => {
      r.onchange = () => {
        kunci = r.value;
        ambil("areaHP").hidden = METODE[kunci].jenis !== "ewallet";
        ambil("btnBayar").disabled = false;
        ambil("notifBayar").innerHTML = "";
      };
    });
    const inputHP = ambil("hpEwallet");
    if (inputHP) inputHP.oninput = () => { hp = inputHP.value.replace(/\D/g, ""); inputHP.value = hp; };
    const bayar = ambil("btnBayar");
    if (bayar) bayar.onclick = () => {
      const r = buatTransaksi(id, kunci, hp);
      if (!r.ok) { ambil("notifBayar").innerHTML = `<div class="alert alert-danger py-2 small" role="alert">${aman(r.pesan)}</div>`; return; }
      memproses = false; gambar();
    };
    document.querySelectorAll("[data-salin]").forEach((b) => { b.onclick = () => salin(b.dataset.salin); });
    document.querySelectorAll("[data-ganti]").forEach((b) => { b.onclick = () => { batalkanTransaksiPending(id); kunci = ""; gambar(); }; });
    document.querySelectorAll("[data-sim]").forEach((b) => {
      b.onclick = () => {
        const aksi = b.dataset.sim;
        if (aksi === "kedaluwarsa") { gatewayWebhook(t.id, "expire"); gambar(); return; }
        if (aksi === "batas") { ubahPesanan(id, { batasBayar: Date.now() - 1 }); gambar(); return; }
        memproses = true;
        ambil("simAksi").innerHTML = '<div class="d-flex align-items-center gap-2"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="small" id="statusProses">Memproses pembayaran...</span></div>';
        setTimeout(() => { gatewayWebhook(t.id, aksi === "berhasil" ? "settlement" : "deny"); memproses = false; }, aksi === "berhasil" ? 1800 : 1000);
      };
    });
  }

  gambar();
  hentikanTimerBayar();
  timerBayar = setInterval(() => {
    if (!location.hash.startsWith("#bayar")) return hentikanTimerBayar();
    periksaKedaluwarsa();
    const sebelum = tanda, baru = tandaTangan();
    if (baru !== sebelum) {
      const p = ambilPesanan();
      gambar();
      if (p && statusBayar(p) === "Lunas") tampilToast("Pembayaran berhasil diterima.");
      return;
    }
    const t = trxAkhir(), h = ambil("hitung");
    if (h && t && t.status === "pending") h.textContent = hitungMundur(t.kedaluwarsa - Date.now());
  }, 500);
}

function halamanInvoice(bagian) {
  const u = userAktif();
  periksaKedaluwarsa();
  const p = semuaPesanan().find((x) => x.id === bagian[1] && (u.role === "admin" || x.email === u.email));
  const kosong = (j, t) => tampilkan(APP, `<div class="gs-card p-4 text-center"><h1 class="h5 font-display fw-semibold">${j}</h1><p class="text-body-secondary">${t}</p><a class="btn btn-primary" href="${u.role === "admin" ? "#admin/pesanan" : "#pesanan"}">Kembali</a></div>`);
  if (!p) return kosong("Invoice tidak ditemukan", "Pesanan ini tidak ada atau bukan milik akunmu.");
  const t = transaksiLunas(p);
  if (!t) return kosong("Invoice belum tersedia", "Invoice terbit otomatis setelah pembayaran lunas.");
  const a = semuaAkun().find((x) => x.email === p.email) || {}, tgl = new Date(t.dibayar), noInv = "INV/" + tgl.getFullYear() + dua(tgl.getMonth() + 1) + dua(tgl.getDate()) + "/" + p.id;
  tampilkan(APP, `<div class="d-flex justify-content-between align-items-center mb-3 gs-tanpa-cetak"><a href="${u.role === "admin" ? "#admin/pesanan" : "#pesanan"}" class="gs-tautan small">&larr; Kembali</a><button class="btn btn-primary btn-sm" id="cetakInvoice">Cetak / Simpan PDF</button></div>` +
    `<div class="gs-invoice gs-card p-4"><div class="d-flex justify-content-between align-items-start flex-wrap gap-3"><div class="d-flex align-items-center gap-2"><span class="gs-logo-kotak"><img src="img/logo.png" alt="" height="22"></span><div><div class="h5 font-display fw-semibold mb-0">GraferStyle</div><div class="small text-body-secondary">Layanan Fotografi &amp; Videografi</div></div></div><div class="text-center"><div class="eyebrow">Invoice</div><div class="fw-semibold">${noInv}</div><span class="gs-stempel">LUNAS</span></div></div>` +
    `<div class="gs-garis mt-4 mb-3"></div><div class="row row-cols-1 row-cols-md-2 g-3 small"><div><div class="text-body-secondary">Ditagihkan kepada</div><strong>${aman(a.nama || p.pelanggan)}</strong><div>${aman(p.email)}</div>${a.wa ? `<div>${aman(a.wa)}</div>` : ""}</div><div><div class="text-body-secondary">Tanggal pembayaran</div><strong>${waktuLengkap(t.dibayar)}</strong><div class="text-body-secondary mt-2">Kode pesanan</div><strong>${p.id}</strong></div></div>` +
    `<table class="table mt-4"><thead><tr><th>Layanan</th><th>Tanggal sesi</th><th>Lokasi</th><th class="gs-kanan">Harga</th></tr></thead><tbody><tr><td>${namaPaket(p)}</td><td>${p.tanggal}</td><td>${aman(p.lokasi)}</td><td class="gs-kanan">${rupiah(t.nominal)}</td></tr></tbody><tfoot><tr><td colspan="3" class="fw-semibold">Total dibayar</td><td class="gs-kanan fw-semibold">${rupiah(t.nominal)}</td></tr></tfoot></table>` +
    `<div class="small text-body-secondary"><div>Metode pembayaran: <strong>${METODE[t.metode].nama}</strong></div><div>ID Transaksi: <strong>${t.id}</strong></div></div><p class="small text-body-secondary mt-4 mb-0">Dokumen ini dibuat otomatis oleh sistem GraferStyle dan sah tanpa tanda tangan. Pembayaran pada website ini adalah simulasi (tanpa uang sungguhan).</p></div>`);
  ambil("cetakInvoice").onclick = () => window.print();
}
