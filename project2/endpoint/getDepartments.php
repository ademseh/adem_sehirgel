<?php
include "../database/db.php";

try {
    
    $sql = "SELECT d.id AS DepartmentID, d.name AS DepartmentName, l.id AS LocationID, l.address AS LocationAddress
            FROM departments d
            RIGHT JOIN locations l ON d.locationID = l.id";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}
?>
