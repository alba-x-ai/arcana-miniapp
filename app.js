const tg = window.Telegram.WebApp;
tg.ready();

const button = document.getElementById("cardButton");
const result = document.getElementById("result");
const cardName = document.getElementById("cardName");
const cardMeaning = document.getElementById("cardMeaning");

let cards = [];

fetch("cards.json")
  .then(response => response.json())
  .then(data => {
    cards = data;
  });

button.addEventListener("click", () => {
  if (!cards.length) return;

  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];

  cardName.textContent = card.name;
  cardMeaning.textContent = card.meaning;

  result.classList.remove("hidden");
});
