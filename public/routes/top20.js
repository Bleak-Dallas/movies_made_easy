var request = require("request");
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

/*************************************************************
* Post user rating
*************************************************************/
router.get('/top20', function(req, resp) {
  console.log("**** /top20 CALLED ****");

  var options = { method: 'GET',
    url: 'https://api.themoviedb.org/3/discover/movie',
    qs: 
   { page: '1',
     include_video: 'false',
     include_adult: 'false',
     sort_by: 'popularity.desc',
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