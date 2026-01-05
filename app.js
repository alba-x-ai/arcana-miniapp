document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready(); // ❗ ТОЛЬКО ЭТО. БОЛЬШЕ НИЧЕГО ОТ TELEGRAM UI.

  const user = tg.initDataUnsafe?.user;
  if (!user) {
    alert("Не удалось получить данные пользователя");
    return;
  }

  /* ---------- LANGUAGE ---------- */
  const SUPPORTED_LANGS = ["ru", "en"];
  const LANG = SUPPORTED_LANGS.includes(user.language_code)
    ? user.language_code
    : "ru";

  /* ---------- TEXTS ---------- */
  const TEXTS = {
    ru: {
      day: "Карта дня",
      question: "Карта вопроса",
      reversed: "Перевёрнутая"
    },
    en: {
      day: "Card of the Day",
      question: "Card for a Question",
      reversed: "Reversed"
    }
  };

  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");

  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const resultBlock  = document.getElementById("result");

  cardButton.textContent     = TEXTS[LANG].day;
  questionButton.textContent = TEXTS[LANG].question;

  /* ---------- LOAD CARDS ---------- */
  let cardsData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data);

  /* ---------- DAY TEXTS ---------- */
  const DAY_TEXTS = {
    8: { ru: "Мягкая сила.", en: "Gentle strength." }
  };

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await response.json();
    showDayCard(data.card, data.reversed);
  }

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    const cardIndex = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;
    showQuestionCard(cardIndex, reversed);
  }

  function showDayCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);
    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = DAY_TEXTS[cardIndex]?.[LANG] ?? "";

    cardPosition.classList.add("hidden");
    resultBlock.classList.remove("hidden");
  }

  function showQuestionCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);
    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = reversed
      ? card.reversed[LANG]
      : card.upright[LANG];

    if (reversed) {
      cardPosition.textContent = TEXTS[LANG].reversed;
      cardPosition.classList.remove("hidden");
    } else {
      cardPosition.classList.add("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  function renderImage(cardIndex, reversed) {
    const fileIndex = String(cardIndex).padStart(2, "0");
    cardImage.src = `./images/cards/${fileIndex}.png`;
    cardImage.style.transform =
      reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
