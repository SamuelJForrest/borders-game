const mainCountryImage = document.querySelector(".main-country-image img");
const borderCountries = document.querySelector(".border-countries");
const borderCard = `
    <div class="col-4 border-country">
        <div class="border-country-image">
            <img src="" alt="">
        </div>
        <div class="border-country-text">
            <p>test</p>
        </div>
    </div>
`;

const generateBorderCountries = (border) => {
  borderCountries.insertAdjacentHTML(
    "beforeend",
    `
    <div class="col-4 border-country">
        <div class="border-country-image">
            <img src="${border.flag}" alt="">
        </div>
        <div class="border-country-text">
            <p>${border.name}</p>
        </div>
    </div>
  `
  );
};

const loadBorderCountries = (borderCountry) => {
  borderCountry.borders.forEach(async function (country) {
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${country}`
    );
    const json = await response.json();
    generateBorderCountries(json);
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
  console.log(mainCountry.borders);
  if (mainCountry.borders === undefined) {
    console.log("no borders, restarting...");
    startGame();
  } else {
    generateCountry(mainCountry.alpha3Code);
  }
};

startGame();
