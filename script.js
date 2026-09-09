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
    word: "Store Growth",
    subtitle: "지역의 관심과 고객 데이터를 읽고, 점포 방문과 매출 성장으로 연결하는 영업기획을 지향합니다.",
  },
  {
    word: "Local Insight",
    subtitle: "상권·축제·CRM 데이터를 결합해 고객이 다시 찾아올 이유를 설계하겠습니다.",
  },
  {
    word: "Field Execution",
    subtitle: "브랜드, 협력사, 현장을 조율해 아이디어가 실제 행사와 성과로 이어지게 만들겠습니다.",
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

const projectImages = document.querySelectorAll(".project-image, .profile-avatar img");
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



window.addEventListener("beforeprint", () => {
  heroWord?.getAnimations?.().forEach((animation) => animation.cancel());
  setHeroWordImmediately(activeHeroIndex);
  revealItems.forEach((item) => item.classList.add("is-visible"));
});

const festivalRegions = [
  { region: "서울", festivalCount: 68, visitors: 42548883, budgetM: 44942, foreign: 582875, topFestival: "2026 서울윈터페스타", topCity: "서울", topVisitors: 10983176, col: 2, row: 2 },
  { region: "부산", festivalCount: 61, visitors: 11815397, budgetM: 27960, foreign: 74761, topFestival: "제13회 해운대 빛축제", topCity: "해운대구", topVisitors: 3694744, col: 5, row: 4 },
  { region: "대구", festivalCount: 32, visitors: 2096219, budgetM: 14472, foreign: 12991, topFestival: "2026 대구치맥페스티벌", topCity: "대구", topVisitors: 745000, col: 4, row: 3 },
  { region: "인천", festivalCount: 26, visitors: 2147987, budgetM: 9497, foreign: 24010, topFestival: "제26회 소래포구축제", topCity: "남동구", topVisitors: 460000, col: 1, row: 2 },
  { region: "광주", festivalCount: 19, visitors: 2634535, budgetM: 24539, foreign: 55846, topFestival: "제16회 광주비엔날레", topCity: "광주", topVisitors: 720711, col: 2, row: 4 },
  { region: "대전", festivalCount: 23, visitors: 5162711, budgetM: 12403, foreign: 6147, topFestival: "제4회 2026 대전 0시 축제", topCity: "중구", topVisitors: 2161566, col: 3, row: 3 },
  { region: "울산", festivalCount: 31, visitors: 3823873, budgetM: 18070, foreign: 6292, topFestival: "2026 울산공업축제", topCity: "울산", topVisitors: 726000, col: 5, row: 5 },
  { region: "세종", festivalCount: 7, visitors: 502390, budgetM: 1973, foreign: 0, topFestival: "2026 세종한글축제", topCity: "세종", topVisitors: 315299, col: 3, row: 4 },
  { region: "경기", festivalCount: 150, visitors: 14074407, budgetM: 81491, foreign: 67464, topFestival: "제38회 여주도자기축제", topCity: "여주시", topVisitors: 1168050, col: 2, row: 3 },
  { region: "강원", festivalCount: 153, visitors: 12993712, budgetM: 66114, foreign: 148031, topFestival: "2026얼음나라 화천 산천어축제", topCity: "화천군", topVisitors: 1869785, col: 4, row: 1 },
  { region: "충북", festivalCount: 65, visitors: 7209469, budgetM: 31282, foreign: 7933, topFestival: "2026 청원생명축제", topCity: "청주시", topVisitors: 653185, col: 3, row: 2 },
  { region: "충남", festivalCount: 116, visitors: 14694407, budgetM: 59157, foreign: 257904, topFestival: "제29회 보령머드축제", topCity: "보령시", topVisitors: 1690359, col: 2, row: 5 },
  { region: "전북", festivalCount: 96, visitors: 7554485, budgetM: 45479, foreign: 59743, topFestival: "제96회 춘향제", topCity: "남원시", topVisitors: 1451276, col: 3, row: 5 },
  { region: "전남", festivalCount: 130, visitors: 11548573, budgetM: 47865, foreign: 23025, topFestival: "2026 화순 고인돌 가을꽃 축제", topCity: "화순군", topVisitors: 710000, col: 3, row: 6 },
  { region: "경북", festivalCount: 125, visitors: 10677491, budgetM: 47471, foreign: 15574, topFestival: "2026년 안동국제탈춤페스티벌", topCity: "안동시", topVisitors: 1600000, col: 5, row: 2 },
  { region: "경남", festivalCount: 109, visitors: 13433308, budgetM: 61898, foreign: 151627, topFestival: "제64회 진해군항제", topCity: "창원시", topVisitors: 3251000, col: 4, row: 5 },
  { region: "제주", festivalCount: 55, visitors: 1326903, budgetM: 12525, foreign: 15348, topFestival: "제19회 전농로 왕벚꽃 축제", topCity: "제주", topVisitors: 255700, col: 2, row: 6 },
];

const festivalStats = document.querySelector("#festivalStats");
const festivalMap = document.querySelector("#festivalMap");
const festivalDetail = document.querySelector("#festivalDetail");
const festivalRanking = document.querySelector("#festivalRanking");
const festivalRankingTitle = document.querySelector("#festivalRankingTitle");
const festivalMetricButtons = document.querySelectorAll("[data-festival-metric]");
let activeFestivalMetric = "visitors";
let activeFestivalRegion = "서울";

function formatFestivalNumber(value, unit = "") {
  return new Intl.NumberFormat("ko-KR").format(Math.round(value)) + unit;
}

function formatFestivalVisitors(value) {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(1).replace(".0", "") + "억 명";
  }

  if (value >= 10000) {
    return Math.round(value / 10000).toLocaleString("ko-KR") + "만 명";
  }

  return formatFestivalNumber(value, "명");
}

function getFestivalMetricValue(region) {
  return activeFestivalMetric === "visitors" ? region.visitors : region.festivalCount;
}

function getFestivalMetricLabel(region) {
  return activeFestivalMetric === "visitors"
    ? formatFestivalVisitors(region.visitors)
    : formatFestivalNumber(region.festivalCount, "개");
}

function renderFestivalStats() {
  if (!festivalStats) {
    return;
  }

  const totalFestivals = festivalRegions.reduce((sum, region) => sum + region.festivalCount, 0);
  const totalVisitors = festivalRegions.reduce((sum, region) => sum + region.visitors, 0);
  const topVisitorRegion = [...festivalRegions].sort((a, b) => b.visitors - a.visitors)[0];
  const topCountRegion = [...festivalRegions].sort((a, b) => b.festivalCount - a.festivalCount)[0];

  festivalStats.innerHTML = [
    { label: "Total Festivals", value: formatFestivalNumber(totalFestivals, "개"), note: "2026년 개최 계획 기준" },
    { label: "Total Visitors", value: formatFestivalVisitors(totalVisitors), note: "전년 방문객수 합계" },
    { label: "Demand Lead", value: topVisitorRegion.region, note: formatFestivalVisitors(topVisitorRegion.visitors) },
    { label: "Activation Lead", value: topCountRegion.region, note: formatFestivalNumber(topCountRegion.festivalCount, "개 축제") },
  ]
    .map(
      (stat) => `<div class="festival-stat"><span>${stat.label}</span><strong>${stat.value}</strong><p>${stat.note}</p></div>`
    )
    .join("");
}

function renderFestivalMap() {
  if (!festivalMap) {
    return;
  }

  const values = festivalRegions.map(getFestivalMetricValue);
  const min = Math.min(...values);
  const max = Math.max(...values);

  festivalMap.innerHTML = festivalRegions
    .map((region) => {
      const value = getFestivalMetricValue(region);
      const heat = max === min ? 40 : 16 + ((value - min) / (max - min)) * 48;
      return `
        <button
          class="festival-region${region.region === activeFestivalRegion ? " is-active" : ""}"
          type="button"
          data-festival-region="${region.region}"
          style="grid-column: ${region.col}; grid-row: ${region.row}; --heat: ${heat.toFixed(1)}"
          aria-pressed="${region.region === activeFestivalRegion}"
        >
          <span class="festival-region-name">${region.region}</span>
          <span class="festival-region-value">${getFestivalMetricLabel(region)}</span>
        </button>`;
    })
    .join("");

  festivalMap.querySelectorAll("[data-festival-region]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFestivalRegion = button.dataset.festivalRegion;
      renderFestivalMap();
      renderFestivalDetail();
    });
  });
}

function renderFestivalDetail() {
  if (!festivalDetail) {
    return;
  }

  const region = festivalRegions.find((item) => item.region === activeFestivalRegion) || festivalRegions[0];
  const visitorRank = [...festivalRegions].sort((a, b) => b.visitors - a.visitors).findIndex((item) => item.region === region.region) + 1;
  const countRank = [...festivalRegions].sort((a, b) => b.festivalCount - a.festivalCount).findIndex((item) => item.region === region.region) + 1;

  festivalDetail.innerHTML = `
    <p class="next-kicker">SELECTED REGION</p>
    <h3>${region.region}</h3>
    <div class="festival-detail-metrics">
      <div class="festival-detail-metric"><span>축제 수</span><strong>${formatFestivalNumber(region.festivalCount, "개")}</strong></div>
      <div class="festival-detail-metric"><span>전년 방문객수</span><strong>${formatFestivalVisitors(region.visitors)}</strong></div>
      <div class="festival-detail-metric"><span>축제당 평균 방문객</span><strong>${formatFestivalVisitors(region.visitors / region.festivalCount)}</strong></div>
      <div class="festival-detail-metric"><span>지역 순위</span><strong>방문객 ${visitorRank}위 · 축제 수 ${countRank}위</strong></div>
    </div>
    <div class="festival-top-event">
      대표 집객 축제
      <strong>${region.topFestival}</strong>
      <span>${region.topCity} · ${formatFestivalVisitors(region.topVisitors)}</span>
    </div>
    <p class="tracker-description">지역별 축제 수는 실행 접점의 폭을, 방문객 규모는 집객 잠재력을 보여줍니다. 점포별 상권·CRM 데이터와 결합하면 지역 콘텐츠형 프로모션 우선순위를 판단할 수 있습니다.</p>
  `;
}

function renderFestivalRanking() {
  if (!festivalRanking || !festivalRankingTitle) {
    return;
  }

  const label = activeFestivalMetric === "visitors" ? "방문객" : "축제 수";
  festivalRankingTitle.textContent = `${label} 기준 상위 지역`;
  const rankedRegions = [...festivalRegions].sort((a, b) => getFestivalMetricValue(b) - getFestivalMetricValue(a)).slice(0, 6);

  festivalRanking.innerHTML = rankedRegions
    .map(
      (region, index) => `
        <li class="festival-ranking-item">
          <span class="festival-rank-number">${index + 1}</span>
          <span>
            <span class="festival-rank-region">${region.region}</span>
            <span class="festival-rank-event">${region.topFestival}</span>
          </span>
          <strong class="festival-rank-value">${getFestivalMetricLabel(region)}</strong>
        </li>`
    )
    .join("");
}

function renderFestivalTracker() {
  renderFestivalStats();
  renderFestivalMap();
  renderFestivalDetail();
  renderFestivalRanking();
}

festivalMetricButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFestivalMetric = button.dataset.festivalMetric;
    festivalMetricButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderFestivalMap();
    renderFestivalRanking();
  });
});

renderFestivalTracker();

const festivalByRegion = {
  "서울": [
    { name: "2026 서울윈터페스타", city: "서울", month: "12월", visitors: 10983176, type: "문화예술" },
    { name: "2026 송파구 벚꽃축제", city: "송파구", month: "4월", visitors: 8620000, type: "자연생태" },
    { name: "2026 서울라이트 광화문", city: "서울", month: "12월", visitors: 3118958, type: "문화예술" }
  ],
  "부산": [
    { name: "제13회 해운대 빛축제", city: "해운대구", month: "12월", visitors: 3694744, type: "문화예술" },
    { name: "광복로 겨울빛 트리축제", city: "중구", month: "12월", visitors: 3105529, type: "문화예술" },
    { name: "제21회 해운대모래축제", city: "해운대구", month: "5월", visitors: 1009910, type: "자연생태" }
  ],
  "대구": [
    { name: "2026 대구치맥페스티벌", city: "대구", month: "7월", visitors: 745000, type: "지역특산물" },
    { name: "제6회 떡볶이 페스티벌", city: "북구", month: "10월", visitors: 330000, type: "문화예술" },
    { name: "제20회 대구국제뮤지컬페스티벌", city: "대구", month: "6월", visitors: 139945, type: "문화예술" }
  ],
  "인천": [
    { name: "제26회 소래포구축제", city: "남동구", month: "10월", visitors: 460000, type: "자연생태" },
    { name: "송도세계문화 관광축제", city: "인천", month: "8월", visitors: 267003, type: "문화예술" },
    { name: "2026년 인천대공원 벚꽃축제", city: "인천", month: "4월", visitors: 256772, type: "문화예술" }
  ],
  "광주": [
    { name: "제16회 광주비엔날레", city: "광주", month: "9월", visitors: 720711, type: "문화예술" },
    { name: "제23회 광주 추억의 충장축제", city: "동구", month: "10월", visitors: 454215, type: "문화예술" },
    { name: "제5회 광주 버스킹 월드컵", city: "동구", month: "10월", visitors: 454215, type: "문화예술" }
  ],
  "대전": [
    { name: "제4회 2026 대전 0시 축제", city: "중구", month: "8월", visitors: 2161566, type: "문화예술" },
    { name: "제17회 유성국화축제", city: "유성구", month: "10월", visitors: 704156, type: "자연생태" },
    { name: "제29회 대전사이언스페스티벌", city: "유성구", month: "4월", visitors: 558269, type: "문화예술" }
  ],
  "울산": [
    { name: "2026 울산공업축제", city: "울산", month: "10월", visitors: 726000, type: "주민화합" },
    { name: "제5회 장생포 수국 페스티벌", city: "남구", month: "6월", visitors: 400000, type: "자연생태" },
    { name: "2026 태화강국가정원 봄꽃축제", city: "울산", month: "5월", visitors: 340907, type: "자연생태" }
  ],
  "경기": [
    { name: "제38회 여주도자기축제", city: "여주시", month: "5월", visitors: 1168050, type: "지역특산물" },
    { name: "제40회 이천도자기축제", city: "이천시", month: "4월", visitors: 1141000, type: "문화예술" },
    { name: "제63회 수원화성문화제", city: "수원시", month: "10월", visitors: 709154, type: "전통역사" }
  ],
  "강원": [
    { name: "2026얼음나라 화천 산천어축제", city: "화천군", month: "1월", visitors: 1869785, type: "자연생태" },
    { name: "강릉단오제", city: "강릉시", month: "6월", visitors: 956000, type: "전통역사" },
    { name: "제33회 태백산 눈축제", city: "태백시", month: "1월", visitors: 526304, type: "자연생태" }
  ],
  "충북": [
    { name: "2026 청원생명축제", city: "청주시", month: "10월", visitors: 653185, type: "지역특산물" },
    { name: "제26회 생거진천 농다리축제", city: "진천군", month: "시기 미정", visitors: 494542, type: "문화예술" },
    { name: "2026 보은대추축제", city: "보은군", month: "10월", visitors: 456190, type: "지역특산물" }
  ],
  "충남": [
    { name: "제29회 보령머드축제", city: "보령시", month: "7월", visitors: 1690359, type: "문화예술" },
    { name: "제44회 금산세계인삼축제", city: "금산군", month: "10월", visitors: 985000, type: "지역특산물" },
    { name: "제72회 백제문화제", city: "공주·부여", month: "10월", visitors: 984515, type: "전통역사" }
  ],
  "전북": [
    { name: "제96회 춘향제", city: "남원시", month: "4월", visitors: 1451276, type: "문화예술" },
    { name: "제23회 고창 청보리밭 축제", city: "고창군", month: "4월", visitors: 698589, type: "자연생태" },
    { name: "제30회 무주반딧불축제", city: "무주군", month: "9월", visitors: 421529, type: "자연생태" }
  ],
  "전남": [
    { name: "2026 화순 고인돌 가을꽃 축제", city: "화순군", month: "10월", visitors: 710000, type: "전통역사" },
    { name: "제25회 담양대나무축제", city: "담양군", month: "5월", visitors: 694928, type: "자연생태" },
    { name: "제25회 광양매화축제", city: "광양시", month: "3월", visitors: 642339, type: "자연생태" }
  ],
  "경북": [
    { name: "2026년 안동국제탈춤페스티벌", city: "안동시", month: "9월", visitors: 1600000, type: "전통역사" },
    { name: "경북영주 풍기인삼축제", city: "영주시", month: "10월", visitors: 497419, type: "지역특산물" },
    { name: "제21회 문경사과축제", city: "문경시", month: "10월", visitors: 463000, type: "지역특산물" }
  ],
  "경남": [
    { name: "제64회 진해군항제", city: "창원시", month: "3월", visitors: 3251000, type: "자연생태" },
    { name: "제26회 마산가고파국화축제", city: "창원시", month: "10월", visitors: 765000, type: "자연생태" },
    { name: "2026 진주남강유등축제", city: "진주시", month: "10월", visitors: 647530, type: "전통역사" }
  ],
  "제주": [
    { name: "제19회 전농로 왕벚꽃 축제", city: "제주", month: "3월", visitors: 255700, type: "자연생태" },
    { name: "와흘메밀문화제", city: "제주", month: "5월·10월", visitors: 116260, type: "지역특산물" },
    { name: "제26회 최남단 방어 축제", city: "제주", month: "11월", visitors: 100000, type: "지역특산물" }
  ]
};

const lotteBranchStores = {
  department: {
    label: "백화점",
    stores: [
      { name: "잠실점", region: "서울", district: "송파권", format: "도심 대형점" },
      { name: "본점", region: "서울", district: "명동·광화문권", format: "관광 핵심점" },
      { name: "강남점", region: "서울", district: "강남권", format: "프리미엄 상권" },
      { name: "영등포점", region: "서울", district: "서남권", format: "생활·교통 상권" },
      { name: "노원점", region: "서울", district: "동북권", format: "생활밀착점" },
      { name: "인천점", region: "인천", district: "인천권", format: "광역 거점" },
      { name: "동탄점", region: "경기", district: "동탄권", format: "신도시 거점" },
      { name: "수원점", region: "경기", district: "수원권", format: "경기 남부 거점" },
      { name: "부산본점", region: "부산", district: "서면권", format: "부산 핵심점" },
      { name: "광복점", region: "부산", district: "원도심 관광권", format: "관광 상권" },
      { name: "광주점", region: "광주", district: "광주권", format: "호남 거점" },
      { name: "대구점", region: "대구", district: "대구권", format: "광역 거점" },
      { name: "대전점", region: "대전", district: "대전권", format: "충청 거점" },
      { name: "울산점", region: "울산", district: "울산권", format: "광역 거점" },
      { name: "전주점", region: "전북", district: "전주권", format: "전북 거점" },
      { name: "창원점", region: "경남", district: "창원권", format: "경남 거점" },
      { name: "포항점", region: "경북", district: "동해안권", format: "지역 거점" }
    ]
  },
  outlet: {
    label: "아울렛",
    stores: [
      { name: "동부산점", region: "부산", district: "기장·해운대 관광권", format: "관광형 아울렛" },
      { name: "기흥점", region: "경기", district: "용인·수원권", format: "교외 체류형" },
      { name: "김해점", region: "경남", district: "김해·창원권", format: "광역 교외형" },
      { name: "이천점", region: "경기", district: "이천·여주권", format: "도자 관광권" },
      { name: "파주점", region: "경기", district: "경기 북부권", format: "관광형 아울렛" },
      { name: "부여점", region: "충남", district: "백제문화권", format: "역사 관광권" },
      { name: "광주수완점", region: "광주", district: "광주 생활권", format: "생활형 아울렛" },
      { name: "구리점", region: "경기", district: "동북 수도권", format: "생활형 아울렛" },
      { name: "대구율하점", region: "대구", district: "대구 동부권", format: "생활형 아울렛" },
      { name: "서울역점", region: "서울", district: "철도·관광 동선", format: "교통 거점" }
    ]
  },
  mall: {
    label: "쇼핑몰",
    stores: [
      { name: "광교점", region: "경기", district: "수원·광교권", format: "생활권 쇼핑몰" },
      { name: "광명점", region: "경기", district: "서남 수도권", format: "가족 체류형" },
      { name: "수지점", region: "경기", district: "용인·분당권", format: "생활권 쇼핑몰" },
      { name: "은평점", region: "서울", district: "서울 서북권", format: "생활권 쇼핑몰" },
      { name: "여수점", region: "전남", district: "여수 관광권", format: "관광 생활권" },
      { name: "진주점", region: "경남", district: "진주권", format: "지역 생활권" },
      { name: "피트인 산본점", region: "경기", district: "군포·안양권", format: "근린형 쇼핑몰" }
    ]
  },
  timevillas: {
    label: "타임빌라스",
    stores: [
      { name: "수원", region: "경기", district: "수원·경기 남부권", format: "프리미엄 라이프스타일" }
    ]
  }
};

const storeTypeTabs = document.querySelectorAll("[data-store-type]");
const storeButtonList = document.querySelector("#storeButtonList");
const storeLinkerResult = document.querySelector("#storeLinkerResult");
let activeStoreType = "department";
let activeStoreName = "잠실점";

function getActiveStores() {
  return lotteBranchStores[activeStoreType]?.stores || [];
}

function getSelectedStore() {
  return getActiveStores().find((store) => store.name === activeStoreName) || getActiveStores()[0];
}

function getRegionSummary(regionName) {
  return festivalRegions.find((region) => region.region === regionName);
}

function makeStoreIdeas(store, festivals) {
  const firstFestival = festivals[0];
  const secondFestival = festivals[1] || firstFestival;
  const thirdFestival = festivals[2] || firstFestival;

  return [
    {
      title: "축제 전 관심을 점포 사전예약으로 연결",
      body: `${firstFestival.name} 시즌에 맞춰 ${store.name}에서 로컬 F&B·굿즈·체험 팝업을 열고, 온라인 사전 예약 고객에게 현장 쿠폰을 제공합니다.`
    },
    {
      title: "축제 방문객의 다음 동선을 점포로 설계",
      body: `${store.district} 특성에 맞춰 축제장 방문 인증, 영수증 리워드, 교통 동선형 혜택을 결합해 축제 후 점포 방문을 유도합니다.`
    },
    {
      title: "CRM 세그먼트별 초청 행사로 매출 전환",
      body: `${secondFestival.type}·${thirdFestival.type} 관심 고객을 대상으로 우수고객 클래스, 가족 체험, 지역 브랜드 큐레이션을 나눠 운영합니다.`
    }
  ];
}

function renderStoreButtons() {
  if (!storeButtonList) {
    return;
  }

  const stores = getActiveStores();
  if (!stores.some((store) => store.name === activeStoreName)) {
    activeStoreName = stores[0]?.name || "";
  }

  storeButtonList.innerHTML = stores
    .map((store) => `
      <button
        class="store-button${store.name === activeStoreName ? " is-active" : ""}"
        type="button"
        data-store-name="${store.name}"
        aria-pressed="${store.name === activeStoreName}"
      >
        ${store.name}
      </button>
    `)
    .join("");

  storeButtonList.querySelectorAll("[data-store-name]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStoreName = button.dataset.storeName;
      renderStoreButtons();
      renderStoreResult();
    });
  });
}

function renderStoreResult() {
  if (!storeLinkerResult) {
    return;
  }

  const store = getSelectedStore();
  if (!store) {
    return;
  }

  const regionSummary = getRegionSummary(store.region);
  const festivals = festivalByRegion[store.region] || [];
  const ideas = makeStoreIdeas(store, festivals);
  const visitors = regionSummary ? regionSummary.visitors : festivals.reduce((sum, festival) => sum + festival.visitors, 0);
  const festivalCount = regionSummary ? regionSummary.festivalCount : festivals.length;

  storeLinkerResult.innerHTML = `
    <div class="store-result-hero">
      <div>
        <p class="next-kicker">${lotteBranchStores[activeStoreType].label} · ${store.format}</p>
        <h3>${store.name}</h3>
        <p>${store.district}의 점포 특성과 ${store.region} 지역 축제 수요를 연결해, 온라인 관심을 오프라인 체류와 구매로 확장합니다.</p>
      </div>
      <div class="store-result-badge">${store.region}<br>연계</div>
    </div>

    <div class="store-result-metrics">
      <div class="store-result-card"><span>지역 축제 수</span><strong>${formatFestivalNumber(festivalCount, "개")}</strong></div>
      <div class="store-result-card"><span>전년 방문객수</span><strong>${formatFestivalVisitors(visitors)}</strong></div>
      <div class="store-result-card"><span>대표 축제</span><strong>${festivals[0]?.name || "지역축제"}</strong></div>
    </div>

    <div class="store-result-grid">
      <div>
        <p class="next-kicker">POPULAR LOCAL FESTIVALS</p>
        <ul class="store-festival-list">
          ${festivals.map((festival) => `
            <li class="store-festival-card">
              <strong>${festival.name}</strong>
              <span>${festival.city} · ${festival.month} · ${festival.type} · ${formatFestivalVisitors(festival.visitors)}</span>
            </li>
          `).join("")}
        </ul>
      </div>
      <div class="store-idea-panel">
        <p class="next-kicker">POP-UP IDEA</p>
        <h4>${store.name} 실행 제안</h4>
        <ul class="store-idea-list">
          ${ideas.map((idea) => `
            <li class="store-idea-item">
              <strong>${idea.title}</strong>
              <span>${idea.body}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderStoreLinker() {
  if (!storeButtonList || !storeLinkerResult) {
    return;
  }

  renderStoreButtons();
  renderStoreResult();
}

storeTypeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeStoreType = tab.dataset.storeType;
    activeStoreName = getActiveStores()[0]?.name || "";
    storeTypeTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    renderStoreLinker();
  });
});

renderStoreLinker();
