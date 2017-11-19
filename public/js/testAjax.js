$(function () {
	// get the values from form.html.
  	var searchButton = $('#cart_btn'),
        searchText = $('#searchMovie'),
        output = $('#movieResults'),
        errorOutput = $('#error');

	$.ajax({
		type: 'GET',
		url: '/getMovies',
		success: function(data) {
			
		}
	});

});