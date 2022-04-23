const mainCountry = document.querySelector(".main-country");
const mainCountryImage = document.querySelector(".main-country-image img");
const mainCountryText = document.querySelector(".main-country-text p");
const mainCountryForm = document.querySelector(".main-country-form");
const borderCountries = document.querySelector(".border-countries");
const loadingModal = document.querySelector(".loading-modal");
const notificationModal = document.querySelector(".notification-modal");
const notificationText = document.querySelector(".notification-modal-text");
const endScreen = document.querySelector(".end-screen");
const mainCountryWords = [];
const countryNames = [];

const collectCountryNames = async () => {
  const response = await fetch(`https://restcountries.com/v2/all`);
  const json = await response.json();
  json.forEach((name) => {
    // let nameWords = name.name.toLowerCase().replace(/[,()]/g, "").split(" ");
    let nameWords = catchNames(name.name).toLowerCase().split(" ");
    countryNames.push(...nameWords);
  });
};
collectCountryNames();

const catchNames = (name) => {
  const splitName = name
    .toLowerCase()
    .replace("(islamic republic of)", "")
    .replace("russian federation", "Russia")
    .replace("korea (democratic people's republic of)", "North Korea")
    .replace("bolivia (plurinational state of)", "Bolivia")
    .replace("palestine, state of", "palestine")
    .replace("tanzania, united republic of", "tanzania")
    .replace(
      "congo (democratic republic of the)",
      "democratic republic of the congo"
    )
    .replace("syrian arab republic", "syria")
    .replace("lao people's democratic republic", "laos")
    .replace("moldova (republic of)", "moldova")
    .replace("korea (republic of)", "south korea")
    .replace("venezuela (bolivarian republic of)", "venezuela")
    .replace(
      "united kingdom of great britain and northern island",
      "united kingdom"
    )
    .split(" ");

  const capitalizedName = [];
  splitName.forEach((word) => {
    capitalizedName.push(word.charAt(0).toUpperCase() + word.slice(1));
  });
  const finalName = capitalizedName.join(" ");

  return finalName;
};

const revealEndScreen = () => {
  endScreen.classList.remove("d-none");
  document.body.classList.add("__gameover");
};

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
    mainCountryForm.removeEventListener("submit", checkCountry);
    notification("game over");
    setTimeout(() => {
      mainCountry.removeAttribute("hide");
    }, 1000);
  }
};

const generateBorderCountries = (border, index) => {
  const hidden = index === 0 ? "" : "hide";
  const catchName = catchNames(border.name);

  borderCountries.insertAdjacentHTML(
    "beforeend",
    `
    <div class="col-4 col-sm-3 border-country" ${hidden}>
      <div class="border-country-card">
        <div class="border-country-card-content">
          <div class="border-country-front">
            <div class="border-country-image">
                <img src="${border.flag}" alt="">
            </div>
          </div>
          <div class="border-country-back">
          </div>
        </div>
      </div>
      <div class="border-country-text">
          <p class="text-center">${catchName}</p>
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
  loadingModal.classList.add("__animateup");
};

const generateName = (name) => {
  name.forEach((word) => {
    mainCountryWords.push(catchNames(word).toLowerCase());
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
    mainCountryText.innerText = catchNames(mainCountry.name);
    let name = mainCountry.name.toLowerCase().split(" ");
    generateName(name);
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
  if (mainCountry.borders === undefined) {
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

const notification = (status) => {
  notificationModal.classList.add("__notification");
  notificationModal.addEventListener("animationend", () => {
    notificationModal.classList.remove("__notification");
  });

  switch (status) {
    case "invalid country":
      notificationText.textContent = "Invalid country - please try again";
      break;
    case "game over":
      notificationText.textContent = "Better luck next time!";
      setTimeout(revealEndScreen, 2000);
      break;
    case "success":
      notificationText.textContent = "You got it! Congratulations!";
      setTimeout(revealEndScreen, 2000);
  }
};

const checkCountry = () => {
  const input = document.querySelector(".main-country-form input");
  let name = input.value.toLowerCase().split(" ");

  if (!countryNames.includes(...name)) {
    notification("invalid country");
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
    notification("success");
    mainCountryForm.removeEventListener("submit", checkCountry);
  }
  input.value = "";
};

// prevent form/input default
mainCountryForm.addEventListener("submit", checkCountry);
mainCountryForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

// stop mobile devices effecting viewport height
window.addEventListener("load", () => {
  var viewport = document.querySelector("meta[name=viewport]");
  viewport.setAttribute(
    "content",
    viewport.content + ", height=" + window.innerHeight
  );
});

startGame();

/**
 * @TODO:
 * There are some countries that are proving difficult due to their names being innaccurate: keep a list of them hear (plus the reason for the difficulty):
 * - North and South Korea (Both called Korea)
 * - Russian Federation (should just be called Russia)
 * - Palestine, (remove the comma from the name)
 * - Syrian republic (should just be called Syria)
 * - United Kingdom of Great Britain and Northern Ireland (change name to United Kingdom, UK and Britain)
 * - Lao People's Democratic Republic (add the people's democractic republic in brackets)
 *
 * There are also some countries with incorrect borders:
 * - Cyrpus (says it borders with the UK)
 * - Brazil (says it borders France)
 *
 * Make a list of words needed to remove from the countries list:
 * Federation
 * Islamic
 * Republic
 *
 */
