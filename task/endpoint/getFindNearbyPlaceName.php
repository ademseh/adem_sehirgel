<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/task/classes/API.php";


//For findnearbyplace we need to values 1. Latitude 2. Longitude

if(isset($_GET['lat']) && isset($_GET['lng'])){
	$api = new API();

	$endpoint = "findNearbyPlaceNameJSON?formatted=true&lat=" . $_GET['lat'] . "&lng=" . $_GET['lng'] . "&username=". API::$username ."&style=full";

	echo $api->makeGETRequest($endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}



?>

