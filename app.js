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
  const cardButton   = document.getElementById("cardButton");
  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const resultBlock  = document.getElementById("result");

  /* ---------- Data ---------- */
  let cardsData = {};

  // загрузка смыслов карт
  fetch("./cards.json")
    .then(res => res.json())
    .then(data => {
      cardsData = data;
    })
    .catch(err => {
      console.error("Failed to load cards.json", err);
    });

  /* ---------- Actions ---------- */
  async function getCardOfTheDay() {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();
      showCard(data.card, data.reversed);

    } catch (err) {
      console.error(err);
      alert("Ошибка получения карты");
    }
  }

  function showCard(cardIndex, reversed) {
    // приводим номер к формату 00, 01, … 21
    const fileIndex = String(cardIndex).padStart(2, "0");

    // универсальный basePath для GitHub Pages
    const basePath = window.location.pathname.split("/")[1];

    // картинка
    cardImage.src = `/${basePath}/images/cards/${fileIndex}.png`;
    cardImage.classList.remove("hidden");
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";

    // текст
    const card = cardsData[cardIndex];
    if (!card) return;

    cardName.textContent = card.name;
    cardMeaning.textContent = reversed ? card.reversed : card.upright;

    // подпись положения
    cardPosition.classList.toggle("hidden", !reversed);

    resultBlock.classList.remove("hidden");
  }

  /* ---------- Events ---------- */
  cardButton.addEventListener("click", getCardOfTheDay);

});
