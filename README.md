# Liri-Node-App

1. Clearly state the problem the app is trying to solve (i.e. what is it doing and why)
   Liri is an application that outputs data for a requested movie, song, or concert. The app interacts with the user through NodeJS console and takes input in the form of command line arguments. Based on the input, the app will run different API calls to return the requested data to the user via an external text file. Users are able to input numerous requests that will be appended to the output file.
2. Give a high-level overview of how the app is organized
   Liri will take a request from the user (song, movie, concert) and output information regarding that request. Input is taking via command line and will be initialized as arguments in their respective functions. These functions will request data from server using get API method and will return a JSON object. Object will then be parsed and displayed to the user via console and external text file.
3. Give start-to-finish instructions on how to run the app
   Input a request in the command line (request type will be followed by a string). The options are the following:
   -this-movie "movie name":
   Output will contain title, year, rating, country, language, plot and actors in movie.
   -this-concert "performer's name"
   User will have the option of selecting which venue name(s) they want to see data for. Outputted data includes venue name of concert, venue location and date of concert. Output will show top 4 events.
   -spotify-this-song "song's name"
   Output will contain song's artist, name, preview link of song from Spotify and album that the song is from.
   -do-what-it-says
   This command will read input from external text file ("random.txt"). This file can contain any concert, movie or spotify-song command.
   User will see all requests/responses appended to log.txt file. If an error occurs when calling one of these functions then the log file will contain a record of the related issue.
4. Include screenshots, gifs or videos of the app functioning
5. Contain a link to a deployed version of the app
6. Clearly list the technologies used in the app
   -Node JS built is used for back-end API services.
   -NPM (node package manager) is used to install the following modules used throughout the program:
   -dotenv: used to load environment variables from env. file into process.env (for API credentials)
   -fs: used to read/write data from external text files
   -moment: used to format date variables
   -inquirer: used to prompt input from the user via console
   -node-spotify-api: Spotify node package that allows users to request song data via search API method.
   -axios: module that allows users to run API calls via a get method. Function returns a response with an output object.
7. State your role in the app development
