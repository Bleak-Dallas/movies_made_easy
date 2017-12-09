/*******************************
 * Author: Dallas Bleak
 * Created for MOVIES MADE EASY
********************************/

/*************************************************************
* Modules
*************************************************************/
var request = require("request");
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var router= express.Router();

/*************************************************************
* Get Instances
*************************************************************/
var app = express();

/*************************************************************
* Set Server, EJS, body-parser
*************************************************************/
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'cJKM8cTG2YZ8VGfRyV7f',
  resave: false,
  saveUninitialized: false,
  store: new FileStore()
  })
);
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

/*************************************************************
 * Routes
*************************************************************/
var search = require('./public/routes/search');
var top20 = require('./public/routes/top20');
var findMovie = require('./public/routes/findMovieByID');
app.get('/search', search);
app.get('/top20', top20);
app.get('/findMovie', findMovie);

/*************************************************************
 * Home Page
*************************************************************/
var guestID;
app.get('/', function(req, resp) {
  if (req.session.guestID === undefined) {
  var options = { method: 'GET',
    url: 'https://api.themoviedb.org/3/authentication/guest_session/new',
    qs: { api_key: 'bf12ff7db24e0ff1faa7910b7b295c8b' },
    body: '{}' };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var parse = JSON.parse(body);
      guestID = parse.guest_session_id;
      req.session.guestID = guestID;
      if(req.session.guestID !== "") {
        console.log("**** (SESSION-1): " + req.session.guestID + " ****");
      }
    });
  }
  resp.sendFile(__dirname + '/public/form.html');
});

/*************************************************************
 * Post user rating
*************************************************************/
app.post('/userRating', function(req, resp) {
  var movieID = req.body.movie_id;
  var rating = req.body.rating;
  var statusMessage;
  console.log("**** (GUEST ID): " + guestID + " ****");
  console.log("**** FORM VALUE RATING: " + req.body.rating + " ****");
  console.log("**** FORM VALUE MOVIE ID: " + req.body.movie_id + " ****");
  

  var options = { method: 'POST',
  url: 'https://api.themoviedb.org/3/movie/' + movieID + '/rating',
  qs: 
   {  guest_session_id: guestID,
      api_key: 'bf12ff7db24e0ff1faa7910b7b295c8b' },
      headers: { 'content-type': 'application/json;charset=utf-8' },
      body: { value: rating },
      json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    statusMessage = body.status_message;
     console.log("**** USER RATING RESPONSE: " + statusMessage + " ****");
    resp.json({status_message: statusMessage});
    resp.end();
  });
  
});

/*************************************************************
 * Start the server
*************************************************************/
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
