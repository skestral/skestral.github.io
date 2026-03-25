// CST-336 
// HW3 – Weather Check
// Savannah Kestral

const API_KEY = "a4f00d747365d67df36e9fd61a2835d2";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// form submit event listener
document.getElementById("weatherForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const zip = document.getElementById("zipInput").value.trim();
    const units = document.getElementById("unitSelect").value;
    const errorMsg = document.getElementById("inputError");

    // validate zip code for 5 digits 
    if (zip.length === 0) {
        errorMsg.textContent = "Please enter a zip code.";
        return;
    }
    // validate format
    if (!/^\d{5}$/.test(zip)) {
        errorMsg.textContent = "Please enter a valid 5-digit US zip code.";
        return;
    }

    errorMsg.textContent = "";
    getWeather(zip, units);
});

// fetch weather info from OpenWeatherMap
function getWeather(zip, units) {
    const url = BASE_URL + "?zip=" + zip + ",US&appid=" + API_KEY + "&units=" + units;

    document.getElementById("weatherDisplay").innerHTML = "<p>Loading...</p>";

    fetch(url)
    // handle errors
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Could not find weather for that city. (Status: " + response.status + ")");
            }
            return response.json();
        })
        // get data
        .then(function(data) {
            displayWeather(data, units);
        })
        // errors from fetch or thrown above
        .catch(function(error) {
            document.getElementById("weatherDisplay").innerHTML = "<p class='weather-error'>" + error.message + "</p>";
        });
}

// get a random cat from cat as a service api
function loadCat() {
    document.getElementById("catImg").src = "https://cataas.com/cat?t=" + Date.now();
}

// get new cat
loadCat();
document.getElementById("newCatBtn").addEventListener("click", loadCat);

// actually display the weather data we get back
function displayWeather(data, units) {
    const unitSymbol = units === "metric" ? "°C" : "°F";
    const speedUnit  = units === "metric" ? "m/s" : "mph";

    const city        = data.name;
    const country     = data.sys.country;
    const temp        = Math.round(data.main.temp);
    const feelsLike   = Math.round(data.main.feels_like);
    const humidity    = data.main.humidity;
    const windSpeed   = data.wind.speed;
    const description = data.weather[0].description;
    const icon        = data.weather[0].icon;

    // set color 
    const tempC = units === "metric" ? temp : Math.round((temp - 32) * 5 / 9);
    let tempClass = "temp-mild";
    if      (tempC < 10) tempClass = "temp-cold";
    else if (tempC < 20) tempClass = "temp-mild";
    else if (tempC < 30) tempClass = "temp-warm";
    else                 tempClass = "temp-hot";

    document.getElementById("weatherDisplay").innerHTML = `
        <div class="weather-card ${tempClass}">
            <div class="weather-location">
                <h2 class="weather-city">${city}</h2>
                <span class="weather-country">${country}</span>
            </div>
            <div class="weather-primary">
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <div>
                    <div class="temp-display">${temp}${unitSymbol}</div>
                    <div class="weather-desc">${description}</div>
                </div>
            </div>
            <div class="weather-details-grid">
                <div class="weather-detail-tile">
                    <span class="detail-label">Feels Like</span>
                    <span class="detail-value">${feelsLike}${unitSymbol}</span>
                </div>
                <div class="weather-detail-tile">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${humidity}%</span>
                </div>
                <div class="weather-detail-tile">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${windSpeed} ${speedUnit}</span>
                </div>
            </div>
        </div>`;
}
