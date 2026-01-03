document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const userId = tg.initDataUnsafe?.user?.id;

  if (!userId) {
    alert("Нет user_id");
    return;
  }

  const API_URL = "https://arcana-1.onrender.com/card-of-the-day";

  const cardButton = document.getElementById("cardButton");

  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const data = await response.json();

      alert(
        "CARD: " + data.card +
        "\nREVERSED: " + data.reversed
      );

    } catch (err) {
      console.error(err);
      alert("Ошибка получения карты");
    }
  }

  cardButton.addEventListener("click", getCardOfTheDay);

});
