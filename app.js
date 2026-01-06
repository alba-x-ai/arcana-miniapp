document.addEventListener("DOMContentLoaded", () => {

  /* ---------- TELEGRAM ---------- */
  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  /* ---------- LANGUAGE ---------- */
  const LANG = user.language_code === "en" ? "en" : "ru";

  /* ---------- BUTTON TEXT ---------- */
  const BUTTON_TEXTS = {
    ru: { day: "Карта дня", question: "Карта вопроса" },
    en: { day: "Card of the Day", question: "Question Card" }
  };

  /* ---------- API ---------- */
  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");

  const cardImage   = document.getElementById("cardImage");
  const cardName    = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");
  const resultBlock = document.getElementById("result");

  cardButton.textContent     = BUTTON_TEXTS[LANG].day;
  questionButton.textContent = BUTTON_TEXTS[LANG].question;

  /* ---------- DATA ---------- */
  let cardsData = {};
  let dayTexts  = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data);

  fetch("./texts/day-texts.json")
    .then(res => res.json())
    .then(data => dayTexts = data);

  /* ---------- HELPERS ---------- */
  function reset() {
    cardImage.classList.add("hidden");
    cardMeaning.classList.add("hidden");
  }

  function renderImage(index, reversed) {
    const fileIndex = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${fileIndex}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    reset();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await res.json();

    renderImage(data.card, data.reversed);

    cardName.textContent = cardsData[data.card].name[LANG];

    const text = data.reversed
      ? dayTexts[data.card][LANG].reversed
      : dayTexts[data.card][LANG].upright;

    cardMeaning.textContent = text;
    cardMeaning.classList.remove("hidden");

    resultBlock.classList.remove("hidden");
  }

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    reset();

    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderImage(index, reversed);

    cardName.textContent = cardsData[index].name[LANG];
    cardMeaning.textContent = reversed
      ? cardsData[index].reversed[LANG]
      : cardsData[index].upright[LANG];

    cardMeaning.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- EVENTS ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
