const btnEl = document.getElementById("btn");
const birthdayEl = document.getElementById("birthday");
const resultEl = document.getElementById("result");

btnEl.addEventListener("click", () => {
  const birthdayValue = birthdayEl.value;

  if (!birthdayValue) {
    alert("Please enter your birthday");
    return;
  }

  const selectedDate = new Date(birthdayValue);
  const today = new Date();

  if (selectedDate > today) {
    alert("La date de naissance ne peut pas être dans le futur !");
    return;
  }

  const ageInfo = calculateAgeInfo(birthdayValue);
  const message = ageInfo.getMessage();
  resultEl.innerText = message;

  saveToLog(message);  
  showLog();           
});





function calculateAgeInfo(birthdayValue) {
  const birthday = new Date(birthdayValue);
  const today = new Date();

  const years = today.getFullYear() - birthday.getFullYear();
  const birthMonth = birthday.getMonth();
  const birthDay = birthday.getDate();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let correctedYears = years;
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    correctedYears--;
  }

  const isBirthday =
    currentDay === birthDay && currentMonth === birthMonth;

  let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = nextBirthday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthsUntil = Math.floor(diffDays / 30);
  const daysUntil = diffDays % 30;

  const weekday = birthday.toLocaleDateString("en-US", { weekday: "long" });
  const fullAge = getFullAge(birthday, today);

  const ageInfo = {
    birthday,
    today,
    ageYears: correctedYears,
    fullAge,
    isBirthday,
    weekday,
    monthsUntil,
    daysUntil,
    getMessage: function () {
      let msg = `🎂 Your age is ${this.ageYears} ${this.ageYears > 1 ? "years" : "year"} old.\n`;
      msg += `📅 You were born on a ${this.weekday}.\n`;
      msg += `🧮 That’s approximately ${this.fullAge.years} years, ${this.fullAge.months} months, and ${this.fullAge.days} days.\n`;
      if (this.isBirthday) {
        msg += `🎉 Happy Birthday! 🎉\n`;
      } else {
        msg += `⏳ Your next birthday is in ${this.monthsUntil} month(s) and ${this.daysUntil} day(s).\n`;
      }
      return msg;
    }
  };

  return ageInfo;
}



function getFullAge(birthday, today) {
  let years = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth() - birthday.getMonth();
  let days = today.getDate() - birthday.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}








function saveToLog(message) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.push(message);
  localStorage.setItem("logs", JSON.stringify(logs));
}







function showLog() {
  const logContainer = document.getElementById("log");
  if (!logContainer) return;
  logContainer.innerHTML = "";
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.forEach((msg, i) => {
    const p = document.createElement("p");
    p.textContent = `${i + 1}. ${msg}`;
    logContainer.appendChild(p);
  });
}

window.onload = showLog;










function clearLog() {
    localStorage.removeItem("logs");
    const logContainer = document.getElementById("log");
    if (logContainer) {
      logContainer.innerHTML = "";
    }
  }
  