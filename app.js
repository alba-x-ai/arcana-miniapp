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
const API_URL = "https://arcana-1.onrender.com";

// DOM элементы
const cardButton = document.getElementById("cardButton");
const cardImage = document.getElementById("cardImage");

// Основная функция — карта дня
async function getCardOfTheDay() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId
      })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    if (data.card === undefined) {
      throw new Error("Card not returned");
    }

    showCard(data.card);

  } catch (err) {
    console.error(err);
    alert("Ошибка получения карты дня");
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
