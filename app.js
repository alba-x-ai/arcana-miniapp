document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.ready();

  const user = tg.initDataUnsafe?.user;
  const LANG = user?.language_code === "en" ? "en" : "ru";

  /* ---------- DOM ---------- */
  const mainScreen = document.getElementById("mainScreen");
  const resultScreen = document.getElementById("resultScreen");
  const glossaryScreen = document.getElementById("glossaryScreen");

  const cardDayBtn = document.getElementById("cardDayBtn");
  const questionBtn = document.getElementById("questionBtn");
  const glossaryBtn = document.getElementById("glossaryBtn");

  const backBtn = document.getElementById("backBtn");
  const backFromGlossaryBtn = document.getElementById("backFromGlossaryBtn");

  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardText = document.getElementById("cardText");
  const glossaryGrid = document.getElementById("glossaryGrid");

  /* ---------- DATA ---------- */
  let cards = {};
  let dayTexts = {};
  let glossary = {};

  Promise.all([
    fetch("./cards.json").then(r => r.json()),
    fetch("./texts/day-texts.json").then(r => r.json()),
    fetch("./glossary/glossary.json").then(r => r.json())
  ]).then(([cardsData, dayData, glossaryData]) => {
    cards = cardsData;
    dayTexts = dayData;
    glossary = glossaryData;
  });

  /* ---------- HELPERS ---------- */
  function show(screen) {
    [mainScreen, resultScreen, glossaryScreen].forEach(s =>
      s.classList.add("hidden")
    );
    screen.classList.remove("hidden");
  }

  function renderCard(index, reversed) {
    const imgIndex = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${imgIndex}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardName.textContent = cards[index].name[LANG];
  }

  /* ---------- CARD OF THE DAY ---------- */
  async function cardOfDay() {
    const res = await fetch(
      "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      }
    );

    const { card, reversed } = await res.json();

    renderCard(card, reversed);

    let text = dayTexts[card][LANG];
    if (reversed) {
      text +=
        LANG === "ru"
          ? " Перевёрнутая позиция смещает фокус внутрь."
          : " The reversed position shifts the focus inward.";
    }

    cardText.textContent = text;
    show(resultScreen);
  }

  /* ---------- QUESTION CARD ---------- */
  function questionCard() {
    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderCard(index, reversed);

    cardText.textContent = reversed
      ? cards[index].reversed[LANG]
      : cards[index].upright[LANG];

    show(resultScreen);
  }

  /* ---------- GLOSSARY ---------- */
  function openGlossary() {
    glossaryGrid.innerHTML = "";

    Object.keys(glossary).forEach(index => {
      const card = glossary[index];

      const item = document.createElement("div");
      item.className = "glossary-item";

      item.innerHTML = `
        <img src="./images/cards/${String(index).padStart(2, "0")}.png" />
        <div>${card.name[LANG]}</div>
      `;

      item.addEventListener("click", () => {
        renderCard(index, false);

        cardText.innerHTML = `
          <p>${card.archetype[LANG]}</p>
          <p><strong>${LANG === "ru" ? "Прямо:" : "Upright:"}</strong> ${card.upright[LANG]}</p>
          <p><strong>${LANG === "ru" ? "Перевёрнуто:" : "Reversed:"}</strong> ${card.reversed[LANG]}</p>
        `;

        show(resultScreen);
      });

      glossaryGrid.appendChild(item);
    });

    show(glossaryScreen);
  }

  /* ---------- EVENTS ---------- */
  cardDayBtn.onclick = cardOfDay;
  questionBtn.onclick = questionCard;
  glossaryBtn.onclick = openGlossary;

  backBtn.onclick = () => show(mainScreen);
  backFromGlossaryBtn.onclick = () => show(mainScreen);
});
