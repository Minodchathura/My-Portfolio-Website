// menu
document.documentElement.classList.add("js");
const menuBtn = document.getElementById("menuBtn"),
  navLinks = document.getElementById("navLinks");
menuBtn.onclick = () => {
  const o = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", o);
};
navLinks.querySelectorAll("a").forEach((a) => (a.onclick = () => navLinks.classList.remove("open")));
document.getElementById("year").textContent = new Date().getFullYear();
// typing effect
const words = ["Software Developer", "Data Analytics Learner", "AI & ML Enthusiast"],
  t = document.getElementById("typing");
let w = 0,
  c = 0,
  del = false;
(function type() {
  const s = words[w];
  t.textContent = s.slice(0, c);
  if (!del && c === s.length) {
    del = true;
    return setTimeout(type, 1400);
  }
  if (del && c === 0) {
    del = false;
    w = (w + 1) % words.length;
  }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 90);
})();
// reveal + counters
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
document.querySelectorAll("[data-count]").forEach((el) => {
  const end = +el.dataset.count,
    dec = +(el.dataset.dec || 0);
  let st = null;
  const step = (ts) => {
    st = st || ts;
    const p = Math.min((ts - st) / 1500, 1);
    el.textContent = (end * p).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});
// scroll: progress bar, active link, back-to-top
const secs = document.querySelectorAll("main section[id]"),
  links = navLinks.querySelectorAll("a"),
  bar = document.getElementById("progress"),
  topBtn = document.getElementById("top");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (scrollY / (h.scrollHeight - innerHeight)) * 100 + "%";
  let cur = "home";
  secs.forEach((s) => {
    if (scrollY >= s.offsetTop - 140) cur = s.id;
  });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  topBtn.classList.toggle("show", scrollY > 500);
});
topBtn.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
// card spotlight + 3D tilt
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    card.style.setProperty("--x", x + "px");
    card.style.setProperty("--y", y + "px");
    card.style.transform = `perspective(700px) rotateX(${(y / r.height - 0.5) * -8}deg) rotateY(${(x / r.width - 0.5) * 8}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => (card.style.transform = ""));
});
// particle network background
const cv = document.getElementById("bg"),
  cx = cv.getContext("2d");
let P = [];
function size() {
  cv.width = innerWidth;
  cv.height = innerHeight;
  P = Array.from({ length: Math.min(90, Math.floor(innerWidth / 14)) }, () => ({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
  }));
}
size();
addEventListener("resize", size);
const m = { x: -999, y: -999 };
addEventListener("mousemove", (e) => {
  m.x = e.clientX;
  m.y = e.clientY;
});
(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > cv.width) p.vx *= -1;
    if (p.y < 0 || p.y > cv.height) p.vy *= -1;
    cx.fillStyle = "rgba(56,189,248,.8)";
    cx.beginPath();
    cx.arc(p.x, p.y, 1.8, 0, 7);
    cx.fill();
    for (let j = i + 1; j < P.length; j++) {
      const q = P[j],
        d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        cx.strokeStyle = `rgba(168,85,247,${0.35 * (1 - d / 120)})`;
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(q.x, q.y);
        cx.stroke();
      }
    }
    const dm = Math.hypot(p.x - m.x, p.y - m.y);
    if (dm < 150) {
      cx.strokeStyle = `rgba(56,189,248,${0.6 * (1 - dm / 150)})`;
      cx.beginPath();
      cx.moveTo(p.x, p.y);
      cx.lineTo(m.x, m.y);
      cx.stroke();
    }
  });
  requestAnimationFrame(draw);
})();
// contact form validation + send (opens the visitor's email app)
const form = document.getElementById("contactForm"),
  status = document.getElementById("formStatus");
function check(f) {
  const v = f.value.trim(),
    box = f.closest(".field"),
    err = box.querySelector(".err");
  let m = "";
  if (!v) m = "This field is required.";
  else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    m = "Please enter a valid email address.";
  else if (f.id === "message" && v.length < 10) m = "Message should be at least 10 characters.";
  err.textContent = m;
  box.classList.toggle("invalid", !!m);
  return !m;
}
form.querySelectorAll("input,textarea").forEach((f) => f.addEventListener("blur", () => check(f)));
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = [...form.querySelectorAll("input,textarea")].map(check).every(Boolean);
  if (!ok) {
    status.className = "status bad";
    status.textContent = "Please fix the highlighted fields.";
    return;
  }
  const d = new FormData(form);
  const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\n\n${d.get("message")}`;
  location.href = `mailto:minodchathura2004@gmail.com?subject=${encodeURIComponent(d.get("subject"))}&body=${encodeURIComponent(body)}`;
  status.className = "status ok";
  status.textContent = "Thank you! Your email app is opening so you can send the message.";
  form.reset();
});

// certificate lightbox
const lb = document.getElementById("lightbox"),
  lbImg = document.getElementById("lbImg");
function closeLb() {
  lb.hidden = true;
  lbImg.src = "";
}
document.querySelectorAll(".cert-img").forEach((btn) =>
  btn.addEventListener("click", () => {
    lbImg.src = btn.dataset.full;
    lb.hidden = false;
  }),
);
lb.addEventListener("click", (e) => {
  if (e.target !== lbImg) closeLb();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lb.hidden) closeLb();
});

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
