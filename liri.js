//read and set environmental variables with the dotenv package
require("dotenv").config();

//import Spotify keys from keys.js file
let keys = require("./keys.js");

//Spotify API output
function songRequest(track) {
  //import Spotify and axios modules
  let Spotify = require("node-spotify-api");

  //initialize key information by importing spotify object from keys JS file
  let spotify = new Spotify(keys.spotify);

  spotify.search({ type: "track", query: track, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("error occured: " + err);
    }
    const trackOutput = JSON.parse(JSON.stringify(data.tracks.items[0]));
    console.log(trackOutput.preview_url);
    const songObject = {
      artist: trackOutput.artists[0].name,
      songName: trackOutput.name,
      previewLink: trackOutput.preview_url,
      album: trackOutput.album.album_type
    };
    console.log(songObject);
  });
}

const axios = require("axios");

//SeatGeek API output
function concertRequest(artist) {
  axios
    .get(
      `https://api.seatgeek.com/2/events?performers.slug=${artist}&client_id=Nzk1NDk5M3wxNTY5OTUzMjQ2Ljkz`
    )
    .then(function(response) {
      console.log(response._events);
    });
}

//OMDb API output
function movieRequest(movie) {
  const movieQuery = `http://www.omdbapi.com/?t=${movie}&apikey=trilogy`;
  axios.get(movieQuery).then(function(response) {
    const movieObject = {
      movieName: response.data.Title,
      year: response.data.Year,
      rating: response.data.Ratings[0].Value,
      ratingRotten: response.data.Ratings[1].Value,
      country: response.data.Country,
      language: response.data.Language,
      plot: response.data.Plot,
      actors: response.data.Actors
    };
    console.log(movieObject);
  });
}

const [, , args] = process.argv;
console.log(args);
const type = args.split("-")[0];
const nameInput = args.split("-")[1];

function makeRequest() {
  if (type === "movie") {
    movieRequest(nameInput);
  } else if (type === "concert") {
    concertRequest(nameInput);
  } else if (type === "song") {
    songRequest(nameInput);
  }
}
makeRequest();
