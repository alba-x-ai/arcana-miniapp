document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Telegram ---------- */
  const tg = window.Telegram.WebApp;
  tg.ready();

  const userId = tg.initDataUnsafe?.user?.id;
  if (!userId) {
    alert("Не удалось получить user_id");
    return;
  }

  /* ---------- Backend ---------- */
  const API_URL = "https://arcana-1.onrender.com/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton = document.getElementById("cardButton");
  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");
  const resultBlock = document.getElementById("result");

  /* ---------- Cards meanings ---------- */
  let cardsData = {};

  fetch("/arcana-miniapp/cards.json")
    .then(res => res.json())
    .then(data => {
      cardsData = data;
    })
    .catch(err => {
      console.error("Failed to load cards.json", err);
    });

  /* ---------- Main ---------- */
  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();
      showCard(data.card);

    } catch (err) {
      console.error(err);
      alert("Ошибка получения карты");
    }
  }

  function showCard(cardIndex) {
    // картинка (PNG + GitHub Pages)
    cardImage.src = `/arcana-miniapp/images/cards/${cardIndex}.png`;
    cardImage.classList.remove("hidden");

    // текст
    const card = cardsData[cardIndex];
    if (card) {
      cardName.textContent = card.name;
      cardMeaning.textContent = card.meaning;
      resultBlock.classList.remove("hidden");
    }
  }

  cardButton.addEventListener("click", getCardOfTheDay);

});
