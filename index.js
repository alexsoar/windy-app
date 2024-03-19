const apiKey = '2858b7833ff2408eaa92ae2bec628ab0';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=';

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  let data = await response.json();

  document.querySelector('.city').innerHTML = data.name;
  document.querySelector('.temperature').innerHTML =
    Math.round(data.main.temp) + '°C';
  document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
  document.querySelector('.wind').innerHTML = data.wind.speed + 'km/h';

  if (data.weather[0].main == 'Clouds') {
    weatherIcon.src = 'images/clouds.png';
  } else if (data.weather[0].main == 'Rain') {
    weatherIcon.src = 'images/rain.png';
  } else if (data.weather[0].main == 'Drizzle') {
    weatherIcon.src = 'images/drizzle.png';
  } else if (data.weather[0].main == 'Clear') {
    weatherIcon.src = 'images/clear.png';
  } else if (data.weather[0].main == 'Mist') {
    weatherIcon.src = 'images/mist.png';
  }
}
function handleSearch() {
  checkWeather(searchBox.value);
}
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

searchBox.value = 'London';

checkWeather(searchBox.value);

searchBtn.addEventListener('click', handleSearch);

searchBox.addEventListener('keypress', handleKeyPress);
