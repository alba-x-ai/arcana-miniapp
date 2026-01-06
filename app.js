/**********************************************************
 * ARCANA — Card of the Day
 * Backend: Cloudflare Worker
 * URL: https://dawn-glitter-5c15.j4albaai.workers.dev
 * Texts: texts/day-texts.json
 **********************************************************/

/* ---------- DOM ---------- */
const homeScreen = document.getElementById("home");
const dayScreen  = document.getElementById("day");

const btnDay  = document.getElementById("btn-day");
const btnBack = document.getElementById("btn-back");

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

btnBack.addEventListener("click", () => {
  showScreen(homeScreen);
});

/* ---------- CARD OF THE DAY ---------- */
async function loadDayCard() {
  try {
    /* --- 1. Получаем user_id из Telegram --- */
    let userId = 1; // fallback для браузера

    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userId = tg.initDataUnsafe.user.id;
      }
    }

    /* --- 2. Запрос к backend --- */
    const backendResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    if (!backendResponse.ok) {
      throw new Error("Backend response error");
    }

    const { card, reversed } = await backendResponse.json();

    /* --- 3. Загружаем тексты дня --- */
    const textsResponse = await fetch("texts/day-texts.json");
    if (!textsResponse.ok) {
      throw new Error("Day texts not found");
    }

    const dayTexts = await textsResponse.json();
    const position = reversed ? "reversed" : "upright";
    const text     = dayTexts[card].ru[position];

    /* --- 4. Рендер --- */
    renderCard(card, reversed, text);

  } catch (error) {
    console.error(error);
    cardText.textContent = "Ошибка загрузки карты дня.";
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
    "Шут", "Маг", "Жрица", "Императрица", "Император",
    "Иерофант", "Влюблённые", "Колесница", "Сила", "Отшельник",
    "Колесо Фортуны", "Справедливость", "Повешенный", "Смерть",
    "Умеренность", "Дьявол", "Башня", "Звезда", "Луна",
    "Солнце", "Суд", "Мир"
  ];
  return names[id];
}
