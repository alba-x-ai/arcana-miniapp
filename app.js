document.addEventListener("DOMContentLoaded", () => {

/* ===============================
   LANGUAGE (FIXED)
================================ */

let LANG = "en";

if (window.Telegram?.WebApp?.language_code) {
  LANG = Telegram.WebApp.language_code;
}
else if (navigator.language) {
  LANG = navigator.language.slice(0, 2);
}

if (!["en", "ru"].includes(LANG)) {
  LANG = "en";
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

const btnShare = document.getElementById("btn-share");

const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardText  = document.getElementById("card-text");

const glossaryCardImage = document.getElementById("glossary-card-image");

const flipCard = document.getElementById("flip-card");

/* ===============================
   BACKEND
================================ */

const API_URL =
  "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

/* ===============================
   EVENTS
================================ */

btnDay.onclick = async () => {

  flipCard.classList.remove("flipped");

  show("card-screen");
  await loadDayCard();
};

btnQuestion.onclick = async () => {

  flipCard.classList.remove("flipped");

  show("card-screen");
  await loadQuestionCard();
};

btnGlossary.onclick = () => {
  show("glossary");
  loadGlossary();
};

btnBack.onclick = () => show("home");
btnBackFromGlossary.onclick = () => show("home");
btnBackToGlossary.onclick = () => show("glossary");

if (btnShare) {
  btnShare.onclick = generateShareImage;
}

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
   CARD STATE
================================ */

let currentCard = null;
let currentText = "";
let currentReversed = false;

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

  const texts =
    await (await fetch("texts/day-texts.json")).json();

  const pos = reversed ? "reversed" : "upright";

  const text = texts[card][LANG][pos];

  render(card, reversed, text);
}

/* ===============================
   QUESTION CARD
================================ */

async function loadQuestionCard() {

  const cards =
    await (await fetch("cards.json")).json();

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

  currentCard = id;
  currentText = text;
  currentReversed = reversed;

  cardImage.src =
    `images/cards/${String(id).padStart(2, "0")}.png`;

  cardImage.style.transform =
    reversed ? "rotate(180deg)" : "none";

  cardTitle.textContent = getName(id);
  cardText.textContent = text;

  setTimeout(()=>{
    flipCard.classList.add("flipped");
  },200);
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
   SHARE IMAGE GENERATOR
================================ */

function generateShareImage() {

  if (currentCard === null) return;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;

  const ctx = canvas.getContext("2d");

  const img = new Image();

  img.onload = () => {

    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0,0,1080,1080);

    ctx.fillStyle = "#e7d8b4";
    ctx.font = "80px Cormorant Garamond";
    ctx.textAlign = "center";

    ctx.fillText("ARCANA",540,120);

    const cardWidth = 360;
    const cardHeight = 630;

    ctx.save();

    if (currentReversed) {
      ctx.translate(540,520);
      ctx.rotate(Math.PI);
      ctx.drawImage(img,-cardWidth/2,-cardHeight/2,cardWidth,cardHeight);
    } else {
      ctx.drawImage(img,540-cardWidth/2,210,cardWidth,cardHeight);
    }

    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "60px Cormorant Garamond";

    const name = getName(currentCard);

    ctx.fillText(name,540,880);

    ctx.fillStyle = "#b8b8b8";
    ctx.font = "32px Cormorant Garamond";

    ctx.fillText("@arcana_app_bot",540,950);

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "arcana-card.png";
    link.click();
  };

  img.src =
    `images/cards/${String(currentCard).padStart(2,"0")}.png`;
}

/* ===============================
   GLOSSARY
================================ */

let glossaryData = null;
const grid = document.getElementById("glossary-grid");

async function loadGlossary() {

  if (!glossaryData) {
    glossaryData =
      await (await fetch("glossary/glossary.json")).json();
  }

  grid.innerHTML = "";

  Object.keys(glossaryData).forEach(id => {

    const div = document.createElement("div");

    div.textContent =
      glossaryData[id].name[LANG];

    div.onclick = () => openGlossaryCard(id);

    grid.appendChild(div);
  });
}

function openGlossaryCard(id) {

  const c = glossaryData[id];

  show("glossary-card");

  glossaryCardImage.src =
    `images/cards/${String(id).padStart(2, "0")}.png`;

  document.getElementById("glossary-title").textContent =
    c.name[LANG];

  document.getElementById("glossary-archetype").textContent =
    c.archetype[LANG];

  document.getElementById("glossary-description").textContent =
    c.description[LANG];

  document.getElementById("label-upright").textContent =
    LANG === "ru"
      ? "Прямое положение"
      : "Upright";

  document.getElementById("label-reversed").textContent =
    LANG === "ru"
      ? "Перевёрнутое положение"
      : "Reversed";

  document.getElementById("glossary-upright").textContent =
    c.upright[LANG];

  document.getElementById("glossary-reversed").textContent =
    c.reversed[LANG];
}

/* ===============================
   INIT
================================ */

loadUI();

if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
}

});
