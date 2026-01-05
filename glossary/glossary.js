const LANG = navigator.language.startsWith("ru") ? "ru" : "en";

fetch("./glossary.json")
  .then(res => res.json())
  .then(glossary => {
    const grid = document.getElementById("cardGrid");

    for (let i = 0; i < 22; i++) {
      const img = document.createElement("img");
      img.src = `../images/cards/${String(i).padStart(2, "0")}.png`;
      img.onclick = () => openCard(i, glossary);
      grid.appendChild(img);
    }
  });

function openCard(i, glossary) {
  const data = glossary[i][LANG];

  document.getElementById("detailImage").src =
    `../images/cards/${String(i).padStart(2, "0")}.png`;

  document.getElementById("detailName").textContent = i;
  document.getElementById("detailEssence").textContent = data.essence;
  document.getElementById("detailUpright").textContent = data.upright;
  document.getElementById("detailReversed").textContent = data.reversed;

  document.getElementById("detail").classList.remove("hidden");
}
