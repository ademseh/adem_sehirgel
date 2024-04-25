<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";



if(
	isset($_GET['lat']) 
	&& isset($_GET['lng']) 
){
	$api = new API();
	$endpoint = "data/2.5/weather?lat=" . $_GET['lat'] . "&lon=" . $_GET['lng'] . "&appid=". API::$openWeatherAPIKEY;

	echo $api->makeGETRequest("openweather" ,$endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}







?>