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

const generateBorderCountries = (country) => {
  console.log(country.borders);
};

const generateCountry = async (country) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${country}`
    );
    const json = await response.json();

    let mainCountry = json;
    mainCountryImage.src = mainCountry.flag;
    generateBorderCountries(mainCountry);
  } catch (error) {
    console.log(error);
  }
};

generateCountry("fra");
