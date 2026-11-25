const SASARAN = [
  ".gs-card", ".accordion-item", ".gs-head", ".gs-masonry button", "#unggulan .gs-zoom", ".gs-banner",
  ".table-responsive", ".gs-hero-teks > *", ".gs-hero #slider", "main section > .eyebrow", "main section > h2",
  "main .bg-deep.rounded-3", "#app > .eyebrow", "#app > h1"
].join(", ");

const kurangiGerak = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let daftarAnimasi = [];

function animasiSiapkan(akar) {
  akar.querySelectorAll("[data-w]").forEach((b) => setTimeout(() => { b.style.width = b.dataset.w + "%"; }, 60));
  akar.querySelectorAll(".gs-num[data-to]").forEach(hitung);

  if (!kurangiGerak) {
    daftarAnimasi = daftarAnimasi.filter((e) => e.isConnected);
    akar.querySelectorAll(SASARAN).forEach((el) => {
      if (el.classList.contains("gs-rev")) return;
      const unit = !el.parentNode.classList.contains("row") && el.parentNode.parentNode.classList.contains("row") ? el.parentNode : el;
      const urut = Array.from(unit.parentNode.children).indexOf(unit);
      el.style.setProperty("--d", (urut % 6) * 0.08 + "s");
      if (unit.parentNode.classList.contains("row") && el.classList.contains("gs-card")) el.style.setProperty("--dx", (urut % 2 ? 28 : -28) + "px");
      el.classList.add("gs-rev");
      daftarAnimasi.push(el);
    });
    periksaAnimasi();
  }
  aturScroll();
}

function periksaAnimasi() {
  const tinggi = window.innerHeight;
  daftarAnimasi.forEach((el) => {
    const r = el.getBoundingClientRect();
    const sudahMuncul = el.classList.contains("gs-in");
    const terlihat = r.top < tinggi * 0.9 && r.bottom > tinggi * 0.1;
    const jauh = r.top > tinggi || r.bottom < 0;
    if (!sudahMuncul && terlihat) {
      el.classList.add("gs-in");
    } else if (sudahMuncul && jauh) {
      el.classList.remove("gs-in");
      el.style.setProperty("--dy", r.bottom < 0 ? "-26px" : "26px");
    }
  });
}

function hitung(el) {
  if (el.dataset.jalan) return;
  el.dataset.jalan = "1";
  const akhir = Number(el.dataset.to), rupiahan = el.dataset.fmt === "rupiah";
  let langkah = 0;
  const waktu = setInterval(() => {
    langkah++;
    const nilai = Math.round(akhir * (langkah / 25));
    el.textContent = rupiahan ? rupiah(nilai) : nilai;
    if (langkah >= 25) clearInterval(waktu);
  }, 40);
}

const barProgres = document.createElement("div");
barProgres.className = "gs-progres";
document.body.appendChild(barProgres);

function aturScroll() {
  const y = window.scrollY, navbar = document.querySelector(".gs-navbar"), keAtas = document.querySelector(".gs-top");
  const total = document.documentElement.scrollHeight - window.innerHeight;
  barProgres.style.width = (total > 0 ? (y / total) * 100 : 0) + "%";
  if (navbar) navbar.classList.toggle("gs-scrolled", y > 30);
  if (keAtas) keAtas.classList.toggle("tampil", y > 300);
}
window.addEventListener("scroll", () => { periksaAnimasi(); aturScroll(); });
window.addEventListener("resize", periksaAnimasi);

document.addEventListener("click", (e) => {
  const t = e.target.closest(".gs-top");
  if (t) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
});

document.addEventListener("click", (e) => {
  const b = e.target.closest(".btn");
  if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement("span");
  s.className = "gs-riak";
  s.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
  b.appendChild(s);
  setTimeout(() => s.remove(), 650);
});

document.addEventListener("mousemove", (e) => {
  const k = e.target.closest(".gs-angkat");
  if (!k) return;
  const r = k.getBoundingClientRect();
  k.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 8 + "deg");
  k.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * 8 + "deg");
});
document.addEventListener("mouseout", (e) => {
  const k = e.target.closest(".gs-angkat");
  if (k && !k.contains(e.relatedTarget)) { k.style.setProperty("--rx", "0deg"); k.style.setProperty("--ry", "0deg"); }
});
