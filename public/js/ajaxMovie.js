'use strict';
var ERROR = {"message": "The request failed!"};


$(function() {

  // get the values from form.html.
  var searchButton = $('#cart_btn'),
      searchText = $('#searchMovie'),
      output = $('#movieResults'),
      errorOutput = $('#error');

  // Listen for the click of the mathButton in form.html
  searchButton.on('click', function(e) {

    // prevent the form from submitting.
    e.preventDefault();

    // send the information to /math_service within index.js.
    var target = '/getMovies?searchText=' + searchText.val();

    // Perform an AJAX request using the get() method.
    // If the request was successful, append the response.
    // If not, append an error.
    $.get(target, function(response) {
      output.append('<tr>' +
                      '<th>Title</th>' +
                      '<th>Logo</th>' + 
                      '<th>ID</th>' + 
                      '<th>Release Date</th>' + 
                      '<th>Overview</th>' + 
                    '</tr>');
    }).fail(function() {
      errorOutput.append('<div>' + JSON.stringify(ERROR) + '</div>');
    });
  });
});