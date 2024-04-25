<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";

if(
	isset($_GET['currency'])
){
	$api = new API();

	$endpoint = "api/latest.json?app_id=". API::$openExchangeAPIKEY ."&base=" . $_GET["currency"];

	echo $api->makeGETRequest("openexchange" ,$endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}

?>