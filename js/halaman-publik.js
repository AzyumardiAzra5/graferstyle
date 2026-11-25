function halamanBeranda() {
  const alur = [["01", "Booking", "Pilih paket, tanggal, lokasi, dan konsep foto."], ["02", "Konfirmasi dan bayar", "Admin mengonfirmasi, lalu bayar online lewat QRIS, Virtual Account, atau e-wallet."], ["03", "Sesi dan pilih foto", "Sesi pemotretan, lalu pilih 20 foto untuk diedit."], ["04", "Hasil via Drive", "Dikirim maksimal 3 hari, revisi hingga 2 kali."]];
  const perPaket = Object.values(fotoTampil()), unggulan = [];
  for (let i = 0; unggulan.length < 6 && i < 10; i++) perPaket.forEach((a) => { if (a[i * 2] && unggulan.length < 6) unggulan.push(a[i * 2]); });
  tampilkan(APP, `
<section class="container-fluid px-3 mx-auto gs-wadah text-center pt-5 pb-4 gs-hero-teks">
  <div class="eyebrow mb-3">Layanan Dokumentasi Visual</div>
  <h1 class="font-display display-5 fw-semibold lh-sm">Setiap momen, <span class="gs-mark">punya cerita</span> untuk dikenang.</h1>
  <p class="text-body-secondary mx-auto mt-3" style="max-width:680px">Setiap pertemuan, perayaan, dan pencapaian punya cerita tersendiri. Biarkan GraferStyle membantu mengabadikannya melalui hasil foto dan video yang menyimpan kesan di setiap momennya.</p>
  <div class="d-flex justify-content-center gap-2 mt-4"><a href="#paket" class="btn btn-primary px-4">Lihat Paket Harga</a><a href="#portofolio" class="btn btn-outline-primary px-4">Lihat Portofolio</a></div>
</section>
<section class="container-fluid px-3 mx-auto gs-wadah gs-hero">
  <div id="slider" class="carousel slide position-relative rounded-3 overflow-hidden" data-bs-ride="carousel" data-bs-interval="5000">
    <div class="carousel-inner">
      <div class="carousel-item active"><img src="img/hero-slider/hero-graduation.jpg" alt="Foto Graduation GraferStyle"></div>
      <div class="carousel-item"><img src="img/hero-slider/hero-prewedding.jpg" alt="Foto Prewedding GraferStyle"></div>
      <div class="carousel-item"><img src="img/hero-slider/hero-couple.jpg" alt="Foto Couple Date GraferStyle"></div>
      <div class="carousel-item"><img src="img/hero-slider/hero-produk.jpg" alt="Foto Produk GraferStyle"></div>
    </div>
    <div class="carousel-indicators"><button type="button" data-bs-target="#slider" data-bs-slide-to="0" class="active" aria-label="Slide 1"></button><button type="button" data-bs-target="#slider" data-bs-slide-to="1" aria-label="Slide 2"></button><button type="button" data-bs-target="#slider" data-bs-slide-to="2" aria-label="Slide 3"></button><button type="button" data-bs-target="#slider" data-bs-slide-to="3" aria-label="Slide 4"></button></div><button class="gs-nav gs-prev" type="button" data-bs-target="#slider" data-bs-slide="prev" aria-label="Sebelumnya">&#8249;</button><button class="gs-nav gs-next" type="button" data-bs-target="#slider" data-bs-slide="next" aria-label="Berikutnya">&#8250;</button>
    <div class="gs-vf" aria-hidden="true"><i></i><i></i><i></i><i></i><span>REC &bull; GRAFERSTYLE</span></div>
  </div>
</section>
<section class="container-fluid px-3 mx-auto gs-wadah py-5">
  <div class="eyebrow mb-2">Alur pemesanan</div><h2 class="font-display fw-semibold mb-4">Dari booking sampai hasil, empat langkah.</h2>
  <div class="row row-cols-1 row-cols-md-4 g-3">${alur.map((a) => `<div><div class="gs-card p-3 h-100"><div class="eyebrow">${a[0]}</div><h3 class="h6 font-display fw-semibold mt-1">${a[1]}</h3><p class="small text-body-secondary mb-0">${a[2]}</p></div></div>`).join("")}</div>
</section>
<section class="container-fluid px-3 mx-auto gs-wadah py-4">
  <div class="eyebrow mb-2">Layanan</div><h2 class="font-display fw-semibold mb-4">Pilih sesi yang cocok</h2>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">${Object.entries(LAYANAN).map(([k, l]) => `<div><div class="gs-card gs-angkat card h-100 overflow-hidden"><button class="gs-zoom poster-btn" data-poster="${l.gambar}" aria-label="Perbesar poster ${l.nama}"><img src="${l.gambar}" alt="Poster ${l.nama}"></button><div class="card-body d-flex flex-column"><div class="eyebrow">${l.tagline}</div><h3 class="h5 font-display fw-semibold mt-1">${l.nama}</h3><p class="small text-body-secondary mb-2 flex-grow-1">${l.deskripsi}</p><div class="small text-body-secondary mb-2">Klik poster untuk memperbesar</div><div class="d-flex justify-content-between align-items-center"><strong>Mulai ${rupiah(Math.min(...l.paket.map((p) => p.harga)))}</strong><a href="#paket/${k}" class="btn btn-primary btn-sm">Lihat Paket</a></div></div></div></div>`).join("")}</div>
</section>
<section class="container-fluid px-3 mx-auto gs-wadah py-5">
  <div class="d-flex justify-content-between align-items-end mb-3"><div><div class="eyebrow mb-1">Portofolio unggulan</div><h2 class="font-display fw-semibold mb-0">Beberapa hasil kami</h2></div><a href="#portofolio" class="btn btn-outline-primary btn-sm">Lihat semua</a></div>
  <div id="unggulan" class="row row-cols-2 row-cols-md-3 g-2">${unggulan.map((f) => `<div><a href="#portofolio" class="gs-zoom" style="aspect-ratio:4/5"><img src="${srcFoto(f)}" alt="Foto portofolio" loading="lazy"></a></div>`).join("")}</div>
</section>
<section class="container-fluid px-3 mx-auto gs-wadah py-4" id="faq" style="max-width:800px">
  <div class="eyebrow mb-2">FAQ</div><h2 class="font-display fw-semibold mb-3">Pertanyaan umum</h2>
  <div class="accordion" id="faqList">${FAQ.slice(0, 4).map((f, i) => `<div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button ${i ? "collapsed" : ""}" data-bs-toggle="collapse" data-bs-target="#f${i}">${f[0]}</button></h3><div id="f${i}" class="accordion-collapse collapse ${i ? "" : "show"}" data-bs-parent="#faqList"><div class="accordion-body small text-body-secondary">${f[1]}</div></div></div>`).join("")}</div>
</section>
<section class="container-fluid px-3 mx-auto gs-wadah py-5"><div class="bg-deep rounded-3 p-5 text-center"><h2 class="font-display fw-semibold">Siap bikin sesi foto?</h2><p class="opacity-75">Masuk untuk booking dan memantau status pesananmu.</p><a href="#booking" class="btn btn-primary px-4">Booking Sekarang</a></div></section>`);
  new bootstrap.Carousel(ambil("slider"));
}

function halamanTentang() {
  tampilkan(APP, `<div class="container-fluid px-3 mx-auto gs-wadah">${judulHalaman("Tentang", "Tentang", "GraferStyle", "Layanan fotografi dan videografi untuk momen yang ingin kamu simpan.")}
<div class="row g-4 mb-5"><div class="col-lg-7"><p class="lead">${KONTAK.tentang}</p>
<div class="row row-cols-2 row-cols-md-4 g-2 mt-3 mb-4">${[[Object.keys(LAYANAN).length, "", "Jenis layanan", "Graduation sampai foto produk"], [20, "", "Foto edit", "dipilih sendiri tiap sesi"], [3, " hari", "Hasil dikirim", "paling lambat setelah sesi"], [2, "x", "Revisi", "sampai hasilnya pas"]].map((s) => `<div><div class="gs-card p-3 h-100"><div class="fs-4 font-display fw-semibold mb-0"><span class="gs-num" data-to="${s[0]}">${s[0]}</span>${s[1]}</div><div class="fw-semibold small mt-1">${s[2]}</div><div class="small text-body-secondary">${s[3]}</div></div></div>`).join("")}</div>
<a href="#paket" class="btn btn-primary">Lihat Paket Harga</a></div>
<div class="col-lg-5"><div class="gs-card p-4"><div class="eyebrow mb-2">Layanan saat ini</div><ul class="list-unstyled mb-0">${Object.values(LAYANAN).map((l) => `<li class="py-2 border-bottom"><strong>${l.nama}</strong><div class="small text-body-secondary">${l.deskripsi}</div></li>`).join("")}</ul></div></div></div></div>`);
}

function halamanPortofolio() {
  tampilkan(APP, `<div class="container-fluid px-3 mx-auto gs-wadah">${judulHalaman("Portofolio", "Portofolio", "GraferStyle", "Beberapa hasil sesi foto kami. Klik foto untuk memperbesar.")}
<div class="d-flex flex-wrap gap-2 mb-4" id="filter">${["Semua", ...Object.keys(fotoTampil())].map((k) => `<button class="btn btn-sm btn-outline-primary">${k}</button>`).join("")}</div><div class="gs-masonry" id="galeri"></div></div>`);
  function tampilGaleri(kat) {
    const list = kat === "Semua" ? Object.entries(fotoTampil()).flatMap(([k, a]) => a.map((f) => [k, f])) : fotoTampil()[kat].map((f) => [kat, f]);
    tampilkan(ambil("galeri"), list.map(([k, f]) => `<button class="gs-zoom" aria-label="Buka foto ${k}"><img src="${srcFoto(f)}" alt="Foto ${k}" loading="lazy"></button>`).join(""));
    const srcs = list.map(([k, f]) => srcFoto(f));
    document.querySelectorAll("#galeri button").forEach((b, n) => { b.onclick = () => bukaLightbox(srcs, n); });
    document.querySelectorAll("#filter button").forEach((b) => { b.className = "btn btn-sm " + (b.textContent === kat ? "btn-primary" : "btn-outline-primary"); });
  }
  document.querySelectorAll("#filter button").forEach((b) => { b.onclick = () => tampilGaleri(b.textContent); });
  tampilGaleri("Semua");
}

function halamanPaket() {
  tampilkan(APP, `<div class="container-fluid px-3 mx-auto gs-wadah">${judulHalaman("Paket Harga", "Paket", "Harga GraferStyle", "Pilih layanan dan paket yang sesuai kebutuhanmu. Semua hasil dikirim lewat Google Drive.")}<div>` +
    Object.entries(LAYANAN).map(([k, l]) => `<section id="${k}" class="mb-5"><div class="d-flex align-items-center mb-3" style="gap:1rem"><button class="gs-zoom poster-btn" data-poster="${l.gambar}" aria-label="Perbesar poster ${l.nama}" style="width:84px;flex-shrink:0;border-radius:.5rem"><img src="${l.gambar}" alt="Poster ${l.nama}"></button><div><h2 class="h4 font-display fw-semibold mb-1">${l.nama}</h2><div class="small text-body-secondary">Klik poster untuk memperbesar</div></div></div><div class="row row-cols-1 row-cols-md-3 g-3">` +
      l.paket.map((p) => `<div><div class="card gs-card h-100 ${p.id === "fotovideo" ? "gs-paket-utama" : ""}">${p.gambar ? `<button type="button" class="gs-zoom poster-btn gs-poster-paket" data-poster="${p.gambar}" aria-label="Perbesar poster ${aman(p.nama)}"><img src="${p.gambar}" alt="Poster ${aman(p.nama)}"></button>` : ""}<div class="card-body d-flex flex-column"><div class="eyebrow">${aman(p.nama)}${p.id === "fotovideo" ? " &middot; Terlengkap" : ""}</div><div class="fs-3 fw-semibold font-display my-2">${rupiah(p.harga)}</div><ul class="list-unstyled small flex-grow-1">${p.fasilitas.map((f) => `<li class="mb-1">&#10003; ${aman(f)}</li>`).join("")}</ul><a class="btn btn-primary w-100" href="#booking/${k}/${p.id}">Pilih Paket</a></div></div></div>`).join("") + `</div></section>`).join("") + `</div></div>`);
}

function halamanKontak() {
  const ikon = (p) => '<svg viewBox="0 0 24 24">' + p + "</svg>";
  const IKON = { wa: ikon('<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5z"/><path d="M8.8 8.6c.3 2.6 2.6 5.2 5.6 6.2l1.2-1.3-2.1-1-.9.7c-.9-.4-1.6-1.1-2-2l.7-.9-1-2.1z"/>'), ig: ikon('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>'), map: ikon('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>') };
  const kartu = [[IKON.wa, "WhatsApp", 'Konsultasi dan pemesanan<br><a class="fw-semibold" href="' + KONTAK.waUrl + '" target="_blank" rel="noreferrer">' + KONTAK.whatsapp + "</a>", "Hubungi Sekarang", KONTAK.waUrl], [IKON.ig, "Instagram", "Lihat portofolio hasil karya", "Kunjungi Profil", KONTAK.instagramUrl], [IKON.map, "Area Layanan", KONTAK.area, "", "#"]];
  tampilkan(APP, `<div class="container-fluid px-3 mx-auto gs-wadah">${judulHalaman("Kontak", "Hubungi", "GraferStyle", "Konsultasi dan pemesanan bisa lewat WhatsApp, Instagram, atau form di bawah.")}
<div class="row row-cols-1 row-cols-md-3 g-3 mb-4">${kartu.map((k) => `<div><div class="gs-card p-3 d-flex gap-3 align-items-center h-100"><div class="gs-icon">${k[0]}</div><div><strong>${k[1]}</strong><div class="small text-body-secondary">${k[2]}</div>${k[3] ? `<a class="small fw-semibold" href="${k[4]}" target="_blank" rel="noreferrer">${k[3]} &rarr;</a>` : ""}</div></div></div>`).join("")}</div>
<div class="row g-4 align-items-stretch">
  <div class="col-lg-5"><div class="gs-art gs-art-bawah rounded-3 p-4 h-100 d-flex flex-column justify-content-end" style="background-image:url(img/kontak.jpeg);min-height:340px"><div class="font-display fs-2 fst-italic">Capture<br>More Moments</div></div></div>
  <div class="col-lg-7"><div class="gs-card p-4"><div class="eyebrow mb-1">Tentang kami</div><h2 class="font-display fw-semibold">Ada yang ingin ditanyakan?</h2><p class="text-body-secondary small">Ceritakan kebutuhan fotografi atau videografi yang kamu inginkan.</p>
    <div class="row small mb-3 g-0"><div class="col-sm-6"><strong>Jam Operasional</strong><div class="text-body-secondary">${KONTAK.jam}</div></div><div class="col-sm-6"><strong>Email</strong><div class="text-body-secondary">${KONTAK.email}</div></div></div>
    <div id="notif"></div>
    <form id="form" class="row g-2" novalidate><div class="col-md-6"><input class="form-control" id="nama" placeholder="Nama lengkap"></div><div class="col-md-6"><input class="form-control" id="wa" placeholder="Nomor WhatsApp"></div><div class="col-12"><input class="form-control" id="mail" placeholder="Email (opsional)"></div><div class="col-12"><textarea class="form-control" id="pesan" rows="3" placeholder="Pesan kamu..."></textarea></div><div class="col-12"><button class="btn btn-primary w-100">Kirim Pesan</button></div></form></div></div>
</div></div>`);
  ambil("form").onsubmit = (e) => {
    e.preventDefault();
    const nama = ambil("nama").value.trim(), wa = ambil("wa").value.trim(), pesan = ambil("pesan").value.trim();
    const ok = nama && wa && pesan;
    ambil("notif").innerHTML = ok ? `<div class="alert alert-success py-2 small">Pesan terkirim (simulasi). Terima kasih, ${aman(nama)}!</div>` : `<div class="alert alert-danger py-2 small">Nama, nomor WhatsApp, dan pesan wajib diisi.</div>`;
    if (ok) e.target.reset();
  };
}
