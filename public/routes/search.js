var request = require("request");
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

/*************************************************************
* Post user rating
*************************************************************/
router.get('/search', function(req, resp) {
  var searchMovie = req.query.query;
  console.log("**** /search CALLED ****");
  console.log("**** QUERY: " + searchMovie + " ****");

  var options = { method: 'GET',
    url: 'https://api.themoviedb.org/3/search/movie',
    qs: 
     { include_adult: 'false',
       page: '1',
       query: searchMovie,
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