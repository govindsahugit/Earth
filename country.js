const countryName = new URLSearchParams(location.search).get("name");
const countryNameElement = document.querySelector(".country-name");
const flagImg = document.querySelector(".flag-img");
const nativeNameElement = document.querySelector(".native-name");
const population = document.querySelector(".population");
const region = document.querySelector(".region");
const subRegion = document.querySelector(".sub-region");
const capital = document.querySelector(".capital");
const domain = document.querySelector(".domain");
const currencies = document.querySelector(".currencies");
const language = document.querySelector(".language");
const borderContainer = document.querySelector(".border-container");
const modeText = document.querySelector(".mode-text");
const modeBtn = document.querySelector(".mode-btn");
const body = document.querySelector("body");

const isDarkMode = JSON.parse(localStorage.getItem("mode"));

const darkHTML = `
    <i class="ri-sun-line"></i></i>
    <span class="mode-text"> Light Mode</span>
    `;

const lightHTML = `
    <i class="fa-regular fa-moon"></i>
    <span class="mode-text"> Dark Mode</span>`;

let current = "light";

if (isDarkMode) {
  body.classList.add("dark");
  modeBtn.innerHTML = darkHTML;
  current = "dark";
} else {
  body.classList.remove("dark");
  modeBtn.innerHTML = lightHTML;
  current = "light";
}

modeBtn.addEventListener("click", (e) => {
  if (current === "light") {
    body.classList.add("dark");
    modeBtn.innerHTML = darkHTML;
    localStorage.setItem("mode", true);
    current = "dark";
  } else {
    body.classList.remove("dark");
    modeBtn.innerHTML = lightHTML;
    localStorage.setItem("mode", false);
    current = "light";
  }
  // console.log(current);
});

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((data) => {
    return data.json();
  })
  .then(([country]) => {
    console.log(country);
    const nativeName = Object.values(country.name.nativeName)[0].common;
    // const currenciesName = Object.values(country.currencies)[0].name;
    const languageName = Object.values(country.languages);
    const bordersName = country.borders;

    if (bordersName) {
      bordersName.forEach((border) => {
        const borderTag = document.createElement("a");
        borderTag.classList.add("borders");
        borderTag.innerText = border;
        borderContainer.append(borderTag);
      });
    } else {
      borderContainer.innerText = `${countryName} has no borders.`;
    }

    if (country.currencies) {
      const currenciesName = Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ");
      currencies.innerText = currenciesName;
    } else {
      currencies.innerText = `${countryName} have no own currencies.`;
    }

    flagImg.src = country.flags.svg;
    nativeNameElement.innerText = nativeName;
    population.innerText = country.population.toLocaleString("en-IN");
    region.innerText = country.region;
    subRegion.innerText = country.subregion;
    countryNameElement.innerText = countryName;
    capital.innerText = country.capital;
    language.innerText = languageName;
    domain.innerText = country.tld.join(", ");
  });
