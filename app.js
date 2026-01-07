const screens = document.querySelectorAll(".screen");
function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
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

  render(card, reversed, texts[card].ru[pos]);
}

/* ---------- QUESTION CARD ---------- */
async function loadQuestionCard() {
  const cards = await (await fetch("cards.json")).json();
  const id = Math.floor(Math.random() * 22);
  const rev = Math.random() < 0.5;
  const text = rev ? cards[id].reversed.ru : cards[id].upright.ru;

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
  return [
    "Шут","Маг","Жрица","Императрица","Император",
    "Иерофант","Влюблённые","Колесница","Сила","Отшельник",
    "Колесо Фортуны","Справедливость","Повешенный","Смерть",
    "Умеренность","Дьявол","Башня","Звезда","Луна",
    "Солнце","Суд","Мир"
  ][id];
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
    div.textContent = glossaryData[id].name.ru;
    div.onclick = () => openGlossaryCard(id);
    grid.appendChild(div);
  });
}

function openGlossaryCard(id) {
  const c = glossaryData[id];
  show("glossary-card");

  document.getElementById("glossary-title").textContent = c.name.ru;
  document.getElementById("glossary-archetype").textContent = c.archetype.ru;
  document.getElementById("glossary-description").textContent = c.description.ru;
  document.getElementById("glossary-upright").textContent = c.upright.ru;
  document.getElementById("glossary-reversed").textContent = c.reversed.ru;
}
