//Init UI
const selectElement = document.getElementById("dropdown");
const countryNameTitle = document.getElementById("countryNameTitle");
const populationTitle = document.getElementById("populationTitle");
const currencyTitle = document.getElementById("currencyTitle");
const weatherTitle = document.getElementById("weatherTitle");
const wikipedaTitle = document.getElementById("wikipedaTitle");
const wikipediaResults = document.getElementById("wikipediaResults") 

const countryInfo = document.getElementById("countryInfo")

const closeCountryInfoButton = document.getElementById("closeCountryInfoButton")

//Modal Variables
var country = null;
var capital = "";
var countryName = "";
var currency = "";
var population = "";
var weatherTemp = "";
var wikipediaHTML = "";


var weatherTemp = "";
var weatherHumidity = "";
var weatherRainProbability = "";
var weatherCloud = "";


var earthQuakeLayer = null;

var currencyKey = "";
var currencyValue = "";

var currencyText = "";
var currencySelectHTML = "";

var newsHTML = "";

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map');
map.setView([51.505, -0.09], 4);

var geoJSONLayer;

//Cluster
var markers = L.markerClusterGroup();



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$('#closeModalButton').click(function() {
    // Modalı kapat
    $('#exampleModal').modal('hide');
});




L.easyButton('fa-info', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Country Info");
    //.       Ankara / Türkiye
    var htmlContent =  
    capital + "/" + country.countryName 
    + "<br>" + "Population: " + population 
    + "<br>" + "Area: " + country.areaInSqKm + "km"
    + "<br>" + "Continent Name: " + country.continentName;

    $('.modal-body').html(htmlContent);
}).addTo(map);


var userValue = "";
L.easyButton('fa-dollar-sign', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Currency");
    $('.modal-body').html("<input type='number' id='currencyValue'/>" + currencyText);

    getCurrency()
    //(Girilen Değer / Döviz Değeri) * Seçilen Döviz Değeri
    document.getElementById("currencyValue").addEventListener("input", function(event){
        console.log("changed")
         userValue = event.target.value;
        detectConvertedCurrency(userValue)
    })

    document.getElementById("currencySelect").addEventListener("change", function(event){
        console.log("select changed")
        detectConvertedCurrency(userValue)
    })
}).addTo(map);

function detectConvertedCurrency(val){
    let currencySelect = document.getElementById("currencySelect");

    const selectedIndex = currencySelect.selectedIndex;

    const selectedOption = currencySelect.options[selectedIndex].value;
        
    const convertedCurrencyValue = (val / currencyValue) * selectedOption
    console.log(convertedCurrencyValue)

    const convertedCurrencyValueInput = document.getElementById("convertedCurrencyValue")

    convertedCurrencyValueInput.innerHTML = parseFloat(convertedCurrencyValue.toFixed(2))
}

L.easyButton('fa-temperature-three-quarters', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Weather");
    var htmlContent =  
    "Weather: " + weatherRainProbability 
     + "<br>" +  "Temperature: " + weatherTemp  + "C°"
    + "<br>" + "humidity: " + weatherHumidity
    + "<br>" + "Cloud Condition: " + weatherCloud;

    $('.modal-body').html(htmlContent);
}).addTo(map);

L.easyButton('fa-w', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Wikipedia");
    $('.modal-body').html(wikipediaHTML);
}).addTo(map);

L.easyButton('fa-newspaper', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Newspaper");
    
    var htmlContent = newsHTML;

    $('.modal-body').html(htmlContent);
}).addTo(map);

//RUN
getCountries()
handlePermission()

//Detecting changes on dropdown
selectElement.addEventListener("change", function(){
    const selectedValue = this.value; // this, olayı tetikleyen elementi (yani selectElement'i) temsil eder
    getBorderOfCountry(selectedValue)
})

closeCountryInfoButton.addEventListener("click", function(){
    countryInfo.style.display = "none"
})

//Functions
function getBorderOfCountry(countryCode){
    clearLayers()

    $.ajax({
        url: "/project1/endpoint/getCountryBorder.php?country_code=" + countryCode,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log(res)
            const countryKeys = Object.keys(res);

            countryKeys.forEach(key => {
                const country = res[key];
                const name = country.properties.name;
                geoJSONLayer = L.geoJSON(country).addTo(map);

                map.fitBounds(L.geoJSON(country).getBounds());

                getCountryDetails(countryCode, name);

            });
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}

function getCountryCode(lat, lng){
    console.log("get country code")
    $.ajax({
        url: "/project1/endpoint/getCountryCode.php?lat=" + lat + "&lng=" + lng,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log(res)
            let countryCode = res.countryCode
            selectElement.value = countryCode
            getBorderOfCountry(countryCode)
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}

//Get countries from Server
function getCountries(){
    $.ajax({
        url: "/project1/endpoint/getCountries.php",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log(res)
            const combinedDataArray = res.features.map(data => ({
              iso_a2: data.properties.iso_a2,
              name: data.properties.name
            }));
            console.log(combinedDataArray)
            combinedDataArray.sort((a, b) => a.name.localeCompare(b.name));
            combinedDataArray.forEach(data => {
              const option = document.createElement("option");
              option.value = data.iso_a2; // option'un value'su ISO kodu olsun
              option.textContent = data.name; // option'un içeriği ülke adı olsun
              selectElement.appendChild(option);
            });
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}

//Clear Layers From the map
function clearLayers(){
    // Tüm katmanları temizleme
    map.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });
}


//Get Country Details
function getCountryDetails(countryCode, countryName){
    $.ajax({
        url: "/project1/endpoint/getCountryDetails.php?country_code=" + countryCode,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            country = res.geonames[0]
            console.log("country")
            console.log(country)
            capital = country.capital
            countryName = country.countryName
            currency = country.currencyCode
            population = formatPopulation(country.population);

            countryNameTitle.innerHTML = capital + "/" + countryName
            currencyTitle.innerHTML = "Currency: " + currency
            populationTitle.innerHTML = "Population: " + population

            //Request for the capital city the lat & lng 
            getCityLatLng(capital)

            //Weather could show temperature, humidity, rain probability and cloud conditions


            //Locations for weather
            let east = country.east
            let north = country.north
            let west = country.west
            let south = country.south

            getEarthQuakes(north, south, east, west)
            //getWeather(north, south, east, west)
            getWikipedia(countryName)
            getCurrency()

            getNews(countryName)
            //countryInfo.style.display = "block";
            console.log("Cluster")

        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}

function getCityLatLng(cityName){
    console.log("city lat lng")
    $.ajax({
        url: "/project1/endpoint/getCityLatLng.php?city_name=" + cityName,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if(res.length > 0){
                let cityRes = res[0]
                let cityLat = cityRes.lat
                let cityLng = cityRes.lon
                getCityWeather(cityLat, cityLng)
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

//Request For City Weather
function getCityWeather(lat, lng){
    console.log("getCityWeather")

    $.ajax({
        url: "/project1/endpoint/getCityWeather.php?lat=" + lat + "&lng=" + lng,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log(res)
            //temperature, humidity, rain probability and cloud conditions 
            weatherTemp = kelvinToCelsius(res.main.temp)
            console.log("weatherTemp : -> " + weatherTemp)
            weatherHumidity = res.main.humidity
            weatherCloud = res.clouds.all
            weatherRainProbability = res.weather[0].main

        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

function getEarthQuakes(north, south, east, west){
    console.log("EarthQuakes")
    if (markers) {
        //map.removeLayer(earthQuakeLayer);
        markers.clearLayers();
    }
    $.ajax({

        url: "/project1/endpoint/getEarthQuakes.php?north=" + north + "&south=" + south + "&east=" + east + "&west=" + west,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            earthQuakeLayer = L.layerGroup();

            

            res.earthquakes.forEach(function(item){
                let lat = item.lat
                let lng = item.lng
                let datetime = item.datetime
                let magnitude = item.magnitude

                console.log(lat + " - " + lng + " - " + datetime + " - " + magnitude)
                /*
                   var earthQuakeIcon = L.icon({
                        iconUrl: '/project1/assets/image/earthquake-icon.png',
                        shadowUrl: '',

                        iconSize:     [40, 40], // size of the icon
                        shadowSize:   [0, 0], // size of the shadow
                        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        shadowAnchor: [4, 62],  // the same for the shadow
                        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                    });
                */
                //let marker =L.marker([lat, lng], {icon: earthQuakeIcon}).addTo(earthQuakeLayer).bindPopup("Date : " + datetime + " Magnitude: " + magnitude);
                var earthQuakeMarker = L.ExtraMarkers.icon({
                    icon: 'fa-house-chimney-crack',
                    iconColor: 'black',
                    markerColor: 'black',
                    shape: 'square',
                    prefix: 'fa'
                });    
                //L.marker([userLat, userLng], {icon: redMarker}).addTo(map);

                //CUSTOM MARKER
                var marker = L.marker([lat, lng], { title: magnitude, icon:  earthQuakeMarker});
                marker.bindPopup('Magnitude: ' + magnitude);
                
                markers.addLayer(marker);

                //var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
            })
            map.addLayer(markers);
            earthQuakeLayer.addTo(map);
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}

function getCurrency(){
    console.log("currency " + currency)
    $.ajax({
        url: "/project1/endpoint/getCurrencies.php?currency=USD",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log(res)
            currencyValue = res.rates[currency]
            currencyKey = currency
            currencyText = currencyKey + " = <span id='convertedCurrencyValue'> 1 </span> ";

            currencySelectHTML = "<select id='currencySelect'>";
            
            var currencyValueInput = document.getElementById("currencyValue");

            if (currencyValueInput) {
              currencyValueInput.value = "" + currencyValue; 
            } else {
              console.error("currencyValueInput not found.");
            }

            for (const currency in res.rates) {
                const rate = res.rates[currency];
                if (currency == "USD") {
                    currencySelectHTML += "<option selected value='"+ rate +"'>" + currency + "</option>";
                } else {
                    currencySelectHTML += "<option value='"+ rate +"'>" + currency + "</option>";
                }
            }
            currencySelectHTML += "</select>";

            currencyText += currencySelectHTML;
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}

/*
function getWeather(north, south, east, west){
    $.ajax({
        url: "/project1/endpoint/getWeather.php?north=" + north + "&south=" + south + "&east=" + east + "&west=" + west,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            let weather = res.weatherObservations[0]
            let temp = weather.temperature
            weatherTemp = "Temperature: " + temp + "°C";
            //weatherTitle.innerHTML = "Temperature: " + temp
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}
*/
function getNews(query){
    //console.log("wikipedia Search: " + countryName)
    newsHTML = "";
    console.log("getNews")
    $.ajax({
        url: "/project1/endpoint/getNews.php?query=" + query.replace(/\s/g, ''),
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            var articles = res.articles
            for (const article of articles) { 
                newsHTML += "<h3>"+ article.title +"</h3>  <p>"+ article.description +"</p> <a href='"+ article.url +"'>Read more...</a>";
            }
        },
        error: function(xhr) {
            console.log("news error")
            console.log(xhr)
        }
    });
}


function getWikipedia(countryName){
    console.log("wikipedia Search: " + countryName)
    $.ajax({
        url: "/project1/endpoint/getWikipedia.php?country_name=" + countryName.replace(/\s/g, ''),
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log("wikipedia Results ")
            console.log(res)
            var content = "";
            res.geonames.forEach(function(item) {
                content += '<div>';
                content += '<p>' + item.summary + '</p>';
                content += '<a href="https://' + item.wikipediaUrl + '">' + "Read more..." + '</a>';
                content += '</div> <br>';
            })
            
            
            wikipediaHTML = content
            //wikipediaResults.innerHTML = content
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });
}


//On Load The Page
document.addEventListener("DOMContentLoaded", function() {
    console.log("loaded")

    console.log("show UI")
    // Hide the loader and show the content once the DOM is loaded
    document.getElementById('loader').style.display = 'none';
    document.getElementById('content').classList.remove('hidden');

});


//Permission For Current Location
function revealPosition(position) {
    let userLat = position.coords.latitude
    let userLng = position.coords.longitude
    console.log('Kullanıcı konumu:', position.coords.latitude, position.coords.longitude);

    /*
    Locate the current location on the map
    var userIcon = L.icon({
        iconUrl: '/project1/assets/image/personIcon.png',
        shadowUrl: '',

        iconSize:     [40, 40], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([userLat, userLng], {icon: userIcon}).addTo(map).bindPopup("Your Location");
    */
      var redMarker = L.ExtraMarkers.icon({
        icon: 'fa-location-crosshairs',
        iconColor: 'black',
        markerColor: 'black',
        shape: 'square',
        prefix: 'fa'
      });
    
    L.marker([userLat, userLng], {icon: redMarker}).addTo(map);
    map.setView([userLat, userLng], 10);

    getCountryCode(userLat, userLng)
}

function handlePermission(){
    if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
            // Kullanıcı izin vermiş, konum isteği yapabilirsin
            navigator.geolocation.getCurrentPosition(revealPosition);
        } else if (permissionStatus.state === 'prompt') {
            // Kullanıcı henüz izin vermemiş, izin isteği gönder
            navigator.geolocation.getCurrentPosition(revealPosition, error => {
                console.error('Konum alınamadı:', error.message);
            });
        } else {
            // Kullanıcı izin vermemiş, mesaj göster veya başka bir işlem yap
            console.warn('Kullanıcı konum izni vermedi.');
        }
    }).catch(error => {
        console.error('İzin durumu alınamadı:', error.message);
    });
} else {
    console.error('Tarayıcı konum izinlerini desteklemiyor.');
}
}

function formatPopulation(population) {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kelvinToCelsius(kelvin) {
    return Number(kelvin - 273.15).toFixed(2);
    //return parseFloat(kelvin - 273.15);
}
