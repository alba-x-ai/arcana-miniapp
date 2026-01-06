const homeScreen = document.getElementById("home-screen");
const dayScreen = document.getElementById("day-screen");

const btnDay = document.getElementById("btn-day");
const btnBackFromDay = document.getElementById("btn-back-from-day");

const cardImage = document.getElementById("day-card-image");
const cardTitle = document.getElementById("day-card-title");
const cardText = document.getElementById("day-card-text");

// === НАВИГАЦИЯ ===
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// === КАРТА ДНЯ ===
btnDay.addEventListener("click", async () => {
  showScreen(dayScreen);
  await showDayCard();
});

btnBackFromDay.addEventListener("click", () => {
  showScreen(homeScreen);
});

// === ЛОГИКА КАРТЫ ДНЯ ===
async function showDayCard() {
  try {
    const response = await fetch("texts/day-texts.json");
    const dayTexts = await response.json();

    // случайная карта 0–21
    const cardId = Math.floor(Math.random() * 22);

    // случайная ориентация
    const isReversed = Math.random() < 0.5;
    const position = isReversed ? "reversed" : "upright";

    const textObj = dayTexts[cardId];
    const text = textObj.ru[position];

    cardImage.src = `images/cards/${String(cardId).padStart(2, "0")}.png`;
    cardImage.style.transform = isReversed ? "rotate(180deg)" : "none";

    cardTitle.textContent = getCardName(cardId);
    cardText.textContent = text;

  } catch (err) {
    cardText.textContent = "Ошибка загрузки текста карты.";
    console.error(err);
  }
}

// === НАЗВАНИЯ КАРТ ===
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
