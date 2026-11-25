const IKON_MATA = '<svg class="gs-mata" viewBox="0 0 24 24"><g class="mata-buka"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></g><g class="mata-tutup"><path d="M3 9.5c2.2 3.7 5.4 5.7 9 5.7s6.8-2 9-5.7"/><path d="M6.4 13.3 4.6 15.7M12 15.2v2.8M17.6 13.3l1.8 2.4"/></g></svg>';

function pasangMataPassword() {
  document.querySelectorAll("[data-eye]").forEach((b) => {
    b.onclick = () => {
      const i = ambil(b.dataset.eye), tampak = i.type === "password";
      i.type = tampak ? "text" : "password";
      b.classList.toggle("terbuka", tampak);
      b.setAttribute("aria-label", tampak ? "Sembunyikan password" : "Tampilkan password");
      b.classList.remove("berkedip");
      void b.offsetWidth;
      b.classList.add("berkedip");
    };
  });
}

function halamanLogin() {
  tampilkan(APP, `
  <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 gs-art gs-art-foto" style="background-image:url(img/login.jpeg)"><a href="#beranda" class="text-white text-decoration-none small">&larr; Kembali ke beranda</a><div><div class="eyebrow mb-2" style="color:#A8C8B5">GraferStyle</div><h2 class="font-display fw-semibold display-6">Satu akun, semua pesanan sesi fotomu.</h2></div></div>
  <div class="col-lg-6 gs-login-r d-flex align-items-center justify-content-center p-4"><div style="width:100%;max-width:420px">
    <div class="text-center mb-4"><div class="font-display fs-4">GraferStyle</div><div class="small" style="color:#A8C8B5">Selamat Datang Kembali</div></div>
    <h1 class="font-display fw-semibold text-center mb-4" style="font-size:1.9rem">Masuk untuk Melanjutkan</h1>
    <div id="notif"></div>
    <form id="form" novalidate>
      <div class="mb-3"><label class="form-label" for="email">Email</label><div class="gs-field"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><input id="email" type="email" class="form-control" placeholder="Masukkan email" autocomplete="username"></div></div>
      <div class="mb-3"><label class="form-label" for="pw">Password</label><div class="gs-field"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><input id="pw" type="password" class="form-control gs-input-mata" placeholder="Masukkan password" autocomplete="current-password"><button type="button" class="gs-eye gs-eye-ikon" data-eye="pw" aria-label="Tampilkan password">${IKON_MATA}</button></div></div>
      <button class="gs-btn-sage mt-4">Masuk <span>&#8599;</span></button>
    </form>
    <p class="small text-center mt-3 mb-0 opacity-75">Belum punya akun? <a href="#daftar" style="color:#A8C8B5">Daftar</a></p>
  </div></div>`);
  pasangMataPassword();
  ambil("form").onsubmit = (e) => {
    e.preventDefault();
    const u = masuk(ambil("email").value, ambil("pw").value);
    if (!u) { ambil("notif").innerHTML = `<div class="alert alert-danger py-2 small">Email atau password salah.</div>`; return; }
    const tujuan = u.role === "admin" ? "admin" : (nextRute || "beranda");
    nextRute = null;
    pindah(tujuan);
  };
}

function halamanDaftar() {
  tampilkan(APP, `
  <div class="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 gs-art gs-art-foto" style="background-image:url(img/daftar.jpeg)"><a href="#beranda" class="text-white text-decoration-none small">&larr; Kembali ke beranda</a><div><div class="eyebrow mb-2" style="color:#A8C8B5">GraferStyle</div><h2 class="font-display fw-semibold fs-2">Buat akun, lalu pesan sesi fotomu.</h2></div></div>
  <div class="col-lg-7 gs-login-r d-flex align-items-center justify-content-center p-4"><div style="width:100%;max-width:440px">
    <h1 class="font-display fw-semibold text-center mb-2" style="font-size:1.9rem">Buat Akun Pelanggan</h1>
    <p class="text-center small opacity-75 mb-4">Lengkapi biodata lebih lanjut nanti di halaman Profil.</p>
    <div id="notif"></div>
    <form id="form" novalidate class="row g-2">
      <div class="col-12 mb-3"><label class="form-label" for="nama">Nama Lengkap</label><div class="gs-field"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/></svg><input id="nama" type="text" class="form-control" placeholder="Masukkan nama lengkap" autocomplete="name"></div></div>
      <div class="col-md-6 mb-3"><label class="form-label" for="email">Email</label><div class="gs-field"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><input id="email" type="email" class="form-control" placeholder="nama@gmail.com" autocomplete="email"></div></div>
      <div class="col-md-6 mb-3"><label class="form-label" for="wa">Nomor WhatsApp</label><div class="gs-field"><svg viewBox="0 0 24 24"><path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg><input id="wa" type="tel" class="form-control" placeholder="08xxxxxxxxxx" autocomplete="tel"></div></div>
      <div class="col-md-6 mb-3"><label class="form-label" for="pw">Password</label><div class="gs-field"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><input id="pw" type="password" class="form-control gs-input-mata" placeholder="Minimal 6 karakter" autocomplete="new-password"><button type="button" class="gs-eye gs-eye-ikon" data-eye="pw" aria-label="Tampilkan password">${IKON_MATA}</button></div></div>
      <div class="col-md-6 mb-3"><label class="form-label" for="pw2">Konfirmasi Password</label><div class="gs-field"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><input id="pw2" type="password" class="form-control gs-input-mata" placeholder="Ulangi password" autocomplete="new-password"><button type="button" class="gs-eye gs-eye-ikon" data-eye="pw2" aria-label="Tampilkan password">${IKON_MATA}</button></div></div>
      <div class="col-12"><button class="gs-btn-sage mt-2">Daftar <span>&#8599;</span></button></div>
    </form>
    <p class="small text-center mt-3 mb-0 opacity-75">Sudah punya akun? <a href="#login" style="color:#A8C8B5">Masuk</a></p>
  </div></div>`);
  pasangMataPassword();
  ambil("form").onsubmit = (e) => {
    e.preventDefault();
    const nama = ambil("nama").value.trim(), mail = ambil("email").value.trim().toLowerCase(), wa = ambil("wa").value.trim(), pw = ambil("pw").value;
    let msg = "";
    if (!nama || !mail.includes("@") || !/^[0-9+]{9,15}$/.test(wa)) msg = "Isi nama, email yang valid, dan nomor WhatsApp yang benar.";
    else if (pw.length < 6) msg = "Password minimal 6 karakter.";
    else if (pw !== ambil("pw2").value) msg = "Konfirmasi password tidak sama.";
    else if (semuaAkun().some((a) => a.email === mail)) msg = "Email sudah terdaftar.";
    if (msg) { ambil("notif").innerHTML = `<div class="alert alert-danger py-2 small">${msg}</div>`; return; }
    daftar(nama, mail, wa, pw);
    pindah("beranda");
  };
}

function halamanBooking(bagian) {
  tampilkan(APP, `<div class="eyebrow mb-1">Booking sesi</div><h1 class="font-display fw-semibold mb-4">Pesan sesi foto</h1><div id="notif"></div>
<form id="form" class="row g-3" novalidate><div class="col-md-6"><label class="form-label small">Layanan</label><select id="kategori" class="form-select"></select></div><div class="col-md-6"><label class="form-label small">Paket</label><select id="paket" class="form-select"></select></div><div class="col-12"><div id="ringkas" class="gs-card p-3 small"></div></div>
<div class="col-md-6"><label class="form-label small">Tanggal sesi</label><input id="tanggal" type="date" class="form-control" aria-describedby="infoTanggal"><div id="infoTanggal" class="form-text" aria-live="polite"></div></div><div class="col-md-6"><label class="form-label small">Lokasi</label><input id="lokasi" class="form-control"></div><div class="col-12"><label class="form-label small">Konsep foto</label><input id="konsep" class="form-control"></div><div class="col-12"><label class="form-label small">Properti (opsional)</label><input id="properti" class="form-control"></div><div class="col-12"><button class="btn btn-primary px-4">Kirim Booking</button></div></form>`);
  const kategori = ambil("kategori"), paket = ambil("paket");
  kategori.innerHTML = Object.entries(LAYANAN).map(([k, l]) => `<option value="${k}">${l.nama}</option>`).join("");
  if (LAYANAN[bagian[1]]) kategori.value = bagian[1];
  function isiRingkasan() {
    const p = LAYANAN[kategori.value].paket.find((x) => x.id === paket.value);
    ambil("ringkas").innerHTML = `<strong>${aman(p.nama)}</strong> &middot; ${p.fasilitas.map(aman).join(" &middot; ")}`;
  }
  function isiPaket(pilih) {
    paket.innerHTML = LAYANAN[kategori.value].paket.map((p) => `<option value="${p.id}">${aman(p.nama)} - ${rupiah(p.harga)}</option>`).join("");
    if (pilih) paket.value = pilih;
    isiRingkasan();
  }
  kategori.onchange = () => isiPaket();
  paket.onchange = isiRingkasan;
  isiPaket(bagian[2]);
  const tgl = ambil("tanggal"), info = ambil("infoTanggal");
  tgl.min = tanggalGeser(BOOKING_MIN_HARI); tgl.max = tanggalGeser(BOOKING_MAKS_HARI);
  const infoAwal = "Booking minimal 1 hari sebelum sesi. Satu tanggal melayani " + MAKS_SESI_PER_HARI + " sesi.";
  function tampilInfoTanggal() {
    tgl.classList.remove("is-invalid", "is-valid");
    if (!tgl.value) { info.textContent = infoAwal; return; }
    const c = periksaTanggalBooking(tgl.value);
    if (c.ok) { tgl.classList.add("is-valid"); info.innerHTML = '<span class="text-success">Tanggal ' + tglIndo(tgl.value) + " tersedia.</span>"; return; }
    tgl.classList.add("is-invalid");
    const saran = c.penuh ? tanggalKosongTerdekat(tgl.value) : [];
    info.innerHTML = '<span class="text-danger">' + c.pesan + "</span>" + (saran.length ? '<div class="mt-1">Tanggal kosong terdekat: ' + saran.map((s) => '<button type="button" class="btn btn-outline-primary btn-sm me-1" data-tgl="' + s + '">' + tglIndo(s) + "</button>").join("") + "</div>" : "");
    info.querySelectorAll("[data-tgl]").forEach((b) => { b.onclick = () => { tgl.value = b.dataset.tgl; tampilInfoTanggal(); }; });
  }
  tgl.oninput = tgl.onchange = tampilInfoTanggal;
  tampilInfoTanggal();
  ambil("form").onsubmit = (e) => {
    e.preventDefault();
    const tanggal = ambil("tanggal").value, lokasi = ambil("lokasi").value.trim(), konsep = ambil("konsep").value.trim();
    if (!tanggal || !lokasi || !konsep) { ambil("notif").innerHTML = `<div class="alert alert-danger py-2 small">Tanggal, lokasi, dan konsep wajib diisi.</div>`; return; }
    const cek = periksaTanggalBooking(tanggal);
    if (!cek.ok) { ambil("notif").innerHTML = '<div class="alert alert-danger py-2 small" role="alert">' + cek.pesan + "</div>"; tampilInfoTanggal(); return; }
    const baru = tambahPesanan({ kategori: kategori.value, paket: paket.value, tanggal, lokasi, konsep, properti: ambil("properti").value.trim() || "-" });
    if (!baru) { ambil("notif").innerHTML = '<div class="alert alert-danger py-2 small" role="alert">Booking gagal. Periksa kembali tanggal sesi.</div>'; return; }
    pindah("pesanan");
  };
}

function halamanPesanan() {
  const langkah = ["Booking", "Konfirmasi", "Bayar", "Sesi", "Hasil"];
  const posisi = { "Menunggu Konfirmasi": 0, Dikonfirmasi: 1, "Pembayaran Terverifikasi": 2, "Sesi Selesai": 3, "Hasil Dikirim": 4, Selesai: 4 };
  function tampil() {
    periksaKedaluwarsa();
    const u = userAktif();
    const saya = semuaPesanan().filter((p) => p.email === u.email);
    tampilkan(APP, `<div class="d-flex justify-content-between align-items-end mb-4"><div><div class="eyebrow mb-1">${aman(u.nama)}</div><h1 class="font-display fw-semibold mb-0">Pesanan Saya</h1></div><a href="#booking" class="btn btn-primary">Booking Baru</a></div>` +
      (saya.length ? "" : `<div class="gs-card p-4 text-center text-body-secondary">Belum ada pesanan. Mulai dengan booking sesi pertamamu.</div>`) +
      `<div class="d-grid gap-3">` + saya.map((p) => {
        const n = posisi[p.status], bayar = statusBayar(p), batal = p.status === "Dibatalkan";
        const tautan = /^https?:\/\//.test(p.link) ? p.link : "";
        const bisaBatal = ["Menunggu Konfirmasi", "Dikonfirmasi"].includes(p.status) && bayar !== "Lunas";
        const bisaBayar = p.status === "Dikonfirmasi" && bayar !== "Lunas";
        const info = p.status === "Menunggu Konfirmasi" ? "Menunggu admin mengonfirmasi jadwal. Pembayaran dibuka setelah pesanan dikonfirmasi."
          : bisaBayar ? "Tagihan " + rupiah(hargaPesanan(p)) + (p.batasBayar ? ", bayar sebelum " + waktuLengkap(p.batasBayar) : "") + "." : "";
        return `<div class="gs-card p-3"><div class="d-flex justify-content-between align-items-start"><div><div class="eyebrow">${p.id}</div><h2 class="h5 font-display fw-semibold mb-1">${namaPaket(p)}</h2><div class="small text-body-secondary">${p.tanggal} &middot; ${aman(p.lokasi)} &middot; Konsep: ${aman(p.konsep)}</div></div>${badge(p.status)}</div>` +
          (batal ? `<div class="alert alert-secondary py-2 small mt-3 mb-0">${aman(p.alasanBatal || "Pesanan dibatalkan.")}</div>`
            : `<div class="mt-3"><div class="progress" style="height:4px"><div class="progress-bar" style="width:0;background:#477C68" data-w="${n * 25}"></div></div><div class="gs-steps mt-2">${langkah.map((l, i) => `<span class="${i <= n ? "on" : ""}">${l}</span>`).join("")}</div></div>`) +
          (info ? `<div class="small text-body-secondary mt-3" data-info="${p.id}">${info}</div>` : "") +
          `<div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2"><span class="small">Pembayaran: <strong data-bayar="${p.id}">${bayar}</strong>${bayar === "Lunas" ? " &middot; " + metodeBayar(p) : ""}</span><div class="d-flex gap-2 flex-wrap">` +
          (bisaBayar ? `<a class="btn btn-primary btn-sm" href="#bayar/${p.id}">${bayar === "Menunggu Pembayaran" ? "Lanjutkan Pembayaran" : "Bayar Sekarang"}</a>` : "") +
          (bayar === "Lunas" ? `<a class="btn btn-outline-primary btn-sm" href="#invoice/${p.id}">Lihat Invoice</a>` : "") +
          (tautan ? `<a class="btn btn-primary btn-sm" href="${aman(tautan)}" target="_blank" rel="noreferrer">Buka Hasil Foto</a>` : "") +
          (bisaBatal ? `<button class="btn btn-outline-danger btn-sm" data-batalkan="${p.id}">Batalkan Pesanan</button>` : "") + `</div></div></div>`;
      }).join("") + `</div>`);
    document.querySelectorAll("[data-batalkan]").forEach((b) => {
      b.onclick = () => konfirmasi({ judul: "Batalkan pesanan?", isi: "Pesanan <strong>" + aman(b.dataset.batalkan) + "</strong> akan dibatalkan dan jadwalnya dilepas. Tindakan ini tidak bisa diurungkan.", ok: "Ya, Batalkan" }, () => {
        const r = batalkanPesananPelanggan(b.dataset.batalkan);
        tampil();
        tampilToast(r.ok ? "Pesanan dibatalkan." : r.pesan);
      });
    });
  }
  tampil();
}

function halamanProfil() {
  const alert_ = (t, k) => `<div class="alert alert-${k} py-2 small">${t}</div>`;
  const f = (id, label, val, tipe = "text", ekstra = "") => `<div class="col-md-6"><label class="form-label small" for="${id}">${label}</label><input id="${id}" type="${tipe}" class="form-control" value="${aman(val)}" ${ekstra}></div>`;
  const tampilPesan = (t, k) => { ambil("pesan").innerHTML = alert_(t, k); window.scrollTo(0, 0); };
  function tampil(pesan) {
    const u = userAktif(), saya = semuaPesanan().filter((p) => p.email === u.email).length, k = kelengkapan(u);
    tampilkan(APP, `
    <div class="eyebrow mb-1">Akun</div><h1 class="font-display fw-semibold mb-4">Profil Saya</h1>
    <div class="gs-card p-4 mb-3 d-flex flex-wrap gap-3 align-items-center">
      <div class="gs-avatar" style="width:64px;height:64px;font-size:1.3rem">${inisial(u.nama)}</div>
      <div class="flex-grow-1"><div class="h5 font-display mb-0 fw-normal">${aman(u.nama)}</div><div class="small text-body-secondary">${aman(u.email)} &middot; Member sejak ${u.bergabung || "-"} &middot; ${saya} pesanan</div>
        <div class="progress mt-2" style="height:6px"><div class="progress-bar" style="width:0;background:#477C68" data-w="${k}"></div></div><div class="small text-body-secondary mt-1">Kelengkapan profil ${k}%</div></div>
    </div>
    <div id="pesan">${pesan || ""}</div>
    <form id="formProfil" class="gs-card p-4 mb-3" novalidate>
      <h2 class="h6 fw-semibold">Data pribadi</h2><div class="row g-3 mb-4">${f("nama", "Nama lengkap", u.nama)}${f("panggilan", "Nama panggilan", u.panggilan)}
        <div class="col-md-6"><label class="form-label small" for="gender">Jenis kelamin</label><select id="gender" class="form-select"><option value="">Pilih</option>${["Laki-laki", "Perempuan"].map((g) => `<option ${u.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select></div>${f("lahir", "Tanggal lahir", u.lahir, "date")}</div>
      <h2 class="h6 fw-semibold">Kontak</h2><div class="row g-3 mb-4">${f("email", "Email", u.email, "email", "disabled")}${f("wa", "Nomor WhatsApp", u.wa, "tel")}${f("instagram", "Akun Instagram", u.instagram, "text", 'placeholder="@username"')}</div>
      <h2 class="h6 fw-semibold">Alamat</h2><div class="row g-3 mb-4"><div class="col-12"><label class="form-label small" for="alamat">Alamat lengkap</label><textarea id="alamat" class="form-control" rows="2">${aman(u.alamat)}</textarea></div>${f("kota", "Kota / Kabupaten", u.kota)}${f("provinsi", "Provinsi", u.provinsi)}</div>
      <button class="btn btn-primary px-4">Simpan Perubahan</button>
    </form>
    <form id="formPw" class="gs-card p-4" novalidate><h2 class="h6 fw-semibold">Ganti password</h2><div class="row g-3 mb-3">${f("pwLama", "Password lama", "", "password")}${f("pwBaru", "Password baru", "", "password")}${f("pwUlang", "Konfirmasi password baru", "", "password")}</div><button class="btn btn-outline-primary px-4">Ganti Password</button></form>`);

    ambil("formProfil").onsubmit = (e) => {
      e.preventDefault();
      const v = (id) => ambil(id).value.trim();
      if (!v("nama")) return tampilPesan("Nama lengkap wajib diisi.", "danger");
      ubahAkun(u.email, { nama: v("nama"), panggilan: v("panggilan"), gender: ambil("gender").value, lahir: ambil("lahir").value, wa: v("wa"), instagram: v("instagram"), alamat: v("alamat"), kota: v("kota"), provinsi: v("provinsi") });
      tampil(alert_("Profil berhasil diperbarui.", "success"));
    };
    ambil("formPw").onsubmit = (e) => {
      e.preventDefault();
      if (ambil("pwLama").value !== u.password) return tampilPesan("Password lama tidak sesuai.", "danger");
      if (ambil("pwBaru").value.length < 6) return tampilPesan("Password baru minimal 6 karakter.", "danger");
      if (ambil("pwBaru").value !== ambil("pwUlang").value) return tampilPesan("Konfirmasi password baru tidak sama.", "danger");
      ubahAkun(u.email, { password: ambil("pwBaru").value });
      tampil(alert_("Password berhasil diganti.", "success"));
    };
  }
  tampil();
}
