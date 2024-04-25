<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";



if(
	isset($_GET['north'])
	&&  isset($_GET['south'])
	&&  isset($_GET['east'])
	&&  isset($_GET['west'])
){
	$api = new API();
	$endpoint = "weatherJSON?formatted=true&north=" . $_GET["north"] . "&south=" . $_GET['south'] . "&east=" . $_GET['east'] . "&west=" . $_GET['west'] . "&username=". API::$username ."&style=full";

	echo $api->makeGETRequest("geonames" ,$endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}







?>