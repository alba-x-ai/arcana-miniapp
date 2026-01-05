document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready(); // ничего больше от Telegram UI

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

  const TEXTS = {
    ru: { day: "Карта дня", question: "Карта вопроса", reversed: "Перевёрнутая" },
    en: { day: "Card of the Day", question: "Card for a Question", reversed: "Reversed" }
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

  /* ---------- CARD OF THE DAY TEXTS ---------- */
  const DAY_TEXTS = {
    0:{ru:"День открывает пространство для нового опыта.",en:"The day opens space for new experience."},
    1:{ru:"Сегодня намерение формирует происходящее.",en:"Today intention shapes events."},
    2:{ru:"Внимание направлено внутрь.",en:"Attention turns inward."},
    3:{ru:"Поддержка и рост.",en:"Support and growth."},
    4:{ru:"Структура даёт устойчивость.",en:"Structure brings stability."},
    5:{ru:"Проявляются ценности.",en:"Values come forward."},
    6:{ru:"Внутренний выбор.",en:"Inner choice."},
    7:{ru:"Движение вперёд.",en:"Forward movement."},
    8:{ru:"Мягкая сила.",en:"Gentle strength."},
    9:{ru:"Уединение и настройка.",en:"Solitude and alignment."},
    10:{ru:"Поворот событий.",en:"A turn of events."},
    11:{ru:"Баланс и честность.",en:"Balance and honesty."},
    12:{ru:"Пауза и взгляд иначе.",en:"Pause and new perspective."},
    13:{ru:"Завершение цикла.",en:"Cycle completion."},
    14:{ru:"Гармония и мера.",en:"Harmony and moderation."},
    15:{ru:"Осознание привязанностей.",en:"Awareness of attachments."},
    16:{ru:"Разрушение старого.",en:"Breaking old forms."},
    17:{ru:"Надежда и восстановление.",en:"Hope and renewal."},
    18:{ru:"Неясные чувства.",en:"Unclear emotions."},
    19:{ru:"Ясность и тепло.",en:"Clarity and warmth."},
    20:{ru:"Внутренний зов.",en:"Inner calling."},
    21:{ru:"Целостность.",en:"Wholeness."}
  };

  async function getCardOfTheDay() {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });
    const data = await res.json();
    showDayCard(data.card, data.reversed);
  }

  function getQuestionCard() {
    const i = Math.floor(Math.random() * 22);
    const r = Math.random() < 0.5;
    showQuestionCard(i, r);
  }

  function showDayCard(i, r) {
    const card = cardsData[i];
    if (!card) return;

    renderImage(i, r);
    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = DAY_TEXTS[i][LANG];
    cardPosition.classList.add("hidden");
    resultBlock.classList.remove("hidden");
  }

  function showQuestionCard(i, r) {
    const card = cardsData[i];
    if (!card) return;

    renderImage(i, r);
    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = r ? card.reversed[LANG] : card.upright[LANG];

    if (r) {
      cardPosition.textContent = TEXTS[LANG].reversed;
      cardPosition.classList.remove("hidden");
    } else {
      cardPosition.classList.add("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  function renderImage(i, r) {
    const idx = String(i).padStart(2, "0");
    cardImage.src = `./images/cards/${idx}.png`;
    cardImage.style.transform = r ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
