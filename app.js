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
var bodyParser = require('body-parser');
var sessionGuestID; // will implement sessions for guest id
var guestID; // for guest session id

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
app.use(session({
  secret: 'cJKM8cTG2YZ8VGfRyV7f',
  resave: false,
  saveUninitialized: false ,
  cookie: { maxAge: 60000 }
  })
);
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

/*************************************************************
* Set default page
*************************************************************/
app.get('/', function(req, resp) {
  resp.sendFile(__dirname + '/public/form.html');
});

/*************************************************************
* Get a guest session "THE MOVIE DATABASE"
*************************************************************/
var options = { method: 'GET',
  url: 'https://api.themoviedb.org/3/authentication/guest_session/new',
  qs: { api_key: 'bf12ff7db24e0ff1faa7910b7b295c8b' },
  body: '{}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var parse = JSON.parse(body);
  guestID = parse.guest_session_id;
});

/*************************************************************
* Post user rating
*************************************************************/
app.post('/userRating', function(req, resp) {
  var movieID = req.body.movie_id;
  var rating = req.body.rating;
  var statusMessage;
  console.log("**** SESSION (GUEST ID): " + guestID + " ****");
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