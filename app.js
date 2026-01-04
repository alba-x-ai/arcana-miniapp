document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Telegram ---------- */
  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) {
    alert("Не удалось получить данные пользователя");
    return;
  }

  /* ---------- Language ---------- */
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

  /* ---------- DATA ---------- */
  let cardsData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data)
    .catch(() => alert("Ошибка загрузки cards.json"));

  /* ---------- TEXTS FOR CARD OF THE DAY ---------- */
  const DAY_TEXTS = {
    0: {
      ru: "Сегодня важно позволить себе быть в движении, не требуя от себя чёткого плана.",
      en: "Today invites you to move forward without demanding a clear plan."
    },
    9: {
      ru: "День располагает к тишине и внутренней настройке. Не всё требует немедленного действия.",
      en: "The day supports silence and inner alignment. Not everything needs immediate action."
    },
    13: {
      ru: "Сегодня завершается один внутренний цикл, освобождая место для нового.",
      en: "Today marks the end of an inner cycle, making space for something new."
    }
    // остальные карты можно добавить постепенно
  };

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      });

      const data = await response.json();
      showDayCard(data.card, data.reversed);

    } catch {
      alert("Ошибка получения карты дня");
    }
  }

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    const cardIndex = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;
    showQuestionCard(cardIndex, reversed);
  }

  /* ---------- RENDER: DAY ---------- */
  function showDayCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);

    cardName.textContent = card.name[LANG];

    // берём специальный текст дня, если есть
    cardMeaning.textContent =
      DAY_TEXTS[cardIndex]?.[LANG]
      || card.upright[LANG]; // fallback

    cardPosition.classList.add("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- RENDER: QUESTION ---------- */
  function showQuestionCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);

    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = reversed
      ? card.reversed[LANG]
      : card.upright[LANG];

    cardPosition.classList.toggle("hidden", !reversed);
    resultBlock.classList.remove("hidden");
  }

  /* ---------- IMAGE ---------- */
  function renderImage(cardIndex, reversed) {
    const fileIndex = String(cardIndex).padStart(2, "0");
    const baseUrl = new URL(document.baseURI);

    cardImage.src =
      `${baseUrl.origin}${baseUrl.pathname}images/cards/${fileIndex}.png`;

    cardImage.classList.remove("hidden");
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
  }

  /* ---------- EVENTS ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
