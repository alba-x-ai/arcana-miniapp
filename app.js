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

  /* ---------- REVERSED COMMENT (DAY) ---------- */
  const DAY_REVERSED_COMMENT = {
    ru: "Перевёрнутая позиция указывает на внутренний оттенок или скрытое сопротивление.",
    en: "The reversed position points to an inner nuance or subtle resistance."
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

  /* ---------- APPLY BUTTON TEXT ---------- */
  cardButton.textContent     = BUTTON_TEXTS[LANG].day;
  questionButton.textContent = BUTTON_TEXTS[LANG].question;
  glossaryButton.textContent = BUTTON_TEXTS[LANG].glossary;

  /* ---------- LOAD CARDS (GLOSSARY DATA) ---------- */
  let cardsData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data);

  /* ---------- POETIC DAY TEXTS (22) ---------- */
  const DAY_TEXTS = {
    0:{ru:"День начинается с чистого шага. Не требуется план — достаточно открытости и доверия движению.",en:"The day begins with a clean step. No plan is required — openness and trust are enough."},
    1:{ru:"Сегодня намерение особенно действенно. Слова и решения формируют пространство.",en:"Today intention is especially potent. Words and choices shape the space around you."},
    2:{ru:"День располагает к тишине. Ответы приходят не через действие, а через внимательное слушание.",en:"The day invites silence. Answers come not through action, but through attentive listening."},
    3:{ru:"Сегодня поддержан рост. Забота, мягкость и принятие дают плод.",en:"Growth is supported today. Care, gentleness, and acceptance bring fruition."},
    4:{ru:"Структура и границы создают устойчивость. Опора важнее скорости.",en:"Structure and boundaries provide stability. Grounding matters more than speed."},
    5:{ru:"День напоминает о внутренних ориентирах. Истина раскрывается через смысл, а не форму.",en:"The day recalls inner values. Truth reveals itself through meaning, not form."},
    6:{ru:"Сегодня значим внутренний выбор. Согласие с собой важнее внешних компромиссов.",en:"Inner choice matters today. Alignment with yourself outweighs external compromise."},
    7:{ru:"День несёт движение. Направление важнее контроля — удержи вектор.",en:"The day carries movement. Direction matters more than control — hold the course."},
    8:{ru:"Сила проявляется мягко. Не через давление, а через присутствие и спокойствие.",en:"Strength manifests gently — through presence and calm, not force."},
    9:{ru:"Подходит время для уединения. Внутренний свет становится заметнее в тишине.",en:"A time for solitude. Inner light becomes clearer in stillness."},
    10:{ru:"Сегодня возможен поворот. Не всё зависит от воли — ритм меняется.",en:"A turn may occur today. Not everything is will-driven — the rhythm shifts."},
    11:{ru:"День требует честности. Баланс восстанавливается через ясное видение.",en:"The day calls for honesty. Balance is restored through clear seeing."},
    12:{ru:"Пауза несёт смысл. Смена взгляда открывает новые связи.",en:"Pause carries meaning. A shift in perspective reveals new connections."},
    13:{ru:"Завершение освобождает. Освободи место для нового дыхания.",en:"Endings liberate. Make space for a new breath."},
    14:{ru:"Гармония рождается из меры. Сегодня важен плавный ритм.",en:"Harmony arises from moderation. A gentle rhythm matters today."},
    15:{ru:"День показывает привязанности. Осознание снижает их власть.",en:"Attachments become visible today. Awareness softens their hold."},
    16:{ru:"Старые конструкции могут треснуть. Истина проявляется через слом иллюзий.",en:"Old structures may crack. Truth appears through the collapse of illusion."},
    17:{ru:"День несёт тихую надежду. Даже слабый свет указывает путь.",en:"The day carries quiet hope. Even a faint light points the way."},
    18:{ru:"Будь бережна с неясными чувствами. Не всё требует немедкого понимания.",en:"Handle unclear feelings gently. Not everything needs immediate clarity."},
    19:{ru:"День наполнен ясностью. Простота возвращает энергию.",en:"The day is filled with clarity. Simplicity restores vitality."},
    20:{ru:"Может прозвучать внутренний зов. Важно его не игнорировать.",en:"An inner call may arise. It’s important not to ignore it."},
    21:{ru:"День ощущается завершённым. Целостность уже присутствует.",en:"The day feels complete. Wholeness is already present."}
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

  /* ---------- RENDER DAY CARD ---------- */
  function showDayCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);

    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = DAY_TEXTS[cardIndex][LANG];

    if (reversed) {
      cardPosition.textContent = DAY_REVERSED_COMMENT[LANG];
      cardPosition.classList.remove("hidden");
    } else {
      cardPosition.classList.add("hidden");
    }

    resultBlock.classList.remove("hidden");
  }

  /* ---------- RENDER QUESTION CARD ---------- */
  function showQuestionCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);

    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = reversed
      ? card.reversed[LANG]
      : card.upright[LANG];

    cardPosition.classList.add("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- IMAGE ---------- */
  function renderImage(cardIndex, reversed) {
    const fileIndex = String(cardIndex).padStart(2, "0");
    cardImage.src = `./images/cards/${fileIndex}.png`;
    cardImage.classList.remove("hidden");
    cardImage.style.transform = reversed
      ? "rotate(180deg)"
      : "rotate(0deg)";
  }

  /* ---------- GLOSSARY BUTTON (TEMP) ---------- */
  glossaryButton.addEventListener("click", () => {
    alert(
      LANG === "ru"
        ? "Глоссарий будет отдельным экраном со списком всех карт."
        : "Glossary will be a separate screen with a list of all cards."
    );
  });

  /* ---------- EVENTS ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
