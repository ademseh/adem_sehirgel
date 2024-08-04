clearCaches()

function clearCaches(){
    
    caches.keys().then(function(names) {
        names.forEach(function(name) {
            caches.delete(name);
        });
    });

    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

}



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

//continent, languages, currency, isoALPHA2, isoALPHA3, population, area, postal codeFormat

//Modal Variables
var continent = "";
var country = null;
var capital = "";
var countryName = "";
var currency = "";
var population = "";
var weatherTemp = "";
var wikipediaHTML = "";
var language = "";
var isoALPHA2 = "";
var isoALPHA3 = "";
var area = "";
var postal = "";
var codeFormat = "";
var language = "";


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
$('.modal-header').addClass("text-white");
$('.modal-header').addClass("bg-gradient");


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$('#closeModalButton').click(function() {
    // Modalı kapat
    $('#exampleModal').modal('hide');
});



// tile layers

// ---------------------------------------------------------
// GLOBAL DECLARATIONS
// ---------------------------------------------------------

var map;

// tile layers

var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
  }
);

var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  }
);

var basemaps = {
  Streets: streets,
  Satellite: satellite
};

// overlays

var airports = L.markerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
});

var cities = L.markerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
});

var overlays = {
  Airports: airports,
  Cities: cities
};

// icons

var airportIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-plane",
  iconColor: "black",
  markerColor: "white",
  shape: "square"
});

var cityIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-city",
  markerColor: "green",
  shape: "square"
});

L.control.layers(basemaps, overlays).addTo(map);

airports.addTo(map);
cities.addTo(map);
// ---------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------

function getAirports(countryCode) {
    airports.clearLayers();

  $.ajax({
    url: "https://coding.itcareerswitch.co.uk/leaflet/getAirports.php",
    type: "POST",
    dataType: "json",
    data: {
      iso: countryCode
    },
    success: function (result) {
      if (result.status.code == 200) {
        result.data.forEach(function (item) {
          L.marker([item.lat, item.lng], { icon: airportIcon })
            .bindTooltip(item.name, { direction: "top", sticky: true })
            .addTo(airports);
        });
      } else {
        showToast("Error retrieving airport data", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showToast("Airports - server error", 4000, false);
    }
  });
}

function getCities(countryCode) {
    cities.clearLayers();
    
  $.ajax({
    url: "https://coding.itcareerswitch.co.uk/leaflet/getCities.php",
    type: "POST",
    dataType: "json",
    data: {
      iso: countryCode
    },
    success: function (result) {
      if (result.status.code == 200) {
        result.data.forEach(function (item) {
          L.marker([item.lat, item.lng], { icon: cityIcon })
            .bindTooltip(
              "<div class='col text-center'><strong>" +
                item.name +
                "</strong><br><i>(" +
                numeral(item.population).format("0,0") +
                ")</i></div>",
              { direction: "top", sticky: true }
            )
            .addTo(cities);
        });
      } else {
        showToast("Error retrieving city data", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      showToast("Cities - server error", 4000, false);
    }
  });
}

function showToast(message, duration, close) {
  Toastify({
    text: message,
    duration: duration,
    newWindow: true,
    close: close,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#870101"
    },
    onClick: function () {} // Callback after click
  }).showToast();
}

L.easyButton('fa-info', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Country Info");

    $('.modal-header').addClass("bg-success");

    var htmlContent = '<table class="table table-striped">' +
          
    '<tr>'+

     '<td class="text-center col-2">'+
        '<i class="fa-solid fa-landmark-flag fa-xl text-success"></i>'+
     '</td>' +

      '<td class="text-nowrap">'+
       ' Capital city'+
       '</td>'+

     '<td id="capitalCity" class="text-end"> '+
      '</td>'+

' </tr>'+
    ' <tr>'+

' <td class="text-center">'+
      '  <i class="fa-solid fa-globe fa-xl text-success"></i>'+
        ' </td>'+

      ' <td>'+
      '   Continent'+
        ' </td>'+

      ' <td id="continent" class="text-end">  '+            
      '</td>'+

      '  </tr>'+
    '<tr>'+

'<td class="text-center">'+
      '  <i class="fa-solid fa-ear-listen fa-xl text-success"></i>'+
        '</td>'+

      ' <td>'+
      '   Languages'+
        ' </td>'+

      ' <td id="languages" class="text-end">'+
      ' </td>'+

      '</tr>'+
    '<tr>'+

' <td class="text-center">'+
      '   <i class="fa-solid fa-coins fa-xl text-success"></i>'+
        ' </td>'+

      ' <td>'+
      '   Currency'+
        ' </td>'+

      '<td id="currency" class="text-end">'+
      '</td>'+

      '</tr>'+
    '<tr>'+

' <td class="text-center">'+
      '  <i class="fa-solid fa-equals fa-xl text-success"></i>'+
        '</td>'+

      ' <td class="text-nowrap">'+
      '  ISO alpha 2'+
        '</td>'+

      ' <td id="isoAlpha2" class="text-end">'+
      ' </td>'+

      ' </tr>'+
   ' <tr>'+

' <td class="text-center">'+
      '  <i class="fa-solid fa-bars fa-xl text-success"></i>'+
        ' </td>'+

      ' <td class="text-nowrap">'+
      ' ISO alpha 3'+
        ' </td>'+

      '<td id="isoAlpha3" class="text-end">'+
      '</td>'+

      '</tr>'+
    '<tr>'+

' <td class="text-center">'+
      '  <i class="fa-solid fa-person fa-xl text-success"></i>'+
        '</td>'+

      '<td>'+
      ' Population'+
        ' </td>'+

      '<td id="population" class="text-end">'+
      '</td>'+

      '</tr>'+
    '<tr>'+

'<td class="text-center">'+
      '  <i class="fa-solid fa-ruler-combined fa-xl text-success"></i>'+
        ' </td>'+

      ' <td class="text-nowrap">'+
      '  Area (km<sup>2</sup>)'+
        ' </td>'+

      ' <td id="areaInSqKm" class="text-end">'+
      ' </td>'+

      ' </tr>'+
    '<tr>'+

' <td class="text-center">'+
      '   <i class="fa-solid fa-envelope fa-xl text-success"></i>'+
        ' </td>'+

      ' <td class="text-nowrap">'+
      '   Postal code format'+
        ' </td>'+

      ' <td id="postalCodeFormat" class="text-end">'+
        
      ' </td>'+

      '</tr>'+

' </table>';
    /*
    var htmlContent =  
    capital + "/" + country.countryName 
    + "<br>" + "Population: " +  numeral(population).format('0,0')
    + "<br>" + "Area: " + numeral(country.areaInSqKm).format('0.0')  + "km"
    + "<br>" + "Continent Name: " + country.continentName;
  */

    $('.modal-body').html(htmlContent);
    $('#capitalCity').html(capital);
    $('#continent').html(continent);
    $('#languages').html(language);
    $('#currency').html(currency);
    $('#isoAlpha3').html(isoALPHA3);
    $('#population').html(population);
    $('#areaInSqKm').html(area);
    $('#postalCodeFormat').html(postal);

}).addTo(map);


var userValue = "";
L.easyButton('fa-dollar-sign', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Currency");
    $('.modal-body').html("<input type='number' class='form-control' id='currencyValue'/>" + currencyText);

    $('.modal-header').addClass("bg-primary");
    getCurrency()
    //(Girilen Değer / Döviz Değeri) * Seçilen Döviz Değeri
    document.getElementById("currencyValue").addEventListener("input", function(event){
         userValue = event.target.value;
        detectConvertedCurrency(userValue)
    })

    document.getElementById("currencySelect").addEventListener("change", function(event){
        detectConvertedCurrency(userValue)
    })
}).addTo(map);

function detectConvertedCurrency(val){
    let currencySelect = document.getElementById("currencySelect");

    const selectedIndex = currencySelect.selectedIndex;

    const selectedOption = currencySelect.options[selectedIndex].value;
        
    const convertedCurrencyValue = (val / currencyValue) * selectedOption

    const convertedCurrencyValueInput = document.getElementById("convertedCurrencyValue")

    convertedCurrencyValueInput.innerHTML = parseFloat(convertedCurrencyValue.toFixed(2))
}

L.easyButton('fa-temperature-three-quarters', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Weather");

    $('.modal-header').addClass("bg-danger");
    var htmlContent =  
    "Weather: " + weatherRainProbability 
     + "<br>" +  "Temperature: " + numeral(weatherTemp).format('0.0')   + "C°"
    + "<br>" + "humidity: " +  numeral(weatherHumidity).format('0.0')
    + "<br>" + "Cloud Condition: " +  numeral(weatherCloud).format('0.0');

    $('.modal-body').html(htmlContent);
}).addTo(map);

L.easyButton('fa-w', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Wikipedia");
    $('.modal-body').html(wikipediaHTML);

    $('.modal-header').addClass("bg-success");
    $('.modal-header').addClass("text-white");
    $('.modal-header').addClass("bg-gradient");
}).addTo(map);

L.easyButton('fa-newspaper', function(btn, map){
    $('#exampleModal').modal('show');
    $('.modal-title').html("Newspaper");

    $('.modal-header').addClass("bg-success");
    $('.modal-header').addClass("text-white");
    $('.modal-header').addClass("bg-gradient");
    
    $('.modal-header').addClass("bg-warning");

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
            if(res.status.error == 0){

                geoJSONLayer = L.geoJSON(res.geometry).addTo(map);

                map.fitBounds(L.geoJSON(res.geometry).getBounds());
                getCountryDetails(countryCode, "");
            }
            /*
            const countryKeys = Object.keys(res);

            countryKeys.forEach(key => {
                const country = res[key];
                var name = country.properties.name;
                geoJSONLayer = L.geoJSON(country).addTo(map);

                map.fitBounds(L.geoJSON(country).getBounds());

                getCountryDetails(countryCode, name);

            });
            */
        },
        error: function(xhr) {
        }
    });
}

function getCountryCode(lat, lng){
    $.ajax({
        url: "/project1/endpoint/getCountryCode.php?lat=" + lat + "&lng=" + lng,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if(res.status.error == "0"){
                let countryCode = res.countryCode
                selectElement.value = countryCode
                getBorderOfCountry(countryCode)
            }
        },
        error: function(xhr) {
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
            if(res.status.error == "0"){
                var countryArray = []
                var keys = Object.keys(res)
                
                keys.forEach(function(item){
                    if(item != "status"){
                        var country = res[item]
                        countryArray.push(country)
                    }
                })

                const combinedDataArray = countryArray.map(data => ({
                    iso_a2: data.iso_a2,
                    name: data.name
                  }));
                combinedDataArray.sort((a, b) => a.name.localeCompare(b.name));
                combinedDataArray.forEach(data => {
                    const option = document.createElement("option");
                    option.value = data.iso_a2; // option'un value'su ISO kodu olsun
                    option.textContent = data.name; // option'un içeriği ülke adı olsun
                    selectElement.appendChild(option);
                  });

            }

            
            
        },
        error: function(xhr) {
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

            if(res.status.error == "0"){
                country = res.geonames[0]
                console.log(country)

                capital = country.capital
                countryName = country.countryName
                countryCode = country.countryCode
                currency = country.currencyCode
                continent = country.continent
                language = country.languages
                isoALPHA3 = country.isoAlpha3
                area = numeral(country.areaInSqKm).format('0.0');
                population = numeral(country.population).format('0,0');
                postal = country.postalCodeFormat
                countryNameTitle.innerHTML = capital + "/" + countryName
                currencyTitle.innerHTML = "Currency: " + currency
                populationTitle.innerHTML = "Population: " + population
    
                //Request for the capital city the lat & lng 
                getCityLatLng(capital)
                getCities(countryCode)
                getAirports(countryCode)
                //Weather could show temperature, humidity, rain probability and cloud conditions
               
    
                //Locations for weather
                let east = country.east
                let north = country.north
                let west = country.west
                let south = country.south
    
                getEarthQuakes(north, south, east, west)
                getWikipedia(countryName)
                getCurrency()
    
                getNews(countryName)

                document.getElementById('loader').style.display = 'none';
                document.getElementById("preloader").style.display = 'none';
                document.getElementById('content').classList.remove('hidden');        
    
            }
            
        },
        error: function(xhr) {
            
        }
    });
}

function getCityLatLng(cityName){
    $.ajax({
        url: "/project1/endpoint/getCityLatLng.php?city_name=" + cityName,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            //console.log("getCityLatLng")
            //console.log(res)
            //console.log(res.length)
            if(res.status.error == "0"){
                if("0" in res){
                    let cityRes = res["0"]
                    let cityLat = cityRes.lat
                    let cityLng = cityRes.lon
                    getCityWeather(cityLat, cityLng)
                }
            }
            
        },
        error: function(xhr) {
        }
    });
}

//Request For City Weather
function getCityWeather(lat, lng){

    $.ajax({
        url: "/project1/endpoint/getCityWeather.php?lat=" + lat + "&lng=" + lng,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            //console.log("cityWeather")
            //console.log(res)
            if(res.status.error == "0"){
                weatherTemp = kelvinToCelsius(res.main.temp)
                weatherHumidity = res.main.humidity
                weatherCloud = res.clouds.all
                weatherRainProbability = res.weather[0].main
            }

        },
        error: function(xhr) {
        }
    });
}

function getEarthQuakes(north, south, east, west){
    if (markers) {
        //map.removeLayer(earthQuakeLayer);
        markers.clearLayers();
    }
    $.ajax({

        url: "/project1/endpoint/getEarthQuakes.php?north=" + north + "&south=" + south + "&east=" + east + "&west=" + west,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            /*
            if(res.status.error == "0"){
                earthQuakeLayer = L.layerGroup();

            

                res.earthquakes.forEach(function(item){
                    let lat = item.lat
                    let lng = item.lng
                    let datetime = item.datetime
                    let magnitude = item.magnitude
                    
                    var earthQuakeMarker = L.ExtraMarkers.icon({
                        icon: 'fa-house-chimney-crack',
                        iconColor: 'black',
                        markerColor: 'black',
                        shape: 'square',
                        prefix: 'fa'
                    });    
    
    
    
                    //CUSTOM MARKER
                    var marker = L.marker([lat, lng], { title: magnitude, icon:  earthQuakeMarker});
                    marker.bindPopup('Magnitude: ' + numeral(magnitude).format('0.0'));
                    
                    markers.addLayer(marker);
    
                })
                map.addLayer(markers);
                earthQuakeLayer.addTo(map);
            }
            */
            if (res.status.error == "0") {
                res.earthquakes.forEach(function(item) {
                    let lat = item.lat;
                    let lng = item.lng;
                    let magnitude = item.magnitude;

                    var earthQuakeMarker = L.ExtraMarkers.icon({
                        icon: 'fa-house-chimney-crack',
                        iconColor: 'black',
                        markerColor: 'black',
                        shape: 'square',
                        prefix: 'fa'
                    });

                    // Create marker with custom icon
                    var marker = L.marker([lat, lng], { icon: earthQuakeMarker });
                    marker.bindPopup('Magnitude: ' + numeral(magnitude).format('0.0'));

                    markers.addLayer(marker); // Add marker to cluster group
                });
                map.addLayer(markers); // Add cluster group to map
            }
        },
        error: function(xhr) {
        }
    });
}

function getCurrency(){
    $.ajax({
        url: "/project1/endpoint/getCurrencies.php?currency=USD",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
 
            if(res.status.error == "0"){
                currencyValue = res.rates[currency]
                currencyKey = currency
                currencyText = currencyKey + " = <span id='convertedCurrencyValue'> 1 </span> ";
                
                currencySelectHTML = "<select class='form-select' id='currencySelect'>";
                
                var currencyValueInput = document.getElementById("currencyValue");
    
                if (currencyValueInput) {
                  currencyValueInput.value = "" + currencyValue; 
                } else {
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
            }
            
        },
        error: function(xhr) {
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
    $.ajax({
        url: "/project1/endpoint/getNews.php?query=" + query.replace(/\s/g, ''),
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if(res.status == "ok"){
                var articles = res.articles
                for (const article of articles) { 
                    newsHTML +=
                     "<div class='row'> " +
                     "<div class='col-6'>" + 
                        "<img class='w-100' src='"+ article.urlToImage +"'/>" + 
                     "</div>" +
                     "<div class='col-6'>" + 

                        "<h5><a class='text-decoration-none text-dark' href='"+ article.url +"'>"+ article.title +"</a></h5>  <a class='text-decoration-none text-dark' href='"+ article.url +"'>"+ article.author +"</a>" +

                     "</div>" +
                     "</div>"
                     ;
                }
            }
            
        },
        error: function(xhr) {
            //console.log(xhr)
        }
    });
}


function getWikipedia(countryName){
    $.ajax({
        url: "/project1/endpoint/getWikipedia.php?country_name=" + countryName.replace(/\s/g, ''),
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if(res.status.error == "0"){
                var content = "";
                res.geonames.forEach(function(item) {
                    content += '<div>';
                    content += '<p>' + item.summary + '</p>';
                    content += '<a href="https://' + item.wikipediaUrl + '">' + "Read more..." + '</a>';
                    content += '</div> <br>';
                })
                
                
                wikipediaHTML = content
            }

            
            //wikipediaResults.innerHTML = content
        },
        error: function(xhr) {
            
        }
    });
}



//Permission For Current Location
function revealPosition(position) {
    let userLat = position.coords.latitude
    let userLng = position.coords.longitude

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

    /*
      var redMarker = L.ExtraMarkers.icon({
        icon: 'fa-location-crosshairs',
        iconColor: 'black',
        markerColor: 'black',
        shape: 'square',
        prefix: 'fa'
      });
    
    L.marker([userLat, userLng], {icon: redMarker}).addTo(map);
    map.setView([userLat, userLng], 10);
    */
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
                //console.error('Konum alınamadı:', error.message);
            });
        } else {
            // Kullanıcı izin vermemiş, mesaj göster veya başka bir işlem yap
            //console.warn('Kullanıcı konum izni vermedi.');
        }
    }).catch(error => {
        //console.error('İzin durumu alınamadı:', error.message);
    });
} else {
    //console.error('Tarayıcı konum izinlerini desteklemiyor.');
}
}

function formatPopulation(population) {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kelvinToCelsius(kelvin) {
    return Number(kelvin - 273.15).toFixed(2);
    //return parseFloat(kelvin - 273.15);
}
