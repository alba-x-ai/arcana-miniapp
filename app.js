document.addEventListener("DOMContentLoaded", async () => {

  const tg = window.Telegram?.WebApp;
  tg?.ready();

  const LANG =
    tg?.initDataUnsafe?.user?.language_code === "en"
      ? "en"
      : "ru";

  /* ---------- TEXTS ---------- */

  const BUTTONS = {
    ru: {
      day: "Карта дня",
      question: "Карта вопроса",
      glossary: "Глоссарий",
      back: "Назад"
    },
    en: {
      day: "Card of the Day",
      question: "Question Card",
      glossary: "Glossary",
      back: "Back"
    }
  };

  /* ---------- DOM ---------- */

  const dayBtn = document.getElementById("dayBtn");
  const questionBtn = document.getElementById("questionBtn");
  const glossaryBtn = document.getElementById("glossaryBtn");
  const backBtn = document.getElementById("backBtn");

  const cardView = document.getElementById("cardView");
  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardText = document.getElementById("cardText");

  const glossaryGrid = document.getElementById("glossaryGrid");

  dayBtn.textContent = BUTTONS[LANG].day;
  questionBtn.textContent = BUTTONS[LANG].question;
  glossaryBtn.textContent = BUTTONS[LANG].glossary;
  backBtn.textContent = BUTTONS[LANG].back;

  /* ---------- LOAD DATA ---------- */

  const cards = await fetch("./cards.json").then(r => r.json());
  const dayTexts = await fetch("./texts/day-texts.json").then(r => r.json());
  const glossary = await fetch("./glossary/glossary.json").then(r => r.json());

  /* ---------- HELPERS ---------- */

  function showBack(show) {
    backBtn.classList.toggle("hidden", !show);
  }

  function reset() {
    cardView.classList.add("hidden");
    glossaryGrid.classList.add("hidden");
    showBack(false);
  }

  function showCard(index, text) {
    const id = String(index).padStart(2, "0");

    cardImage.src = `./images/cards/${id}.png`;
    cardName.textContent = cards[index].name[LANG];
    cardText.textContent = text;

    cardView.classList.remove("hidden");
    showBack(true);
  }

  /* ---------- CARD OF DAY ---------- */

  dayBtn.onclick = () => {
    reset();
    const index = new Date().getDate() % 22;
    showCard(index, dayTexts[index][LANG]);
  };

  /* ---------- QUESTION CARD ---------- */

  questionBtn.onclick = () => {
    reset();
    const index = Math.floor(Math.random() * 22);
    showCard(index, cards[index].upright[LANG]);
  };

  /* ---------- GLOSSARY ---------- */

  glossaryBtn.onclick = () => {
    reset();
    glossaryGrid.innerHTML = "";

    glossary.forEach((card, index) => {
      const el = document.createElement("div");
      el.className = "glossary-item";

      el.innerHTML = `
        <img src="./images/cards/${String(index).padStart(2,"0")}.png">
        <div>${card.name[LANG]}</div>
      `;

      el.onclick = () => {
        showCard(index, card.archetype[LANG]);
      };

      glossaryGrid.appendChild(el);
    });

    glossaryGrid.classList.remove("hidden");
    showBack(true);
  };

  backBtn.onclick = () => {
    reset();
  };

});
