const apiKey = '2858b7833ff2408eaa92ae2bec628ab0';
const apigeoKey = '8ec61f23bebc4b0a8efae22ee2f04573';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&';

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const autocompleteContainer = document.querySelector('.autocomplete');

async function getWeatherByGeoLocation() {
  try {
    const options = {
      enableHighAccuracy: true, // Установка в true для получения более точной позиции за счет использования GPS
      timeout: 5000, // Максимальное время ожидания ответа (в миллисекундах)
      maximumAge: 0, // Максимальный возраст кешированных данных (в миллисекундах)
    };
    // Получаем текущие координаты пользователя
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    // Отправляем запрос на API OpenWeatherMap, используя полученные координаты
    const response = await fetch(
      `${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );
    const data = await response.json();

    displayWeatherData(data);
  } catch (error) {
    console.error('Error getting geolocation or weather data:', error);
    alert('Произошла ошибка при получении геопозиции или данных о погоде');
  }
}

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
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
    alert('К сожалению, такой город не найден');
    return;
  }

  document.querySelector('.city').innerHTML = data.name;
  document.querySelector('.temperature').innerHTML =
    Math.round(data.main.temp) + '°C';
  document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
  document.querySelector('.wind').innerHTML = data.wind.speed;

  if (data.weather && data.weather.length > 0) {
    const weatherType = data.weather[0].main;
    weatherIcon.src = `images/${weatherType.toLowerCase()}.png`;
  }
}

async function fetchAutocompleteSuggestions(cityName) {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${apigeoKey}`
    );
    const data = await response.json();
    return data.results.map((result) => result.formatted);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
}

function showAutocompleteSuggestions(suggestions) {
  autocompleteContainer.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement('div');
    suggestionElement.classList.add('autocomplete-item');
    suggestionElement.textContent = suggestion;
    suggestionElement.addEventListener('click', () => {
      searchBox.value = suggestion;
      handleSearch();
      autocompleteContainer.innerHTML = '';
    });
    autocompleteContainer.appendChild(suggestionElement);
  });
}

function handleSearch() {
  const cityName = searchBox.value.trim();
  if (cityName === '') {
    alert('Введите пожалуйста название города.');
    return;
  }
  // if (!/^[\sa-zA-Zа-яА-Я-]+$/.test(cityName)) {
  //   alert(
  //     'Пожалуйста, не используйте цифры или символы, только если их нет в названии города'
  //   );
  //   return;
  // }
  checkWeather(cityName);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}
// Обработчик ввода текста в поле поиска
searchBox.addEventListener('input', async () => {
  const cityName = searchBox.value.trim();
  if (cityName === '') {
    autocompleteContainer.innerHTML = '';
    return;
  }
  const suggestions = await fetchAutocompleteSuggestions(cityName);
  showAutocompleteSuggestions(suggestions);
});

// Получить геопозицию пользователя и определить погоду в его городе при загрузке страницы
getWeatherByGeoLocation();

searchBtn.addEventListener('click', handleSearch);
searchBox.addEventListener('keypress', handleKeyPress);
