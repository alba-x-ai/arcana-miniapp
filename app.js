document.addEventListener("DOMContentLoaded", () => {

  /* ---------- TELEGRAM ---------- */
  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  /* ---------- LANGUAGE ---------- */
  const LANG = user.language_code === "en" ? "en" : "ru";

  /* ---------- BUTTON TEXTS ---------- */
  const BUTTON_TEXTS = {
    ru: {
      day: "Карта дня",
      question: "Карта вопроса",
      glossary: "Глоссарий"
    },
    en: {
      day: "Card of the Day",
      question: "Question Card",
      glossary: "Glossary"
    }
  };

  /* ---------- DAY REVERSED COMMENT ---------- */
  const DAY_REVERSED_COMMENT = {
    ru: "Перевёрнутая позиция добавляет внутренний оттенок.",
    en: "The reversed position adds an inner nuance."
  };

  /* ---------- API ---------- */
  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");

  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const glossaryGrid = document.getElementById("glossaryGrid");
  const resultBlock  = document.getElementById("result");

  /* ---------- APPLY BUTTON TEXT ---------- */
  cardButton.textContent     = BUTTON_TEXTS[LANG].day;
  questionButton.textContent = BUTTON_TEXTS[LANG].question;
  glossaryButton.textContent = BUTTON_TEXTS[LANG].glossary;

  /* ---------- LOAD DATA ---------- */
  let cardsData = {};
  let glossaryData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data);

  fetch("./glossary/cards.json")
    .then(res => res.json())
    .then(data => glossaryData = data);

  /* ---------- POETIC DAY TEXTS (22) ---------- */
  const DAY_TEXTS = {
    0:{ru:"День начинается с чистого шага. Достаточно быть открытой движению.",en:"The day begins with a clean step. Openness to movement is enough."},
    1:{ru:"Сегодня намерение формирует пространство.",en:"Today intention shapes space."},
    2:{ru:"Тишина несёт ответы.",en:"Silence carries answers."},
    3:{ru:"Рост поддерживается заботой.",en:"Growth is supported by care."},
    4:{ru:"Опора важнее скорости.",en:"Stability matters more than speed."},
    5:{ru:"Внутренние ориентиры становятся яснее.",en:"Inner values become clearer."},
    6:{ru:"Сегодня важен честный внутренний выбор.",en:"An honest inner choice matters today."},
    7:{ru:"Движение задаёт направление.",en:"Movement sets direction."},
    8:{ru:"Сила проявляется мягко.",en:"Strength appears gently."},
    9:{ru:"Уединение помогает услышать себя.",en:"Solitude helps you hear yourself."},
    10:{ru:"Ритм меняется — будь гибкой.",en:"The rhythm shifts — stay flexible."},
    11:{ru:"Честность возвращает баланс.",en:"Honesty restores balance."},
    12:{ru:"Пауза открывает новый взгляд.",en:"Pause opens a new perspective."},
    13:{ru:"Завершение освобождает пространство.",en:"Endings free space."},
    14:{ru:"Мера создаёт гармонию.",en:"Moderation creates harmony."},
    15:{ru:"Привязанности становятся заметны.",en:"Attachments become visible."},
    16:{ru:"Иллюзии разрушаются.",en:"Illusions collapse."},
    17:{ru:"Тихая надежда присутствует.",en:"Quiet hope is present."},
    18:{ru:"Будь бережна с чувствами.",en:"Handle feelings gently."},
    19:{ru:"Ясность возвращает энергию.",en:"Clarity restores energy."},
    20:{ru:"Внутренний зов требует внимания.",en:"An inner call asks for attention."},
    21:{ru:"Целостность уже здесь.",en:"Wholeness is already here."}
  };

  /* ---------- HELPERS ---------- */
  function resetContent() {
    cardImage.classList.add("hidden");
    cardMeaning.classList.add("hidden");
    cardPosition.classList.add("hidden");
    glossaryGrid.classList.add("hidden");
    glossaryGrid.innerHTML = "";
  }

  function renderImage(index, reversed) {
    const fileIndex = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${fileIndex}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    resetContent();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await res.json();

    renderImage(data.card, data.reversed);

    cardName.textContent = cardsData[data.card].name[LANG];
    cardMeaning.textContent = DAY_TEXTS[data.card][LANG];
    cardMeaning.classList.remove("hidden");

    if (data.reversed) {
      cardPosition.textContent = DAY_REVERSED_COMMENT[LANG];
      cardPosition.classList.remove("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    resetContent();

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

  /* ---------- GLOSSARY (INLINE MODE) ---------- */
  function openGlossary() {
    resetContent();

    cardName.textContent =
      LANG === "ru" ? "Глоссарий Арканов" : "Arcana Glossary";

    Object.entries(glossaryData).forEach(([index, card]) => {
      const item = document.createElement("div");
      item.className = "glossary-card";
      item.innerHTML = `
        <div class="glossary-card-title">
          ${card.name[LANG]}
        </div>
      `;

      item.addEventListener("click", () => {
        resetContent();

        cardName.textContent = card.name[LANG];
        cardMeaning.innerHTML = `
          <p>${card.description[LANG]}</p>
          <p><strong>${LANG === "ru" ? "Прямое значение:" : "Upright meaning:"}</strong><br>
          ${card.upright[LANG]}</p>
          <p><strong>${LANG === "ru" ? "Перевёрнутое значение:" : "Reversed meaning:"}</strong><br>
          ${card.reversed[LANG]}</p>
        `;
        cardMeaning.classList.remove("hidden");
      });

      glossaryGrid.appendChild(item);
    });

    glossaryGrid.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- EVENTS ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);
  glossaryButton.addEventListener("click", openGlossary);

});
