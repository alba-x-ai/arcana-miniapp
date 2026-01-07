/* =========================================================
   LANGUAGE
   По умолчанию — EN
   Если язык Telegram = ru → RU
========================================================= */

let LANG = "en";

if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code === "ru") {
  LANG = "ru";
}

/* =========================================================
   SCREENS
========================================================= */

const screens = document.querySelectorAll(".screen");

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* =========================================================
   DOM
========================================================= */

const grid = document.getElementById("glossary-grid");

const btnBackHome = document.getElementById("btn-back-home");
const btnBackList = document.getElementById("btn-back-list");

const img = document.getElementById("glossary-image");
const title = document.getElementById("glossary-title");
const description = document.getElementById("glossary-description");
const upright = document.getElementById("glossary-upright");
const reversed = document.getElementById("glossary-reversed");

/* =========================================================
   BUTTON TEXTS
========================================================= */

btnBackHome.textContent = LANG === "ru" ? "← Назад" : "← Back";
btnBackList.textContent = LANG === "ru" ? "← К списку" : "← Back to list";

/* =========================================================
   DATA
========================================================= */

let glossaryData = null;

/* =========================================================
   LOAD GLOSSARY LIST
========================================================= */

async function loadGlossary() {
  if (!glossaryData) {
    glossaryData = await (await fetch("glossary.json")).json();
  }

  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {
    const card = glossaryData[id];

    const div = document.createElement("div");
    div.textContent = card.name[LANG];
    div.className = "glossary-item";

    div.onclick = () => openCard(id);

    grid.appendChild(div);
  });
}

/* =========================================================
   OPEN CARD
========================================================= */

function openCard(id) {
  const c = glossaryData[id];

  // image
  img.src = `../images/cards/${String(id).padStart(2, "0")}.png`;
  img.style.transform = "none";

  // texts
  title.textContent = c.name[LANG];
  description.textContent = c.description[LANG];
  upright.textContent = c.upright[LANG];
  reversed.textContent = c.reversed[LANG];

  show("glossary-card");
}

/* =========================================================
   EVENTS
========================================================= */

btnBackHome.onclick = () => {
  window.location.href = "../index.html";
};

btnBackList.onclick = () => {
  show("glossary-list");
};

/* =========================================================
   INIT
========================================================= */

show("glossary-list");
loadGlossary();
