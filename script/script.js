// on crée un text input et un bouton et une div
let inputCity = document.createElement("input");
let submitBtn = document.createElement("button");
let resultContainer = document.createElement("div");

inputCity.placeholder = "Enter a city";
submitBtn.textContent = "Submit";

// on les lie au body
document.body.appendChild(inputCity);
document.body.appendChild(submitBtn);
document.body.appendChild(resultContainer);

// event listener sur le bouton submit, quand on clique déclenche la fonction...
submitBtn.addEventListener("click", () => {
  // on recup la ville entrée dans l'input et on la stock dans une constante
  const city = inputCity.value;
  const apiKey = "72ca06ae350b5f35e9ccd4edd80aeeb9"; // ma clé API lié a mon compte Openweather 
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild); //nous permet de supprimer la météo de la ville precedente
  }
  // on demande à l'API
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  ) // url de l'API + la ville saisie par l'utilisateur (=const city)+ clé API
    .then((response) => response.json()) //on traite la réponse en format JSON
    .then((data) => {
      const temperatureKelvin = data.list[0].main.temp; //on va chercher la data qui nous interesse dans l'api, ici elle se trouve list:main:temp (https://api.openweathermap.org/data/2.5/forecast?q=Paris&appid=72ca06ae350b5f35e9ccd4edd80aeeb9 exemple de Paris)
      const temperatureCelsius = Math.round(temperatureKelvin - 273.15); //on converti la temp en C
      // la fonction qui créé une nouvelle div pour afficher la météo
      const meteoDiv = document.createElement("div");
      meteoDiv.textContent = `Météo pour ${city} : ${temperatureCelsius}°C`;

      // on lie la div résultat au conteneur de résultat
      resultContainer.appendChild(meteoDiv);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
 // pour afficher previson sur 5j --> jouer avec la data "dt_txt" (data.list[1].dt_txt) index [0] = 10/10/23 à 9h00, [1]= 10/10/23 à 12h00, [2] 10/10/23 à 15h00, [3] 10/10/23 à 18h00, [4] 10/10/23 à 21h00, [5] 11/10/23 0h00 on passe au JOUR SUIVANT après donc 6 "tour d'index" 