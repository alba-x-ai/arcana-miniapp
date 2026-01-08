const screens = document.querySelectorAll(".screen");

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* DOM */

const btnDay = document.getElementById("btn-day");
const btnQuestion = document.getElementById("btn-question");
const btnGlossary = document.getElementById("btn-glossary");

const btnBack = document.getElementById("btn-back");
const btnBackFromGlossary = document.getElementById("btn-back-from-glossary");
const btnBackToGlossary = document.getElementById("btn-back-to-glossary");

const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardText  = document.getElementById("card-text");

/* events */

btnDay.onclick = async () => {
  show("card-screen");
};

btnQuestion.onclick = async () => {
  show("card-screen");
};

btnGlossary.onclick = () => {
  show("glossary");
};

btnBack.onclick = () => show("home");
btnBackFromGlossary.onclick = () => show("home");
btnBackToGlossary.onclick = () => show("glossary");
