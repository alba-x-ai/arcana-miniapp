document.addEventListener("DOMContentLoaded", () => {

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

  /* ---------- POETIC DAY TEXTS ---------- */
  const DAY_TEXTS = {
    0:{ru:"День словно раскрытая ладонь. В нём больше воздуха, чем формы. Позволь себе идти, не зная маршрута, и замечать знаки по пути.",en:"The day feels like an open palm. More air than form. Allow yourself to move without a route, noticing signs along the way."},
    1:{ru:"Сегодня слово и намерение имеют вес. То, что ты выбираешь назвать и поддержать вниманием, начинает собираться в реальность.",en:"Today words and intention carry weight. What you name and nourish with attention begins to take shape."},
    2:{ru:"День говорит шёпотом. Ответы приходят в паузах, во взгляде внутрь, в тонком ощущении правильного момента.",en:"The day speaks in a whisper. Answers arrive in pauses, inward glances, and subtle timing."},
    3:{ru:"Сегодня важно беречь то, что растёт. Забота и мягкость создают больше силы, чем спешка.",en:"Today calls for protecting what grows. Care and gentleness create more strength than haste."},
    4:{ru:"День выстраивает опору. Чёткие формы и границы дают ощущение земли под ногами и спокойствие в движении.",en:"The day builds support. Clear forms and boundaries offer ground and calm movement."},
    5:{ru:"Сегодня можно вспомнить, на что ты опираешься внутри. Традиции, смыслы и личные истины звучат особенно ясно.",en:"Today invites remembering inner foundations. Values and personal truths speak clearly."},
    6:{ru:"День о выборе, который совершается тихо. Не между «да» и «нет», а между откликом и привычкой.",en:"The day holds a quiet choice. Not between yes and no, but between resonance and habit."},
    7:{ru:"Сегодня движение уже началось. Не нужно ускорять его — достаточно удерживать направление.",en:"Movement has already begun today. No need to rush; simply hold the direction."},
    8:{ru:"Мягкость становится силой. Спокойствие удерживает больше, чем напряжение.",en:"Gentleness becomes strength. Calm holds more than tension."},
    9:{ru:"День приглашает к уединению. В тишине легче услышать себя без искажений.",en:"The day invites solitude. Silence helps hear yourself without distortion."},
    10:{ru:"Сегодня возможен поворот. Не обязательно понимать его сразу — достаточно позволить колесу провернуться.",en:"A turn may occur today. Understanding can wait; letting the wheel move is enough."},
    11:{ru:"День требует честного взгляда. Равновесие рождается там, где вещи называются своими именами.",en:"The day asks for honest sight. Balance arises when things are named as they are."},
    12:{ru:"Сегодня полезно остановиться. В перевёрнутом взгляде скрывается новый смысл.",en:"Today benefits from pause. A reversed view reveals new meaning."},
    13:{ru:"День о завершении. Не как потере, а как освобождении пространства для дыхания.",en:"The day speaks of endings—not as loss, but as space freed for breath."},
    14:{ru:"Сегодня важно не крайнее, а соединённое. Мера удерживает гармонию между полюсами.",en:"Today favors integration over extremes. Moderation holds harmony."},
    15:{ru:"День может подсветить привязанности. Не для осуждения — для осознания.",en:"The day may highlight attachments. Not for judgment, but for awareness."},
    16:{ru:"Что-то может пошатнуться. Это не разрушение ради боли, а освобождение от хрупкого.",en:"Something may shake. Not destruction for pain, but release from what was fragile."},
    17:{ru:"День несёт тихий свет. Надежда проявляется без громких жестов.",en:"The day carries quiet light. Hope appears without loud gestures."},
    18:{ru:"Сегодня туман чувств. Не спеши прояснять — достаточно быть рядом с ними.",en:"Emotions may feel foggy today. No need to clarify; presence is enough."},
    19:{ru:"День наполнен теплом и ясностью. Можно позволить себе быть видимой.",en:"The day is filled with warmth and clarity. You may allow yourself to be seen."},
    20:{ru:"Сегодня может прозвучать внутренний зов. Он не торопит — он приглашает.",en:"An inner call may sound today. It does not rush; it invites."},
    21:{ru:"День ощущается завершённым. Всё складывается в единую линию.",en:"The day feels complete. Everything aligns into a single line."}
  };

  /* ---------- POETIC REVERSED COMMENT ---------- */
  const DAY_REVERSED_COMMENT = {
    ru: "В перевёрнутом положении энергия дня может ощущаться приглушённо. Позволь себе медленный ритм и не требуй от себя ясности немедленно.",
    en: "In reversed form, the day’s energy may feel muted. Allow a slower rhythm and do not demand immediate clarity."
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

  function showDayCard(i, reversed) {
    const card = cardsData[i];
    if (!card) return;

    renderImage(i, reversed);
    cardName.textContent = card.name[LANG];

    let text = DAY_TEXTS[i][LANG];
    if (reversed) {
      text += "\n\n" + DAY_REVERSED_COMMENT[LANG];
    }

    cardMeaning.textContent = text;
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
