$(document).ready(function () {
    // searchbar with autocomplete
    $(".search-bar").autocomplete({
        minLength: 3,
        autoFocus: true,
        source: function (request, response) {
            const matcher = new RegExp(
                "^" + $.ui.autocomplete.escapeRegex(request.term),
                "i"
            );
            $.ajax({
                url: "../utils/city.list.json",
                dataType: "json",
                success: function (data) {
                    response(
                        $.map(data, function (v) {
                            const text = v.name;
                            if (text && (!request.term || matcher.test(text))) {
                                return {
                                    label: `${text}${
                                        v.state ? `, ${v.state}` : ""
                                    }${v.country ? `, ${v.country}` : ""}`,
                                    value: {
                                        coord: v.coord,
                                        name: text,
                                        id: v.id,
                                    },
                                };
                            }
                        })
                    );
                },
            });
        },
        select: function (e, ui) {
            getCityWeather(ui.item.value);
            $(this).val("");
            return false;
        },
    });

    // prevent accidental sumbission before city and state/country combo is selected
    $(".search-bar").keydown(function (event) {
        if (event.keyCode == 13) {
            if (typeof $(".search-bar").val() !== "number") {
                event.preventDefault();
                return false;
            }
        }
    });
});
