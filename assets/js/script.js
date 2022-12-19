const options = {
  types: ["(cities)"]
}

const presentDate = dayjs().format('dddd, MMM DD, YYYY')
const geocoder = new google.maps.Geocoder();
const inputLocationEL = document.querySelector('#location')
const subTitleEl = $('.subtitle')
const searchBtnEl = $('#search-btn')

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
  var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&units=imperial&cnt=40&appid=c3ad3a0e2e79c49b9881a9353b89aa61`//Using url parameters to show data in imperial unit and show max length of data (5 days)
  console.log(weatherUrl)
  $.ajax({
    type: 'GET',
    url: weatherUrl,
    success: (data) => {
      console.log(data)
      for (let i =0; i < 5; i++){
      var day = new City(data, i)
      console.log(day)
      }
    },
    error: () => alert('Something went wrong'),
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
//Excute functions-------------------------------------------------------------------------
showDate(subTitleEl)
addAutoComplete(inputLocationEL, options)
searchBtnEl.click(getText)
