const themeToggle = document.querySelector("#themeToggle");
const root = document.documentElement;
const storageKey = "lotte-portfolio-theme";

function getPreferredTheme() {
  const savedTheme = window.localStorage.getItem(storageKey);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (!themeToggle) {
    return;
  }

  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "다크 모드로 전환" : "라이트 모드로 전환");
}

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  });
}

const heroWords = [
  {
    word: "Campaign",
    subtitle: "아이디어 자체보다 어떤 문제를 풀기 위한 실행인지 설명 가능한 캠페인을 지향합니다.",
  },
  {
    word: "Value",
    subtitle: "롯데백화점의 다음 가치를 고객 인사이트와 재현 가능한 실행력으로 증명하고 싶습니다.",
  },
  {
    word: "Insight",
    subtitle: "타겟 고객의 반응을 이끌기 위해 '문제 정의 - 근거 - 전략 수립'의 마케팅 경험을 쌓았습니다.",
  },
];

const heroWord = document.querySelector("#heroWord");
const heroSubtitle = document.querySelector("#heroSubtitle");
const heroPrev = document.querySelector("#heroPrev");
const heroNext = document.querySelector("#heroNext");
const heroPause = document.querySelector("#heroPause");
let activeHeroIndex = 0;
let isHeroPaused = false;
let heroIntervalId = null;

function setHeroWordImmediately(index) {
  if (!heroWord || !heroSubtitle) {
    return;
  }

  activeHeroIndex = (index + heroWords.length) % heroWords.length;
  heroWord.textContent = heroWords[activeHeroIndex].word;
  heroSubtitle.textContent = heroWords[activeHeroIndex].subtitle;
}

function renderHeroWord(nextIndex) {
  if (!heroWord || !heroSubtitle) {
    return;
  }

  activeHeroIndex = (nextIndex + heroWords.length) % heroWords.length;
  const current = heroWords[activeHeroIndex];

  heroWord.animate(
    [
      { opacity: 1, transform: "translateY(0px)" },
      { opacity: 0, transform: "translateY(10px)" },
    ],
    { duration: 180, fill: "forwards", easing: "ease" }
  ).onfinish = () => {
    heroWord.textContent = current.word;
    heroSubtitle.textContent = current.subtitle;
    heroWord.animate(
      [
        { opacity: 0, transform: "translateY(-10px)" },
        { opacity: 1, transform: "translateY(0px)" },
      ],
      { duration: 220, fill: "forwards", easing: "ease" }
    );
  };
}

function goToNextHeroWord() {
  renderHeroWord(activeHeroIndex + 1);
}

function goToPrevHeroWord() {
  renderHeroWord(activeHeroIndex - 1);
}

function startHeroRotation() {
  if (heroIntervalId) {
    window.clearInterval(heroIntervalId);
  }

  heroIntervalId = window.setInterval(() => {
    if (!isHeroPaused) {
      goToNextHeroWord();
    }
  }, 2600);
}

function updatePauseButton() {
  if (!heroPause) {
    return;
  }

  heroPause.textContent = isHeroPaused ? "▶" : "⏸";
  heroPause.classList.toggle("is-paused", isHeroPaused);
  heroPause.setAttribute("aria-pressed", String(isHeroPaused));
  heroPause.setAttribute("aria-label", isHeroPaused ? "자동 넘김 다시 시작" : "자동 넘김 멈추기");
}

updatePauseButton();
setHeroWordImmediately(0);
startHeroRotation();

if (heroNext) {
  heroNext.addEventListener("click", () => {
    goToNextHeroWord();
  });
}

if (heroPrev) {
  heroPrev.addEventListener("click", () => {
    goToPrevHeroWord();
  });
}

if (heroPause) {
  heroPause.addEventListener("click", () => {
    isHeroPaused = !isHeroPaused;
    updatePauseButton();
  });
}

const projectImages = document.querySelectorAll(".project-image");
const imageModal = document.querySelector("#imageModal");
const imageModalContent = document.querySelector("#imageModalContent");
const imageModalClose = document.querySelector("#imageModalClose");

function closeImageModal() {
  if (!imageModal || !imageModalContent) {
    return;
  }

  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  imageModalContent.removeAttribute("src");
  imageModalContent.alt = "";
  document.body.style.overflow = "";
}

function openImageModal(image) {
  if (!imageModal || !imageModalContent) {
    return;
  }

  imageModalContent.src = image.currentSrc || image.src;
  imageModalContent.alt = image.alt || "프로젝트 이미지";
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

projectImages.forEach((image) => {
  image.addEventListener("click", () => openImageModal(image));
});

if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-modal-close")) {
      closeImageModal();
    }
  });
}

if (imageModalClose) {
  imageModalClose.addEventListener("click", closeImageModal);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal?.classList.contains("is-open")) {
    closeImageModal();
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
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
