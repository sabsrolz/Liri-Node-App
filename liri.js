//read and set environmental variables with the dotenv package
require("dotenv").config();

//import Spotify keys from keys.js file
let keys = require("./keys.js");
//import fs module to read text from external text files
const fs = require("fs");
//import moment module to format concert dates
const moment = require("moment");
//import inquirer to prompt user input for concert request
const inquirer = require("inquirer");
//import axios for API get calls
const axios = require("axios");
let concertOptions = [];
let concertObject = {};

//exportOutput will be called to write API output to external output.txt file
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
  //import Spotify node package
  const Spotify = require("node-spotify-api");

  //initialize key information by importing spotify object from keys JS file
  let spotify = new Spotify(keys.spotify);
  //use search method to pull data for inputted song name (only the first song is returned in this case)
  spotify.search({ type: "track", query: track, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("error occured: " + err);
    }
    const trackOutput = JSON.parse(JSON.stringify(data.tracks.items[0]));

    //for testing: console.log(JSON.stringify(data.tracks.items[0], null, 7));
    //initialize song object that stores items that will be displayed to user
    const songObject = {
      artist: trackOutput.artists[0].name,
      songName: trackOutput.name,
      previewLink: trackOutput.preview_url,
      album: trackOutput.album.name
    };
    //loop through object to format output display
    Object.keys(songObject).forEach(key => {
      //display output to console
      console.log(`${key}: ${songObject[key]}`);
      //export output to text file
      exportOutput(`${key}: ${songObject[key]} \r\n`);
    });
  });
}
//function that allows user to select what concert to ouput data for
function concertSelect() {
  //array that will store a venue name/event date combination for first 4 events outputted by API
  const venueOptions = [];
  concertOptions.forEach(concert =>
    venueOptions.push(`${concert.venueName},${concert.eventDate}`)
  );
  //method that will output concert options to user in command line as a checkbox list
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
      //iterate through user answers to display data based on their selection
      for (let answer = 0; answer < answers.concertInquirer.length; answer++) {
        for (let option = 0; option < concertOptions.length; option++) {
          if (
            concertOptions[option].venueName ===
              answers.concertInquirer[answer].split(",")[0] &&
            concertOptions[option].eventDate ===
              answers.concertInquirer[answer].split(",")[1]
          ) {
            //loop through object to format output display
            Object.keys(concertOptions[option]).forEach(key => {
              //display output to console
              console.log(`${key}: ${concertOptions[option][key]}`);
              //export output to text file
              exportOutput(`${key}: ${concertOptions[option][key]} \r\n`);
            });
          }
        }
      }
      //console.log(answers);
    });
}
//seatGeek platform API output
function concertRequest(artist) {
  artist = artist.replace(" ", "-");
  //use get axios method to call seatGeek API for requested artist
  axios
    .get(
      `https://api.seatgeek.com/2/events?performers.slug=${artist}&client_id=Nzk1NDk5M3wxNTY5OTUzMjQ2Ljkz`
    )
    .then(function(response) {
      //iterate through first 4 concert events and create object for each
      for (let event = 0; event < 5; event++) {
        concertObject = {
          venueName: response.data.events[event].venue.name,
          venueLocation: response.data.events[event].venue.extended_address,
          eventDate: moment(response.data.events[event].datetime_local).format(
            "MM/DD/YYYY"
          )
        };
        //push each object to array of options that will be displayed to user
        concertOptions.push(concertObject);
      }
      //call function that will allow the user to select which events to see data for
      concertSelect();
    });
}

//OMDb API output
function movieRequest(movie) {
  const movieQuery = `http://www.omdbapi.com/?t=${movie}&apikey=trilogy`;
  //use get axios method to call OMDb API for requested artist
  axios.get(movieQuery).then(function(response) {
    //initialize movie object that stores items that will be displayed to user
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
    //loop through object to format output display
    Object.keys(movieObject).forEach(key => {
      //display output to console
      console.log(`${key}: ${movieObject[key]}`);
      //export output to text file
      exportOutput(`${key}: ${movieObject[key]} \r\n`);
    });
  });
}

//function that will take input from external random.text file - file will contain a movie, song, or concert request
function readInput() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    //declare variables for each part of request
    const inputType = data.split(",")[0];
    const inputName = data.split(",")[1];
    //condition that will call request function based on input
    if (inputType === "movie-this") {
      movieRequest(inputName);
    } else if (inputType === "concert-this") {
      concertRequest(inputName);
    } else if (inputType === "spotify-this-song") {
      songRequest(inputName);
    }
  });
}
//initialize variables for arguments inputted by user in command line
const [, , type, nameInput] = process.argv;

//function that will call request function depending on process.argv values
function makeRequest() {
  //separator used to indicate new request in output text file
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

//app runs when calling makeRequest function
makeRequest();
