document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("glossaryGrid");
  const detail = document.getElementById("glossaryDetail");
  const backBtn = document.getElementById("backBtn");

  const LANG =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code === "en"
      ? "en"
      : "ru";

  let glossary = {};

  try {
    glossary = await fetch("./glossary.json").then(r => r.json());
  } catch (e) {
    console.error("Glossary load error", e);
    return;
  }

  Object.entries(glossary).forEach(([id, card]) => {
    const item = document.createElement("div");
    item.className = "glossary-item";
    item.dataset.id = id;

    item.innerHTML = `
      <img src="../images/cards/${id.padStart(2, "0")}.png" />
      <div class="title">${card.name[LANG]}</div>
    `;

    item.addEventListener("click", () => {
      openCard(id);
    });

    grid.appendChild(item);
  });

  function openCard(id) {
    const card = glossary[id];

    grid.classList.add("hidden");
    detail.classList.remove("hidden");

    detail.innerHTML = `
      <h2>${card.name[LANG]}</h2>
      <p>${card.archetype[LANG]}</p>
      <p><strong>${LANG === "ru" ? "Прямо:" : "Upright:"}</strong><br>${card.upright[LANG]}</p>
      <p><strong>${LANG === "ru" ? "Перевёрнуто:" : "Reversed:"}</strong><br>${card.reversed[LANG]}</p>
      <button id="backInner">Назад</button>
    `;

    document.getElementById("backInner").onclick = () => {
      detail.classList.add("hidden");
      grid.classList.remove("hidden");
    };
  }

  backBtn?.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
});
