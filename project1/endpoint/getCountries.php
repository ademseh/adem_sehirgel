<?php
/*
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
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";

//For findnearbyplace we need to values 1. Latitude 2. Longitude
try {
    $api = new API();

    $endpoint = "data/countryBorders.json";
    
    //VALUES are string 
    $data = $api->makeGETRequest("local", $endpoint);
    
    //Parse string to json
    $parsedData = json_decode($data, true);
    
    // Initialize an empty array to store filtered data
    $filteredData = [];
    
    // Loop through features and extract iso_a2 and name
    foreach ($parsedData['features'] as $feature) {
        $properties = $feature['properties'];
        $filteredData[] = [
            "iso_a2" => $properties['iso_a2'],
            "name" => $properties['name']
        ];
    }
    
    $filteredData["status"]["error"] = "0";
    $filteredData["status"]["message"] = "successfull";
    
    // Parse filtered array to json
    $jsonData = json_encode($filteredData);
    
    // Print json
    echo $jsonData;
} catch (Exception $e){
    $filteredData = [];
    $filteredData["status"]["error"] = "1";
    $filteredData["status"]["message"] = "error";
    
    // Parse filtered array to json
    $jsonData = json_encode($filteredData);
    
    // Print json
    echo $jsonData;
}






?>