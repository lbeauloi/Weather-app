// Sélectionnez le bouton avec la classe "submitBtn"
const submitBtn = document.querySelector(".submitBtn");

submitBtn.addEventListener("click", () => {
  // Sélectionnez l'élément d'entrée de la ville
  const inputCity = document.querySelector("#inputCity");
  const city = inputCity.value;
  const apiKey = "72ca06ae350b5f35e9ccd4edd80aeeb9";

  // METEO DU JOUR
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`
  )
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.main.temp;
      const tempMin = data.main.temp_min;
      const tempMax = data.main.temp_max;

      const tempArrondie = Math.round(temperature);
      const tempMaxArrondie = Math.round(tempMax);
      const tempMinArrondie = Math.round(tempMin);

      const temp = document.querySelector(".temp");
      const minTemp = document.querySelector(".min");
      const maxTemp = document.querySelector(".max");
      const cityName = document.querySelector(".city");

      temp.textContent = `${tempArrondie}°C`;
      minTemp.textContent = `${tempMinArrondie}°C`;
      maxTemp.textContent = `${tempMaxArrondie}°C`;
      cityName.textContent = city;

      inputCity.value = ""; // on reset l'input
    });

  // PREVISION SUR 5 JOURS
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`
  )
    .then((response) => response.json())
    .then((data) => {
      const forecasts = data.list;
      const selectedHours = [0, 8, 16, 24, 32, 40];
      const previsionContainer = document.querySelector(".meteo5j"); // Sélectionnez la div existante
      previsionContainer.innerHTML = ""; // Effacez le contenu précédent
      selectedHours.forEach((hour) => {
        const forecast = forecasts[hour];
        const dateTime = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const tempRound = Math.round(temperature);
        const previsionDiv = document.createElement("div");
        previsionDiv.textContent = `${dateTime.toLocaleDateString("fr-FR", {
          weekday: "long",
        })} : ${tempRound}°C`;

        previsionContainer.appendChild(previsionDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching 5-day forecast data:", error);
    });

  // IMAGE DE LA VILLE EN QUESTION
  const accessKey = "TFQbywMAkEZOglEdRD4aLAbnMcnZkMHw4cauMi_FIow";

  fetch(`https://api.unsplash.com/search/photos?query=${city}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const imageUrl = data.results[0].urls.regular;
      const imgCity = document.querySelector(".imageVille"); // on selectionne la div existante
      imgCity.innerHTML = ""; // on efface le contenu précédent
      const img = document.createElement("img");
      img.src = imageUrl;
      img.classList.add("city-image"); // on ajoute la classe "city-image" à l'image
      imgCity.appendChild(img);
    })
    .catch((error) => {
      console.error("Error fetching image data:", error);
    });
});
