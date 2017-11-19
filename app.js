/*******************************
* Author: Dallas Bleak
* Created: 11/07/2017
********************************/

/*************************************************************
* Modules
*************************************************************/
var express = require('express');
var bodyParser = require('body-parser');
const MovieDB = require('moviedb')('bf12ff7db24e0ff1faa7910b7b295c8b');
var movieSearchResults = null;
var top20Results = null;

/*************************************************************
* Get Instances
*************************************************************/
var app = express();
var mdb = MovieDB;

/*************************************************************
* Set Server, EJS, body-parser
*************************************************************/
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*************************************************************
* Set default page
*************************************************************/
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/form.html');
});

/*************************************************************
* GET THE TOP 20 MOVIES
*************************************************************/
app.post('/getTop20', function(request, response) {
   var searchMovie   = request.body.searchMovie;

   console.log('******START SEARCH******');


  mdb.discoverMovie({ sort_by : 'popularity.desc' }, (err, res) => {
    top20Results = res.results;

  for (var i = 0; i < top20Results.length; i++) { 
    console.log('TITLE: ' + top20Results[i].title);
  }
  console.log('******END SEARCH******');
  response.render("pages/top20", {top20Results:top20Results});
  response.send();
  });
});

/*************************************************************
* SEARCH FOR AND RETURN MOVIES
*************************************************************/
app.post('/getMovies', function(request, response) {
   var searchMovie   = request.body.searchMovie;
    if (searchMovie) {

   console.log('******START SEARCH******');
   console.log('SEARCH QUERY: ' + searchMovie);


  mdb.searchMovie({ query: searchMovie }, (error, res) => {
    movieSearchResults = res.results;

  for (var i = 0; i < movieSearchResults.length; i++) { 
    console.log('TITLE: ' + movieSearchResults[i].title);
  }
  console.log('******END SEARCH******');
  response.render("pages/movieSearch", {movieSearchResults:movieSearchResults});
  response.send();
  });
  } else {
    console.log("SEARCH NOT DEFINED");
  }
});

/*************************************************************
* FOR TESTING: test search the movie Alien
*************************************************************/
/*mdb
.movieInfo({ id: 278 }, (err, res) => {
    console.log(res);
  })

.discoverMovie({ sort_by : 'popularity.desc' }, (err, res) => {
    console.log(res);
  });*/

/*************************************************************
* Start the server
*************************************************************/
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});