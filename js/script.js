$(document).ready(function() {
    var cityArray = [];
    var futureArray = [];

    // populate Phoenix weather on page load
    function loadPage() {
        var queryURL =
            "https://api.openweathermap.org/data/2.5/weather?q=phoenix&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

        // page load AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(getWeather);
    }

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
        cityName
            .text(response.name)
            .css({ "font-weight": "bolder", "font-size": "x-large" });
        $(".current-weather").append(cityName);

        var date = $("<p>");
        date.text(now).css("font-size", "large");
        $(".current-weather").append(date);

        var icon = $("<img>");
        icon.attr(
            "src",
            "https://openweathermap.org/img/w/" +
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
            "https://api.openweathermap.org/data/2.5/uvi?appid=73dd4f9c95552ba9b2a9aa8643789ace&lat=" +
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
            uv.addClass("uv").text("UV Index: ");
            $(".current-weather").append(uv);

            var button = $("<button>");
            button.addClass("uvBtn").text(urlData.value);
            $(".uv").append(button);

            // consider changing to buttons????
            // UV index color coding
            if (urlData.value < 3) {
                $(".uvBtn").css("background-color", "green");
            } else if (urlData.value > 2 && urlData.value < 6) {
                $(".uvBtn").css("background-color", "yellow");
            } else if (urlData.value > 5 && urlData.value < 8) {
                $(".uvBtn").css("background-color", "orange");
            } else if (urlData.value > 7 && urlData.value < 11) {
                $(".uvBtn").css("background-color", "red");
            } else if (urlData.value >= 11) {
                $(".uvBtn").css("background-color", "purple");
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

                    futureArray.push(dailyData.list[i].dt_txt);
                    futureArray.push(dailyData.list[i].weather[0].icon);
                    futureArray.push(dailyData.list[i].main.temp_max);
                    futureArray.push(dailyData.list[i].main.humidity);
                }
            }
            console.log(futureArray);

            var fDate = $("<p>");
            fDate.text("Date: " + futureArray[0]);
            $("#day-one").append(fDate);

            var fIcon = $("<img>");
            fIcon.attr(
                "src",
                "http://openweathermap.org/img/w/" + futureArray[1] + ".png"
            );
            $("#day-one").append(fIcon);

            var fTemp = $("<p>");
            fTemp.text("Temperature: " + futureArray[2] + " \u00B0F");
            $("#day-one").append(fTemp);

            var fHumidity = $("<p>");
            fHumidity.text("Humidity: " + futureArray[3] + "%");
            $("#day-one").append(fHumidity);

            var fDate = $("<p>");
            fDate.text("Date: " + futureArray[4]);
            $("#day-two").append(fDate);

            var fIcon = $("<img>");
            fIcon.attr(
                "src",
                "http://openweathermap.org/img/w/" + futureArray[5] + ".png"
            );
            $("#day-two").append(fIcon);

            var fTemp = $("<p>");
            fTemp.text("Temperature: " + futureArray[6] + " \u00B0F");
            $("#day-two").append(fTemp);

            var fHumidity = $("<p>");
            fHumidity.text("Humidity: " + futureArray[7] + "%");
            $("#day-two").append(fHumidity);

            var fDate = $("<p>");
            fDate.text("Date: " + futureArray[8]);
            $("#day-three").append(fDate);

            var fIcon = $("<img>");
            fIcon.attr(
                "src",
                "http://openweathermap.org/img/w/" + futureArray[9] + ".png"
            );
            $("#day-three").append(fIcon);

            var fTemp = $("<p>");
            fTemp.text("Temperature: " + futureArray[10] + " \u00B0F");
            $("#day-three").append(fTemp);

            var fHumidity = $("<p>");
            fHumidity.text("Humidity: " + futureArray[11] + "%");
            $("#day-three").append(fHumidity);

            var fDate = $("<p>");
            fDate.text("Date: " + futureArray[12]);
            $("#day-four").append(fDate);

            var fIcon = $("<img>");
            fIcon.attr(
                "src",
                "http://openweathermap.org/img/w/" + futureArray[13] + ".png"
            );
            $("#day-four").append(fIcon);

            var fTemp = $("<p>");
            fTemp.text("Temperature: " + futureArray[14] + " \u00B0F");
            $("#day-four").append(fTemp);

            var fHumidity = $("<p>");
            fHumidity.text("Humidity: " + futureArray[15] + "%");
            $("#day-four").append(fHumidity);

            var fDate = $("<p>");
            fDate.text("Date: " + futureArray[16]);
            $("#day-five").append(fDate);

            var fIcon = $("<img>");
            fIcon.attr(
                "src",
                "http://openweathermap.org/img/w/" + futureArray[17] + ".png"
            );
            $("#day-five").append(fIcon);

            var fTemp = $("<p>");
            fTemp.text("Temperature: " + futureArray[18] + " \u00B0F");
            $("#day-five").append(fTemp);

            var fHumidity = $("<p>");
            fHumidity.text("Humidity: " + futureArray[19] + "%");
            $("#day-five").append(fHumidity);
        });

        storeArray();
        favoritesBtns();
    }

    // adds favorites buttons
    function favoritesBtns() {
        $(".favorites").empty();
        if (cityArray.length !== 0) {
            var clearBtn = $("<button>");
            clearBtn
                .addClass("clear-btn btn btn-outline-light my-2 my-sm-0")
                .text("Clear");
            $(".favorites").append(clearBtn);
        }
        for (let i = 0; i < cityArray.length; i++) {
            var button = $("<button>");
            button
                .addClass("city-btn btn btn-outline-light my-2 my-sm-0")
                .attr("data-name", cityArray[i])
                .text(cityArray[i]);
            $(".favorites").append(button);
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

    function resetFavs() {
        cityArray = [];
        $(".favorites").empty();
        storeArray();
        getArray();
        if (cityArray.length !== 0) {
            var clearBtn = $("<button>");
            clearBtn
                .addClass("clear-btn btn btn-outline-light my-2 my-sm-0")
                .text("Clear");
            $(".favorites").append(clearBtn);
        }
    }

    $(document).on("click", ".clear-btn", resetFavs);

    loadPage();
    getArray();
    favoritesBtns();
});
