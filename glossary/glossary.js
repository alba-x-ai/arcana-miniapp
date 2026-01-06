document.addEventListener("DOMContentLoaded", async () => {
  const tg = window.Telegram?.WebApp;
  tg?.ready();

  const LANG =
    tg?.initDataUnsafe?.user?.language_code === "en" ? "en" : "ru";

  /* ---------- DOM ---------- */
  const gridScreen = document.getElementById("gridScreen");
  const cardScreen = document.getElementById("cardScreen");

  const grid = document.getElementById("glossaryGrid");

  const cardImage = document.getElementById("cardImage");
  const cardName  = document.getElementById("cardName");
  const cardText  = document.getElementById("cardText");

  const backBtn = document.getElementById("backBtn");

  /* ---------- DATA ---------- */
  const glossary = await fetch("./glossary.json").then(r => r.json());

  let view = "grid"; // grid | card

  /* ---------- HELPERS ---------- */
  function showGrid() {
    gridScreen.classList.remove("hidden");
    cardScreen.classList.add("hidden");
    view = "grid";
  }

  function showCard() {
    gridScreen.classList.add("hidden");
    cardScreen.classList.remove("hidden");
    view = "card";
  }

  /* ---------- BUILD GRID ---------- */
  Object.entries(glossary).forEach(([index, card]) => {
    const el = document.createElement("div");
    el.className = "glossary-item";

    const id = String(index).padStart(2, "0");

    el.innerHTML = `
      <img src="../images/cards/${id}.png" />
      <div>${card.name[LANG]}</div>
    `;

    el.addEventListener("click", () => {
      cardImage.src = `../images/cards/${id}.png`;
      cardName.textContent = card.name[LANG];

      cardText.innerHTML = `
        <p><em>${card.archetype[LANG]}</em></p>
        <p><strong>${LANG === "ru" ? "Прямое значение:" : "Upright:"}</strong><br>
        ${card.upright[LANG]}</p>
        <p><strong>${LANG === "ru" ? "Перевёрнутое значение:" : "Reversed:"}</strong><br>
        ${card.reversed[LANG]}</p>
      `;

      showCard();
    });

    grid.appendChild(el);
  });

  /* ---------- BACK ---------- */
  backBtn.addEventListener("click", () => {
    if (view === "card") {
      showGrid();
    } else {
      window.location.href = "../index.html";
    }
  });
});
