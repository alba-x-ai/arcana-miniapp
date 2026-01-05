document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready(); // без управления UI Telegram

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

  /* ---------- CARD OF THE DAY TEXTS ---------- */
  const DAY_TEXTS = {
    0: {
      ru: "День открывает пространство для нового опыта. Не требуется точный план — важнее готовность откликнуться на движение жизни и позволить себе шаг в неизвестное.",
      en: "The day opens space for new experience. A clear plan is not required — openness and responsiveness matter more than certainty."
    },
    1: {
      ru: "Сегодня твое намерение обладает силой оформления реальности. Обращай внимание на то, что ты выбираешь утверждать и подпитывать своим вниманием.",
      en: "Today your intention actively shapes reality. Notice what you choose to affirm and support with your attention."
    },
    2: {
      ru: "День благоприятен для тишины и внутреннего слушания. Ответы приходят не через действие, а через внимательное присутствие.",
      en: "The day favors silence and inner listening. Answers arrive through presence rather than action."
    },
    3: {
      ru: "Сегодня важно заботиться о том, что растёт. Поддержка, мягкость и принятие создают условия для естественного развития.",
      en: "Today calls for nurturing what is growing. Care, softness, and acceptance create space for natural development."
    },
    4: {
      ru: "День напоминает о ценности структуры. Чёткие границы и порядок дают ощущение устойчивости и безопасности.",
      en: "The day highlights the value of structure. Clear boundaries and order provide stability and security."
    },
    5: {
      ru: "Сегодня проявляются глубинные ориентиры. Прислушайся к внутренним ценностям — они подсказывают верное направление.",
      en: "Today reveals deeper inner values. Listening to them helps you orient yourself correctly."
    },
    6: {
      ru: "День связан с внутренним выбором. Важно быть честной с собой и согласовывать решения с тем, что действительно откликается.",
      en: "The day is about inner choice. Honesty with yourself helps align decisions with what truly resonates."
    },
    7: {
      ru: "Сегодня ощущается движение вперёд. Направление уже задано — задача дня в удержании курса, а не в ускорении.",
      en: "The day carries forward movement. The direction is set; maintaining course matters more than speed."
    },
    8: {
      ru: "Мягкая сила сегодня эффективнее давления. Устойчивость проявляется через спокойствие и внутренний баланс.",
      en: "Gentle strength is more effective than force today. Stability comes through calmness and inner balance."
    },
    9: {
      ru: "День подходит для уединения и внутренней настройки. Полезно снизить внешнюю активность и восстановить контакт с собой.",
      en: "A suitable day for solitude and inner alignment. Reducing external activity helps restore inner contact."
    },
    10: {
      ru: "Сегодня возможны неожиданные повороты. Гибкость и доверие к процессу помогут пройти изменения без сопротивления.",
      en: "Unexpected shifts may occur today. Flexibility and trust ease the transition."
    },
    11: {
      ru: "День требует внутренней честности. Баланс достигается не компромиссами, а ясным пониманием своей позиции.",
      en: "The day asks for inner honesty. Balance comes from clarity, not compromise."
    },
    12: {
      ru: "Сегодня полезна пауза. Смена точки зрения позволяет увидеть ситуацию глубже и освободиться от спешки.",
      en: "A pause is beneficial today. Changing perspective reveals deeper understanding."
    },
    13: {
      ru: "День связан с завершением. Освобождение от старого создаёт пространство для нового этапа.",
      en: "The day is about endings. Releasing the old makes room for a new phase."
    },
    14: {
      ru: "Сегодня важна мера. Гармония возникает через соединение противоположностей и спокойное удержание баланса.",
      en: "Moderation matters today. Harmony emerges through balanced integration of opposites."
    },
    15: {
      ru: "День может проявить скрытые привязанности. Осознание того, что удерживает, уже является шагом к свободе.",
      en: "Hidden attachments may surface today. Awareness itself begins the path to freedom."
    },
    16: {
      ru: "Возможен слом привычных конструкций. То, что разрушается, освобождает энергию для более устойчивых форм.",
      en: "Familiar structures may break down. Their collapse frees energy for stronger foundations."
    },
    17: {
      ru: "День несёт тихую надежду. Восстановление происходит мягко, без резких усилий.",
      en: "The day brings quiet hope. Renewal unfolds gently without force."
    },
    18: {
      ru: "Сегодня важно бережно относиться к неясным чувствам. Не всё требует немедкого понимания.",
      en: "Handle unclear emotions gently today. Not everything needs immediate clarity."
    },
    19: {
      ru: "День наполнен ясностью и жизненной энергией. Поддерживается открытость, радость и естественное проявление.",
      en: "The day is filled with clarity and vitality. Openness and natural expression are supported."
    },
    20: {
      ru: "Сегодня может прозвучать внутренний зов. Обрати внимание на то, что требует признания и принятия.",
      en: "An inner call may arise today. Notice what seeks recognition and acceptance."
    },
    21: {
      ru: "День ощущается целостным. Происходит интеграция пройденного опыта и внутреннее завершение цикла.",
      en: "The day feels whole. Past experiences integrate, bringing a sense of completion."
    }
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
    cardImage.style.transform =
      reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  cardButton.addEventListener("click", getCardOfTheDay);
  questionButton.addEventListener("click", getQuestionCard);

});
