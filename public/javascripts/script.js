/*$(document).ready(function(){
  $.get("http://jsonip.com", function(data) {
    $(".ip").empty().append("Tuning in from IP Address: " + data.ip);
  });
 $.get("http://api.openweathermap.org/data/2.5/weather?q=boulder,co?&APPID=fceb86b7fa0aa20c2959dbc7f63c1f99", function(data){
    $('.weather').empty().append("Your Current Weather: "+ data.weather[0].description.toUpperCase())
    $('.temp').append("Temperature: "+ data.main.temp)
  });

// })*/

// $(document).ready(function(){
//   $.get("http://jsonip.com", function(data) {
//     $(".ip").empty().append("Tuning in from IP Address: " + data.ip);
//   });
//   console.log('HELLLLLLLO')
//   $.get("http://www.telize.com/geoip", function(data) {
//     $(".long").empty().append("Longitude: " + data.longitude);
//     $(".lat").empty().append("Latitude: "+ data.latitude);
//   });

//   $.get("http://api.openweathermap.org/data/2.5/weather?q=idaho+springs,co?&APPID=fceb86b7fa0aa20c2959dbc7f63c1f99&units=imperial", function(data){
//     $('.currentWeather').empty().append("Your Current Weather: "+ data.weather[0].description.toUpperCase())
//     $('.temp').append("Temperature: "+ data.main.temp)
//   });

// })