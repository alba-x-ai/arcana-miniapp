const screens = document.querySelectorAll(".screen");

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===== DOM ===== */

const grid = document.getElementById("glossary-grid");
const img  = document.getElementById("glossary-image");

const title = document.getElementById("glossary-title");
const archetype = document.getElementById("glossary-archetype");
const description = document.getElementById("glossary-description");
const upright = document.getElementById("glossary-upright");
const reversed = document.getElementById("glossary-reversed");

const btnBackHome = document.getElementById("btn-back-home");
const btnBackList = document.getElementById("btn-back-list");

btnBackHome.onclick = () => window.history.back();
btnBackList.onclick = () => show("glossary-list");

/* ===== DATA ===== */

let data = null;

fetch("glossary.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    renderList();
  });

/* ===== LIST ===== */

function renderList() {
  grid.innerHTML = "";

  Object.keys(data).forEach(id => {
    const div = document.createElement("div");
    div.textContent = data[id].name.ru;
    div.onclick = () => openCard(id);
    grid.appendChild(div);
  });
}

/* ===== CARD ===== */

function openCard(id) {
  const c = data[id];

  img.src = `../images/cards/${String(id).padStart(2, "0")}.png`;

  title.textContent = c.name.ru;
  archetype.textContent = c.archetype.ru;
  description.textContent = c.description.ru;
  upright.textContent = c.upright.ru;
  reversed.textContent = c.reversed.ru;

  show("glossary-card");
}
