document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     DOM
  ================================ */

  const btnDay = document.getElementById("btn-day");
  const btnQuestion = document.getElementById("btn-question");
  const btnGlossary = document.getElementById("btn-glossary");

  const btnBack = document.getElementById("btn-back");
  const btnBackFromGlossary = document.getElementById("btn-back-from-glossary");
  const btnBackToGlossary = document.getElementById("btn-back-to-glossary");

  /* ===============================
     SAFETY CHECK
  ================================ */

  if (!btnDay || !btnQuestion || !btnGlossary) {
    alert("ERROR: buttons not found in DOM");
    return;
  }

  /* ===============================
     CLICK TEST
  ================================ */

  btnDay.onclick = () => {
    alert("CLICK OK: CARD DAY");
  };

  btnQuestion.onclick = () => {
    alert("CLICK OK: QUESTION");
  };

  btnGlossary.onclick = () => {
    alert("CLICK OK: GLOSSARY");
  };

  btnBack.onclick = () => {
    alert("CLICK OK: BACK");
  };

  btnBackFromGlossary.onclick = () => {
    alert("CLICK OK: BACK FROM GLOSSARY");
  };

  btnBackToGlossary.onclick = () => {
    alert("CLICK OK: BACK TO GLOSSARY");
  };

  /* ===============================
     TELEGRAM INIT
  ================================ */

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
  }

});
