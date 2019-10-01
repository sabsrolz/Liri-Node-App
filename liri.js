//read and set environmental variables with the dotenv package
require("dotenv").config();

//import Spotify keys from keys.js file
let keys = require("./keys.js");

//Spotify API output
//import Spotify and axios modules
let Spotify = require("node-spotify-api");

//initialize key information by importing spotify object from keys JS file
let spotify = new Spotify(keys.spotify);

spotify.search(
  { type: "track", query: "All the Small Things", limit: 1 },
  function(err, data) {
    if (err) {
      return console.log("error occured: " + err);
    }
    const trackObject = JSON.parse(
      JSON.stringify(data.tracks.items[0].artists)
    );
    //console.log(trackObject);
  }
);

const axios = require("axios");

//SeatGeek API output
axios
  .get(
    "https://api.seatgeek.com/2/events?performers.slug=JonasBrothers&client_id=Nzk1NDk5M3wxNTY5OTUzMjQ2Ljkz"
  )
  .then(function(response) {
    //console.log(response);
  });

//OMDb API output
axios
  .get("http://www.omdbapi.com/?t=Moana&apikey=trilogy")
  .then(function(response) {
    // console.log("movie output starts here");
    // console.log(response);
  });

const [, , args] = process.argv;
console.log(args);
const type = args.split("-")[0];
const nameInput = args.split("-")[1];
