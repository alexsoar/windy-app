const apiKey = '2858b7833ff2408eaa92ae2bec628ab0';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&';

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');

async function getWeatherByGeoLocation() {
  // Получаем текущие координаты пользователя
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Отправляем запрос на API OpenWeatherMap, используя полученные координаты
        const response = await fetch(
          `${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        const data = await response.json();

        displayWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    },
    (error) => {
      console.error('Error getting geolocation:', error);
    }
  );
}

async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + 'q=' + city + `&appid=${apiKey}`);
    const data = await response.json();

    displayWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Произошла ошибка при получении данных о погоде');
  }
}

function displayWeatherData(data) {
  if (data.name === undefined) {
    alert('Придумайте, что-нибудь получше, город с таким названием не найден');
    return;
  }

  document.querySelector('.city').innerHTML = data.name;
  document.querySelector('.temperature').innerHTML =
    Math.round(data.main.temp) + '°C';
  document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
  document.querySelector('.wind').innerHTML = data.wind.speed + 'km/h';

  if (data.weather && data.weather.length > 0) {
    const weatherType = data.weather[0].main;
    weatherIcon.src = `images/${weatherType.toLowerCase()}.png`;
  }
}

function handleSearch() {
  const cityName = searchBox.value.trim();
  if (!/^[\sa-zA-Zа-яА-Я-]+$/.test(cityName)) {
    alert(
      'Пожалуйста не используйте цифры или символы, только если их нет в названии города'
    );
    return;
  }
  checkWeather(cityName);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

searchBox.value = 'London';

// Получить погоду по геолокации при загрузке страницы
getWeatherByGeoLocation();

searchBtn.addEventListener('click', handleSearch);
searchBox.addEventListener('keypress', handleKeyPress);
