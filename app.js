/* ===============================
   LANGUAGE
================================ */

let LANG = "en";

if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code === "ru") {
  LANG = "ru";
}

/* ===============================
   UI TEXTS
================================ */

let UI = null;

async function loadUI() {
  UI = await (await fetch("texts/ui-texts.json")).json();
  applyUI();
}

function applyUI() {
  document.getElementById("title").textContent = UI[LANG].title;

  btnDay.textContent = UI[LANG].btn_day;
  btnQuestion.textContent = UI[LANG].btn_question;
  btnGlossary.textContent = UI[LANG].btn_glossary;

  document.querySelectorAll(".btn-back").forEach(
    b => b.textContent = UI[LANG].btn_back
  );

  const glossaryTitle = document.getElementById("glossary-title-main");
  if (glossaryTitle) {
    glossaryTitle.textContent = UI[LANG].glossary_title;
  }
}

/* ===============================
   SCREENS
================================ */

const screens = document.querySelectorAll(".screen");

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===============================
   DOM
================================ */

const btnDay = document.getElementById("btn-day");
const btnQuestion = document.getElementById("btn-question");
const btnGlossary = document.getElementById("btn-glossary");

const btnBack = document.getElementById("btn-back");
const btnBackFromGlossary = document.getElementById("btn-back-from-glossary");
const btnBackToGlossary = document.getElementById("btn-back-to-glossary");

const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardText  = document.getElementById("card-text");

/* ===============================
   SAFE EVENT BINDER
================================ */

function bindTap(el, handler) {
  if (!el) return;
  el.addEventListener("touchstart", e => {
    e.preventDefault();
    handler();
  }, { passive: false });

  el.addEventListener("click", handler);
}

/* ===============================
   BACKEND
================================ */

const API_URL =
  "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

/* ===============================
   EVENTS
================================ */

bindTap(btnDay, async () => {
  show("card-screen");
  await loadDayCard();
});

bindTap(btnQuestion, async () => {
  show("card-screen");
  await loadQuestionCard();
});

bindTap(btnGlossary, () => {
  show("glossary");
  loadGlossary();
});

bindTap(btnBack, () => show("home"));
bindTap(btnBackFromGlossary, () => show("home"));
bindTap(btnBackToGlossary, () => show("glossary"));

/* ===============================
   HELPERS
================================ */

function getUserId() {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return Telegram.WebApp.initDataUnsafe.user.id;
  }
  return 1;
}

/* ===============================
   CARD OF THE DAY
================================ */

async function loadDayCard() {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: getUserId() })
  });

  const { card, reversed } = await res.json();
  const texts = await (await fetch("texts/day-texts.json")).json();
  const pos = reversed ? "reversed" : "upright";

  render(card, reversed, texts[card][LANG][pos]);
}

/* ===============================
   QUESTION CARD
================================ */

async function loadQuestionCard() {
  const cards = await (await fetch("cards.json")).json();
  const id = Math.floor(Math.random() * 22);
  const rev = Math.random() < 0.5;

  const text = rev
    ? cards[id].reversed[LANG]
    : cards[id].upright[LANG];

  render(id, rev, text);
}

/* ===============================
   RENDER
================================ */

function render(id, reversed, text) {
  cardImage.src = `images/cards/${String(id).padStart(2, "0")}.png`;
  cardImage.style.transform = reversed ? "rotate(180deg)" : "none";
  cardTitle.textContent = getName(id);
  cardText.textContent = text;
}

function getName(id) {
  return {
    ru: [
      "Шут","Маг","Жрица","Императрица","Император",
      "Иерофант","Влюблённые","Колесница","Сила","Отшельник",
      "Колесо Фортуны","Справедливость","Повешенный","Смерть",
      "Умеренность","Дьявол","Башня","Звезда","Луна",
      "Солнце","Суд","Мир"
    ],
    en: [
      "The Fool","The Magician","The High Priestess","The Empress","The Emperor",
      "The Hierophant","The Lovers","The Chariot","Strength","The Hermit",
      "Wheel of Fortune","Justice","The Hanged Man","Death",
      "Temperance","The Devil","The Tower","The Star","The Moon",
      "The Sun","Judgement","The World"
    ]
  }[LANG][id];
}

/* ===============================
   GLOSSARY
================================ */

let glossaryData = null;
const grid = document.getElementById("glossary-grid");

async function loadGlossary() {
  if (!glossaryData) {
    glossaryData = await (await fetch("glossary/glossary.json")).json();
  }

  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {
    const div = document.createElement("div");
    div.textContent = glossaryData[id].name[LANG];
    bindTap(div, () => openGlossaryCard(id));
    grid.appendChild(div);
  });
}

function openGlossaryCard(id) {
  const c = glossaryData[id];

  show("glossary-card");

  document.getElementById("glossary-title").textContent = c.name[LANG];
  document.getElementById("glossary-archetype").textContent = c.archetype[LANG];
  document.getElementById("glossary-description").textContent = c.description[LANG];
  document.getElementById("glossary-upright").textContent = c.upright[LANG];
  document.getElementById("glossary-reversed").textContent = c.reversed[LANG];
}

/* ===============================
   INIT
================================ */

loadUI();

if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
}
