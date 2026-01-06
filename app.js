const home = document.getElementById("home");
const day = document.getElementById("day");

const btnDay = document.getElementById("btn-day");
const btnBack = document.getElementById("btn-back");

const cardImage = document.getElementById("card-image");
const cardTitle = document.getElementById("card-title");
const cardText  = document.getElementById("card-text");

// навигация
function show(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// события
btnDay.addEventListener("click", () => {
  show(day);
  loadDayCard();
});

btnBack.addEventListener("click", () => {
  show(home);
});

// карта дня
async function loadDayCard() {
  try {
    const res = await fetch("texts/day-texts.json");
    const texts = await res.json();

    const id = Math.floor(Math.random() * 22);
    const reversed = Math.random() < 0.5;
    const pos = reversed ? "reversed" : "upright";

    cardImage.src = `images/cards/${String(id).padStart(2,"0")}.png`;
    cardImage.style.transform = reversed ? "rotate(180deg)" : "none";

    cardTitle.textContent = getName(id);
    cardText.textContent = texts[id].ru[pos];

  } catch (e) {
    cardText.textContent = "Ошибка загрузки карты дня.";
    console.error(e);
  }
}

// имена
function getName(id) {
  return [
    "Шут","Маг","Жрица","Императрица","Император",
    "Иерофант","Влюблённые","Колесница","Сила","Отшельник",
    "Колесо Фортуны","Справедливость","Повешенный","Смерть",
    "Умеренность","Дьявол","Башня","Звезда","Луна",
    "Солнце","Суд","Мир"
  ][id];
}
