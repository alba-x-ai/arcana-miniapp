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

  /* ---------- DAY TEXTS ---------- */
  const DAY_TEXTS = {
    0:{ru:"День открывает новое пространство. Можно идти без чёткого плана.",en:"The day opens new space. You may move without a clear plan."},
    1:{ru:"Сегодня намерение особенно влияет на происходящее.",en:"Today intention strongly shapes events."},
    2:{ru:"День располагает к тишине и вниманию к внутренним ощущениям.",en:"The day invites silence and inner listening."},
    3:{ru:"Сегодня поддерживается забота и мягкий рост.",en:"The day supports nurturing and gentle growth."},
    4:{ru:"Структура и границы сегодня дают устойчивость.",en:"Structure and boundaries bring stability today."},
    5:{ru:"День напоминает о ценностях и внутренних ориентирах.",en:"The day reminds you of values and inner guidance."},
    6:{ru:"Сегодня важен внутренний выбор и согласие с собой.",en:"Inner choice and alignment matter today."},
    7:{ru:"День несёт движение и направление.",en:"The day carries movement and direction."},
    8:{ru:"Мягкая сила сегодня важнее давления.",en:"Gentle strength outweighs force today."},
    9:{ru:"Подходит время для уединения и внутренней настройки.",en:"A good day for solitude and inner alignment."},
    10:{ru:"Сегодня возможны повороты и смена ритма.",en:"Shifts and changes in rhythm may appear."},
    11:{ru:"День требует честности и внутреннего баланса.",en:"Honesty and balance are required today."},
    12:{ru:"Полезна пауза и смена взгляда.",en:"A pause and new perspective are helpful."},
    13:{ru:"День связан с завершением и освобождением.",en:"The day is about endings and release."},
    14:{ru:"Сегодня важны мера и гармония.",en:"Moderation and harmony matter today."},
    15:{ru:"Могут проявиться скрытые привязанности.",en:"Hidden attachments may surface today."},
    16:{ru:"Возможен слом привычных конструкций.",en:"Familiar structures may break down."},
    17:{ru:"День несёт тихую надежду и восстановление.",en:"A gentle sense of hope and renewal appears."},
    18:{ru:"Важно бережно относиться к неясным чувствам.",en:"Handle unclear emotions gently."},
    19:{ru:"День наполнен ясностью и жизненной энергией.",en:"The day is filled with clarity and vitality."},
    20:{ru:"Может прийти внутренний зов или осознание.",en:"An inner call or realization may arise."},
    21:{ru:"День ощущается целостным и завершённым.",en:"The day feels whole and complete."}
  };

  /* ---------- DAY COMMENTS ---------- */
  const DAY_COMMENTS = {
    0:{ru:"Сегодня это состояние проявляется скорее внутри, чем внешне.",en:"Today this state is more internal than external."},
    1:{ru:"Влияние ощущается тоньше и требует внутренней собранности.",en:"The influence is subtle and requires inner focus."},
    2:{ru:"Интуитивные процессы идут глубже и не сразу заметны.",en:"Intuitive processes run deeper and are not immediately visible."},
    3:{ru:"Забота и рост сегодня направлены внутрь.",en:"Nurturing and growth are directed inward."},
    4:{ru:"Опора формируется изнутри, а не через внешние структуры.",en:"Stability forms internally rather than externally."},
    5:{ru:"Ценности проявляются через личное переживание.",en:"Values are experienced personally."},
    6:{ru:"Выбор больше ощущается, чем проявляется.",en:"The choice is felt more than acted upon."},
    7:{ru:"Движение есть, но оно не всегда заметно.",en:"Movement exists but is not always visible."},
    8:{ru:"Внутренняя сила работает тихо.",en:"Inner strength works quietly."},
    9:{ru:"Уединение носит внутренний характер.",en:"Solitude is internal rather than physical."},
    10:{ru:"Перемены зреют внутри.",en:"Changes are forming internally."},
    11:{ru:"Баланс начинается с честности с собой.",en:"Balance begins with honesty toward yourself."},
    12:{ru:"Пауза ощущается глубже, чем кажется.",en:"The pause is deeper than it seems."},
    13:{ru:"Завершение происходит на внутреннем уровне.",en:"Completion is happening internally."},
    14:{ru:"Гармония ищется внутри.",en:"Harmony is sought internally."},
    15:{ru:"Осознание ограничений приходит постепенно.",en:"Awareness of limitations comes gradually."},
    16:{ru:"Изменения начинаются изнутри.",en:"Change begins internally."},
    17:{ru:"Надежда присутствует без ярких сигналов.",en:"Hope is present without dramatic signs."},
    18:{ru:"Неясность связана с внутренними процессами.",en:"Uncertainty relates to inner processes."},
    19:{ru:"Радость проявляется сдержанно.",en:"Joy is expressed subtly."},
    20:{ru:"Осознание требует времени.",en:"Realization takes time."},
    21:{ru:"Целостность ощущается изнутри.",en:"Wholeness is felt from within."}
  };

  /* ---------- CARD OF THE DAY ---------- */
  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          timezoneOffset: new Date().getTimezoneOffset()
        })
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

  /* ---------- RENDER DAY ---------- */
  function showDayCard(cardIndex, reversed) {
    const card = cardsData[cardIndex];
    if (!card) return;

    renderImage(cardIndex, reversed);

    let text = DAY_TEXTS[cardIndex][LANG];
    if (reversed && DAY_COMMENTS[cardIndex]) {
      text += "\n\n" + DAY_COMMENTS[cardIndex][LANG];
    }

    cardName.textContent = card.name[LANG];
    cardMeaning.textContent = text;

    cardPosition.classList.add("hidden");
    resultBlock.classList.remove("hidden");
  }

  /* ---------- RENDER QUESTION ---------- */
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
