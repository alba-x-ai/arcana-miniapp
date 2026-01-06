document.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  tg.ready();

  const LANG = tg.initDataUnsafe?.user?.language_code === "en" ? "en" : "ru";

  const BUTTON_TEXTS = {
    ru: {
      day: "Карта дня",
      question: "Карта вопроса",
      glossary: "Глоссарий"
    },
    en: {
      day: "Card of the Day",
      question: "Question Card",
      glossary: "Glossary"
    }
  };

  const cardButton = document.getElementById("cardButton");
  const questionButton = document.getElementById("questionButton");
  const glossaryButton = document.getElementById("glossaryButton");

  cardButton.textContent = BUTTON_TEXTS[LANG].day;
  questionButton.textContent = BUTTON_TEXTS[LANG].question;
  glossaryButton.textContent = BUTTON_TEXTS[LANG].glossary;

  cardButton.addEventListener("click", () => {
    alert("Карта дня работает");
  });

  questionButton.addEventListener("click", () => {
    alert("Карта вопроса работает");
  });

  glossaryButton.addEventListener("click", () => {
    window.location.href = "./glossary/glossary.html";
  });
});
