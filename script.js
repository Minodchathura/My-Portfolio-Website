// Minod Chathura - portfolio script
// Used by index.html and the three project pages.

// tell the CSS that JavaScript is working (needed for the fade-in effect)
document.documentElement.classList.add("js");

// ---------- mobile menu ----------
var menuBtn = document.getElementById("menuBtn");
var navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
  var isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// close the menu after clicking a link
var navItems = navLinks.querySelectorAll("a");
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
}

// ---------- footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- fade-in when sections come into view ----------
var revealItems = document.querySelectorAll(".reveal");

var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealItems.forEach(function (item) {
  observer.observe(item);
});

// ---------- lightbox (certificates on home page, screenshots on project pages) ----------
var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lbImg");
var lightboxCaption = document.getElementById("lbCap");
var lightboxButtons = document.querySelectorAll("[data-full]");
var currentImage = 0;

function showImage(index) {
  // loop around at both ends
  currentImage = (index + lightboxButtons.length) % lightboxButtons.length;
  var button = lightboxButtons[currentImage];
  lightboxImg.src = button.getAttribute("data-full");
  lightboxImg.alt = button.getAttribute("data-alt");
  lightboxCaption.textContent = button.getAttribute("data-alt");
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
}

if (lightbox && lightboxButtons.length > 0) {
  lightboxButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      showImage(index);
    });
  });

  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);

  // prev / next buttons only exist on project pages
  var prevBtn = lightbox.querySelector(".lb-prev");
  var nextBtn = lightbox.querySelector(".lb-next");
  if (prevBtn) prevBtn.addEventListener("click", function () { showImage(currentImage - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { showImage(currentImage + 1); });

  // click on the dark area to close
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && prevBtn) showImage(currentImage - 1);
    if (e.key === "ArrowRight" && nextBtn) showImage(currentImage + 1);
  });
}

// ---------- everything below is only for the home page ----------
var typingEl = document.getElementById("typing");

if (typingEl) {
  // typing effect in the hero title
  var words = ["Software Developer", "Data Analytics Learner", "AI & ML Enthusiast"];
  var wordIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function typeWord() {
    var word = words[wordIndex];
    typingEl.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex === word.length) {
      // finished typing, wait a bit then start deleting
      deleting = true;
      setTimeout(typeWord, 1400);
      return;
    }
    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    charIndex = deleting ? charIndex - 1 : charIndex + 1;
    setTimeout(typeWord, deleting ? 40 : 90);
  }

  // people who prefer less motion just see the first word
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typingEl.textContent = words[0];
  } else {
    typeWord();
  }

  // numbers in the hero count up from 0
  var counters = document.querySelectorAll("[data-count]");
  counters.forEach(function (el) {
    var end = Number(el.getAttribute("data-count"));
    var decimals = Number(el.getAttribute("data-dec") || 0);
    var startTime = null;

    function step(time) {
      if (startTime === null) startTime = time;
      var progress = Math.min((time - startTime) / 1500, 1);
      el.textContent = (end * progress).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  // highlight the nav link of the section we are in + back to top button
  var sections = document.querySelectorAll("main section[id]");
  var topBtn = document.getElementById("top");

  window.addEventListener("scroll", function () {
    var current = "home";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.id;
      }
    });
    navItems.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
    topBtn.classList.toggle("show", window.scrollY > 500);
  });

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- contact form ----------
  var form = document.getElementById("contactForm");
  var statusText = document.getElementById("formStatus");

  // returns true if the field is OK, otherwise shows an error message
  function checkField(field) {
    var value = field.value.trim();
    var box = field.closest(".field");
    var errorEl = box.querySelector(".err");
    var message = "";

    if (value === "") {
      message = "This field is required.";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    } else if (field.id === "message" && value.length < 10) {
      message = "Message should be at least 10 characters.";
    }

    errorEl.textContent = message;
    box.classList.toggle("invalid", message !== "");
    return message === "";
  }

  var fields = form.querySelectorAll("input, textarea");
  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      checkField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var allOk = true;
    fields.forEach(function (field) {
      if (!checkField(field)) allOk = false;
    });

    if (!allOk) {
      statusText.className = "status bad";
      statusText.textContent = "Please fix the highlighted fields.";
      return;
    }

    // no backend, so this opens the visitor's email app with the message filled in
    var name = form.elements["name"].value;
    var email = form.elements["email"].value;
    var subject = form.elements["subject"].value;
    var message = form.elements["message"].value;
    var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;

    window.location.href =
      "mailto:minodchathura2004@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    statusText.className = "status ok";
    statusText.textContent = "Thank you! Your email app is opening so you can send the message.";
    form.reset();
  });
}
