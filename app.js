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
    ru: "Перевёрнутая позиция добавляет скрытый оттенок и внутреннее сопротивление.",
    en: "The reversed position adds a hidden nuance and inner resistance."
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
  const resultBlock  = document.getElementById("result");
  const glossaryGrid = document.getElementById("glossaryGrid");

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

  /* ---------- POETIC DAY TEXTS ---------- */
  const DAY_TEXTS = {
    0:{ru:"День начинается с чистого шага. Достаточно быть открытой движению.",en:"The day begins with a clean step. Openness to movement is enough."},
    1:{ru:"Сегодня намерение формирует пространство. Внимание усиливает действие.",en:"Today intention shapes space. Attention amplifies action."},
    2:{ru:"Тишина несёт ответы. Не торопись с выводами.",en:"Silence carries answers. No need to rush conclusions."},
    3:{ru:"Рост поддерживается заботой и принятием.",en:"Growth is supported by care and acceptance."},
    4:{ru:"Опора важнее скорости. Структура создаёт устойчивость.",en:"Stability matters more than speed. Structure creates support."},
    5:{ru:"Внутренние ориентиры становятся яснее.",en:"Inner values become clearer."},
    6:{ru:"Сегодня важен честный внутренний выбор.",en:"An honest inner choice matters today."},
    7:{ru:"Движение задаёт направление. Доверься вектору.",en:"Movement sets direction. Trust the vector."},
    8:{ru:"Сила проявляется мягко, без давления.",en:"Strength manifests gently, without force."},
    9:{ru:"Уединение помогает услышать себя.",en:"Solitude helps you hear yourself."},
    10:{ru:"Ритм меняется. Будь гибкой к поворотам.",en:"The rhythm shifts. Stay flexible with turns."},
    11:{ru:"Честность возвращает баланс.",en:"Honesty restores balance."},
    12:{ru:"Пауза открывает новый взгляд.",en:"Pause opens a new perspective."},
    13:{ru:"Завершение освобождает пространство.",en:"Endings free space."},
    14:{ru:"Мера и плавность создают гармонию.",en:"Moderation and flow create harmony."},
    15:{ru:"Привязанности становятся заметны.",en:"Attachments become visible."},
    16:{ru:"Иллюзии разрушаются, открывая правду.",en:"Illusions collapse, revealing truth."},
    17:{ru:"Тихая надежда присутствует.",en:"Quiet hope is present."},
    18:{ru:"Будь бережна с неясными чувствами.",en:"Handle unclear feelings gently."},
    19:{ru:"Ясность возвращает энергию.",en:"Clarity restores energy."},
    20:{ru:"Внутренний зов требует внимания.",en:"An inner call asks for attention."},
    21:{ru:"Целостность уже достигнута.",en:"Wholeness is already reached."}
  };

  /* ---------- HELPERS ---------- */
  function hideAllViews() {
    cardImage.classList.add("hidden");
    cardMeaning.classList.add("hidden");
    cardPosition.classList.add("hidden");
    glossaryGrid.classList.add("hidden");
  }

  function renderImage(cardIndex, reversed) {
    const fileIndex = String(cardIndex).padStart(2, "0");
    cardImage.src = `./images/cards/${fileIndex}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

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

  function showDayCard(cardIndex, reversed) {
    hideAllViews();

    renderImage(cardIndex, reversed);

    cardName.textContent = cardsData[cardIndex].name[LANG];
    cardMeaning.textContent = DAY_TEXTS[cardIndex][LANG];
    cardMeaning.classList.remove("hidden");

    if (reversed) {
      cardPosition.textContent = DAY_REVERSED_COMMENT[LANG];
      cardPosition.classList.remove("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    hideAllViews();

    const cardIndex = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderImage(cardIndex, reversed);

    cardName.textContent = cardsData[cardIndex].name[LANG];
    cardMeaning.textContent = reversed
      ? cardsData[cardIndex].reversed[LANG]
      : cardsData[cardIndex].upright[LANG];

    cardMeaning.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- GLOSSARY GRID ---------- */
  function openGlossary() {
    hideAllViews();

    cardName.textContent =
      LANG === "ru" ? "Глоссарий Арканов" : "Arcana Glossary";

    glossaryGrid.innerHTML = "";

    Object.entries(glossaryData).forEach(([index, card]) => {
      const item = document.createElement("div");
      item.className = "glossary-card";

      item.innerHTML = `
        <div class="glossary-card-title">
          ${card.name[LANG]}
        </div>
      `;

      item.addEventListener("click", () => {
        openGlossaryCard(index);
      });

      glossaryGrid.appendChild(item);
    });

    glossaryGrid.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- GLOSSARY CARD VIEW ---------- */
  function openGlossaryCard(cardIndex) {
    hideAllViews();

    const card = glossaryData[cardIndex];

    cardName.textContent = card.name[LANG];

    cardMeaning.innerHTML = `
      <p>${card.description[LANG]}</p>
      <p><strong>${LANG === "ru" ? "Прямое значение:" : "Upright meaning:"}</strong><br>
      ${card.upright[LANG]}</p>
      <p><strong>${LANG === "ru" ? "Перевёрнутое значение:" : "Reversed meaning:"}</strong><br>
      ${card.reversed[LANG]}</p>
    `;

    cardMeaning.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- EVENTS ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);
  glossaryButton.addEventListener("click", openGlossary);

});
