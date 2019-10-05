console.log("this is loaded");

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.seatGeek = {
  client_id: process.env.seatGEEK_API
};

exports.OMDb = {
  apikey: process.env.OMDb_API
};
