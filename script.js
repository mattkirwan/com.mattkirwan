(() => {
    const TOTAL = 10;
  
    // If you rename files, update this list.
    const images = Array.from({ length: TOTAL }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `images/${n}.jpg`;
    });
  
    const imgEl = document.getElementById("slideImage");
    const counterEl = document.getElementById("counter");
    const frame = document.getElementById("frame");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
  
    let index = 0;
  
    // Preload for smoother switching
    const preload = () => {
      images.forEach((src) => {
        const im = new Image();
        im.src = src;
      });
    };
  
    const formatCounter = (i) => {
      const xx = String(i + 1).padStart(2, "0");
      const yy = String(TOTAL).padStart(2, "0");
      return `${xx} / ${yy}`;
    };
  
    const show = (i) => {
      index = (i + TOTAL) % TOTAL; // loop
      imgEl.src = images[index];
      counterEl.textContent = formatCounter(index);
    };
  
    const next = () => show(index + 1);
    const prev = () => show(index - 1);
  
    // Keyboard support
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  
    // Click areas (desktop)
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
  
    // Swipe / drag
    let startX = 0;
    let startY = 0;
    let dragging = false;
  
    const SWIPE_THRESHOLD = 40; // px
    const MAX_VERTICAL_DRIFT = 70; // px (avoid accidental swipes while scrolling)
  
    const onStart = (x, y) => {
      startX = x;
      startY = y;
      dragging = true;
    };
  
    const onEnd = (x, y) => {
      if (!dragging) return;
      dragging = false;
  
      const dx = x - startX;
      const dy = y - startY;
  
      if (Math.abs(dy) > MAX_VERTICAL_DRIFT) return;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
  
      if (dx < 0) next();
      else prev();
    };
  
    // Touch
    frame.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }, { passive: true });
  
    frame.addEventListener("touchend", (e) => {
      const t = e.changedTouches[0];
      onEnd(t.clientX, t.clientY);
    });
  
    // Mouse drag
    frame.addEventListener("mousedown", (e) => onStart(e.clientX, e.clientY));
    window.addEventListener("mouseup", (e) => onEnd(e.clientX, e.clientY));
  
    // Prevent dragging the image ghost on desktop
    imgEl.addEventListener("dragstart", (e) => e.preventDefault());
  
    preload();
    show(0);
  })();
  