/* ---------- SCREENS ---------- */
const screens = document.querySelectorAll(".screen");
function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- LANGUAGE ---------- */
let LANG = "ru";

if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
  const code = Telegram.WebApp.initDataUnsafe.user.language_code;
  LANG = code.startsWith("en") ? "en" : "ru";
}

/* ---------- DOM ---------- */
const grid = document.getElementById("glossary-grid");

const img = document.getElementById("glossary-image");
const title = document.getElementById("glossary-title");
const archetype = document.getElementById("glossary-archetype");
const description = document.getElementById("glossary-description");
const upright = document.getElementById("glossary-upright");
const reversed = document.getElementById("glossary-reversed");

const btnBackHome = document.getElementById("btn-back-home");
const btnBackList = document.getElementById("btn-back-list");

const listTitle = document.getElementById("glossary-list-title");
const labelUpright = document.getElementById("label-upright");
const labelReversed = document.getElementById("label-reversed");

/* ---------- UI TEXTS ---------- */
const UI = {
  ru: {
    listTitle: "Глоссарий Арканов",
    back: "← Назад",
    upright: "Прямое положение",
    reversed: "Перевёрнутое положение"
  },
  en: {
    listTitle: "Arcana Glossary",
    back: "← Back",
    upright: "Upright position",
    reversed: "Reversed position"
  }
};

/* ---------- APPLY UI TEXT ---------- */
listTitle.textContent = UI[LANG].listTitle;
btnBackHome.textContent = UI[LANG].back;
btnBackList.textContent = UI[LANG].back;
labelUpright.innerHTML = `<strong>${UI[LANG].upright}</strong>`;
labelReversed.innerHTML = `<strong>${UI[LANG].reversed}</strong>`;

/* ---------- DATA ---------- */
let glossaryData = null;

/* ---------- LOAD LIST ---------- */
async function loadGlossary() {
  if (!glossaryData) {
    const res = await fetch("glossary.json");
    glossaryData = await res.json();
  }

  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {
    const item = document.createElement("div");
    item.className = "glossary-item";
    item.textContent = glossaryData[id].name[LANG];
    item.onclick = () => openCard(id);
    grid.appendChild(item);
  });
}

/* ---------- OPEN CARD ---------- */
function openCard(id) {
  const c = glossaryData[id];

  img.src = `../images/cards/${String(id).padStart(2, "0")}.png`;
  img.style.transform = "none";

  title.textContent = c.name[LANG];
  archetype.textContent = c.archetype?.[LANG] || "";
  description.textContent = c.description[LANG];
  upright.textContent = c.upright[LANG];
  reversed.textContent = c.reversed[LANG];

  show("glossary-card");
}

/* ---------- EVENTS ---------- */
btnBackHome.onclick = () => {
  window.location.href = "../index.html";
};

btnBackList.onclick = () => {
  show("glossary-list");
};

/* ---------- INIT ---------- */
loadGlossary();
