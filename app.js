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

  /* ---------- UI TEXTS ---------- */
  const TEXTS = {
    ru: {
      day: "Карта дня",
      question: "Карта вопроса",
      reversed: "Перевёрнутая"
    },
    en: {
      day: "Card of the Day",
      question: "Question Card",
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
    0:{ru:"День словно раскрытая ладонь. В нём больше воздуха, чем формы. Позволь себе идти, не зная маршрута.",en:"The day feels like an open palm. More air than form. Allow yourself to move without a route."},
    1:{ru:"Сегодня слово и намерение имеют вес. Внимание формирует происходящее.",en:"Today words and intention carry weight. Attention shapes events."},
    2:{ru:"День говорит тише обычного. Ответы приходят в паузах.",en:"The day speaks softly. Answers arrive in pauses."},
    3:{ru:"Береги то, что растёт. Забота сегодня важнее скорости.",en:"Protect what grows. Care matters more than speed today."},
    4:{ru:"Чёткие границы создают ощущение устойчивости.",en:"Clear boundaries create a sense of stability."},
    5:{ru:"Ценности становятся точкой опоры.",en:"Values become an inner reference point."},
    6:{ru:"Выбор совершается внутри, ещё до действия.",en:"The choice is made inwardly before action."},
    7:{ru:"Движение уже началось. Удерживай направление.",en:"Movement has begun. Hold the direction."},
    8:{ru:"Мягкость удерживает больше, чем давление.",en:"Gentleness holds more than force."},
    9:{ru:"Тишина помогает услышать главное.",en:"Silence helps you hear what matters."},
    10:{ru:"Повороты происходят естественно. Доверься ритму.",en:"Turns happen naturally. Trust the rhythm."},
    11:{ru:"Честность возвращает равновесие.",en:"Honesty restores balance."},
    12:{ru:"Пауза открывает иной взгляд.",en:"A pause opens a new perspective."},
    13:{ru:"Освобождение приходит через завершение.",en:"Release comes through completion."},
    14:{ru:"Мера соединяет крайности.",en:"Moderation connects extremes."},
    15:{ru:"Осознание ослабляет привязанности.",en:"Awareness loosens attachments."},
    16:{ru:"Хрупкое отпадает, освобождая место.",en:"What is fragile falls away, freeing space."},
    17:{ru:"Надежда проявляется тихо.",en:"Hope appears quietly."},
    18:{ru:"Неясность — часть пути.",en:"Uncertainty is part of the path."},
    19:{ru:"Тепло и ясность доступны.",en:"Warmth and clarity are available."},
    20:{ru:"Внутренний зов становится слышимым.",en:"An inner call becomes audible."},
    21:{ru:"Опыт складывается в целое.",en:"Experience integrates into wholeness."}
  };

  const DAY_REVERSED_COMMENT = {
    ru: "В перевёрнутом положении энергия дня может ощущаться приглушённо. Не спеши.",
    en: "In reversed form, the day’s energy may feel muted. There is no need to rush."
  };

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });
    const data = await res.json();
    showDayCard(data.card, data.reversed);
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

  /* ---------- QUESTION CARD ---------- */
  function getQuestionCard() {
    const i = Math.floor(Math.random() * 22);
    const r = Math.random() < 0.5;
    showQuestionCard(i, r);
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
