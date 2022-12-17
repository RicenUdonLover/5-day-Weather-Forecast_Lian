const options = {
  types: ["(cities)"]
}

const presentDate = dayjs().format('dddd, MMM DD, YYYY')
const geocoder = new google.maps.Geocoder();
const inputLocationEL = document.querySelector('#location')
const subTitleEl = $('.subtitle')
const searchBtnEl = $('#search-btn')

//Functions--------------------------------------------------------
showDate = dateContainer => dateContainer.text(`Today is ${presentDate}`)
addAutoComplete = (input, options) => new google.maps.places.Autocomplete(input, options)
getText = (event) => {
  event.preventDefault();
  var inputLocationText = inputLocationEL.value.trim()
  console.log(inputLocationText)
  getGeocode(inputLocationText, getWeatherApi)
}


getGeocode = (address, callback) => {
  if (address) {
    console.log(address)
    // Next, make a request to the geocode method, passing in the city name
    // and a callback function to handle the response
    geocoder.geocode({ address: address }, (results, status) => {
      // If the request was successful
      if (status === google.maps.GeocoderStatus.OK) {
        // Get the first result (which should be the most accurate)
        const result = results[0];
        // Get the latitude and longitude of the city
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        // Print the latitude and longitude to the console
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        callback(lat, lng)
      } else {
        // If the request was not successful, print the error to the console
        console.error(`Geocoding error: ${status}`);
      }
    });
  }
}

var getWeatherApi = function (Latitude, Longitude) {
  var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&appid=c3ad3a0e2e79c49b9881a9353b89aa61`
  console.log(url)
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        // console.log(response);
        response.json().then(function (data) {
          console.log(data)
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      console.log('something is wrong');
    });
};

//Excute functions
showDate(subTitleEl)
addAutoComplete(inputLocationEL, options)
searchBtnEl.click(getText)
