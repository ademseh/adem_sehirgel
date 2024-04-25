<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";



if(
	isset($_GET['query']) 
){
	$api = new API();

	$endpoint = "v2/everything?q=" . $_GET['query'] . "&apiKey=" . API::$newsApiAPIKEY;

	echo $api->makeGETRequest("newsapi" ,$endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}







?>