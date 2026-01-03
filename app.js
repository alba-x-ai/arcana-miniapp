document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const userId = tg.initDataUnsafe?.user?.id;
  if (!userId) {
    alert("Не удалось получить user_id");
    return;
  }

  const API_URL = "https://arcana-1.onrender.com/card-of-the-day";

  const cardButton   = document.getElementById("cardButton");
  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const resultBlock  = document.getElementById("result");

  let cardsData = {};

  fetch("./cards.json")
    .then(res => res.json())
    .then(data => cardsData = data)
    .catch(err => console.error("cards.json error", err));

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
      showCard(data.card, data.reversed);

    } catch (err) {
      console.error(err);
      alert("Ошибка получения карты");
    }
  }

  function showCard(cardIndex, reversed) {
    const fileIndex = String(cardIndex).padStart(2, "0");

    const baseUrl = new URL(document.baseURI);
    const imageUrl =
      `${baseUrl.origin}${baseUrl.pathname}images/cards/${fileIndex}.png`;

    console.log("IMAGE URL:", imageUrl);

    cardImage.src = imageUrl;
    cardImage.classList.remove("hidden");
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";

    const card = cardsData[cardIndex];
    if (!card) return;

    cardName.textContent = card.name;
    cardMeaning.textContent = reversed ? card.reversed : card.upright;

    // ЗАЩИТА: если элемента нет — не падаем
    if (cardPosition) {
      cardPosition.classList.toggle("hidden", !reversed);
    }

    resultBlock.classList.remove("hidden");
  }

  cardButton.addEventListener("click", getCardOfTheDay);

});
