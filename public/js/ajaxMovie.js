$(function() {
    var userInput =  $('#searchMovie');
    var searchButton =  $('#search'); 
    var top20Button = $('#top20');
    var rateButton = $('#rateButton');
    var movieRateButton = $('#rateMovie');
    var key = "bf12ff7db24e0ff1faa7910b7b295c8b";


    searchButton.on('click', function(e) {

    // prevent the form from submitting.
    e.preventDefault();

    //jquery ajax get request using apikey and user's input as parameters
    $.ajax({
      url : "https://api.themoviedb.org/3/search/movie",
      type : "GET",  // for post change this to POST
      data : {api_key : key, page : "1", language : "en-US", query : userInput.val()},
      dataType : "json",
      /*beforeSend : function (http) { // this may not be used, but added so you know it exists
        alert ("beforeSend fired");
      },*/
      success : function (response, status, http) {
        console.log("****SUCCESS CALLED****");
        displaySearchResults(response);
      },
      error : function (http, status, error) {
        alert("some error occured: " + error);
      }
    });
  });

   top20Button.on('click', function(e) {

      // prevent the form from submitting.
      e.preventDefault();

      //jquery ajax get request using apikey and user's input as parameters
      $.ajax({
        url : "https://api.themoviedb.org/3/discover/movie",
        type : "GET",  // for post change this to POST
        data : {api_key : key, page : "1", language : "en-US", sort_by : "popularity.desc"},
        dataType : "json",
        success : function (response, status, http) {
          console.log("****SUCCESS CALLED****");
          displaySearchResults(response);
        },
        error : function (http, status, error) {
          alert("some error occured: " + error);
        }
      });
    });


   rateButton.on('click', function(e) {

    console.log("====rateMovie===== CALLED");
    // prevent the form from submitting.
      e.preventDefault();

    var key = "bf12ff7db24e0ff1faa7910b7b295c8b";
    var rating =  $("input[name='rating']:checked").val();
    var movieID =  $('#movie_id').val(); 

    $.ajax({
      url : "/userRating",
      type : "POST",  // for post change this to POST
      data : {movie_id : movieID,
              rating : rating
             },
      dataType : "json",
      success : function (response, status, http) {
        console.log("****getGuestSession SUCCESS CALLED****");
        console.log("****STATUS == " + status + "****");
        console.log("****RESPONSE == " + response.status_message + "****");
        var rating = $(".rating");
        rating.append( '<p class="closePara">' + response.status_message + '</p>');
      },
      error : function (http, status, error) {
        alert("some error occured: " + error);
      }
    });

  });

   $('#rateMovie').click(function(){
      $("#userForm").trigger("reset");
      $("p.closePara").remove();
});

});


function displaySearchResults(response) {

  var poster_url = "https://image.tmdb.org/t/p/w300";

    $('#movieResults').empty();  //needed to clear dom element before adding new results
    $(".poster").empty();
    $(".title").empty();
    $(".userScore").empty();
    $(".trailer").empty();
    $(".overview").empty();
    $(".cast").empty();
    var movieList= $("<table>" +
                      "<tr>" +
                      "<th>Image</th>" +
                      "<th>Title</th>" +
                      "<th>Release Date</th>" +
                      "<th>&nbsp</th>" +
                      "</tr>" +
                    "</table>");  //create table element

    //fill table with movie title results (and more) through append method
    for (var i = 0; i < response.results.length; i++) {
      console.log('TITLE: ' + response.results[i].title);

        //create a botton to print data to console about the currently selected movie
        var viewDetailsButton = "<button class='cart_btn' onclick='findMovieByID(this.value)' value='" + 
                            response.results[i].id + "'>View Movie Details</button>";

        movieList.append( "<tr><td>" + "<img src='" +  poster_url + response.results[i].poster_path + "'></td><td>" + 
                            response.results[i].title + "</td><td>" + response.results[i].release_date + "</td><td>" + 
                            viewDetailsButton + "</td></tr>");
    }

    //append entire table to the movies div through dom manipulation
    $('#movieResults').append(movieList);
}

function findMovieByID(value) {
    console.log("Movie ID: " + value);
    var key = "bf12ff7db24e0ff1faa7910b7b295c8b";

    $.ajax({
      url : "https://api.themoviedb.org/3/movie/"+value,
      type : "GET",  // for post change this to POST
      data : {api_key : key, language : "en-US", append_to_response: "videos"},
      dataType : "json",
      /*beforeSend : function (http) { // this may not be used, but added so you know it exists
        alert ("beforeSend fired");
      },*/
      success : function (response, status, http) {
        console.log("****SUCCESS CALLED (Movie ID: " + value + ")****"); 
        console.log(JSON.stringify(response));
        displayMovieDetails(response);
      },
      error : function (http, status, error) {
        alert("some error occured: " + error);
      }
    });
}

function displayMovieDetails(response) {
    $('#movieResults').empty();
    $(".poster").empty();
    $(".title").empty();
    $(".userScore").empty();
    $(".trailer").empty();
    $(".overview").empty();
    $(".cast").empty();
    $(".wrapper").show();


    var movieid = response.id;
    var poster_url = "https://image.tmdb.org/t/p/w500";
    var releaseDate = new Date(response.release_date);
    var year = releaseDate.getFullYear();
    var userRating = response.vote_average * 10;
    var videoResults = response.videos.results;
    var movieTrailer = videoResults[0].key;
    console.log("MOVIE KEY 1: " + movieTrailer);

    for (var i = 0; i < videoResults.length; i++) {
      if (videoResults[i].type.includes("Trailer"))
        console.log('TRAILER NAMES: ' + videoResults[i].name);
        console.log('TRAILER KEY: ' + videoResults[i].key);
    }


    var poster = $(".poster");
    var title = $(".title");
    var userScore = $(".userScore");
    var trailer = $(".trailer");
    var overview = $(".overview");
    var rating = $(".rating");

    movieTrailer = videoResults[0].key;
    poster.append( "<img src='" +  poster_url + response.poster_path + "'>" );
    title.append( "<h1>" + response.original_title + "</h1>" + "  <h3>(" + year + ")</h3>");
    userScore.append('<h2>' + userRating + '%</h2>&nbsp<h4>User Rating</h4>');
    trailer.append('<span><a href="#"><i style="font-size:24px" class="fa">&#xf04b;</i>&nbspPlay Trailer</a></span>').click(
    function() {
      $(".overlay-content").empty();
      openNav(movieTrailer);
    });
    overview.append( "<h2>Overview</h2>" + response.overview );
    rating.append( '<input type="hidden" id="movie_id" name="movie_id" value="" />');
    $("#movie_id").attr("value", movieid);

}

/* Open when someone clicks on the span element */
function openNav(movieTrailer) {
    $("#myNav").css("width", "100%");
    console.log("OPENNAV: " + movieTrailer);
    $(".overlay-content").append('<iframe id="video" src="https://www.youtube.com/embed/' + movieTrailer + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    
    $(function(){
      $('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
  });


}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    $(".overlay-content").empty();
}