let cityArray = JSON.parse(localStorage.getItem('cityArray'))
  ? JSON.parse(localStorage.getItem('cityArray'))
  : [];

// function to fetch weather data and append to page
const getCityWeather = (data) => {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=73dd4f9c95552ba9b2a9aa8643789ace`,
    method: 'GET',
  }).then((res) => {
    // add favorite button if not already in existance for that city
    const favoriteBtnData = {
      id: data.id,
      name: data.name,
      coord: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
    };
    cityArray = JSON.parse(localStorage.getItem('cityArray'))
      ? JSON.parse(localStorage.getItem('cityArray'))
      : [];

    if (cityArray.length === 0) {
      if (!data.orig) {
        cityArray.push(favoriteBtnData);
      }
    } else if (
      !localStorage.getItem('cityArray').includes(data.id) &&
      cityArray.length < 6 &&
      !data.orig
    ) {
      cityArray.push(favoriteBtnData);
    }

    localStorage.setItem('cityArray', JSON.stringify(cityArray));
    favoritesBtns(cityArray);

    // clear previous search data
    $('p').remove();
    $('img').remove();

    // populate requested current weather parameters
    const cityName = $('<p>');
    cityName
      .addClass('title')
      .text(data.name)
      .css({ 'font-weight': 'bolder', 'font-size': 'x-large' });
    $('.current-weather').append(cityName);

    const date = $('<p>');
    date
      .addClass('title')
      .text(moment().format('MMMM Do, YYYY'))
      .css('font-size', 'large');
    $('.current-weather').append(date);

    const icon = $('<img>');
    icon.attr(
      'src',
      `https://openweathermap.org/img/w/${res.current.weather[0].icon}.png`
    );
    $('.current-weather').append(icon);

    const temp = $('<p>');
    temp.text('Temperature: ' + res.current.temp + ' \u00B0F');
    $('.current-weather').append(temp);

    const humidity = $('<p>');
    humidity.text('Humidity: ' + res.current.humidity + '%');
    $('.current-weather').append(humidity);

    const wind = $('<p>');
    wind.text('Wind: ' + res.current.wind_speed + ' mph');
    $('.current-weather').append(wind);

    const uv = $('<p>');
    uv.addClass('uv').text('UV Index: ');
    $('.current-weather').append(uv);

    const button = $('<button>');
    button.addClass('uvBtn').text(res.current.uvi);
    $('.uv').append(button);

    // UV index color coding
    if (res.current.uvi < 3) {
      $('.uvBtn').css('background-color', 'green').css('color', 'white');
    } else if (res.current.uvi > 2 && res.current.uvi < 6) {
      $('.uvBtn').css('background-color', 'yellow');
    } else if (res.current.uvi > 5 && res.current.uvi < 8) {
      $('.uvBtn').css('background-color', 'orange');
    } else if (res.current.uvi > 7 && res.current.uvi < 11) {
      $('.uvBtn').css('background-color', 'red').css('color', 'white');
    } else if (res.current.uvi >= 11) {
      $('.uvBtn').css('background-color', 'purple').css('color', 'white');
    }

    // populate five day forcast cards
    for (let i = 0; i < res.daily.slice(0, 5).length; i++) {
      const fDate = $('<p>');
      fDate.text(moment().add(i, 'days').format('M/D/YY'));
      $(`#day-${i}`).append(fDate);

      const fIcon = $('<img>');
      fIcon.attr(
        'src',
        `http://openweathermap.org/img/w/${res.daily[i].weather[0].icon}.png`
      );
      $(`#day-${i}`).append(fIcon);

      const fTemp = $('<p>');
      fTemp.text(`Temperature: ${res.daily[i].temp.max}\u00B0F`);
      $(`#day-${i}`).append(fTemp);

      const fHumidity = $('<p>');
      fHumidity.text(`Humidity: ${res.daily[i].humidity}%`);
      $(`#day-${i}`).append(fHumidity);
    }
  });
};

$(document).ready(function () {
  // functions to run on page load
  // populate Phoenix weather on page load
  getCityWeather({
    id: 5308655,
    name: 'Phoenix',
    coord: {
      lat: 33.44838,
      lon: -112.074043,
    },
    orig: true,
  });
  favoritesBtns(cityArray);
});
