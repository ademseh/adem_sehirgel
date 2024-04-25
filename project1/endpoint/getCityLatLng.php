<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";



if(
	isset($_GET['city_name']) 
){
	$api = new API();

	$endpoint = "geo/1.0/direct?q=" . $_GET['city_name'] . "&limit=5&appid=" . API::$openWeatherAPIKEY;

	echo $api->makeGETRequest("openweather" ,$endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}







?>