<?php
//earthquakesJSON?formatted=true&north=44.1&south=-9.9&east=-22.4&west=55.2&username=ademsehg&style=full
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";

//For findnearbyplace we need to values 1. Latitude 2. Longitude

$api = new API();

$endpoint = "data/countryBorders.json";

//VALUES are string 
$data = $api->makeGETRequest("local", $endpoint);

//Parse string to json
$parsedData = json_decode($data, true);


//parse array to json
$jsonData = json_encode($parsedData);

//print json
echo $jsonData;





?>