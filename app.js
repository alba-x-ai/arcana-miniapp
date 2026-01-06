document.addEventListener("DOMContentLoaded", async () => {
  /* ---------- TELEGRAM ---------- */
  const tg = window.Telegram?.WebApp;
  tg?.ready();

  const user = tg?.initDataUnsafe?.user;
  const LANG = user?.language_code === "en" ? "en" : "ru";

  /* ---------- API ---------- */
  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardDayBtn  = document.getElementById("cardDayBtn");
  const questionBtn = document.getElementById("questionBtn");
  const glossaryBtn = document.getElementById("glossaryBtn");
  const backBtn     = document.getElementById("backBtn");

  const mainScreen   = document.getElementById("mainScreen");
  const resultScreen = document.getElementById("resultScreen");

  const cardImage = document.getElementById("cardImage");
  const cardName  = document.getElementById("cardName");
  const cardText  = document.getElementById("cardText");

  /* ---------- DATA ---------- */
  let cards = {};
  let dayTexts = {};

  try {
    [cards, dayTexts] = await Promise.all([
      fetch("./cards.json").then(r => r.json()),
      fetch("./texts/day-texts.json").then(r => r.json())
    ]);
  } catch (e) {
    console.error("Ошибка загрузки данных:", e);
    return;
  }

  /* ---------- HELPERS ---------- */
  function showMain() {
    mainScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");
  }

  function showResult() {
    mainScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
  }

  function renderCard(index, reversed = false) {
    const id = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${id}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardName.textContent = cards[index].name[LANG];
  }

  /* ---------- CARD OF THE DAY ---------- */
  async function showCardOfDay() {
    if (!user) return;

    let data;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      });
      data = await res.json();
    } catch (e) {
      console.error("Ошибка получения карты дня:", e);
      return;
    }

    const { card, reversed } = data;

    renderCard(card, reversed);

    // 🔴 ВАЖНОЕ МЕСТО — ТОЛЬКО С [LANG]
    let text = dayTexts[card][LANG];

    if (reversed) {
      text +=
        LANG === "ru"
          ? "\n\nПеревёрнутая позиция смещает внимание внутрь."
          : "\n\nThe reversed position shifts attention inward.";
    }

    cardText.textContent = text;
    showResult();
  }

  /* ---------- QUESTION CARD ---------- */
  function showQuestionCard() {
    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderCard(index, reversed);

    cardText.textContent = reversed
      ? cards[index].reversed[LANG]
      : cards[index].upright[LANG];

    showResult();
  }

  /* ---------- EVENTS ---------- */
  cardDayBtn?.addEventListener("click", showCardOfDay);
  questionBtn?.addEventListener("click", showQuestionCard);
  glossaryBtn?.addEventListener("click", () => {
    window.location.href = "./glossary/glossary.html";
  });
  backBtn?.addEventListener("click", showMain);
});
