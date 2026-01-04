document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Telegram ---------- */
  const tg = window.Telegram.WebApp;
  tg.ready();

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

  /* ---------- Backend ---------- */
  const API_URL = "https://arcana-1.onrender.com/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");

  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const resultBlock  = document.getElementById("result");

  /* ---------- Data ---------- */
  let cardsData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data)
    .catch(err => {
      console.error("cards.json load error", err);
      alert("Ошибка загрузки данных карт");
    });

  /* ---------- Card of the Day (server) ---------- */
  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const data = await response.json();
      showCard(data.card, data.reversed);

    } catch (err) {
      console.error(err);
      alert("Ошибка получения карты дня");
    }
  }

  /* ---------- Card for Question (local random) ---------- */
  function getQuestionCard() {
    const cardIndex = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;
    showCard(cardIndex, reversed);
  }

  /* ---------- Show Card ---------- */
  function showCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    // image
    const fileIndex = String(cardIndex).padStart(2, "0");
    const baseUrl = new URL(document.baseURI);
    cardImage.src =
      `${baseUrl.origin}${baseUrl.pathname}images/cards/${fileIndex}.png`;

    cardImage.classList.remove("hidden");
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";

    // text
    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = reversed
      ? card.reversed[LANG]
      : card.upright[LANG];

    cardPosition.classList.toggle("hidden", !reversed);
    resultBlock.classList.remove("hidden");
  }

  /* ---------- Events ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
