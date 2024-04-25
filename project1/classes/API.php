<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


//ENUM CASE FOR STABLE VARIABLES
class URL
{
	const GEONAMES = "geonames";
    const LOCAL = "local";
    const OPENWEATHER = "openweather";
	const OPENEXCHANGE = "openexchange";
	const NEWSAPI = "newsapi";
}

class API {



	//BASE_URL's
	private $GEONAMES_BASE_URL = "http://api.geonames.org/";
	private $LOCAL_BASE_URL = "https://ademsehirgel.tokeryazilim.com/project1/";
	private $OPENWEATHER_BASE_URL = "http://api.openweathermap.org/";
	private $OPENEXCHANGE_BASE_URL = "https://openexchangerates.org/";
	private $NEWSAPI_BASE_URL = "https://newsapi.org/";
	//USERNAME for geonames
	static public $username = "ademsehg";
	static public $openWeatherAPIKEY = "f124febc164254553b00c0cfd6726114";
	static public $openExchangeAPIKEY = "1db39b9bbee24ae7ab55c14cd50fe032";
	static public $newsApiAPIKEY = "42ce2ed5811b48a284b7c0dc2bc839bf";


	public function makeGETRequest($url ,$endpoint){
		try {

			//URL setup
			$requestURL = "";

			if ($url == URL::LOCAL){
				$requestURL = $this->LOCAL_BASE_URL . $endpoint;
			} else if ($url == URL::GEONAMES){
				$requestURL = $this->GEONAMES_BASE_URL . $endpoint;
			} else if ($url == URL::OPENWEATHER){
				$requestURL = $this->OPENWEATHER_BASE_URL . $endpoint;
			} else if ($url == URL::OPENEXCHANGE){
				$requestURL = $this->OPENEXCHANGE_BASE_URL . $endpoint;
			} else if ($url == URL::NEWSAPI){
				$requestURL = $this->NEWSAPI_BASE_URL . $endpoint;
			}

			//CURL help us to make a request
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $requestURL);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			
			$userAgent = $_SERVER['HTTP_USER_AGENT'];

			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'User-Agent: '. $userAgent
			));


			$result = curl_exec($ch);

			curl_close($ch);

			$decodedResult = json_decode($result, true);

			//We create a status element for controlling the status of request


			$encodedResult = json_encode($decodedResult);

			return $encodedResult;
		} catch (Exception $e){

			//Same things like above
			$decodedResult = [];

			$decodedResult["status"]["message"] = $e->getMessage();

			$encodedResult = json_encode($decodedResult);
			
			return $encodedResult;
		}


	}

}



?>