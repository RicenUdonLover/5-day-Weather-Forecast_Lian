const options = {
  types: ["(cities)"]
}

const presentDate = dayjs().format('dddd, MMM DD, YYYY')
const geocoder = new google.maps.Geocoder();
const inputLocationEL = document.querySelector('#location')
const subTitleEl = $('.subtitle')
const searchBtnEl = $('#search-btn')
const clearHistoryBtn = document.getElementById('clear-history');
const navbar = document.getElementById('search-history');

//Functions--------------------------------------------------------
showDate = dateContainer => dateContainer.text(`Today is ${presentDate}`) //Show today's date in subtitle of the hero element

addAutoComplete = (input, options) => new google.maps.places.Autocomplete(input, options) // Add autocomplete to the search input

getText = (event) => {
  event.preventDefault();
  var inputLocationText = inputLocationEL.value.trim()
  console.log(inputLocationText)
  getGeocode(inputLocationText, getWeatherApi)
} // Get the text from search bar and use it to get geocode from google maps platform


getGeocode = (address, callback) => {
  if (address) { // Make sure the address is not empty
    console.log(address)
    // Make a request to the geocode method, passing in the city name and a callback function to handle the response
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        // Get the first result (which should be the most accurate)
        const result = results[0];
        // Get the latitude and longitude of the city
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        // Print the latitude and longitude to the console
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        const cityName = address;
        updateSearchHistory(cityName); // Update search history
        callback(lat, lng)// Use a callback function to handle the coordinates got from the search
      } else {
        console.error(`Geocoding error: ${status}`);
      }
    });
  } else {
    console.log('invalid input')
    return
  }
}

getWeatherApi = (Latitude, Longitude) => {
  var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&units=imperial&cnt=40&appid=c3ad3a0e2e79c49b9881a9353b89aa61`; // Using url parameters to show data in imperial unit and show max length of data (5 days)
  console.log(weatherUrl);

  fetch(weatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      const container = document.getElementById('cards-container');
      container.innerHTML = ''; // Clear previous cards

      for (let i = 0; i < 5; i++) {
        var day = new City(data, i);
        console.log(day);

        // Create card element and populate it with City properties
        const card = document.createElement('div');
        card.className = 'column is-one-fifth';
        card.innerHTML = `
  <div class="card">
    <div class="card-content">
      <div class="content">
        <h3 class="title is-4">${day.name}</h3>
        <p>Date: ${day.date}</p>
        <p>Temperature: ${day.temp}</p>
        <p>Feels Like: ${day.feelsLike}</p>
        <p>Humidity: ${day.humidity}</p>
        <p>Weather: ${day.weather}</p>
        <p>Wind: ${day.wind}</p>
      </div>
    </div>
  </div>
`;

        container.appendChild(card);
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('Something went wrong');
    });
};

class City {
  constructor(data, day) {
    this.name = `${data.city.name}, ${data.city.country}`,
      this.date = data.list[day * 8].dt_txt.slice(0, 10),
      this.temp = `${Math.floor(data.list[day * 8].main.temp)}°F`,
      this.feelsLike = `${Math.floor(data.list[day * 8].main.feels_like)}°F`,
      this.humidity = `${data.list[day * 8].main.humidity}%`,
      this.weather = data.list[day * 8].weather[0].main,
      this.wind = `${data.list[day * 8].wind.speed}mph`
  }
}

updateSearchHistory = (city) => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const index = searchHistory.findIndex(item => item.toLowerCase() === city.toLowerCase());

  if (index === -1) { // If the city is not in the search history
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    renderSearchHistory(); // Render the search history in the navbar
  }
}

function renderSearchHistory() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = '';

  if (searchHistory.length > 0) {
    clearHistoryBtn.classList.remove('is-hidden');
  } else if (searchHistory.length === 0 || !searchHistory) {
    clearHistoryBtn.classList.add('is-hidden');
  }

  searchHistory.forEach(city => {
    const item = document.createElement('a');
    item.className = 'panel-block';
    item.textContent = city;
    item.addEventListener('click', () => {
      getGeocode(city, getWeatherApi); // Fetch weather data when clicked
    });
    menuList.appendChild(item);
  });
}

clearSearchHistory = () => {
  localStorage.removeItem('searchHistory');
  renderSearchHistory();
}



//Excute functions-------------------------------------------------------------------------
showDate(subTitleEl)
addAutoComplete(inputLocationEL, options)
searchBtnEl.click(getText)
clearHistoryBtn.addEventListener('click', clearSearchHistory);
renderSearchHistory();
