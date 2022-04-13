const mainCountryImage = document.querySelector(".main-country-image img");
const mainCountryText = document.querySelector(".main-country-text p");
const mainCountryForm = document.querySelector(".main-country-form");
const borderCountries = document.querySelector(".border-countries");
const countryNames = [];

const collectCountryNames = async () => {
  const response = await fetch(`https://restcountries.com/v2/all`);
  const json = await response.json();
  json.forEach((name) => {
    countryNames.push(name.name.toLowerCase());
  });
};
collectCountryNames();

const revealBorderCountry = async () => {
  const countries = document.querySelectorAll(".border-country");
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].hasAttribute("hide")) {
      countries[i].removeAttribute("hide");
      break;
    }
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

const checkCountry = () => {
  const input = document.querySelector(".main-country-form input");

  if (!countryNames.includes(input.value.toLowerCase())) {
    console.log("name not in list");
    return;
  }

  if (input.value.toLowerCase() !== mainCountryText.innerText.toLowerCase()) {
    revealBorderCountry();
  } else {
    const mainCountry = document.querySelector(".main-country");
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
