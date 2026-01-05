document.addEventListener("DOMContentLoaded", () => {

  /* ================= TELEGRAM ================= */
  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) {
    alert("Не удалось получить данные пользователя Telegram");
    return;
  }

  /* ================= LANGUAGE ================= */
  const SUPPORTED_LANGS = ["ru", "en"];
  const LANG = SUPPORTED_LANGS.includes(user.language_code)
    ? user.language_code
    : "ru";

  /* ================= TEXTS ================= */
  const TEXTS = {
    ru: {
      dayButton: "Карта дня",
      questionButton: "Карта вопроса",
      reversed: "Перевёрнутая"
    },
    en: {
      dayButton: "Card of the Day",
      questionButton: "Card for a Question",
      reversed: "Reversed"
    }
  };

  /* ================= API ================= */
  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ================= DOM ================= */
  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");

  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const resultBlock  = document.getElementById("result");

  /* ================= BUTTON TEXT ================= */
  cardButton.textContent     = TEXTS[LANG].dayButton;
  questionButton.textContent = TEXTS[LANG].questionButton;

  /* ================= TELEGRAM BUTTONS ================= */
  tg.MainButton.setText(TEXTS[LANG].dayButton);
  tg.MainButton.show();

  tg.SecondaryButton.setText(TEXTS[LANG].questionButton);
  tg.SecondaryButton.show();

  /* ================= DATA ================= */
  let cardsData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => {
      cardsData = data;
    })
    .catch(err => {
      console.error("Failed to load cards.json", err);
    });

  /* ================= DAY TEXTS ================= */
  const DAY_TEXTS = {
    0:{ru:"День открывает новое пространство.",en:"The day opens new space."},
    1:{ru:"Сегодня намерение особенно важно.",en:"Intention matters today."},
    2:{ru:"День тишины и наблюдения.",en:"A day of silence and listening."},
    3:{ru:"Поддержка и рост.",en:"Support and growth."},
    4:{ru:"Структура даёт опору.",en:"Structure brings stability."},
    5:{ru:"Возвращение к ценностям.",en:"Return to values."},
    6:{ru:"Внутренний выбор.",en:"Inner choice."},
    7:{ru:"Движение вперёд.",en:"Forward movement."},
    8:{ru:"Мягкая сила.",en:"Gentle strength."},
    9:{ru:"Уединение.",en:"Solitude."},
    10:{ru:"Поворот момента.",en:"A turn of events."},
    11:{ru:"Баланс и честность.",en:"Balance and honesty."},
    12:{ru:"Пауза и иной взгляд.",en:"Pause and new perspective."},
    13:{ru:"Завершение.",en:"Completion."},
    14:{ru:"Мера и гармония.",en:"Harmony and moderation."},
    15:{ru:"Проявление привязок.",en:"Attachments surface."},
    16:{ru:"Разрушение старого.",en:"Breaking old forms."},
    17:{ru:"Надежда.",en:"Hope."},
    18:{ru:"Неясные чувства.",en:"Unclear emotions."},
    19:{ru:"Ясность.",en:"Clarity."},
    20:{ru:"Пробуждение.",en:"Awakening."},
    21:{ru:"Целостность.",en:"Wholeness."}
  };

  /* ================= CARD OF THE DAY ================= */
  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id
        })
      });

      if (!response.ok) {
        console.error("API error:", response.status);
        return;
      }

      const data = await response.json();
      showDayCard(data.card, data.reversed);

    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  /* ================= QUESTION CARD ================= */
  function getQuestionCard() {
    const cardIndex = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;
    showQuestionCard(cardIndex, reversed);
  }

  /* ================= RENDER ================= */
  function showDayCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);
    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = DAY_TEXTS[cardIndex][LANG];

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
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  /* ================= EVENTS ================= */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

  tg.MainButton.onClick(getCardOfTheDay);
  tg.SecondaryButton.onClick(getQuestionCard);

});
