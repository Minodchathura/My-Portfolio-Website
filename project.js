// menu
const menuBtn = document.getElementById("menuBtn"),
  navLinks = document.getElementById("navLinks");
document.documentElement.classList.add("js");
menuBtn.onclick = () => {
  const o = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", o);
};
document.getElementById("year").textContent = new Date().getFullYear();
// scroll reveal + progress bar
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
const bar = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (scrollY / (h.scrollHeight - innerHeight)) * 100 + "%";
});
// screenshot lightbox with previous / next
const lb = document.getElementById("lightbox"),
  lbImg = document.getElementById("lbImg"),
  lbCap = document.getElementById("lbCap");
const btns = [...document.querySelectorAll(".shot-btn")];
let cur = 0;
function show(i) {
  cur = (i + btns.length) % btns.length;
  lbImg.src = btns[cur].dataset.full;
  lbCap.textContent = btns[cur].dataset.cap;
  lb.hidden = false;
}
function closeLb() {
  lb.hidden = true;
  lbImg.src = "";
}
btns.forEach((b, i) => b.addEventListener("click", () => show(i)));
lb.querySelector(".lb-close").onclick = closeLb;
lb.querySelector(".lb-prev").onclick = () => show(cur - 1);
lb.querySelector(".lb-next").onclick = () => show(cur + 1);
lb.addEventListener("click", (e) => {
  if (e.target === lb) closeLb();
});
addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
});
if (!btns.length) lb.remove();
// particle background
const cv = document.getElementById("bg"),
  cx = cv.getContext("2d");
let Pt = [];
function size() {
  cv.width = innerWidth;
  cv.height = innerHeight;
  Pt = Array.from({ length: Math.min(80, Math.floor(innerWidth / 14)) }, () => ({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
  }));
}
size();
addEventListener("resize", size);
(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  Pt.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > cv.width) p.vx *= -1;
    if (p.y < 0 || p.y > cv.height) p.vy *= -1;
    cx.fillStyle = "rgba(56,189,248,.8)";
    cx.beginPath();
    cx.arc(p.x, p.y, 1.8, 0, 7);
    cx.fill();
    for (let j = i + 1; j < Pt.length; j++) {
      const q = Pt[j],
        d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        cx.strokeStyle = `rgba(168,85,247,${0.35 * (1 - d / 120)})`;
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(q.x, q.y);
        cx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
})();

// circular favicon made from the profile photo (works on http/https: Live Server or GitHub Pages)
(function () {
  const img = new Image();
  img.onload = () => {
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const x = c.getContext("2d");
      x.beginPath();
      x.arc(32, 32, 32, 0, 7);
      x.clip();
      const s = Math.min(img.width, img.height);
      x.drawImage(img, (img.width - s) / 2, (img.height - s) * 0.2, s, s, 0, 0, 64, 64);
      const l = document.querySelector('link[rel="icon"]');
      l.type = "image/png";
      l.href = c.toDataURL("image/png");
    } catch (e) {}
  };
  img.src = "assets/profile.jpg";
})();
