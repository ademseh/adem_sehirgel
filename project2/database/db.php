<?php
$servername = "localhost";
$username = "u335195660_ademsehirgel";
$password = "Ademsehirgel123.,!";
$dbName = "u335195660_ademsehirgel";

try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbName", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  //echo "Connected successfully";
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
?>