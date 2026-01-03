// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;
tg.ready();

// Получаем user_id Telegram
const userId = tg.initDataUnsafe?.user?.id;

if (!userId) {
  alert("Не удалось получить user_id");
  throw new Error("No Telegram user_id");
}

// URL backend
const API_URL = "https://arcana-1.onrender.com/card-of-the-day";

// DOM элементы
const cardButton = document.getElementById("cardButton");
const cardImage = document.getElementById("cardImage");

// Основная функция — карта дня
async function getCardOfTheDay() {
  try {
    console.log("Sending user_id:", userId);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: userId })
    });

    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Response data:", data);

    showCard(data.card);

  } catch (err) {
    console.error("FULL ERROR:", err);
    alert(err.message);
  }
}

// Отображение карты
function showCard(cardIndex) {
  cardImage.src = `./cards/${cardIndex}.jpg`;
  cardImage.style.display = "block";
}

// Обработчик кнопки
cardButton.addEventListener("click", () => {
  getCardOfTheDay();
});
