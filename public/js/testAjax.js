function rateMovie(guestID, movieID, rating) {
    var key = "bf12ff7db24e0ff1faa7910b7b295c8b";

    var data = JSON.stringify({
      "value": rating
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "https://api.themoviedb.org/3/movie/" + movieID + "/rating?guest_session_id=" + guestID + "&api_key=" + key);
    xhr.setRequestHeader("content-type", "application/json;charset=utf-8");

    xhr.send(data);
}

module.exports = {rateMovie : rateMovie()};