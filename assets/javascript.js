var city = "";
var m = moment();
var citybtn = $("#citysearchbtn");
var key = "9d0408c1b72df0440eea79041dfc4aeb";

//to use localstoage to store an array, we stringify it going in, when we retrieve, we parse.
var recentSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];  //if localstorage contains an array, set recentSearches to be that array, otherwise set it to be []

//var recentSearches = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
if (recentSearches != [])
{
$("#recentcities").append(`<div class='card-content recent-city'>${recentSearches[recentSearches.length -1]}</div>`)
$("#recentcities").append(`<div class='card-content recent-city'>${recentSearches[recentSearches.length -2]}</div>`)
$("#recentcities").append(`<div class='card-content recent-city'>${recentSearches[recentSearches.length -3]}</div>`)}

$("#citysearchbtn").on("click", function() {
    console.log(city);
    city = $("#searchbox").val();
    var currentCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`
    console.log(city);
    for (i=0; i < $("#today").length; i++)
        { $("#today").children(i).remove();
          $("#fiveblocks").children(i).children().children().remove();
          $("#fiveblocks").children(i).removeClass();
        }     
        recentSearches.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(recentSearches));
        console.log(localStorage.getItem("searchHistory"));
   
    
    $("#recentcities").append(`<div class='card-content'>${recentSearches[recentSearches.length -1]}</div>`)

    searchCity();

    function searchCity(){
    fetch(currentCall)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        console.log((data)['weather'][0]['icon']);
        var yourCity = $("<h2>" + (data)['name'] +"<img src='http://openweathermap.org/img/w/"+(data)['weather'][0]['icon']+".png'></h2>");
        var lat = (data)['coord']['lat'];
        var lon = (data)['coord']['lon'];
        var mainTemp = $("<h3>" + Math.floor((data)['main']['temp']) + "°F</h3>");
        var mainHumid = $("<h5>" + (data)['main']['humidity'] + "% humidity</h5>");
        var mainWind = $("<h5>" + (data)['wind']['speed'] + "mph windspeed </h5>");
        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,alerts,hourly&appid=${key}`

        fetch(oneCall) 
            .then(function (nextResponse) {
                return nextResponse.json();
            })
            .then(function (nextdata) {
                console.log(nextdata);
                var mainWeather = (nextdata)['current']['weather']['icon'];
                var mainUV = (nextdata)['daily'][0]['uvi'];
                var mainUVI = $("<h5>" + mainUV + " UV index</h5>")
                
            $("#today").append(yourCity).append(mainTemp).append(mainHumid).append(mainWind).append(mainUVI);
                
                if (mainUV > 7) {
                    $("#today").children().eq(4).addClass("red-text")
                } else if (mainUV > 4) {
                    $("#today").children().eq(4).addClass("yellow")
                } else {
                    $("#today").children().eq(4).addClass("green-text")
                }

                for (i=0; i < $("#fiveblocks").children().length; i++) {
                    var boxDate = $("<div>" + moment.unix((nextdata)['daily'][i]['dt']).format("MM/DD") + "</div>");
                    var boxTemp = ("<div>" + Math.floor((nextdata)['daily'][i]['temp']['day']) + "°F</div>");
                    var boxHumid = $("<div>" + (nextdata)['daily'][i]['humidity'] + "% humidity </div>");
                    var boxWind = $("<div>" + (nextdata)['daily'][i]['wind_speed'] + "mph wind</div>");
                    var boxUV = $("<div>" + (nextdata)['daily'][i]['uvi'] + "UV index</div>");
                    var boxIcon = $("<div><img src='http://openweathermap.org/img/w/"+(nextdata)['daily'][i]['weather'][0]['icon']+".png'></div>");

                    $("#fiveblocks").children().eq(i).children().append(boxDate);
                    $("#fiveblocks").children().eq(i).children().append(boxTemp);
                    $("#fiveblocks").children().eq(i).children().append(boxHumid);
                    $("#fiveblocks").children().eq(i).children().append(boxWind);
                    $("#fiveblocks").children().eq(i).children().append(boxUV);
                    $("#fiveblocks").children().eq(i).children().append(boxIcon);

                    if (Math.floor((nextdata)['daily'][i]['temp']['day']) > 85) {
                        $("#fiveblocks").children().eq(i).addClass("card col s2 red lighten-2");
                    } else if (Math.floor((nextdata)['daily'][i]['temp']['day']) > 70) {
                        $("#fiveblocks").children().eq(i).addClass("card col s2 red lighten-4");
                    } else if (Math.floor((nextdata)['daily'][i]['temp']['day']) > 40) {
                        $("#fiveblocks").children().eq(i).addClass("card col s2 purple lighten-4");
                    } else {
                        $("#fiveblocks").children().eq(i).addClass("card col s2 blue lighten-4");
                    };
                    if ((nextdata)['daily'][i]['uvi'] > 7) {
                        $("#fiveblocks").children().eq(i).children().children().eq(4).addClass("white-text red darken-2");
                    } else if ((nextdata)['daily'][i]['uvi'] > 3) {
                        $("#fiveblocks").children().eq(i).children().children().eq(4).addClass("white-text yellow darken-2")
                    } else {
                        $("#fiveblocks").children().eq(i).children().children().eq(4).addClass("white-text green darken-2")

                    }
                    
                }

                
            })

    
});
}
});

// recent searches into searchbox was completed with help from Zach Duty

$(".recent-city").on("click", function(event) {
    event.stopPropagation();
    $("#searchbox").val(event.target.innerHTML);
})