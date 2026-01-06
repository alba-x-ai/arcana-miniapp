document.addEventListener("DOMContentLoaded", async () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  const LANG = user.language_code === "en" ? "en" : "ru";

  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  const cards = await fetch("./cards.json").then(r => r.json());
  const dayTexts = await fetch("./texts/day-texts.json").then(r => r.json());
  const glossaryData = await fetch("./glossary/cards.json").then(r => r.json());

  const cardButton = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");
  const backButton = document.getElementById("backButton");

  const mainButtons = document.getElementById("mainButtons");
  const result = document.getElementById("result");
  const glossary = document.getElementById("glossary");

  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");

  function hideAll() {
    mainButtons.classList.add("hidden");
    result.classList.add("hidden");
    glossary.classList.add("hidden");
  }

  function showMain() {
    hideAll();
    mainButtons.classList.remove("hidden");
  }

  function showCard(index, reversed, text) {
    const file = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${file}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "none";

    cardName.textContent = cards[index].name[LANG];
    cardMeaning.textContent = text;

    hideAll();
    result.classList.remove("hidden");
  }

  // КАРТА ДНЯ
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

  // КАРТА ВОПРОСА
  questionButton.onclick = () => {
    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    const text = reversed
      ? cards[index].reversed[LANG]
      : cards[index].upright[LANG];

    showCard(index, reversed, text);
  };

  // ГЛОССАРИЙ
  glossaryButton.onclick = () => {
    glossary.innerHTML = "";
    hideAll();

    Object.keys(glossaryData).forEach(key => {
      const item = document.createElement("div");
      item.className = "glossary-item";
      item.textContent = glossaryData[key].name[LANG];

      item.onclick = () => {
        const card = glossaryData[key];
        const text =
          `${card.upright[LANG]}\n\n${card.reversed[LANG]}`;

        showCard(key, false, text);
      };

      glossary.appendChild(item);
    });

    glossary.classList.remove("hidden");
  };

  backButton.onclick = showMain;

});
