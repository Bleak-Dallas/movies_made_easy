var request = require("request");
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

/*************************************************************
* Post user rating
*************************************************************/
router.get('/findMovie', function(req, resp) {
  var movieID = req.query.movie_id;
  console.log("**** /findMovie CALLED ****");
  console.log("**** MOVIE ID: " + movieID + " ****");

  var options = { method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/' + movieID,
  qs: 
   { append_to_response: 'videos,release_dates',
     language: 'en-US',
     api_key: 'bf12ff7db24e0ff1faa7910b7b295c8b' },
  body: '{}' };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //console.log(body);
    resp.send(body);
    resp.end();
    });
});

module.exports = router;