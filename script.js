const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city');
const notFoundSection = document.querySelector('.not-found');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = "da89424bcb07731445e387f7f4330286";

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() !== ''){
        updateWeather(cityInput.value);
    }
});

async function fetchData(endpoint, city){
    const url = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    return res.json();
}

function showSection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(sec => sec.style.display = 'none');
    section.style.display = 'block';
}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg';
    if(id<=531) return 'rain.svg';
    if(id<=622) return 'snow.svg';
    if(id<=781) return 'atmosphere.svg';
    if(id==800) return 'clear.svg';
    return 'clouds.svg';
}

async function updateWeather(city){
    const data = await fetchData('weather', city);

    if(data.cod != 200){
        showSection(notFoundSection);
        return;
    }

    const {name, main, weather, wind} = data;

    countryTxt.textContent = name;
    tempTxt.textContent = Math.round(main.temp) + "°C";
    conditionTxt.textContent = weather[0].main;
    humidityValueTxt.textContent = main.humidity + "%";
    windValueTxt.textContent = wind.speed + " m/s";

    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(weather[0].id)}`;

    updateForecast(city);
    showSection(weatherInfoSection);
}

async function updateForecast(city){
    const data = await fetchData('forecast', city);
    forecastItemsContainer.innerHTML = '';

    data.list.forEach(item => {
        if(item.dt_txt.includes("12:00:00")){
            const html = `
                <div class="forecast-item">
                    <p>${new Date(item.dt_txt).toDateString().slice(4,10)}</p>
                    <img src="assets/weather/${getWeatherIcon(item.weather[0].id)}" width="40">
                    <p>${Math.round(item.main.temp)}°C</p>
                </div>
            `;
            forecastItemsContainer.insertAdjacentHTML('beforeend', html);
        }
    });
}
