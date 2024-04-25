<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


enum URL: string
{
	case GEONAMES = "geonames";
	case LOCAL = "local";
}

$GEONAMES_URL = "https://geonames.com";
$LOCAL_URL = "http://localhost";



$param = $_GET['URL'];


if ($param == URL::GEONAMES->value) {
	echo $GEONAMES_URL;
} else if($param == URL::LOCAL->value) {
	echo $LOCAL_URL;
}

?>