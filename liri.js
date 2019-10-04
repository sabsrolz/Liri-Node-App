//read and set environmental variables with the dotenv package
require("dotenv").config();

//import Spotify keys from keys.js file
let keys = require("./keys.js");
//import fs module to read text from external text files
const fs = require("fs");
const moment = require("moment");
const inquirer = require("inquirer");
let concertOptions = [];
let concertObject = {};

function exportOutput(queryOutput) {
  fs.appendFile("output.txt", queryOutput, function(err, data) {
    if (err) {
      console.log(err);
    }
    //console.log('The "data to append" was appended to file!');
  });
}
//Spotify API output
function songRequest(track) {
  //import Spotify and axios modules
  const Spotify = require("node-spotify-api");

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
    //for testing: console.log(JSON.stringify(data.tracks.items[0], null, 7));
    //console.log(data.tracks.items[0].album);
    const songObject = {
      artist: trackOutput.artists[0].name,
      songName: trackOutput.name,
      previewLink: trackOutput.preview_url,
      album: trackOutput.album.name
    };
    Object.keys(songObject).forEach(key => {
      console.log(key + ": " + songObject[key]);
      exportOutput(key + ": " + songObject[key] + "\r\n");
    });
    //exportOutput("-----------------------------------" + "\r\n");
    //console.log(songObject);
    //exportOutput(JSON.stringify(songObject));
  });
}

const axios = require("axios");

function concertSelect() {
  const venueOptions = [];
  concertOptions.forEach(concert =>
    venueOptions.push(`${concert.venueName},${concert.eventDate}`)
  ); //TODO concatenate with dates for uniqueness
  console.log(venueOptions);
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "concertInquirer",
        message: "Select the venue that you want to output data for:",
        choices: venueOptions
      }
    ])
    .then(answers => {
      for (let answer = 0; answer < answers.concertInquirer.length; answer++) {
        for (let option = 0; option < concertOptions.length; option++) {
          //console.log(concertObject.venueName);
          if (
            concertOptions[option].venueName ===
              answers.concertInquirer[answer].split(",")[0] &&
            concertOptions[option].eventDate ===
              answers.concertInquirer[answer].split(",")[1]
          ) {
            Object.keys(concertOptions[option]).forEach(key => {
              console.log(key + ": " + concertOptions[option][key]);
              exportOutput(key + ": " + concertOptions[option][key] + "\r\n");
            });
          }
        }
      }
      //console.log(answers);
    });
}
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
      for (let event = 0; event < 4; event++) {
        concertObject = {
          venueName: response.data.events[event].venue.name,
          venueLocation: response.data.events[event].venue.extended_address,
          eventDate: moment(response.data.events[event].datetime_local).format(
            "MM/DD/YYYY"
          )
        };
        concertOptions.push(concertObject);

        // Object.keys(concertObject).forEach(key => {
        //   console.log(key + ": " + concertObject[key]);
        //   exportOutput(key + ": " + concertObject[key] + "\r\n");
        // });
        //console.log(concertObject);
        //exportOutput(JSON.stringify(concertObject));
      }
      console.log(concertOptions);
      concertSelect();
      //console.log(concertOptions);
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
    Object.keys(movieObject).forEach(key => {
      console.log(key + ": " + movieObject[key]);
      exportOutput(key + ": " + movieObject[key] + "\r\n");
    });
    //console.log(movieObject);
    //exportOutput(JSON.stringify(movieObject));
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

const [, , type, nameInput] = process.argv;
// const type = args.split(",")[0];
// const nameInput = args.split(",")[1];

function makeRequest() {
  exportOutput("-----------------------------------" + "\r\n");
  exportOutput(`${type} ${nameInput} \r\n`);
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
