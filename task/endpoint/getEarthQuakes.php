<?php
//earthquakesJSON?formatted=true&north=44.1&south=-9.9&east=-22.4&west=55.2&username=ademsehg&style=full
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/task/classes/API.php";


//For findnearbyplace we need to values 1. Latitude 2. Longitude

if(
	isset($_GET['north']) 
	&& isset($_GET['south']) 
	&& isset($_GET["west"]) 
	&& isset($_GET["east"])
){
	$api = new API();

	$endpoint = "earthquakesJSON?formatted=true&north=". $_GET['north'] 
		."&south=". $_GET['south'] 
		."&east=". $_GET['east'] 
		."&west=". $_GET['west'] 
		."&username=". API::$username ."&style=full";

	echo $api->makeGETRequest($endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}



?>