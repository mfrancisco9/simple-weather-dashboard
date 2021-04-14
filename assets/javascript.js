var city = "";
var m = moment();
var citybtn = $("#citysearchbtn");
var key = "9d0408c1b72df0440eea79041dfc4aeb";

//to use localstoage to store an array, we stringify it going in, when we retrieve, we parse.
var recentSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];  //if localstorage contains an array, set recentSearches to be that array, otherwise set it to be []

//var recentSearches = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];

$("#recentcities").append(`<div class='card-content recent-city'>${recentSearches[recentSearches.length -1]}</div>`)
$("#recentcities").append(`<div class='card-content recent-city'>${recentSearches[recentSearches.length -2]}</div>`)
$("#recentcities").append(`<div class='card-content recent-city'>${recentSearches[recentSearches.length -3]}</div>`)

$("#citysearchbtn").on("click", function() {
    console.log(city);
    city = $("#searchbox").val();
    var currentCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`
    console.log(city);
    for (i=0; i < $("#today").length; i++)
        { $("#today").children(i).remove();
          $("#fiveblocks").children(i).children().children().remove();
        }     
        recentSearches.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(recentSearches));
        console.log(localStorage.getItem("searchHistory"));
    //We need to put an array in local storage: 
    //.push(city) into recentSearches
    //set it to localStorage with name "searchHistory"
    // 1st time opening app :   "chicago" and it gets put into local storage  => [chicago]
    // end time openning app: "Milwaukee" and it gets put into local storage  =>  [milwaukee]
        //localStorage.setItem("searchHistory", JSON.stringify(recentSearches))
    
    $("#recentcities").append(`<div class='card-content'>${recentSearches[recentSearches.length -1]}</div>`)

    searchCity();

    function searchCity(){
    fetch(currentCall)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var yourCity = $("<h2>" + (data)['name'] + "</h2>");
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
                var mainWeather = (nextdata)['current']['weather']['main'];
                var mainUV = (nextdata)['daily'][0]['uvi'];
                var mainUVI = $("<h5>" + mainUV + " UV index</h5>")
                
            $("#today").append(yourCity).append(mainTemp).append(mainHumid).append(mainWind).append(mainUVI);
                
                for (i=0; i < $("#fiveblocks").children().length; i++) {
                    var boxDate = $("<div>" + moment.unix((nextdata)['daily'][i]['dt']).format("MM/DD") + "</div>");
                    var boxTemp = ("<div>" + (nextdata)['daily'][i]['temp']['day'] + "°F</div>");
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


                  

                    ;
                }
            })

    
});
}
});

$(".recent-city").on("click", function() {
    console.log(this);
    console.log(this.val());
    console.log(this.text());
    $("#searchbox").val("test");
})
