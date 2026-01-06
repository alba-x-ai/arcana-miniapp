const tg = window.Telegram?.WebApp;
tg?.ready();

const LANG =
  tg?.initDataUnsafe?.user?.language_code === "en" ? "en" : "ru";

const API_URL =
  "https://dawn-glitter-5c15.j4albaai.workers.dev/card-of-the-day";

let cards = {};
let dayTexts = {};
let glossaryData = {};

fetch("./cards.json").then(r => r.json()).then(d => cards = d);
fetch("./texts/day-texts.json").then(r => r.json()).then(d => dayTexts = d);
fetch("./glossary/cards.json").then(r => r.json()).then(d => glossaryData = d);

const result = document.getElementById("result");
const glossary = document.getElementById("glossary");
const cardImage = document.getElementById("cardImage");
const cardName = document.getElementById("cardName");
const cardMeaning = document.getElementById("cardMeaning");

function hideAll() {
  result.classList.add("hidden");
  glossary.classList.add("hidden");
}

function showCard(index, reversed, text) {
  const file = String(index).padStart(2, "0");
  cardImage.src = `./images/cards/${file}.png`;
  cardImage.style.transform = reversed ? "rotate(180deg)" : "none";
  cardName.textContent = cards[index].name[LANG];
  cardMeaning.textContent = text;
  hideAll();
  result.classList.remove("hidden");
}

window.onDay = async () => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: tg?.initDataUnsafe?.user?.id || 0
    })
  });

  const data = await res.json();
  const text = data.reversed
    ? dayTexts[data.card][LANG].reversed
    : dayTexts[data.card][LANG].upright;

  showCard(data.card, data.reversed, text);
};

window.onQuestion = () => {
  const i = Math.floor(Math.random() * 22);
  const r = Math.random() < 0.5;
  const text = r ? cards[i].reversed[LANG] : cards[i].upright[LANG];
  showCard(i, r, text);
};

window.onGlossary = () => {
  glossary.innerHTML = "";
  hideAll();

  Object.keys(glossaryData).forEach(i => {
    const div = document.createElement("div");
    div.className = "glossary-item";
    div.textContent = glossaryData[i].name[LANG];
    div.onclick = () => {
      const c = glossaryData[i];
      showCard(i, false, `${c.upright[LANG]}\n\n${c.reversed[LANG]}`);
    };
    glossary.appendChild(div);
  });

  glossary.classList.remove("hidden");
};

window.onBack = () => {
  hideAll();
};
