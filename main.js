const countryContainer = document.querySelector(".countries-container");
const body = document.querySelector("body");
const header = document.querySelector("header");
const main = document.querySelector("main");
const selectElement = document.querySelector(".select-bar select");
const searchBox = document.querySelector(".search-bar input");
const modeText = document.querySelector(".mode-text");
const modeBtn = document.querySelector(".mode-btn");
const threeContainer = document.querySelector(".three-container");
const earthIcon = document.querySelector(".earth-icon");
import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import VanillaTilt from "vanilla-tilt";

if (!localStorage.getItem("mode")) {
  localStorage.setItem("mode", false);
}

if (localStorage.getItem("mode") === "false") {
  threeContainer.style.display = "none";
  earthIcon.style.display = "none";
}

const threeJs = (element, threeModel, x, y, z, ax, ay) => {
  // scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = z;
  camera.position.y = y;
  camera.position.x = x;

  if (window.innerWidth < 768) {
    camera.position.z = 5;
  }

  // renderer
  const canvas = element;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Add OrbitControls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Post processing
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  let model;

  // HDRI
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("./rogland_moonlit_night_2k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;

    // Load model after HDRI is ready
    const loader = new GLTFLoader();
    loader.load(
      `./${threeModel}`,
      function (gltf) {
        model = gltf.scene;
        scene.add(model);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error("An error happened:", error);
      }
    );
  });

  window.addEventListener("scroll", (e) => {
    if (model) {
      model.rotation.y += 0.04;
      model.rotation.x += 0.005;
    }
  });

  // animation
  function animate() {
    window.requestAnimationFrame(animate);

    if (model) {
      model.rotation.y += ax; // Add rotation to the model around y-axis
      model.rotation.x += ay; // Add rotation to the model around y-axis
    }

    controls.update(); // Update controls in animation loop
    composer.render(); // Use composer instead of renderer
  }

  animate();
};

threeJs(
  document.getElementById("canvas1"),
  "earth.glb",
  0,
  0.1,
  2.99,
  0.0015,
  0.0005
);
threeJs(
  document.getElementById("canvas2"),
  "stars.glb",
  0,
  0.2,
  3,
  0.0015,
  0.0005
);

earthIcon.addEventListener("click", (e) => {
  if (body.className === "dark") {
    main.style.opacity = "0";
    main.style.pointerEvents = "none";
    header.style.opacity = "0";
    header.style.pointerEvents = "none";
    document.querySelector(".threejs-container1").style.zIndex = "1";
    document.querySelector(".exit-btn").style.opacity = "1";
    document.querySelector(".exit-btn").style.pointerEvents = "unset";

    threeJs(document.getElementById("canvas1"), "earth.glb", 0, 0.1, 3.5, 0, 0);
    threeJs(
      document.getElementById("canvas2"),
      "stars.glb",
      0,
      0.2,
      3,
      0.0002,
      0
    );
  }
});
document.querySelector(".exit-btn").addEventListener("click", (e) => {
  if (body.className === "dark") {
    main.style.opacity = "1";
    main.style.pointerEvents = "unset";
    header.style.opacity = "1";
    header.style.pointerEvents = "unset";
    document.querySelector(".threejs-container1").style.zIndex = "-1";
    document.querySelector(".exit-btn").style.opacity = "0";
    document.querySelector(".exit-btn").style.pointerEvents = "none";

    threeJs(
      document.getElementById("canvas1"),
      "earth.glb",
      0,
      0.1,
      3.5,
      0.0015,
      0.0005
    );
    threeJs(
      document.getElementById("canvas2"),
      "stars.glb",
      0,
      0.2,
      3,
      0.0015,
      0.0005
    );
  }
});

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
  if (document.body.className === "dark") {
    document.querySelector(".three-container").style.display = "unset";
    earthIcon.style.display = "unset";
  } else {
    document.querySelector(".three-container").style.display = "none";
    earthIcon.style.display = "none";
  }
});

// modeBtn.addEventListener("click", (e) => {
//   body.classList.toggle(localStorage.getItem("mode"));
// });

let allCountriesData;

const makeAcard = document.createElement("a");

fetch("https://restcountries.com/v3.1/all")
  .then((data) => {
    // console.log(data.json());
    return data.json();
  })
  .then((data) => {
    // console.log(data);
    renderCountries(data);
    allCountriesData = data;
  });

selectElement.addEventListener("change", (e) => {
  // console.log(selectElement.value);
  fetch(`https://restcountries.com/v3.1/region/${selectElement.value}`)
    .then((data) => {
      return data.json();
    })
    .then(renderCountries);
});

function renderCountries(data) {
  countryContainer.innerHTML = "";

  data.forEach((country) => {
    // console.log(country);

    const countryCard = document.createElement("a");
    countryCard.classList.add("country");
    countryCard.href = `#`;

    VanillaTilt.init(countryCard, {
      max: 25, // maximum tilt rotation (degrees)
      speed: 400, // speed of the enter/exit transition
      glare: true, // whether to add glare effect
      "max-glare": 0.5, // maximum glare opacity
    });

    const cardHTML = `
      <div class="flag-container">
        <img src="${country.flags.svg}" alt="flag" />
      </div>
                    <div class="country-details">
                      <h1>${country.name.common}</h1>
                      <p><b>Population: </b>${country.population.toLocaleString(
                        "en-IN"
                      )}</p>
                      <p><b>Region: </b>${country.region}</p>
                      <p><b>Capital: </b>${country.capital?.[0]}</p>
                    </div>
        `;
    countryCard.innerHTML = cardHTML;
    countryContainer.append(countryCard);
  });
}

searchBox.addEventListener("input", (e) => {
  // console.log(e.target.value);
  const filteredCountries = allCountriesData.filter((country) => {
    return country.name.common
      .toLowerCase()
      .includes(e.target.value.toLowerCase());
  });
  // console.log(filteredCountries);
  renderCountries(filteredCountries);
});
