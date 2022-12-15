const options = {
    types: ["(cities)"]
}
const presentDate = dayjs().format('dddd, MMM DD, YYYY')
const geocoder = new google.maps.Geocoder();
const inputLocationEL = document.querySelector('#location')
const subTitleEl = $('.subtitle')



//Functions--------------------------------------------------------
showDate = dateContainer => dateContainer.text(`Today is ${presentDate}`)
addAutoComplete = (input, options) => new google.maps.places.Autocomplete(input, options)




// Next, make a request to the geocode method, passing in the city name
// and a callback function to handle the response
geocoder.geocode({ address: 'Seattle' }, (results, status) => {
  // If the request was successful
  if (status === google.maps.GeocoderStatus.OK) {
    // Get the first result (which should be the most accurate)
    const result = results[0];
    // Get the latitude and longitude of the city
    const lat = result.geometry.location.lat();
    const lng = result.geometry.location.lng();

    // Print the latitude and longitude to the console
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  } else {
    // If the request was not successful, print the error to the console
    console.error(`Geocoding error: ${status}`);
  }
});
//Excute functions
showDate(subTitleEl)
addAutoComplete(inputLocationEL, options)