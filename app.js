document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.ready();

  const mainScreen = document.getElementById("mainScreen");
  const resultScreen = document.getElementById("resultScreen");
  const glossaryScreen = document.getElementById("glossaryScreen");

  const dayBtn = document.getElementById("dayBtn");
  const questionBtn = document.getElementById("questionBtn");
  const glossaryBtn = document.getElementById("glossaryBtn");
  const backBtn = document.getElementById("backBtn");
  const glossaryBackBtn = document.getElementById("glossaryBackBtn");

  const cardImage = document.getElementById("cardImage");
  const cardName = document.getElementById("cardName");
  const cardText = document.getElementById("cardText");
  const cardNote = document.getElementById("cardNote");

  const glossaryGrid = document.getElementById("glossaryGrid");

  function show(screen) {
    mainScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    glossaryScreen.classList.add("hidden");
    screen.classList.remove("hidden");
  }

  /* ===== CARD OF THE DAY ===== */
  dayBtn.onclick = () => {
    show(resultScreen);

    cardImage.src = "./images/cards/00.png";
    cardImage.classList.remove("hidden");

    cardName.textContent = "Шут";
    cardText.textContent = "Начало пути, доверие жизни, открытость опыту.";
    cardNote.textContent = "";
  };

  /* ===== QUESTION CARD ===== */
  questionBtn.onclick = () => {
    show(resultScreen);

    cardImage.src = "./images/cards/07.png";
    cardImage.classList.remove("hidden");

    cardName.textContent = "Колесница";
    cardText.textContent = "Движение вперёд, воля, преодоление.";
    cardNote.textContent = "";
  };

  /* ===== GLOSSARY ===== */
  glossaryBtn.onclick = () => {
    show(glossaryScreen);
    glossaryGrid.innerHTML = "";

    fetch("./glossary/glossary.json")
      .then(r => r.json())
      .then(data => {
        Object.values(data).forEach(card => {
          const item = document.createElement("div");
          item.className = "glossary-item";
          item.innerHTML = `
            <img src="./images/cards/${card.id}.png">
            <div class="title">${card.name.ru}</div>
          `;

          item.onclick = () => {
            show(resultScreen);
            cardImage.src = `./images/cards/${card.id}.png`;
            cardImage.classList.remove("hidden");
            cardName.textContent = card.name.ru;
            cardText.textContent = card.upright.ru;
            cardNote.textContent = "Перевёрнутая позиция смещает фокус внутрь.";
          };

          glossaryGrid.appendChild(item);
        });
      });
  };

  backBtn.onclick = () => show(mainScreen);
  glossaryBackBtn.onclick = () => show(mainScreen);
});
