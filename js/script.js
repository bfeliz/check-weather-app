//  on refresh of page need to have last query already showing

$(document).ready(function() {
    var cityArray = [];

    // build search button URL
    function buildSearchURL() {
        // beginning of main query URL
        var cityQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

        // additional query parameters
        var city = $(".search-bar")
            .val()
            .trim();

        var finalCityURL =
            "&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

        // prevents duplicate cities from being added to favorites, otherwise pushes city to array for button creation
        if (cityArray.includes(city) === false) {
            cityArray.push(city);
        }
        // adds main query URL components together
        console.log(cityQueryURL + city + finalCityURL);
        return cityQueryURL + city + finalCityURL;
    }

    // build favorite buttons URL
    function buildBtnURL() {
        // beginning of button query URL
        var btnQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

        // additional query parameters
        var btnCity = $(this).attr("data-name");

        var finalBtnURL =
            "&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

        // adds button click URL components together
        function finalReturn() {
            return btnQueryURL + btnCity + finalBtnURL;
        }

        // save button click URL in variable
        var queryURL = finalReturn();
        console.log(queryURL);

        // AJAX call for buttons
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(getWeather);
    }

    // on click of search button start data population functions
    $(".search-button").on("click", function(event) {
        event.preventDefault();

        var queryURL = buildSearchURL();

        // AJAX call for search button
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(getWeather);
    });

    // on click of buttons start data population fuctions
    $(document).on("click", ".city-btn", buildBtnURL);

    function getWeather(response) {
        // clear previous search data
        $("p").remove();
        $("img").remove();

        // variables from first call storing data for later use
        var now = moment().format("MMMM Do, YYYY");
        var lat = response.coord.lat;
        var lon = response.coord.lon;

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
            uv.addClass("uv").text("UV Index: " + urlData.value);
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
                if (dailyData.list[i].dt_txt.indexOf("15:00:00") !== -1) {
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
                        "Humidity: " + dailyData.list[i].main.humidity + "%"
                    );
                    $(".future-weather").append(fHumidity);
                }
            }
        });
        // });

        storeArray();
        favoritesBtns();
    }

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
