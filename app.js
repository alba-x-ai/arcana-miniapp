document.addEventListener("DOMContentLoaded", async () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) {
    alert("Нет данных пользователя");
    return;
  }

  const LANG = user.language_code === "en" ? "en" : "ru";

  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  const cardButton = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");

  const result = document.getElementById("result");
  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");

  const cards = await fetch("./cards.json").then(r => r.json());
  const dayTexts = await fetch("./texts/day-texts.json").then(r => r.json());

  function showCard(index, reversed, text) {
    const file = String(index).padStart(2, "0");

    // ⬇️ ВАЖНО: путь соответствует /images/cards/
    cardImage.src = `./images/cards/${file}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "none";

    cardName.textContent = cards[index].name[LANG];
    cardMeaning.textContent = text;

    result.classList.remove("hidden");
  }

  cardButton.onclick = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await res.json();

    const text = data.reversed
      ? dayTexts[data.card][LANG].reversed
      : dayTexts[data.card][LANG].upright;

    showCard(data.card, data.reversed, text);
  };

  questionButton.onclick = () => {
    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    const text = reversed
      ? cards[index].reversed[LANG]
      : cards[index].upright[LANG];

    showCard(index, reversed, text);
  };

});
