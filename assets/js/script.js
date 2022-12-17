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
    // Next, make a request to the geocode method, passing in the city name and a callback function to handle the response
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

var getWeatherApi = (Latitude, Longitude) => {
  var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${Latitude}&lon=${Longitude}&units=imperial&cnt=5&appid=c3ad3a0e2e79c49b9881a9353b89aa61`//Using url parameters to show data in imperial unit and 
  console.log(weatherUrl)
  $.ajax({
    type: 'GET',
    url: weatherUrl,
    success: (data)=> console.log(data),
    error: ()=> alert('Something went wrong'),
  });
};

//Excute functions
showDate(subTitleEl)
addAutoComplete(inputLocationEL, options)
searchBtnEl.click(getText)
