(async () => {
  const LANG =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code === "en"
      ? "en"
      : "ru";

  const container = document.getElementById("glossaryContainer");
  if (!container) return;

  const data = await fetch("./glossary/glossary.json").then(r => r.json());

  container.innerHTML = "";

  Object.entries(data).forEach(([index, card]) => {
    const item = document.createElement("div");
    item.className = "glossary-card";

    item.innerHTML = `
      <img src="./images/cards/${String(index).padStart(2, "0")}.png" />
      <div class="glossary-title">${card.name[LANG]}</div>
    `;

    item.addEventListener("click", () => {
      const result = document.getElementById("result");

      result.classList.remove("hidden");

      document.getElementById("cardImage").src =
        `./images/cards/${String(index).padStart(2, "0")}.png`;

      document.getElementById("cardName").textContent =
        card.name[LANG];

      document.getElementById("cardMeaning").innerHTML = `
        <p>${card.description[LANG]}</p>
        <p><strong>${LANG === "ru" ? "Прямое значение" : "Upright"}:</strong><br>
        ${card.upright[LANG]}</p>
        <p><strong>${LANG === "ru" ? "Перевёрнутое значение" : "Reversed"}:</strong><br>
        ${card.reversed[LANG]}</p>
      `;

      container.classList.add("hidden");
    });

    container.appendChild(item);
  });
})();
