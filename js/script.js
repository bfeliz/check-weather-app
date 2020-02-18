$(document).ready(function() {
  var cityArray = [];
  var dataArray = [];
  for (let i = 1; i < 6; i++) {
    var today = moment();
    var tomorrow = today.add(4, "days");
    var date = moment(tomorrow).format("M/D/YY");
    dataArray.push({
      id: "#day-" + i,
      date: date,
      icon: "",
      temp: "",
      humid: ""
    });
  }

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

    var finalCityURL = "&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

    // prevents duplicate cities from being added to favorites, otherwise pushes city to array for button creation
    if (cityArray.includes(city) === false) {
      cityArray.push(city);
    }
    // adds main query URL components together
    return cityQueryURL + city + finalCityURL;
  }

  // build favorite buttons URL
  function buildBtnURL() {
    // beginning of button query URL
    var btnQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

    // additional query parameters
    var btnCity = $(this).attr("data-name");

    var finalBtnURL = "&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace";

    // adds button click URL components together
    function finalReturn() {
      return btnQueryURL + btnCity + finalBtnURL;
    }

    // save button click URL in variable
    var queryURL = finalReturn();

    // AJAX call for buttons
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(getWeather);
  }

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
      .addClass("title")
      .text(response.name)
      .css({ "font-weight": "bolder", "font-size": "x-large" });
    $(".current-weather").append(cityName);

    var date = $("<p>");
    date
      .addClass("title")
      .text(now)
      .css("font-size", "large");
    $(".current-weather").append(date);

    var icon = $("<img>");
    icon.attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    $(".current-weather").append(icon);

    var temp = $("<p>");
    temp.text("Temperature: " + response.main.temp + " \u00B0F");
    $(".current-weather").append(temp);

    var humidity = $("<p>");
    humidity.text("Humidity: " + response.main.humidity + "%");
    $(".current-weather").append(humidity);

    var wind = $("<p>");
    wind.text("Wind: " + response.wind.speed + " mph");
    $(".current-weather").append(wind);

    // current city URL for UV data
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

      // UV index color coding
      if (urlData.value < 3) {
        $(".uvBtn")
          .css("background-color", "green")
          .css("color", "white");
      } else if (urlData.value > 2 && urlData.value < 6) {
        $(".uvBtn").css("background-color", "yellow");
      } else if (urlData.value > 5 && urlData.value < 8) {
        $(".uvBtn").css("background-color", "orange");
      } else if (urlData.value > 7 && urlData.value < 11) {
        $(".uvBtn")
          .css("background-color", "red")
          .css("color", "white");
      } else if (urlData.value >= 11) {
        $(".uvBtn")
          .css("background-color", "purple")
          .css("color", "white");
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
      // five day forcast results sort
      var dataIndex = 0;
      for (let i = 0; i < dailyData.list.length; i++) {
        if (dailyData.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          // push sorted data into array
          dataArray[dataIndex].icon = dailyData.list[i].weather[0].icon;
          dataArray[dataIndex].temp = dailyData.list[i].main.temp_max;
          dataArray[dataIndex].humid = dailyData.list[i].main.humidity;
          dataIndex++;
        }
      }

      // insert 5 day weather data
      for (let m = 0; m < dataArray.length; m++) {
        var fDate = $("<p>");
        fDate.text(dataArray[m].date);
        $(dataArray[m].id).append(fDate);

        var fIcon = $("<img>");
        fIcon.attr(
          "src",
          "http://openweathermap.org/img/w/" + dataArray[m].icon + ".png"
        );
        $(dataArray[m].id).append(fIcon);

        var fTemp = $("<p>");
        fTemp.text("Temperature: " + dataArray[m].temp + " \u00B0F");
        $(dataArray[m].id).append(fTemp);

        var fHumidity = $("<p>");
        fHumidity.text("Humidity: " + dataArray[m].humid + "%");
        $(dataArray[m].id).append(fHumidity);
      }
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

  // function to reset favorite buttons area
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

  // event listener for favorites clear button
  $(document).on("click", ".clear-btn", resetFavs);

  // functions to run on page load
  loadPage();
  getArray();
  favoritesBtns();
});
