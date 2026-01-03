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
  const cardName = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");
  const resultBlock = document.getElementById("result");

  let cardsData = {};

  fetch("/arcana-miniapp/cards.json")
    .then(res => res.json())
    .then(data => cardsData = data);

  async function getCardOfTheDay() {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });

    const data = await response.json();
    showCard(data.card, data.reversed);
  }

  function showCard(cardIndex, reversed) {
    cardImage.src = `/arcana-miniapp/images/cards/${cardIndex}.png`;
    cardImage.classList.remove("hidden");

    // переворот картинки
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";

    const card = cardsData[cardIndex];
    if (!card) return;

    cardName.textContent =
      card.name + (reversed ? " (Reversed)" : "");

    cardMeaning.textContent =
      reversed ? card.reversed : card.upright;

    resultBlock.classList.remove("hidden");
  }

  cardButton.addEventListener("click", getCardOfTheDay);
});
