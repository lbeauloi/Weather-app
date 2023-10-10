// on crée un text input et un bouton et une div
let inputCity = document.createElement("input");
let submitBtn = document.createElement("button");
let tempContainer = document.createElement("div");
let previsionContainer = document.createElement("div");
let imgContainer = document.createElement("div");

inputCity.placeholder = "Enter a city";
submitBtn.textContent = "Submit";

// on les lie au body
document.body.appendChild(inputCity);
document.body.appendChild(submitBtn);
document.body.appendChild(tempContainer);
document.body.appendChild(previsionContainer);
document.body.appendChild(imgContainer);

// event listener sur le bouton submit, quand on clique déclenche la fonction...
submitBtn.addEventListener("click", () => {
  // on recup la ville entrée dans l'input et on la stock dans une constante
  const city = inputCity.value;
  const apiKey = "72ca06ae350b5f35e9ccd4edd80aeeb9"; // ma clé API lié a mon compte Openweather

  while (tempContainer.firstChild) {
    tempContainer.removeChild(tempContainer.firstChild); //nous permet de supprimer la météo de la ville precedente
  }

  while (previsionContainer.firstChild) {
    previsionContainer.removeChild(previsionContainer.firstChild);
  }
  while (imgContainer.firstChild) {
    imgContainer.removeChild(imgContainer.firstChild);
  }
  // METEO DU JOUR
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`
  ) // url de l'API + la ville saisie par l'utilisateur (=const cityName)+ clé API
    .then((response) => response.json()) //on traite la réponse en format JSON
    .then((data) => {
      const temperature = data.main.temp; //on va chercher la data qui nous interesse dans l'api, ici elle se trouve main:temp (https://api.openweathermap.org/data/2.5/weather?q=paris&appid=72ca06ae350b5f35e9ccd4edd80aeeb9&units=metric&lang=fr exemple de Paris)

      // la fonction qui créé une nouvelle div pour afficher la météo
      const meteoDiv = document.createElement("div");
      meteoDiv.textContent = `Météo à ${city} : ${temperature}°C`;

      // on lie la div résultat au conteneur de résultat
      tempContainer.appendChild(meteoDiv);
    });

  // IMAGE DE LA VILLE EN QUESTION
  const accessKey = "TFQbywMAkEZOglEdRD4aLAbnMcnZkMHw4cauMi_FIow";

  // Envoyer une requête à l'API d'Unsplash
  fetch(`https://api.unsplash.com/search/photos?query=${city}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Extraire l'URL de la première image de la réponse
      const imageUrl = data.results[0].urls.regular;

      // Afficher l'image dans la page
      //   const imgDiv = document.createElement("div");
      const imgCity = document.createElement("img");
      imgCity.src = imageUrl;
      imgCity.setAttribute("width", "200px");
      imgCity.setAttribute("height", "200px");
      //   document.body.appendChild(imgDiv);
      imgContainer.appendChild(imgCity);
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche :", error);
    });

  // PREVISION SUR 5 JOURS
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`
  )
    .then((response) => response.json())
    .then((data) => {
      const forecasts = data.list;

      const selectedHours = [0, 8, 16, 24, 32, 40]; //si on selectionne les index de 0 a 40, on aura une prevision toute les 3h (genre mardi9h00 15deg, mardi 12h00 15deg, mardi 15h00 15deg....)

      selectedHours.forEach((hour) => {
        const forecast = forecasts[hour];
        const dateTime = new Date(forecast.dt * 1000); //*1000 car exprimé en milli seconde
        const temperature = forecast.main.temp;
        const previsionDiv = document.createElement("div");
        previsionDiv.textContent = `Prévision pour ${dateTime.toLocaleDateString(
          "fr-FR",
          { weekday: "long" }
        )} à ${dateTime.toLocaleTimeString("fr-FR")} : ${temperature}°C`;
        previsionContainer.appendChild(previsionDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
