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

  /* ---------- DAY TEXTS (ALL 22) ---------- */
  const DAY_TEXTS = {
    0: {
      ru: "День открывает новое пространство. Можно позволить себе идти без чёткого плана.",
      en: "The day opens a new space. You may move without a clear plan."
    },
    1: {
      ru: "Сегодня особенно заметно, как намерение формирует происходящее.",
      en: "Today highlights how intention shapes reality."
    },
    2: {
      ru: "День располагает к тишине и вниманию к внутренним ощущениям.",
      en: "The day invites silence and attention to inner signals."
    },
    3: {
      ru: "Сегодняшний день поддерживает заботу, рост и мягкое внимание.",
      en: "The day supports nurturing, growth, and gentle attention."
    },
    4: {
      ru: "Структура и границы сегодня дают ощущение устойчивости.",
      en: "Structure and boundaries bring a sense of stability today."
    },
    5: {
      ru: "День может напомнить о ценностях и внутренних ориентирах.",
      en: "The day may remind you of values and inner guidance."
    },
    6: {
      ru: "Сегодня важен внутренний выбор и согласие с собой.",
      en: "Today emphasizes inner choice and alignment."
    },
    7: {
      ru: "День несёт ощущение движения и направления.",
      en: "The day carries a sense of movement and direction."
    },
    8: {
      ru: "Мягкая внутренняя сила сегодня важнее внешнего давления.",
      en: "Gentle inner strength matters more than force today."
    },
    9: {
      ru: "День подходит для уединения и внутренней настройки.",
      en: "The day is suited for solitude and inner alignment."
    },
    10: {
      ru: "Сегодня могут проявиться повороты и смена ритма.",
      en: "Shifts and changes in rhythm may appear today."
    },
    11: {
      ru: "День требует честного взгляда и внутреннего баланса.",
      en: "The day calls for honesty and inner balance."
    },
    12: {
      ru: "Сегодня полезно сделать паузу и изменить точку зрения.",
      en: "A pause and a shift in perspective may be helpful today."
    },
    13: {
      ru: "День связан с завершением и освобождением пространства.",
      en: "The day relates to endings and clearing space."
    },
    14: {
      ru: "Сегодня важно чувство меры и спокойное соединение противоположностей.",
      en: "Balance and gentle integration are key today."
    },
    15: {
      ru: "День может подсветить привязанности и скрытые напряжения.",
      en: "The day may highlight attachments and hidden tensions."
    },
    16: {
      ru: "Сегодня возможен внутренний или внешний слом привычных конструкций.",
      en: "A disruption of familiar structures may occur today."
    },
    17: {
      ru: "День несёт мягкий свет надежды и восстановления.",
      en: "The day carries a gentle light of hope and renewal."
    },
    18: {
      ru: "Сегодня важно бережно относиться к неясным чувствам.",
      en: "Handle unclear feelings gently today."
    },
    19: {
      ru: "День наполнен ясностью и жизненной энергией.",
      en: "The day is filled with clarity and vitality."
    },
    20: {
      ru: "Сегодня может прийти осознание или внутренний зов.",
      en: "An inner call or realization may arise today."
    },
    21: {
      ru: "День ощущается как завершённый и целостный.",
      en: "The day feels complete and whole."
    }
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
    cardMeaning.textContent = DAY_TEXTS[cardIndex][LANG];

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
