/**********************************************************
 * ARCANA — Card of the Day (backend) + Question Card (front)
 **********************************************************/

/* ---------- DOM ---------- */
const homeScreen = document.getElementById("home");
const dayScreen  = document.getElementById("day");

const btnDay      = document.getElementById("btn-day");
const btnQuestion = document.getElementById("btn-question");
const btnBack     = document.getElementById("btn-back");

const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardText  = document.getElementById("card-text");

/* ---------- API ---------- */
const API_URL =
  "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

/* ---------- NAVIGATION ---------- */
function showScreen(screen) {
  document
    .querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

/* ---------- EVENTS ---------- */
btnDay.addEventListener("click", () => {
  showScreen(dayScreen);
  loadDayCard();
});

btnQuestion.addEventListener("click", () => {
  showScreen(dayScreen);
  loadQuestionCard();
});

btnBack.addEventListener("click", () => {
  showScreen(homeScreen);
});

/* ---------- CARD OF THE DAY (BACKEND) ---------- */
async function loadDayCard() {
  try {
    let userId = 1; // fallback для браузера
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (tg.initDataUnsafe?.user) {
        userId = tg.initDataUnsafe.user.id;
      }
    }

    const backendResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    if (!backendResponse.ok) {
      throw new Error("Backend response error");
    }

    const { card, reversed } = await backendResponse.json();

    const textsResponse = await fetch("texts/day-texts.json");
    const dayTexts = await textsResponse.json();

    const position = reversed ? "reversed" : "upright";
    const text = dayTexts[card].ru[position];

    renderCard(card, reversed, text);

  } catch (error) {
    console.error(error);
    cardText.textContent = "Ошибка загрузки карты дня.";
  }
}

/* ---------- QUESTION CARD (FRONTEND) ---------- */
async function loadQuestionCard() {
  try {
    const cardsRes = await fetch("cards.json");
    const cards = await cardsRes.json();

    const cardId = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    const text = reversed
      ? cards[cardId].reversed.ru
      : cards[cardId].upright.ru;

    renderCard(cardId, reversed, text);

  } catch (error) {
    console.error(error);
    cardText.textContent = "Ошибка загрузки карты вопроса.";
  }
}

/* ---------- RENDER ---------- */
function renderCard(cardId, reversed, text) {
  cardImage.src = `images/cards/${String(cardId).padStart(2, "0")}.png`;
  cardImage.style.transform = reversed ? "rotate(180deg)" : "none";

  cardTitle.textContent = getCardName(cardId);
  cardText.textContent  = text;
}

/* ---------- CARD NAMES ---------- */
function getCardName(id) {
  const names = [
    "Шут","Маг","Жрица","Императрица","Император",
    "Иерофант","Влюблённые","Колесница","Сила","Отшельник",
    "Колесо Фортуны","Справедливость","Повешенный","Смерть",
    "Умеренность","Дьявол","Башня","Звезда","Луна",
    "Солнце","Суд","Мир"
  ];
  return names[id];
}
