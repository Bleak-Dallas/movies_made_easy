/***************************************************************
 * Author: Dallas Bleak
 * Created for MOVIES MADE EASY
***************************************************************/

$(function() {
    var userInput =  $('#searchMovie');
    var searchButton =  $('#search'); 
    var top20Button = $('#top20');
    var rateButton = $('#rateButton');
    var movieRateButton = $('.rateMovie');
    var key = "bf12ff7db24e0ff1faa7910b7b295c8b";


    /***************************************************************
     * SEARCH FUNCTION
     * This function seaches for and returns the movie
     ***************************************************************/
    searchButton.on('click', function(e) {

    // prevent the form from submitting.
    e.preventDefault();

    //jquery ajax get request using apikey and user's input as parameters
    $.ajax({
      url : "https://api.themoviedb.org/3/search/movie",
      type : "GET",  // for post change this to POST
      data : {api_key : key, page : "1", language : "en-US", query : userInput.val()},
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


  /***************************************************************
   * TOP 20 FUNCTION
   * This function gets the top 20 rated movies
  ***************************************************************/
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

   /***************************************************************
     * RATE FUNCTION
     * This function posts the user rating for a particular movie
    ***************************************************************/
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
        console.log("****RESPONSE == " + response.status_message + "****");
        var originalMessage = response.status_message;
        var message = originalMessage.replace(".", "!");
        var rating = $(".rating");
        rating.append( '<br><p class="closePara">' + message + '</p>');
      },
      error : function (http, status, error) {
        alert("some error occured: " + error);
      }
    });

  });

});

/***************************************************************
 * DISPLAY SEARCH RESULTS
 * This function displays the users chosen search in a table
***************************************************************/
function displaySearchResults(response) {

  var poster_url = "https://image.tmdb.org/t/p/w300";

    $('#movieResults').empty();  //needed to clear dom element before adding new results
    $(".poster").empty();
    $(".title").empty();
    $(".mpaa").empty();
    $(".userScore").empty();
    $(".rate").empty();
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

/***************************************************************
 * FIND MOVIE BY ID
 * This function gets one specific movie by the movie ID
***************************************************************/
function findMovieByID(value) {
    var key = "bf12ff7db24e0ff1faa7910b7b295c8b";

    $.ajax({
      url : "https://api.themoviedb.org/3/movie/"+value,
      type : "GET",  // for post change this to POST
      data : {api_key : key, 
              language : "en-US", 
              append_to_response: "videos,release_dates"
             },
      dataType : "json",
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

/***************************************************************
 * DISPLAY MOVIE DETAILS
 * This function displays the movie details to the user
***************************************************************/
function displayMovieDetails(response) {

    $('#movieResults').empty();
    $(".poster").empty();
    $(".title").empty();
    $(".mpaa").empty();
    $(".userScore").empty();
    $(".rate").empty();
    $(".trailer").empty();
    $(".overview").empty();
    $(".cast").empty();
    $(".wrapper").show();


    var movieid = response.id;
      console.log("MOVIE ID: " + movieid);
    var poster_url = "https://image.tmdb.org/t/p/w500";
    var releaseDate = new Date(response.release_date);
    var year = releaseDate.getFullYear();
    var userRating = response.vote_average * 10;
    var videoResults = response.videos.results;
    var movieTrailer = videoResults[0].key;
      console.log("MOVIE KEY 1: " + movieTrailer);
    var poster = $(".poster");
    var title = $(".title");
    var mpaa = $(".mpaa");
    var userScore = $(".userScore");
    var trailer = $(".trailer");
    var overview = $(".overview");
    var rate = $(".rate");
    var rating = $(".rating");
    var mpaaResults = response.release_dates.results;
    var mpaaRating;

    $.each(mpaaResults,function(i,item){
       $.each(item.release_dates, function(i, item) {
        console.log(item.certification);
        if (item.certification === "G" || item.certification === "PG" || item.certification === "PG-13" || 
            item.certification === "R" || item.certification === "NC-17" || item.certification === "NR") {
            console.log("======" + item.certification);
            mpaaRating = item.certification;
        } 
      });
    });
    console.log("**** MPAA RATING: " + mpaa + "****");

    poster.append( "<img src='" +  poster_url + response.poster_path + "'>" );
    title.append( "<h1>" + response.original_title + "</h1>" + "  <h3>(" + year + ")</h3>");
    mpaa.append(getMpaaPic(mpaaRating));
    userScore.append('<h2>' + userRating + '%</h2>&nbsp<h4>User Rating</h4>');
    rate.append('<h4><a href="#ex1" class="rateMovie" rel="modal:open" onclick="formReset()">Rate Movie</a></h4>');
    rating.append( '<input type="hidden" id="movie_id" name="movie_id" value="" />');
    $("#movie_id").attr("value", movieid);
    trailer.append('<span><a href="#"><i style="font-size:24px" class="fa">&#xf04b;</i>&nbspPlay Trailer</a></span>').click(
    function() {
      $(".overlay-content").empty();
      openNav(movieTrailer);
    });
    overview.append( "<h2>Overview</h2>" + response.overview );

}

/***************************************************************
 * GET MPAA PIC
 * This function dgets the MPAAA rating picture and gets it
 * ready for display to the user
***************************************************************/
function getMpaaPic(mpaaRating) {
    switch (mpaaRating) {
      case "G":
          return '<img src="/images/G.png" alt="G" width="auto" height="50">';
      case "PG":
          return '<img src="/images/PG.png" alt="PG" width="auto" height="50">';
      case "PG-13":
          return '<img src="/images/PG13.png" alt="PG-13" width="auto" height="50">';
      case "R":
          return '<img src="/images/R.png" alt="R" width="auto" height="50">';
      case "NC-17":
          return '<img src="/images/NC17.png" alt="NC-17" width="auto" height="50">';
      case "NR":
          return '<img src="/images/NR.png" alt="NR" width="auto" height="50">';
    default:
          return "This movie has not been rated";
}
}

/***************************************************************
 * OPEN NAV
 * This function pulls the slider to display the movie trailer
***************************************************************/
function openNav(movieTrailer) {
    $("#myNav").css("width", "100%");
    console.log("OPENNAV: " + movieTrailer);
    $(".overlay-content").append('<iframe id="video" src="https://www.youtube.com/embed/' + movieTrailer + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    
    $(function(){
      $('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
  });


}

/***************************************************************
 * CLOSE NAV
 * This function closes the movie trailer slider
***************************************************************/
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    $(".overlay-content").empty();
}

function formReset() {
  console.log("**==** Rate Movie Clicked **==**");
  $("#userForm").trigger("reset");
  $("p.closePara").remove();
}