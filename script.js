const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (window.lucide) {
  window.lucide.createIcons();
}

const closeNav = () => {
  body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeNav();
  });
});

nav?.addEventListener("pointerdown", (event) => {
  if (!body.classList.contains("nav-open")) return;
  if (event.target.closest("a")) return;
  closeNav();
});

document.addEventListener("pointerdown", (event) => {
  if (!body.classList.contains("nav-open")) return;
  if (nav?.contains(event.target) || navToggle?.contains(event.target)) return;
  closeNav();
});

const diplomaModal = document.querySelector("[data-diploma-modal]");
const diplomaModalImage = diplomaModal?.querySelector("[data-diploma-modal-image]");
const diplomaModalCounter = diplomaModal?.querySelector("[data-diploma-modal-counter]");
const diplomaModalClose = diplomaModal?.querySelector(".diploma-modal__close");
const diplomaModalPrev = diplomaModal?.querySelector("[data-diploma-prev]");
const diplomaModalNext = diplomaModal?.querySelector("[data-diploma-next]");
const diplomaCards = Array.from(document.querySelectorAll(".diploma-card"));
let diplomaFocusReturn = null;
let currentDiplomaIndex = 0;

const isDiplomaModalOpen = () => diplomaModal?.classList.contains("is-open");

const getDiplomaFocusable = () => {
  if (!diplomaModal) return [];

  return Array.from(
    diplomaModal.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")
  ).filter((element) => !element.hasAttribute("disabled"));
};

const closeDiplomaModal = () => {
  if (!isDiplomaModalOpen()) return;

  diplomaModal.classList.remove("is-open");
  diplomaModal.setAttribute("aria-hidden", "true");
  body.classList.remove("diploma-modal-open");

  if (diplomaModalImage) {
    diplomaModalImage.removeAttribute("src");
    diplomaModalImage.alt = "";
  }

  if (diplomaModalCounter) {
    diplomaModalCounter.textContent = "";
  }

  diplomaFocusReturn?.focus?.();
  diplomaFocusReturn = null;
};

const showDiploma = (index) => {
  if (!diplomaModal || !diplomaModalImage) return;
  if (!diplomaCards.length) return;

  currentDiplomaIndex = (index + diplomaCards.length) % diplomaCards.length;

  const card = diplomaCards[currentDiplomaIndex];
  const preview = card.querySelector("img");
  const imageUrl = card.getAttribute("href") || preview?.currentSrc || preview?.src;
  const imageTitle = preview?.getAttribute("alt") || card.getAttribute("aria-label") || "Диплом";

  if (!imageUrl) return;

  diplomaModalImage.src = imageUrl;
  diplomaModalImage.alt = imageTitle;

  if (diplomaModalCounter) {
    diplomaModalCounter.textContent = `${currentDiplomaIndex + 1} из ${diplomaCards.length}`;
  }
};

const openDiplomaModal = (card) => {
  if (!diplomaModal || !diplomaModalImage) return;

  closeNav();
  diplomaFocusReturn = document.activeElement;

  const cardIndex = diplomaCards.indexOf(card);
  showDiploma(cardIndex === -1 ? 0 : cardIndex);

  body.classList.add("diploma-modal-open");
  diplomaModal.classList.add("is-open");
  diplomaModal.setAttribute("aria-hidden", "false");

  window.requestAnimationFrame(() => {
    diplomaModalClose?.focus();
  });
};

diplomaCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    openDiplomaModal(card);
  });
});

diplomaModalPrev?.addEventListener("click", () => {
  showDiploma(currentDiplomaIndex - 1);
});

diplomaModalNext?.addEventListener("click", () => {
  showDiploma(currentDiplomaIndex + 1);
});

diplomaModal?.querySelectorAll("[data-diploma-close]").forEach((control) => {
  control.addEventListener("click", closeDiplomaModal);
});

document.addEventListener("keydown", (event) => {
  if (!isDiplomaModalOpen()) return;

  if (event.key === "Escape") {
    closeDiplomaModal();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showDiploma(currentDiplomaIndex - 1);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showDiploma(currentDiplomaIndex + 1);
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getDiplomaFocusable();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");

  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector("[data-slider-track]");
  const dotsContainer = slider.querySelector("[data-slider-dots]");
  const realSlides = Array.from(slider.querySelectorAll("[data-slide]"));
  let slides = realSlides;
  let current = 0;
  let startX = 0;
  let dragX = 0;
  let isDragging = false;
  let hasLoop = false;

  if (track && realSlides.length > 1) {
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[realSlides.length - 1].cloneNode(true);

    firstClone.removeAttribute("data-slide");
    lastClone.removeAttribute("data-slide");
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    track.prepend(lastClone);
    track.append(firstClone);

    slides = Array.from(track.children);
    current = 1;
    hasLoop = true;
  }

  const getRealIndex = () => {
    if (!hasLoop) return current;
    if (current === 0) return realSlides.length - 1;
    if (current === slides.length - 1) return 0;
    return current - 1;
  };

  const normalizeSlide = (index) => {
    if (!hasLoop) {
      return Math.max(0, Math.min(index, slides.length - 1));
    }
    if (index < 0) return slides.length - 2;
    if (index > slides.length - 1) return 1;
    return index;
  };

  const dots = realSlides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать отзыв ${index + 1}`);
    dot.addEventListener("click", () => setSlide(hasLoop ? index + 1 : index));
    dotsContainer?.append(dot);
    return dot;
  });

  const setTrackTransition = (enabled) => {
    if (!track) return;
    track.style.transition = enabled ? "" : "none";
  };

  const moveTrack = (offsetPx = 0) => {
    if (!track) return;
    track.style.transform = `translate3d(calc(${-current * 100}% + ${offsetPx}px), 0, 0)`;
  };

  const updateSlideState = () => {
    const realIndex = getRealIndex();
    realSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === realIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    slides.forEach((slide) => {
      if (!slide.matches("[data-slide]")) {
        slide.classList.remove("is-active");
        slide.setAttribute("aria-hidden", "true");
      }
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === realIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const jumpWithoutAnimation = (index) => {
    setTrackTransition(false);
    current = index;
    moveTrack();
    updateSlideState();
    track?.getBoundingClientRect();
    setTrackTransition(true);
  };

  const setSlide = (index, offsetPx = 0) => {
    setTrackTransition(true);
    current = normalizeSlide(index);
    moveTrack(offsetPx);
    updateSlideState();
  };

  const finishDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove("is-dragging");

    const threshold = Math.min(slider.clientWidth * 0.18, 120);
    if (dragX < -threshold) {
      setSlide(current + 1);
    } else if (dragX > threshold) {
      setSlide(current - 1);
    } else {
      setSlide(current);
    }

    dragX = 0;
  };

  slider.addEventListener("pointerdown", (event) => {
    if (slides.length < 2) return;
    isDragging = true;
    startX = event.clientX;
    dragX = 0;
    slider.classList.add("is-dragging");
    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragX = event.clientX - startX;

    moveTrack(dragX);
  });

  slider.addEventListener("pointerup", finishDrag);
  slider.addEventListener("pointercancel", finishDrag);
  slider.addEventListener("lostpointercapture", finishDrag);

  track?.addEventListener("transitionend", () => {
    if (!hasLoop) return;
    if (current === 0) {
      jumpWithoutAnimation(slides.length - 2);
    }
    if (current === slides.length - 1) {
      jumpWithoutAnimation(1);
    }
  });

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      setSlide(current - 1);
    }
    if (event.key === "ArrowRight") {
      setSlide(current + 1);
    }
  });

  jumpWithoutAnimation(current);
});
