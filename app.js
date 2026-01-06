document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  const LANG = user.language_code === "en" ? "en" : "ru";

  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  const cardButton = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");
  const backButton = document.getElementById("backButton");

  const mainButtons = document.getElementById("mainButtons");
  const backWrap = document.getElementById("backButtonWrap");

  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const result = document.getElementById("result");
  const glossaryGrid = document.getElementById("glossaryGrid");

  let cardsData = {};
  let dayTexts = {};
  let glossaryData = {};

  fetch("./cards.json").then(r => r.json()).then(d => cardsData = d);
  fetch("./texts/day-texts.json").then(r => r.json()).then(d => dayTexts = d);
  fetch("./glossary/glossary.json").then(r => r.json()).then(d => glossaryData = d);

  function resetView() {
    result.classList.add("hidden");
    glossaryGrid.classList.add("hidden");
    cardImage.classList.add("hidden");
    cardPosition.classList.add("hidden");
  }

  function renderImage(index, reversed) {
    const id = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${id}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  async function cardOfDay() {
    resetView();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const { card, reversed } = await res.json();

    renderImage(card, reversed);
    cardName.textContent = cardsData[card].name[LANG];
    cardMeaning.textContent = dayTexts[card][LANG];
    result.classList.remove("hidden");
  }

  function questionCard() {
    resetView();

    const card = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderImage(card, reversed);
    cardName.textContent = cardsData[card].name[LANG];
    cardMeaning.textContent = reversed
      ? cardsData[card].reversed[LANG]
      : cardsData[card].upright[LANG];

    result.classList.remove("hidden");
  }

  function openGlossary() {
    resetView();
    mainButtons.classList.add("hidden");
    backWrap.classList.remove("hidden");

    glossaryGrid.innerHTML = "";

    Object.entries(glossaryData).forEach(([i, card]) => {
      const el = document.createElement("div");
      el.className = "glossary-card";
      el.innerHTML = `
        <img src="./images/cards/${String(i).padStart(2,"0")}.png">
        <div class="glossary-title">${card.name[LANG]}</div>
      `;
      el.onclick = () => {
        resetView();
        renderImage(i, false);
        cardName.textContent = card.name[LANG];
        cardMeaning.textContent = card.archetype[LANG];
        result.classList.remove("hidden");
      };
      glossaryGrid.appendChild(el);
    });

    glossaryGrid.classList.remove("hidden");
  }

  function goBack() {
    resetView();
    mainButtons.classList.remove("hidden");
    backWrap.classList.add("hidden");
  }

  cardButton.onclick = cardOfDay;
  questionButton.onclick = questionCard;
  glossaryButton.onclick = openGlossary;
  backButton.onclick = goBack;

});
