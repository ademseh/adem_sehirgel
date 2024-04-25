<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


class API {

	static public $username = "ademsehg";
	private $BASE_URL = "http://api.geonames.org/";

	public function makeGETRequest($endpoint){
		try {

			//URL setup
			$url = $this->BASE_URL . $endpoint;

			//CURL help us to make a request
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			$result = curl_exec($ch);

			curl_close($ch);

			$decodedResult = json_decode($result, true);

			//We create a status element for controlling the status of request
			$decodedResult["status"]["error"] = "0";

			$encodedResult = json_encode($decodedResult);

			return $encodedResult;
		} catch (Exception $e){

			//Same things like above
			$decodedResult = [];

			$decodedResult["status"]["error"] = "1";
			$decodedResult["status"]["message"] = $e->getMessage();

			$encodedResult = json_encode($decodedResult);
			
			return $encodedResult;
		}


	}

}



?>