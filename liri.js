//read and set environmental variables with the dotenv package
require("dotenv").config();

//import Spotify keys from keys.js file
let keys = require("./keys.js");
//import fs module to read text from external text files
let fs = require("fs");

function exportOutput(queryOutput) {
  fs.appendFile("output.txt", queryOutput, function(err, data) {
    if (err) {
      console.log(err);
    }
    console.log('The "data to append" was appended to file!');
  });
}
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
    exportOutput(JSON.stringify(songObject));
  });
}

const axios = require("axios");

//SeatGeek API output
function concertRequest(artist) {
  artist = artist.replace(" ", "-");
  console.log(artist);
  //artist = "Taylor-Swift";
  axios
    .get(
      `https://api.seatgeek.com/2/events?performers.slug=${artist}&client_id=Nzk1NDk5M3wxNTY5OTUzMjQ2Ljkz`
    )
    .then(function(response) {
      console.log(response);
      exportOutput("concert output");
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
    exportOutput(JSON.stringify(movieObject));
  });
}

function readInput() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    console.log(data);
    const inputType = data.split(",")[0];
    const inputName = data.split(",")[1];

    if (inputType === "movie-this") {
      movieRequest(inputName);
    } else if (inputType === "concert-this") {
      concertRequest(inputName);
    } else if (inputType === "spotify-this-song") {
      songRequest(inputName);
    }
  });
}

const [, , args] = process.argv;
console.log(args);
const type = args.split(",")[0];
const nameInput = args.split(",")[1];
console.log(nameInput);

function makeRequest() {
  if (type === "movie-this") {
    if (nameInput != "") {
      movieRequest(nameInput);
    } else {
      movieRequest("Mr Nobody");
    }
  } else if (type === "concert-this") {
    concertRequest(nameInput);
  } else if (type === "spotify-this-song") {
    if (nameInput != "") {
      songRequest(nameInput);
    } else {
      songRequest("The Sign");
    }
  } else if (type === "do-what-it-says") {
    readInput();
  }
}
makeRequest();

//readInput();
