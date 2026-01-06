document.addEventListener("DOMContentLoaded", async () => {
  /* ---------- TELEGRAM ---------- */
  const tg = window.Telegram?.WebApp;
  if (tg) tg.ready();

  const user = tg?.initDataUnsafe?.user;
  const LANG = user?.language_code === "en" ? "en" : "ru";

  /* ---------- API ---------- */
  const API_URL =
    "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

  /* ---------- DOM ---------- */
  const cardButton     = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");
  const backButton     = document.getElementById("backButton");

  const cardImage   = document.getElementById("cardImage");
  const cardName    = document.getElementById("cardName");
  const cardMeaning = document.getElementById("cardMeaning");

  /* ---------- DATA ---------- */
  let cards = {};
  let dayTexts = {};

  /* ---------- LOAD JSON ---------- */
  try {
    const cardsRes = await fetch("./cards.json");
    cards = await cardsRes.json();

    const dayRes = await fetch("./texts/day-texts.json");
    dayTexts = await dayRes.json();
  } catch (e) {
    console.error("Ошибка загрузки JSON:", e);
    return;
  }

  /* ---------- HELPERS ---------- */
  function clearView() {
    cardImage.classList.add("hidden");
    cardName.textContent = "";
    cardMeaning.textContent = "";
    backButton.classList.add("hidden");
  }

  function renderImage(index, reversed) {
    const imgIndex = String(index).padStart(2, "0");
    cardImage.src = `./images/cards/${imgIndex}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "rotate(0deg)";
    cardImage.classList.remove("hidden");
  }

  /* ---------- CARD OF THE DAY ---------- */
  async function showCardOfDay() {
    clearView();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id || "anon",
      }),
    });

    const data = await res.json();
    const index = data.card;
    const reversed = data.reversed;

    renderImage(index, reversed);

    cardName.textContent = cards[index].name[LANG];

    // 🔒 СТРОГО ПО ТВОЕЙ СТРУКТУРЕ
    cardMeaning.textContent =
      dayTexts[index][LANG].upright;

    if (reversed) {
      cardMeaning.textContent +=
        "\n\n" + dayTexts[index][LANG].reversed;
    }

    backButton.classList.remove("hidden");
  }

  /* ---------- QUESTION CARD ---------- */
  function showQuestionCard() {
    clearView();

    const index = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;

    renderImage(index, reversed);

    cardName.textContent = cards[index].name[LANG];
    cardMeaning.textContent = reversed
      ? cards[index].reversed[LANG]
      : cards[index].upright[LANG];

    backButton.classList.remove("hidden");
  }

  /* ---------- BACK ---------- */
  function goBack() {
    clearView();
  }

  /* ---------- EVENTS ---------- */
  cardButton?.addEventListener("click", showCardOfDay);
  questionButton?.addEventListener("click", showQuestionCard);
  glossaryButton?.addEventListener("click", () => {
    window.location.href = "./glossary/glossary.html";
  });
  backButton?.addEventListener("click", goBack);
});
