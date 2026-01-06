document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  const LANG = user.language_code === "en" ? "en" : "ru";

  const BUTTON_TEXTS = {
    ru: {
      day: "Карта дня",
      question: "Карта вопроса",
      glossary: "Глоссарий"
    },
    en: {
      day: "Card of the Day",
      question: "Question Card",
      glossary: "Glossary"
    }
  };

  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");

  const cardImage    = document.getElementById("cardImage");
  const cardName     = document.getElementById("cardName");
  const cardMeaning  = document.getElementById("cardMeaning");
  const cardPosition = document.getElementById("cardPosition");
  const glossaryGrid = document.getElementById("glossaryGrid");
  const resultBlock  = document.getElementById("result");

  cardButton.textContent     = BUTTON_TEXTS[LANG].day;
  questionButton.textContent = BUTTON_TEXTS[LANG].question;
  glossaryButton.textContent = BUTTON_TEXTS[LANG].glossary;

  let cardsData = {};
  let dayTexts = {};
  let glossaryData = {};

  fetch("./cards.json").then(r => r.json()).then(d => cardsData = d);
  fetch("./texts/day-texts.json").then(r => r.json()).then(d => dayTexts = d);
  fetch("./glossary/glossary.json").then(r => r.json()).then(d => glossaryData = d);

  function reset() {
    cardImage.classList.add("hidden");
    cardMeaning.classList.add("hidden");
    cardPosition.classList.add("hidden");
    glossaryGrid.classList.add("hidden");
    glossaryGrid.innerHTML = "";
  }

  function renderImage(index, reversed) {
    const id = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${id}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  async function getCardOfTheDay() {
    reset();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const { card, reversed } = await res.json();

    renderImage(card, reversed);
    cardName.textContent = cardsData[card].name[LANG];

    cardMeaning.textContent =
      dayTexts[card][LANG] +
      (reversed ? "\n\n" + dayTexts[card][`reversed_${LANG}`] : "");

    cardMeaning.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  function getQuestionCard() {
    reset();

    const card = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderImage(card, reversed);
    cardName.textContent = cardsData[card].name[LANG];
    cardMeaning.textContent = reversed
      ? cardsData[card].reversed[LANG]
      : cardsData[card].upright[LANG];

    cardMeaning.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  function openGlossary() {
    reset();
    cardName.textContent = LANG === "ru" ? "Глоссарий Арканов" : "Arcana Glossary";

    Object.entries(glossaryData).forEach(([i, card]) => {
      const el = document.createElement("div");
      el.className = "glossary-card";
      el.innerHTML = `
        <img src="./images/cards/${String(i).padStart(2,"0")}.png">
        <div class="glossary-card-title">${card.name[LANG]}</div>
      `;
      el.onclick = () => {
        reset();
        renderImage(i, false);
        cardName.textContent = card.name[LANG];
        cardMeaning.innerHTML = `
          <p>${card.archetype[LANG]}</p>
          <p><strong>Upright:</strong><br>${card.upright[LANG]}</p>
          <p><strong>Reversed:</strong><br>${card.reversed[LANG]}</p>
        `;
        cardMeaning.classList.remove("hidden");
      };
      glossaryGrid.appendChild(el);
    });

    glossaryGrid.classList.remove("hidden");
    resultBlock.classList.remove("hidden");
  }

  cardButton.onclick = getCardOfTheDay;
  questionButton.onclick = getQuestionCard;
  glossaryButton.onclick = openGlossary;

});
