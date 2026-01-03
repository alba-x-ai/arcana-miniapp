document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const userId = tg.initDataUnsafe?.user?.id;

  if (!userId) {
    alert("Не удалось получить user_id");
    return;
  }

  const API_URL = "https://arcana-1.onrender.com/card-of-the-day";

  const cardButton = document.getElementById("cardButton");
  const cardImage = document.getElementById("cardImage");

  if (!cardButton || !cardImage) {
    console.error("DOM elements not found:", { cardButton, cardImage });
    alert("Ошибка интерфейса: не найдены элементы");
    return;
  }

  async function getCardOfTheDay() {
    try {
      console.log("Sending user_id:", userId);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      showCard(data.card);

    } catch (err) {
      console.error("FULL ERROR:", err);
      alert("Ошибка получения карты");
    }
  }

  function showCard(cardIndex) {
    cardImage.src = `./cards/${cardIndex}.jpg`;
    cardImage.style.display = "block";
  }

  cardButton.addEventListener("click", getCardOfTheDay);

});
