const mainCountryImage = document.querySelector(".main-country-image img");
const borderCountries = document.querySelector(".border-countries");

const setFirstClue = () => {
  const firstCountry = document.querySelectorAll(".border-country");
  firstCountry[0].removeAttribute("hide");
};

const generateBorderCountries = (border) => {
  borderCountries.insertAdjacentHTML(
    "beforeend",
    `
    <div class="col-4 border-country" hide>
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
  borderCountry.borders.forEach(async function (country, i) {
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${country}`
    );
    const json = await response.json();
    generateBorderCountries(json);
    setFirstClue();
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

startGame();
