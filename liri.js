//read and set environmental variables with the dotenv package
require("dotenv").config();

//import Spotify keys from keys.js file
let keys = require("./keys.js");

//Spotify API output
//import Spotify and axios modules
let Spotify = require("node-spotify-api");

//initialize key information by importing spotify object from keys JS file
let spotify = new Spotify(keys.spotify);

spotify.search({ type: "track", query: "All the Small Things" }, function(
  err,
  data
) {
  if (err) {
    return console.log("error occured: " + err);
  }

  const trackObject = JSON.parse(JSON.stringify(data.tracks));
  //console.log(trackObject);

  //console.log(JSON.stringify(data.tracks));
  //console.log(JSON.parse(JSON.stringify(data.tracks)));
  //console.log(typeof JSON.stringify(data.tracks));
});

const axios = require("axios");

//SeatGeek API output
axios
  .get(
    "https://api.seatgeek.com/2/events?performers.slug=JonasBrothers&client_id=Nzk1NDk5M3wxNTY5OTUzMjQ2Ljkz"
  )
  .then(function(response) {
    console.log("this is the response");
    console.log(response);
  });
