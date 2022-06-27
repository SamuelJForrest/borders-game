const mainCountry = document.querySelector(".main-country");
const mainCountryImage = document.querySelector(".main-country-image img");
const mainCountryText = document.querySelector(".main-country-text p");
const mainCountryForm = document.querySelector(".main-country-form");
const borderCountries = document.querySelector(".border-countries");
const loadingModal = document.querySelector(".loading-modal");
const notificationModal = document.querySelector(".notification-modal");
const notificationText = document.querySelector(".notification-modal-text");
const endScreen = document.querySelector(".end-screen");
const endScreenModal = document.querySelector(".end-screen-modal");
const datalist = document.querySelector("#countries");
const input = document.querySelector(".main-country-form input");
const mainCountryWords = [];
const countryNames = [];
const results = [];
const emoji = countryFlagEmoji.data;
const borderEmojis = [];
let amountOfGuesses = 0;

/**
 * Loops through the countries - retrieved from the API - and pushes the names to the required arrays
 */
const collectCountryNames = async () => {
  const response = await fetch(`https://restcountries.com/v2/all`);
  const json = await response.json();
  json.forEach((name) => {
    let nameWords = catchNames(name.name).toLowerCase().split(" ");
    results.push(name.name);
    countryNames.push(...nameWords);
    datalist.insertAdjacentHTML(
      "beforeend",
      `<option value="${name.name}">${name.name}</option>`
    );
  });

  for (let option of datalist.options) {
    option.addEventListener("click", function () {
      input.value = option.value;
    });
  }
};
collectCountryNames();

/**
 * Takes a country name, and replaces part of the name to the more commonly known version of the countries name
 */
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

/**
 * Reveals the end screen modal, and stops the user from being able to scroll
 */
const revealEndScreen = () => {
  endScreen.classList.remove("d-none");
  document.body.classList.add("__gameover");
};

/**
 * Reveals a bordering country per guess - ends the game if the there is no more bordering countries
 */
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

/**
 * Loops through the mystery country's bordering country, and appends the HTML for each country
 */
const generateBorderCountries = (border, index) => {
  const hidden = index === 0 ? "" : "hide";
  const catchName = catchNames(border.name);

  borderCountries.insertAdjacentHTML(
    "beforeend",
    `
    <div class="col-4 col-sm-3 border-country" ${hidden} nodrag>
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

/**
 * Loops through and assigns each of the main country's borders
 */
const loadBorderCountries = (borderCountry) => {
  let index = 0;
  borderCountry.borders.forEach(async function (country) {
    const response = await fetch(
      `https://restcountries.com/v2/alpha/${country}`
    );
    const json = await response.json();
    generateBorderCountries(json, index);
    index += 1;
    borderEmojis.push(countryFlagEmoji.data[json.alpha2Code].emoji);
  });
  loadingModal.classList.add("__animateup");
};

/**
 * Adds names to main country words array
 */
const generateName = (name) => {
  name.forEach((word) => {
    mainCountryWords.push(catchNames(word).toLowerCase());
  });
};

/**
 * Loads information about the main country
 */
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

/**
 * Retrieves country data from the API and determines the random country
 */
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

/**
 * Appends a Twitter link to the end screen, with a href dependent on the player's success
 */
const setTwitterMessage = (status) => {
  let emojiMessage = [];
  for (let i = 0; i < amountOfGuesses; i++) {
    emojiMessage.push(borderEmojis[i]);
  }
  if (status == "win") {
    endScreenModal.insertAdjacentHTML(
      "beforeend",
      `
      <a href="https://www.twitter.com/share?text=I guessed the country in ${amountOfGuesses} ${
        amountOfGuesses == 1 ? "guess" : "guesses"
      }! 🌎%0a%0aThis mystery country borders with:%0a%0a${[
        ...emojiMessage,
      ].join(
        " "
      )}%0a%0aDo you know the mystery country? Put your geography skills to the test!%0a%0aDeveloped by @samueljforrest 🏴󠁧󠁢󠁷󠁬󠁳󠁿%0a%0aYou can play it here:&url=https://www.bordle.app%0a&hashtags=Bordle" class="end-screen-btn"
      target="_blank"
      rel="noopener">Tweet</a>
    `
    );
  } else {
    endScreenModal.insertAdjacentHTML(
      "beforeend",
      `
      <a
      href="https://www.twitter.com/share?text=I'm playing Bordle! 🌍 Challenge yourself by finding the mystery country based on its neighbours!%0a%0aDeveloped by @samueljforrest 🏴󠁧󠁢󠁷󠁬󠁳󠁿%0a%0aYou can play it here:&url=https://www.bordle.app%0a&hashtags=Bordle"
      class="end-screen-btn"
      target="_blank"
      rel="noopener"
      >Tweet</a
    >
    `
    );
  }
};

/**
 * Displays feedback to the player based on their actions
 */
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
      setTwitterMessage();
      setTimeout(revealEndScreen, 2000);
      break;
    case "success":
      setTwitterMessage("win");
      notificationText.textContent = "You got it! Congratulations!";
      setTimeout(revealEndScreen, 2000);
  }
};

/**
 * Checks a players guess against the main country
 */
const checkCountry = () => {
  let name = input.value.trim().toLowerCase().split(" ");

  if (!countryNames.includes(...name)) {
    notification("invalid country");
    input.value = "";
    return;
  }

  if (
    input.value.trim().toLowerCase() !==
      mainCountryText.innerText.toLowerCase() &&
    !mainCountryWords.includes(input.value.toLowerCase())
  ) {
    amountOfGuesses++;
    revealBorderCountry();
  } else {
    amountOfGuesses++;
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

// Display datalist upon input focus
input.onfocus = function () {
  datalist.style.display = "block";
  input.style.borderRadius = "5px 5px 0 0";
};

// Filter datalist by user search
input.addEventListener("input", () => {
  let text = input.value.toLowerCase();
  datalist.innerHTML = "";
  let filteredResults = results.filter((res) => {
    return res.toLowerCase().includes(text);
  });
  filteredResults.forEach((res) => {
    datalist.insertAdjacentHTML(
      "beforeend",
      `<option value="${catchNames(res)}">${catchNames(res)}</option>`
    );
  });
  if (filteredResults.length > 0) {
    datalist.style.display = "block";
  }
});

// Set focus of current datalist selection (when using keyboard to navigate)
let currentFocus = -1;
input.onkeydown = function (e) {
  if (e.keyCode == 40) {
    currentFocus++;
    addActive(datalist.options);
  } else if (e.keyCode == 38) {
    currentFocus--;
    addActive(datalist.options);
  } else if (e.keyCode == 13) {
    e.preventDefault();
    checkCountry();
    // reset values once the country has been checked
    input.value = "";
    datalist.innerHTML = "";
    currentFocus = -1;
    datalist.style.display = "none";
  }
};

// Add active class to current datalist option
function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("active");
  input.value = x[currentFocus].value;
}

// Remove active class from other datalist options
function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
}

startGame();

// Event listeners

// closes datalist when block is clicked on
document.addEventListener("click", (e) => {
  if (e.target == datalist || e.target == input) return;
  datalist.style.display = "none";
  input.style.borderRadius = "0";
});
