document.addEventListener("DOMContentLoaded", async () => {
  const LANG = "ru"; // можно позже синхронизировать с app.js

  const grid = document.getElementById("glossaryGrid");
  const view = document.getElementById("cardView");

  const cardImg  = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardText = document.getElementById("cardText");
  const backBtn  = document.getElementById("backBtn");

  const data = await fetch("./glossary.json").then(r => r.json());

  /* ---------- GRID ---------- */
  Object.entries(data).forEach(([index, card]) => {
    const el = document.createElement("div");
    el.className = "glossary-item";

    const id = String(index).padStart(2, "0");
    el.innerHTML = `
      <img src="../images/cards/${id}.png">
      <span>${card.name[LANG]}</span>
    `;

    el.onclick = () => {
      grid.classList.add("hidden");
      view.classList.remove("hidden");

      cardImg.src = `../images/cards/${id}.png`;
      cardName.textContent = card.name[LANG];

      cardText.innerHTML = `
        <p><em>${card.archetype[LANG]}</em></p>
        <p><strong>Прямое значение:</strong><br>${card.upright[LANG]}</p>
        <p><strong>Перевёрнутое значение:</strong><br>${card.reversed[LANG]}</p>
      `;
    };

    grid.appendChild(el);
  });

  /* ---------- BACK ---------- */
  backBtn.onclick = () => {
    view.classList.add("hidden");
    grid.classList.remove("hidden");
  };
});
