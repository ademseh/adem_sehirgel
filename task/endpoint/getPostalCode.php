<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/task/classes/API.php";




if(isset($_GET['postalcode']) && isset($_GET['maxRows'])){
	$api = new API();

	$endpoint = "postalCodeSearchJSON??formatted=true&postalcode=" . $_GET['postalcode'] . "&maxRows=" . $_GET['maxRows'] . "&username=". API::$username ."&style=full";

	echo $api->makeGETRequest($endpoint);
} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}







?>