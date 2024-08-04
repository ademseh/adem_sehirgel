
<?php
header("Location: /project3");
include "database/db.php";

if(
    isset($_GET["type"]) &&
    $_GET["type"] == "save"
){
    $name = $_GET["name"];
    $departmanID = $_GET["departmanID"];

    try {
        $sql = "INSERT INTO employees (name, departmentID)
        VALUES ('$name', '$departmanID')";
        // use exec() because no results are returned
        $conn->exec($sql);
        //echo "New record created successfully";
    } catch(PDOException $e){
        echo $e->getMessage();
    }

} else if(
    isset($_GET["type"]) &&
    $_GET["type"] == "update"
    ){

    $id = $_GET["id"];
    $name = $_GET["name"];
    $departmanID = $_GET["departmanID"];

    $sql = "UPDATE employees SET name='$name', departmentID='$departmanID' WHERE id=$id";

    // Prepare statement
    $stmt = $conn->prepare($sql);
      
    // execute the query
    $stmt->execute();
    
    // echo a message to say the UPDATE succeeded
    //echo $stmt->rowCount() . " records UPDATED successfully";

} else if (isset($_GET["delete"])){
    $id = $_GET["delete"];
    $sql = "DELETE FROM employees WHERE id=$id";

    // use exec() because no results are returned
    $conn->exec($sql);
    //echo "Record deleted successfully";
}


$sql = "
SELECT 
    e.id AS EmployeeID,
    e.name AS EmployeeName,
    d.id AS DepartmentID,
    d.name AS DepartmentName,
    l.id AS LocationID,
    l.address AS LocationAddress
FROM 
    employees e
LEFT JOIN 
    departments d ON e.departmentID = d.id
LEFT JOIN 
    locations l ON d.locationID = l.id
";

$sqlDepartments = "
SELECT 
    d.id AS DepartmentID,
    d.name AS DepartmentName,
    d.locationID AS DepartmentLocationID,
    l.id AS LocationID,
    l.address AS LocationAddress
FROM 
    departments d
RIGHT JOIN 
    locations l ON d.locationID = l.id;
";


try {
    //Employee
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $resultsEmployee = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Departments
    $stmt = $conn->prepare($sqlDepartments);
    $stmt->execute();

    $resultsDepartments = $stmt->fetchAll(PDO::FETCH_ASSOC);

   // print_r($resultsDepartments);
} catch (PDOException $e) {
    echo 'Query failed: ' . $e->getMessage();
}



?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="lib/bootstrap-5.3-2.3-dist/css/bootstrap.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="lib/fontawesome-free-5.15-2.4-web/css/all.min.css">

    <!-- Datatable -->
    <link rel="stylesheet" href="lib/datatable/dataTables.dataTables.min.css">

    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>

    <!-- ADD/UPDATE Layout -->
    <div class="add-update-layout">
        <i class="fas fa-times position-fixed top-0 end-0"></i>

        <div class="form-layout m-4">
            <h1 class="title">Add / Update</h1>


            <form action="#">


                <label for="name" class="form-label">Employee Name</label>
                <input type="text" name="name" id="name" class="form-control name">
                <input type="text" class="d-none typeInput" name="type" value="">
                <input type="text" class="d-none id" name="id" value="">

                <label for="company" class="form-label  mt-3">Department</label>
                <select id="company" name="departmanID" class="form-select department-select" aria-label="Default select example">
                    <option selected>Select a Department</option>
                </select>

                <label for="location-info" class="form-label  mt-3">Address</label>
                <input type="text" id="location-info" class="form-control location-info" readonly>


                <button class="btn btn-success mt-3">Save</button>

            </form>

        </div>
    </div>

    <!-- NAV -->
    <nav class="navbar navbar-inverse navbar-fixed-top bg-light">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="dashboard.html">Company Directory</a>
            </div>

        </div>
    </nav>


    <!-- Search BAR / Section-1 
    <div class="section-1 container d-flex justify-content-center p-2">
        <div class="input-group w-100">
            <div class="form-outline flex-grow-1" data-mdb-input-init>
                <input type="search" placeholder="Search" id="form1" class="form-control w-100" />
            </div>
            <button type="button" class="btn btn-primary" data-mdb-ripple-init>
                <i class="fas fa-search"></i>
            </button>
        </div>


    </div>
    -->


    <!-- Section-2 -->
    <div class="container section-2 mt-4">
        <button class="btn btn-success btn-add w-100">Add</button>
    </div>

    <!-- Section-3 --->
    <div class="container section-3 mt-3">
        <h3>Employees</h3>

        <table id="example" class="display overflow-auto" style="width:100%">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                
                <?php
                        foreach ($resultsEmployee as $row) { ?>
              
                            <tr>
                                <td><?= $row['EmployeeID'] ?></td>
                                <td><?= $row['EmployeeName'] ?></td>
                                <td><?= $row['DepartmentName'] ?></td>
                                <td><?= $row['LocationAddress'] ?></td>
                                <td>
                                    <button id="<?= $row['EmployeeID'] ?>" onclick="openAddUpdateLayout(this.id, '<?= $row['EmployeeName'] ?>', '<?= $row['DepartmentID'] ?>')" class="btn btn-success update-btn">Update</button>
                                    <a href="?delete=<?= $row['EmployeeID'] ?>" class="btn btn-danger">Delete</a>
                                </td>

                            </tr>

                <?php } ?>
            </tbody>
        </table>
    </div>





    <script src="lib/jquery-3.7.1.min.js"></script>
    <script src="lib/bootstrap-5.3-2.3-dist/js/bootstrap.bundle.min.js"></script>

    <script src="lib/datatable/dataTables.min.js"></script>

    <script src="assets/js/main.js"></script>
</body>

</html>