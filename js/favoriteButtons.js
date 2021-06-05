// display favorites buttons
function favoritesBtns(cityArray) {
    $(".favorites").empty();
    if (cityArray.length !== 0) {
        const clearBtn = $("<button>");
        clearBtn
            .addClass("clear-btn btn btn-outline-light my-2 my-sm-0")
            .text("Clear");
        $(".favorites").append(clearBtn);
    }
    for (let i = 0; i < cityArray.length; i++) {
        const button = $("<button>");
        button
            .addClass("city-btn btn btn-outline-light my-2 my-sm-0")
            .attr("data-id", cityArray[i].id)
            .attr("data-name", cityArray[i].name)
            .attr("data-lat", cityArray[i].coord.lat)
            .attr("data-lon", cityArray[i].coord.lon)
            .text(cityArray[i].name);
        $(".favorites").append(button);
    }
}

// clear favorite buttons
function resetFavs() {
    $(".favorites").empty();
    localStorage.removeItem("cityArray");
}

// event listener for favorites clear button
$(document).on("click", ".clear-btn", resetFavs);

$(document).on("click", ".city-btn", function () {
    getCityWeather({
        id: $(this).attr("data-id"),
        name: $(this).attr("data-name"),
        coord: {
            lat: $(this).attr("data-lat"),
            lon: $(this).attr("data-lon"),
        },
    });
});
