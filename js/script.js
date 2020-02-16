//  on refresh of page need to have last query already showing
var city;

$(document).ready(function() {
    var cityArray = [];
    // on click of search button start data population functions
    $(".search-button").on("click", function(event) {
        event.preventDefault();

        // user input
        var city = $(".search-bar")
            .val()
            .trim();

        function getWeather() {
            // current city weather url
            var queryURL =
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

            // current city weather AJAX call
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                // clear previous search data
                console.log(response);
                $("p").remove();
                $("img").remove();

                // variables from first call storing data for later use
                var now = moment().format("MMMM Do, YYYY");
                var lat = response.coord.lat;
                var lon = response.coord.lon;
                console.log("lat" + lat);
                console.log("lon" + lon);

                var cityID = response.id;

                // populate requested current weather parameters
                var cityName = $("<p>");
                cityName.text("Location: " + response.name);
                $(".current-weather").append(cityName);

                var date = $("<p>");
                date.text("Date: " + now);
                $(".current-weather").append(date);

                var icon = $("<img>");
                icon.attr(
                    "src",
                    "http://openweathermap.org/img/w/" +
                        response.weather[0].icon +
                        ".png"
                );
                $(".current-weather").append(icon);

                var temp = $("<p>");
                temp.text("Temperature: " + response.main.temp + " \u00B0F");
                $(".current-weather").append(temp);

                var humidity = $("<p>");
                humidity.text("Humidity: " + response.main.humidity + "%");
                $(".current-weather").append(humidity);

                var wind = $("<p>");
                wind.text("Wind: " + response.wind.speed);
                $(".current-weather").append(wind);

                var uvURL =
                    "http://api.openweathermap.org/data/2.5/uvi?appid=73dd4f9c95552ba9b2a9aa8643789ace&lat=" +
                    lat +
                    "&lon=" +
                    lon;

                // current city UV AJAX call
                $.ajax({
                    url: uvURL,
                    method: "GET"
                }).then(function(urlData) {
                    // populate requested current UV parameters
                    var uv = $("<p>");
                    uv.text("UV Index: " + urlData.value);
                    $(".current-weather").append(uv);

                    // consider changing to buttons????
                    // UV index color coding
                    if (urlData.value < 3) {
                        $(".uv").css("background-color", "green");
                    } else if (urlData.value > 2 && urlData.value < 6) {
                        $(".uv").css("background-color", "yellow");
                    } else if (urlData.value > 5 && urlData.value < 8) {
                        $(".uv").css("background-color", "orange");
                    } else if (urlData.value > 7 && urlData.value < 11) {
                        $(".uv").css("background-color", "red");
                    } else if (urlData.value >= 11) {
                        $(".uv").css("background-color", "purple");
                    }
                });

                // 5 day forcast URL
                var dailyURL =
                    "https://api.openweathermap.org/data/2.5/forecast?id=" +
                    cityID +
                    "&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

                // five day forcast AJAX call
                $.ajax({
                    url: dailyURL,
                    method: "GET"
                }).then(function(dailyData) {
                    for (let i = 0; i < dailyData.list.length; i++) {
                        if (
                            dailyData.list[i].dt_txt.indexOf("15:00:00") !== -1
                        ) {
                            // populate requested future weather parameters
                            var fDate = $("<p>");
                            fDate.text("Date: " + dailyData.list[i].dt_txt);
                            $(".future-weather").append(fDate);

                            var fIcon = $("<img>");
                            fIcon.attr(
                                "src",
                                "http://openweathermap.org/img/w/" +
                                    dailyData.list[i].weather[0].icon +
                                    ".png"
                            );
                            $(".future-weather").append(fIcon);

                            var fTemp = $("<p>");
                            fTemp.text(
                                "Temperature: " +
                                    dailyData.list[i].main.temp_max +
                                    " \u00B0F"
                            );
                            $(".future-weather").append(fTemp);

                            var fHumidity = $("<p>");
                            fHumidity.text(
                                "Humidity: " +
                                    dailyData.list[i].main.humidity +
                                    "%"
                            );
                            $(".future-weather").append(fHumidity);
                        }
                    }
                });
            });

            addToArray();
            storeArray();
            favoritesBtns();

            // prevents duplicate cities from being added to favorites
            function addToArray() {
                if (cityArray.includes(city) === false) {
                    console.log(city);
                    cityArray.push(city);
                }
            }
        }
        getWeather();
    });

    // adds favorites buttons
    function favoritesBtns() {
        $(".favorites").empty();
        for (let i = 0; i < cityArray.length; i++) {
            var button = $("<button>");
            button
                .addClass("city-btn")
                .attr("data-name", cityArray[i])
                .text(cityArray[i]);
            $(".favorites").prepend(button);
        }
    }

    // local storage functions to store searched cities
    function storeArray() {
        localStorage.setItem("cityArray", JSON.stringify(cityArray));
    }

    function getArray() {
        var browserArray = JSON.parse(localStorage.getItem("cityArray"));
        if (browserArray !== null) {
            cityArray = browserArray;
        }
    }
    getArray();
});
