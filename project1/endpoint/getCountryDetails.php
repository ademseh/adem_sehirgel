<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";



if(
	isset($_GET['country_code'])
){
	$api = new API();

	$endpoint = "countryInfoJSON?formatted=true&lang=en" . "&country=" . $_GET['country_code'] . "&username=". API::$username ."&style=full";

	echo $api->makeGETRequest("geonames" ,$endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}







?>