//read and set environmental variables with the dotenv package
require("dotenv").config();
//import Spotify keys from keys.js file
let keys = require("./keys.js");
//initialize key information
let spotify = new spotify(keys.spotify);
