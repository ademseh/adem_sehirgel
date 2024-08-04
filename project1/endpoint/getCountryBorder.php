<?php
/*
//earthquakesJSON?formatted=true&north=44.1&south=-9.9&east=-22.4&west=55.2&username=ademsehg&style=full
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";

//For findnearbyplace we need to values 1. Latitude 2. Longitude

if(
	isset($_GET['country_code']) 
){

	$country_code = strtoupper($_GET['country_code']);

	$api = new API();

	$endpoint = "data/countryBorders.json";

	//VALUES are string 
	$data = $api->makeGETRequest("local", $endpoint);

	//Parse string to json
	$parsedData = json_decode($data, true);

	//Filter array
	$filteredData = array_filter($parsedData['features'], function($item) use ($country_code) {
	    return $item['properties']['iso_a2'] == $country_code;
	});

	//Detecting of existing country/data
	if (count($filteredData) == 0) {
		$filteredData["status"]["error"] = "1";
		$filteredData["status"]["message"] = "no country found";
	} else {
		$filteredData["status"]["error"] = "0";
		$filteredData["status"]["message"] = "country founded";
	}

	//parse array to json
	$jsonData = json_encode($filteredData);

	//print json
	echo $jsonData;

} else {
	$decodedResult = [];

	$decodedResult["status"]["error"] = "1";
	$decodedResult["status"]["message"] = "parameter missed";

	$encodedResult = json_encode($decodedResult);
			
	echo $encodedResult;
}
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include $_SERVER['DOCUMENT_ROOT'] . "/project1/classes/API.php";

//For findnearbyplace we need to values 1. Latitude 2. Longitude

if(isset($_GET['country_code'])) {
    $country_code = strtoupper($_GET['country_code']);

    $api = new API();
    $endpoint = "data/countryBorders.json";

    //VALUES are string 
    $data = $api->makeGETRequest("local", $endpoint);

    //Parse string to json
    $parsedData = json_decode($data, true);

    //Filter array
    $filteredData = array_filter($parsedData['features'], function($item) use ($country_code) {
        return $item['properties']['iso_a2'] == $country_code;
    });

    //Detecting of existing country/data
    $response = [];
    if (count($filteredData) == 0) {
        $response["status"]["error"] = "1";
        $response["status"]["message"] = "no country found";
    } else {
        $geometry = reset($filteredData)['geometry']; // Get the first geometry
        $status = ["status" => ["error" => "0", "message" => "country founded"]];

        $response["geometry"] = $geometry;
        $response["status"] = $status["status"];
    }

    //parse array to json
    $jsonData = json_encode($response);

    //print json
    echo $jsonData;
} else {
    $response = [
        "status" => [
            "error" => "1",
            "message" => "parameter missed"
        ]
    ];

    $jsonData = json_encode($response);
    echo $jsonData;
}



?>