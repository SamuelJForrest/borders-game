const mainCountry = document.querySelector(".main-country");
const mainCountryImage = document.querySelector(".main-country-image img");
const mainCountryText = document.querySelector(".main-country-text p");
const mainCountryForm = document.querySelector(".main-country-form");
const borderCountries = document.querySelector(".border-countries");
const mainCountryWords = [];
const countryNames = [];

const collectCountryNames = async () => {
  const response = await fetch(`https://restcountries.com/v2/all`);
  const json = await response.json();
  json.forEach((name) => {
    let nameWords = name.name.toLowerCase().split(" ");
    countryNames.push(...nameWords);
  });
};
collectCountryNames();

const revealBorderCountry = async () => {
  const countries = document.querySelectorAll(".border-country");
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].hasAttribute("hide")) {
      countries[i].removeAttribute("hide");
      return;
    }
  }

  const hiddenCountries = document.querySelectorAll("[hide]");
  if (hiddenCountries.length === 1) {
    console.log(`game over, the answer was ${mainCountryText.textContent}`);
    mainCountryForm.removeEventListener("submit", checkCountry);
    setTimeout(() => {
      mainCountry.removeAttribute("hide");
    }, 1000);
  }
};

const generateBorderCountries = (border, index) => {
  const hidden = index === 0 ? "" : "hide";
  borderCountries.insertAdjacentHTML(
    "beforeend",
    `
    <div class="col-3 border-country" ${hidden}>
        <div class="border-country-image">
            <img src="${border.flag}" alt="">
        </div>
        <div class="border-country-text">
            <p class="text-center">${border.name}</p>
        </div>
    </div>
  `
  );
};

const loadBorderCountries = (borderCountry) => {
  let index = 0;
  borderCountry.borders.forEach(async function (country) {
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${country}`
    );
    const json = await response.json();
    generateBorderCountries(json, index);
    index += 1;
  });
};

const generateCountry = async (country) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${country}`
    );
    const json = await response.json();

    let mainCountry = json;
    mainCountryImage.src = mainCountry.flag;
    mainCountryText.innerText = mainCountry.name;
    let name = mainCountry.name.toLowerCase().split(" ");
    name.forEach((word) => {
      mainCountryWords.push(word);
    });
    console.log(mainCountryWords);
    loadBorderCountries(mainCountry);
  } catch (error) {
    console.log(error);
  }
};

const startGame = async () => {
  const response = await fetch("https://restcountries.com/v2/all");
  const json = await response.json();
  const countries = json.length;
  const randomNumber = Math.floor(Math.random() * countries);
  let mainCountry = json[randomNumber];
  console.log(mainCountry.name);
  if (mainCountry.borders === undefined) {
    console.log("no borders, restarting...");
    startGame();
  } else {
    generateCountry(mainCountry.alpha3Code);
  }
};

const checkWords = (words) => {
  words.forEach((word) => {
    if (mainCountryWords.includes(word)) {
      return true;
    } else {
      return false;
    }
  });
};

const checkCountry = () => {
  const input = document.querySelector(".main-country-form input");
  let name = input.value.toLowerCase().split(" ");

  if (!countryNames.includes(...name)) {
    console.log("name not in list");
    input.value = "";
    return;
  }

  if (
    input.value.toLowerCase() !== mainCountryText.innerText.toLowerCase() &&
    !mainCountryWords.includes(input.value.toLowerCase())
  ) {
    revealBorderCountry();
  } else {
    mainCountry.removeAttribute("hide");
    console.log("you got it!");
    mainCountryForm.removeEventListener("submit", checkCountry);
  }
  input.value = "";
};

mainCountryForm.addEventListener("submit", checkCountry);
mainCountryForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

startGame();
