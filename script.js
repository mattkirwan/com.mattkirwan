/* ---------------------------------------------------------------
   Matt Kirwan — Photography

   Renders the masonry grid from gallery.js and drives the lightbox.
   No dependencies, no build step.
   --------------------------------------------------------------- */

(() => {
  "use strict";

  const site = window.SITE || {};
  const projects = Array.isArray(site.projects) ? site.projects : [];

  /* --- Element handles ------------------------------------------------ */

  const el = {
    name: document.getElementById("siteName"),
    tagline: document.getElementById("siteTagline"),
    navList: document.getElementById("navList"),
    navToggle: document.getElementById("navToggle"),
    nav: document.getElementById("siteNav"),
    intro: document.getElementById("projectIntro"),
    title: document.getElementById("projectTitle"),
    description: document.getElementById("projectDescription"),
    grid: document.getElementById("gallery"),
    empty: document.getElementById("emptyState"),
    lightbox: document.getElementById("lightbox"),
    stage: document.getElementById("lightboxStage"),
    image: document.getElementById("lightboxImage"),
    caption: document.getElementById("lightboxCaption"),
    counter: document.getElementById("lightboxCounter"),
    close: document.getElementById("lightboxClose"),
    prev: document.getElementById("lightboxPrev"),
    next: document.getElementById("lightboxNext")
  };

  /* --- Which project are we showing? ----------------------------------
     One gallery today. `?project=<slug>` already works, so adding a
     second entry to gallery.js is all that a second project needs. */

  const requestedSlug = new URLSearchParams(location.search).get("project");
  const project =
    projects.find((p) => p.slug === requestedSlug) || projects[0] || null;
  const photos = project && Array.isArray(project.photos) ? project.photos : [];

  /* --- Helpers -------------------------------------------------------- */

  // Builds "Title, Location, Year" from whichever fields are filled in.
  const captionFor = (photo) =>
    [photo.title, photo.location, photo.year].filter(Boolean).join(", ");

  const altFor = (photo) => photo.alt || captionFor(photo) || "Photograph";

  const pad = (n) => String(n).padStart(2, "0");

  /* --- Header and navigation ------------------------------------------ */

  const renderChrome = () => {
    if (site.name) {
      el.name.textContent = site.name;
      document.title = `${site.name} — ${site.tagline || "Photography"}`;
    }
    if (site.tagline) el.tagline.textContent = site.tagline;

    // The nav only earns its place once there is more than one project.
    if (projects.length > 1) {
      projects.forEach((p) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `?project=${encodeURIComponent(p.slug)}`;
        a.textContent = p.title || p.slug;
        if (p === project) a.setAttribute("aria-current", "page");
        li.appendChild(a);
        el.navList.appendChild(li);
      });
    } else {
      el.nav.hidden = true;
      el.navToggle.hidden = true;
    }

    if (project && projects.length > 1) {
      el.title.textContent = project.title || "";
      el.description.textContent = project.description || "";
      if (!project.description) el.description.hidden = true;
      el.intro.hidden = false;
    }
  };

  el.navToggle.addEventListener("click", () => {
    const open = el.nav.classList.toggle("is-open");
    el.navToggle.setAttribute("aria-expanded", String(open));
  });

  /* --- Grid ------------------------------------------------------------ */

  const renderGrid = () => {
    if (!photos.length) {
      el.empty.hidden = false;
      return;
    }

    const frag = document.createDocumentFragment();

    photos.forEach((photo, i) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.setAttribute("aria-label", `Open ${altFor(photo)}`);
      tile.addEventListener("click", () => open(i));

      const frame = document.createElement("div");
      frame.className = "tile-frame";

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = altFor(photo);
      img.loading = i < 4 ? "eager" : "lazy";
      img.decoding = "async";

      // Reserving the aspect ratio up front stops the grid reflowing
      // as images arrive.
      if (photo.w && photo.h) {
        img.width = photo.w;
        img.height = photo.h;
        frame.style.aspectRatio = `${photo.w} / ${photo.h}`;
      }

      const reveal = () => img.classList.add("is-loaded");
      if (img.complete) reveal();
      else img.addEventListener("load", reveal, { once: true });
      // A broken file should not leave a permanently invisible tile.
      img.addEventListener("error", reveal, { once: true });

      frame.appendChild(img);
      tile.appendChild(frame);
      frag.appendChild(tile);
    });

    el.grid.appendChild(frag);
  };

  /* --- Lightbox -------------------------------------------------------- */

  let current = 0;
  let lastFocused = null;

  const preload = (i) => {
    const photo = photos[i];
    if (photo) new Image().src = photo.src;
  };

  const show = (i) => {
    current = i;
    const photo = photos[i];

    el.image.classList.add("is-swapping");

    const swap = () => {
      el.image.src = photo.src;
      el.image.alt = altFor(photo);
      el.image.classList.remove("is-swapping");
    };

    // Decode first where supported, so the new frame appears complete
    // rather than painting in progressively.
    const pending = new Image();
    pending.src = photo.src;
    if (pending.decode) pending.decode().then(swap).catch(swap);
    else swap();

    el.caption.textContent = captionFor(photo);
    el.counter.textContent = `${pad(i + 1)} / ${pad(photos.length)}`;

    // With a single photo there is nowhere to navigate to.
    const solo = photos.length < 2;
    el.prev.disabled = solo;
    el.next.disabled = solo;

    preload(i + 1 < photos.length ? i + 1 : 0);
    preload(i - 1 >= 0 ? i - 1 : photos.length - 1);
  };

  function open(i) {
    lastFocused = document.activeElement;
    el.lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    show(i);
    el.close.focus();
  }

  const close = () => {
    el.lightbox.hidden = true;
    document.body.style.overflow = "";
    el.image.removeAttribute("src");
    if (lastFocused) lastFocused.focus();
  };

  // Wraps around at both ends.
  const step = (delta) => {
    if (photos.length < 2) return;
    show((current + delta + photos.length) % photos.length);
  };

  el.close.addEventListener("click", close);
  el.prev.addEventListener("click", () => step(-1));
  el.next.addEventListener("click", () => step(1));

  // Clicking the backdrop (but not the photo itself) closes.
  el.stage.addEventListener("click", (e) => {
    if (e.target !== el.image) close();
  });

  document.addEventListener("keydown", (e) => {
    if (el.lightbox.hidden) return;

    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowRight") {
      step(1);
    } else if (e.key === "ArrowLeft") {
      step(-1);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog while it is open.
      const focusable = [el.close, el.prev, el.next].filter((b) => !b.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Swipe to move between photographs on touch screens.
  let touchX = null;
  let touchY = null;

  el.stage.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );

  el.stage.addEventListener(
    "touchend",
    (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      // Horizontal intent only, and far enough to be deliberate.
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        step(dx < 0 ? 1 : -1);
      }
      touchX = null;
      touchY = null;
    },
    { passive: true }
  );

  /* --- Go -------------------------------------------------------------- */

  renderChrome();
  renderGrid();
})();
