const screens = document.querySelectorAll(".screen");
function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- LANGUAGE ---------- */
let LANG = "ru";

if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
  const tgLang = Telegram.WebApp.initDataUnsafe.user.language_code;
  LANG = tgLang.startsWith("en") ? "en" : "ru";
}

/* ---------- DOM ---------- */
const btnDay = document.getElementById("btn-day");
const btnQuestion = document.getElementById("btn-question");
const btnGlossary = document.getElementById("btn-glossary");
const btnBack = document.getElementById("btn-back");
const btnBackFromGlossary = document.getElementById("btn-back-from-glossary");
const btnBackToGlossary = document.getElementById("btn-back-to-glossary");

const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardText  = document.getElementById("card-text");

/* --- glossary DOM --- */
const glossaryImage = document.getElementById("glossary-card-image");
const glossaryTitle = document.getElementById("glossary-title");
const glossaryArchetype = document.getElementById("glossary-archetype");
const glossaryDescription = document.getElementById("glossary-description");
const glossaryUpright = document.getElementById("glossary-upright");
const glossaryReversed = document.getElementById("glossary-reversed");

/* ---------- BACKEND ---------- */
const API_URL =
  "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

/* ---------- EVENTS ---------- */
btnDay.onclick = () => {
  show("card-screen");
  loadDayCard();
};

btnQuestion.onclick = () => {
  show("card-screen");
  loadQuestionCard();
};

btnGlossary.onclick = () => {
  show("glossary");
  loadGlossary();
};

btnBack.onclick = () => show("home");
btnBackFromGlossary.onclick = () => show("home");
btnBackToGlossary.onclick = () => show("glossary");

/* ---------- CARD DAY ---------- */
async function loadDayCard() {
  let userId = 1;
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    userId = Telegram.WebApp.initDataUnsafe.user.id;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId })
  });

  const { card, reversed } = await res.json();
  const texts = await (await fetch("texts/day-texts.json")).json();
  const pos = reversed ? "reversed" : "upright";

  render(card, reversed, texts[card][LANG][pos]);
}

/* ---------- QUESTION CARD ---------- */
async function loadQuestionCard() {
  const cards = await (await fetch("cards.json")).json();
  const id = Math.floor(Math.random() * 22);
  const rev = Math.random() < 0.5;

  const text = rev
    ? cards[id].reversed[LANG]
    : cards[id].upright[LANG];

  render(id, rev, text);
}

/* ---------- RENDER ---------- */
function render(id, reversed, text) {
  cardImage.src = `images/cards/${String(id).padStart(2,"0")}.png`;
  cardImage.style.transform = reversed ? "rotate(180deg)" : "none";
  cardTitle.textContent = getName(id);
  cardText.textContent = text;
}

function getName(id) {
  const names = [
    { ru:"Шут", en:"The Fool" },
    { ru:"Маг", en:"The Magician" },
    { ru:"Жрица", en:"The High Priestess" },
    { ru:"Императрица", en:"The Empress" },
    { ru:"Император", en:"The Emperor" },
    { ru:"Иерофант", en:"The Hierophant" },
    { ru:"Влюблённые", en:"The Lovers" },
    { ru:"Колесница", en:"The Chariot" },
    { ru:"Сила", en:"Strength" },
    { ru:"Отшельник", en:"The Hermit" },
    { ru:"Колесо Фортуны", en:"Wheel of Fortune" },
    { ru:"Справедливость", en:"Justice" },
    { ru:"Повешенный", en:"The Hanged Man" },
    { ru:"Смерть", en:"Death" },
    { ru:"Умеренность", en:"Temperance" },
    { ru:"Дьявол", en:"The Devil" },
    { ru:"Башня", en:"The Tower" },
    { ru:"Звезда", en:"The Star" },
    { ru:"Луна", en:"The Moon" },
    { ru:"Солнце", en:"The Sun" },
    { ru:"Суд", en:"Judgement" },
    { ru:"Мир", en:"The World" }
  ];

  return names[id][LANG];
}

/* ---------- GLOSSARY ---------- */
let glossaryData = null;
const grid = document.getElementById("glossary-grid");

async function loadGlossary() {
  if (!glossaryData) {
    glossaryData = await (await fetch("glossary/glossary.json")).json();
  }

  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {
    const div = document.createElement("div");
    div.className = "glossary-item";
    div.textContent = glossaryData[id].name[LANG];
    div.onclick = () => openGlossaryCard(id);
    grid.appendChild(div);
  });
}

function openGlossaryCard(id) {
  const c = glossaryData[id];
  show("glossary-card");

  glossaryImage.src =
    `images/cards/${String(id).padStart(2,"0")}.png`;

  glossaryTitle.textContent = c.name[LANG];
  glossaryArchetype.textContent = c.archetype?.[LANG] || "";
  glossaryDescription.textContent = c.description[LANG];
  glossaryUpright.textContent = c.upright[LANG];
  glossaryReversed.textContent = c.reversed[LANG];
}
