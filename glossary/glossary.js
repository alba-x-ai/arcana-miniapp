/* =====================================================
   LANGUAGE
   Default: EN
   RU only if Telegram language === "ru"
===================================================== */

const lang =
  window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code === "ru"
    ? "ru"
    : "en";

/* =====================================================
   UI TEXT
===================================================== */

const UI = {
  title: {
    ru: "Глоссарий",
    en: "Glossary"
  },
  upright: {
    ru: "Прямое значение",
    en: "Upright meaning"
  },
  reversed: {
    ru: "Перевёрнутое значение",
    en: "Reversed meaning"
  },
  back: {
    ru: "← Назад",
    en: "← Back"
  }
};

/* =====================================================
   SCREENS
===================================================== */

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* =====================================================
   DOM
===================================================== */

const grid = document.getElementById("glossary-grid");

const titleEl = document.querySelector("#glossary-list .title");

const img = document.getElementById("glossary-image");
const title = document.getElementById("glossary-title");
const archetype = document.getElementById("glossary-archetype");
const description = document.getElementById("glossary-description");
const upright = document.getElementById("glossary-upright");
const reversed = document.getElementById("glossary-reversed");

const btnBackHome = document.getElementById("btn-back-home");
const btnBackList = document.getElementById("btn-back-list");

/* =====================================================
   APPLY UI LANGUAGE
===================================================== */

titleEl.textContent = UI.title[lang];
btnBackHome.textContent = UI.back[lang];
btnBackList.textContent = UI.back[lang];

document.querySelectorAll(".meanings strong")[0].textContent =
  UI.upright[lang];

document.querySelectorAll(".meanings strong")[1].textContent =
  UI.reversed[lang];

/* =====================================================
   DATA
===================================================== */

let glossaryData = null;

/* =====================================================
   LOAD LIST
===================================================== */

async function loadGlossary() {
  if (!glossaryData) {
    glossaryData = await fetch("glossary/glossary.json").then(r => r.json());
  }

  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {
    const card = glossaryData[id];

    const item = document.createElement("div");
    item.textContent = card.name[lang];
    item.onclick = () => openCard(id);

    grid.appendChild(item);
  });
}

/* =====================================================
   OPEN CARD
===================================================== */

function openCard(id) {
  const card = glossaryData[id];

  showScreen("glossary-card");

  img.src = `images/cards/${String(id).padStart(2, "0")}.png`;
  img.alt = card.name[lang];

  title.textContent = card.name[lang];
  archetype.textContent = card.archetype?.[lang] || "";
  description.textContent = card.description?.[lang] || "";

  upright.textContent = card.upright[lang];
  reversed.textContent = card.reversed[lang];
}

/* =====================================================
   NAVIGATION
===================================================== */

btnBackHome.onclick = () => showScreen("glossary-list");
btnBackList.onclick = () => showScreen("glossary-list");

/* =====================================================
   INIT
===================================================== */

loadGlossary();
