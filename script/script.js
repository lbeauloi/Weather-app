// on selectionne le bouton avec la classe "submitBtn"
const submitBtn = document.querySelector(".submitBtn");

submitBtn.addEventListener("click", () => {
  //event listener sur le bouton

  const inputCity = document.querySelector("#inputCity");
  const city = inputCity.value;
  const apiKey = "72ca06ae350b5f35e9ccd4edd80aeeb9";

  // -----------------------------------METEO DU JOUR----------------------------------------
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`
  )
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.main.temp;
      const tempMin = data.main.temp_min;
      const tempMax = data.main.temp_max;

      //on arrondi les temperatures pour éviter d'avoir des truc style 14.98°C
      const tempArrondie = Math.round(temperature);
      const tempMaxArrondie = Math.round(tempMax);
      const tempMinArrondie = Math.round(tempMin);

      const temp = document.querySelector(".temp");
      const minTemp = document.querySelector(".min");
      const maxTemp = document.querySelector(".max");
      const cityName = document.querySelector(".city");

      temp.textContent = `${tempArrondie}°C`;
      minTemp.textContent = `Min:${tempMinArrondie}°C`;
      maxTemp.textContent = `Max:${tempMaxArrondie}°C`;
      cityName.textContent = city;

      //ajout de l'image (ensoleillé, nuageux, etc) (rappel le chemin : https://api.openweathermap.org/data/2.5/weather?q=paris&appid=72ca06ae350b5f35e9ccd4edd80aeeb9&units=metric&lang=fr (data.weather[0].main)
      const weatherIcon = document.querySelector(".weatherIcon");

      if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "style/images/clouds.png";
      } else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "style/images/clear.png";
      } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "style/images/drizzle.png";
      } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "style/images/mist.png";
      } else if (data.weather[0].main == "Rain") {
        weatherIcon.src = "style/images/rain.png";
      } else if (data.weather[0].main == "Snow") {
        weatherIcon.src = "style/images/snow.png";
      }

      inputCity.value = ""; // on reset l'input
    });

  // ---------------------PREVISION SUR 5 JOURS--------------------
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`
  )
    .then((response) => response.json())
    .then((data) => {
      const forecasts = data.list;
      const selectedHours = [0, 8, 16, 24, 32, 40]; //vu que l'API fourni des update toutes les 3h, et on ne veut pas avoir meteo lundi 6h 10°C, lundi 9h 12°C, lundi 12h 18°C, etc.
      const previsionContainer = document.querySelector(".meteo5j"); // on selectionne la div existante
      previsionContainer.innerHTML = ""; // on efface le contenu précédent
      selectedHours.forEach((hour) => {
        const forecast = forecasts[hour];
        const dateTime = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const tempRound = Math.round(temperature);

        // une div pour chaque jour de la semaine 
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day"); // on donne une classe à la div

        const jourSemaine = document.createElement("p");
        const prevision = document.createElement("p");

        // on def une classe
        jourSemaine.classList.add("jourSemaine");
        prevision.classList.add("prevision");

        //mettre à jour les "p"
        jourSemaine.textContent = dateTime.toLocaleDateString("fr-FR", {
          weekday: "long",
        });
        prevision.textContent = `${tempRound}°C`;

        dayDiv.appendChild(jourSemaine);
        dayDiv.appendChild(prevision);
        previsionContainer.appendChild(dayDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching 5-day forecast data:", error);
    });

  // -----------------------IMAGE DE LA VILLE EN QUESTION---------------------------------------
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
