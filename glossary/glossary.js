/* ================= LANGUAGE ================= */

let LANG = "en";
const tgLang =
  window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || "";

if (tgLang.toLowerCase().startsWith("ru")) {
  LANG = "ru";
}

/* ================= SCREENS ================= */

const screens = document.querySelectorAll(".screen");

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ================= DOM ================= */

const grid = document.getElementById("glossary-grid");

const btnBackHome = document.getElementById("btn-back-home");
const btnBackList = document.getElementById("btn-back-list");

const img = document.getElementById("glossary-image");
const title = document.getElementById("glossary-title");
const description = document.getElementById("glossary-description");
const upright = document.getElementById("glossary-upright");
const reversed = document.getElementById("glossary-reversed");

/* ================= BUTTON TEXT ================= */

btnBackHome.textContent = LANG === "ru" ? "← Назад" : "← Back";
btnBackList.textContent = LANG === "ru" ? "← К списку" : "← Back";

/* ================= DATA ================= */

let glossaryData = null;

/* ================= LOAD LIST ================= */

async function loadGlossary() {
  glossaryData = await (await fetch("glossary.json")).json();
  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {
    const card = glossaryData[id];

    const item = document.createElement("div");
    item.textContent = card.name[LANG];
    item.onclick = () => openCard(id);

    grid.appendChild(item);
  });
}

/* ================= OPEN CARD ================= */

function openCard(id) {
  const c = glossaryData[id];

  img.src = `../images/cards/${String(id).padStart(2, "0")}.png`;

  title.textContent = c.name[LANG];
  description.textContent = c.description[LANG];
  upright.textContent = c.upright[LANG];
  reversed.textContent = c.reversed[LANG];

  show("glossary-card");
}

/* ================= EVENTS ================= */

btnBackHome.onclick = () => {
  window.location.href = "../index.html";
};

btnBackList.onclick = () => {
  show("glossary-list");
};

/* ================= INIT ================= */

show("glossary-list");
loadGlossary();
