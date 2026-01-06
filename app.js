document.addEventListener("DOMContentLoaded", async () => {
  const tg = window.Telegram?.WebApp;
  tg?.ready();

  const LANG =
    tg?.initDataUnsafe?.user?.language_code === "en" ? "en" : "ru";

  /* ---------- DOM ---------- */
  const cardDayBtn   = document.getElementById("cardDayBtn");
  const questionBtn  = document.getElementById("questionBtn");
  const glossaryBtn  = document.getElementById("glossaryBtn");
  const backBtn      = document.getElementById("backBtn");

  const mainScreen   = document.getElementById("mainScreen");
  const resultScreen = document.getElementById("resultScreen");

  const cardImg  = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardText = document.getElementById("cardText");

  /* ---------- DATA ---------- */
  const cards = await fetch("./cards.json").then(r => r.json());
  const dayTexts = await fetch("./texts/day-texts.json").then(r => r.json());

  /* ---------- HELPERS ---------- */
  function showResult() {
    mainScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    backBtn.classList.remove("hidden");
  }

  function showMain() {
    resultScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    backBtn.classList.add("hidden");
  }

  function renderCard(index, reversed = false) {
    const id = String(index).padStart(2, "0");
    cardImg.src = `./images/cards/${id}.png`;
    cardImg.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
  }

  /* ---------- CARD OF THE DAY ---------- */
  cardDayBtn.onclick = async () => {
    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderCard(index, reversed);
    cardName.textContent = cards[index].name[LANG];

    let text = dayTexts[index][LANG];

    if (reversed) {
      text += LANG === "ru"
        ? "\n\n(Перевёрнутая позиция смещает фокус внутрь.)"
        : "\n\n(Reversed position shifts the focus inward.)";
    }

    cardText.textContent = text;
    showResult();
  };

  /* ---------- QUESTION CARD ---------- */
  questionBtn.onclick = () => {
    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderCard(index, reversed);
    cardName.textContent = cards[index].name[LANG];

    cardText.textContent = reversed
      ? cards[index].reversed[LANG]
      : cards[index].upright[LANG];

    showResult();
  };

  /* ---------- GLOSSARY ---------- */
  glossaryBtn.onclick = () => {
    window.open("./glossary/glossary.html", "_self");
  };

  backBtn.onclick = showMain;
});
