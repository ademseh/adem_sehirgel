<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getPersonnelCountByDepartment.php

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// departmentID'yi alın (örnek olarak GET yöntemi kullanıldı)
$locationID = isset($_GET['locationID']) ? $_GET['locationID'] : null;

if (!$locationID) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failed";
    $output['status']['description'] = "departmentID not provided";
    $output['data'] = [];

    echo json_encode($output);

    exit;
}

// SQL sorgusu hazırlanıp çalıştırılıyor
$query = $conn->prepare('SELECT COUNT(*) as department_count FROM department WHERE locationID = ?');
$query->bind_param('i', $locationID);
$query->execute();

$result = $query->get_result();

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";    
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$data = $result->fetch_assoc();

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output); 

?>
