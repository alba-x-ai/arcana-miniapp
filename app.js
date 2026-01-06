document.addEventListener("DOMContentLoaded", async () => {
  /* ---------- TELEGRAM ---------- */
  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  /* ---------- LANGUAGE ---------- */
  const LANG = user.language_code === "en" ? "en" : "ru";

  /* ---------- API ---------- */
  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");

  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");

  const glossaryContainer = document.getElementById("glossaryContainer");
  const resultBlock = document.getElementById("result");

  /* ---------- DATA ---------- */
  let cardsData = {};
  let dayTexts = {};

  await fetch("./cards.json")
    .then(r => r.json())
    .then(d => (cardsData = d));

  await fetch("./texts/day-texts.json")
    .then(r => r.json())
    .then(d => (dayTexts = d));

  /* ---------- HELPERS ---------- */
  function resetView() {
    resultBlock.classList.add("hidden");
    glossaryContainer.classList.add("hidden");

    cardImage.classList.add("hidden");
    cardPosition.classList.add("hidden");

    cardMeaning.innerHTML = "";
  }

  function renderImage(index, reversed) {
    const fileIndex = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${fileIndex}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    resetView();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await res.json();

    const card = cardsData[data.card];

    renderImage(data.card, data.reversed);

    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = dayTexts[data.card][LANG];

    if (data.reversed) {
      cardPosition.textContent =
        LANG === "ru"
          ? "Перевёрнутая позиция добавляет внутренний оттенок."
          : "The reversed position adds an inner nuance.";
      cardPosition.classList.remove("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    resetView();

    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;
    const card = cardsData[index];

    renderImage(index, reversed);

    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = reversed
      ? card.reversed[LANG]
      : card.upright[LANG];

    if (reversed) {
      cardPosition.textContent =
        LANG === "ru" ? "Перевёрнутая" : "Reversed";
      cardPosition.classList.remove("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  /* ---------- GLOSSARY ---------- */
  glossaryButton.addEventListener("click", async () => {
    resetView();
    glossaryContainer.classList.remove("hidden");

    if (!window.renderGlossary) {
      const script = document.createElement("script");
      script.src = "./glossary/glossary.js";
      document.body.appendChild(script);
    }
  });

  /* ---------- EVENTS ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);
});
