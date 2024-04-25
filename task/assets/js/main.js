let pResult = document.getElementById("result")
//var preloader = document.getElementById("preloader")

let latInput = document.getElementById("latitude")
let lngInput = document.getElementById("longitude")

let northInput = document.getElementById("north")
let eastInput = document.getElementById("east")
let southInput = document.getElementById("south")
let westInput = document.getElementById("west")

let postalcodeInput = document.getElementById("postalCode")
let maxRowsInput = document.getElementById("maxRows")

let getFindNearbyPlaceButton = document.getElementById("getFindNearbyPlaceButton")
let getEarthQuakesButton = document.getElementById("getEarthQuakesButton")
let getPostalCodeButton = document.getElementById("getPostalCodeButton")


getFindNearbyPlaceButton.addEventListener("click", function(){
    getFindNearbyPlaceName()
})

getEarthQuakesButton.addEventListener("click", function(){
    getEarthQuakes()
})

getPostalCodeButton.addEventListener("click", function(){
    getPostalCode()
})

function getFindNearbyPlaceName(){

	pResult.innerHTML = "Loading..."

//51.54666022132789, -0.10320137039160829
	$.ajax({
        url: "/task/endpoint/getFindNearbyPlaceName.php?lat="+ latInput.value +"&lng=" + lngInput.value,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log(res)
            pResult.innerHTML = ""

            if(res.status.error == "0"){
            	pResult.innerHTML = res.geonames[0].name + "/" + res.geonames[0].countryName
            } else {
            	console.log("error: " + res.status.message)
                pResult.innerHTML = res.status.message
            }

        },
        error: function(xhr){
            pResult.innerHTML = ""

        	console.log(xhr)
            pResult.innerHTML = xhr
        }
    });
}


function getEarthQuakes(){
    pResult.innerHTML = "Loading..."	


	$.ajax({
        url: "/task/endpoint/getEarthQuakes.php?north="+ northInput.value +"&south=" + southInput.value + "&east=" + eastInput.value +"&west=" + westInput.value,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
        	console.log(res)
            pResult.innerHTML = ""

            if(res.status.error == "0"){

            	console.log("verilerin hazır")
            	res.earthquakes.forEach(function(item){
            		pResult.innerHTML = pResult.innerHTML + item.src + " - " + item.depth + " - " + item.lat + ", " + item.lng +  "<br>"
            	})
            } else {
            	console.log("error: " + res.status.message)
                pResult.innerHTML = res.status.message
            }

        },
        error: function(xhr){
            pResult.innerHTML = ""

        	console.log(xhr)
            pResult.innerHTML = xhr

        }
    });
}


function getPostalCode(){
	pResult.innerHTML = "Loading..."
	

	$.ajax({
        url: "/task/endpoint/getPostalCode.php?postalcode="+ postalcodeInput.value +"&maxRows=" + maxRowsInput.value,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            pResult.innerHTML = ""
            if(res.status.error == "0"){
            	res.postalCodes.forEach(function(item){
            		pResult.innerHTML = pResult.innerHTML + item.postalCode + " - " + item.placeName + " - " + item.countryCode + "<br>"
            	})
            } else {
            	pResult.innerHTML = res.status.message
            }

        },
        error: function(xhr){
            pResult.innerHTML = ""

        	pResult.innerHTML = xhr
        }
    });
}

function showPreloader(){
	//preloader.style.display = "block"
}
function hidePreloader(){
	//preloader.style.display = "none"
}

