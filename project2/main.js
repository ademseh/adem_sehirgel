var departments = ""
var locations = ""

var filteredDepartment = ""
var filteredLocation = ""

var activeTable = ""

var deleteType = {
    personnel: "personnel",
    department: "department",
    location: "location"
}


init()


function init() {
    activeTable = "personnel"
    refreshAlldatas()
}

function initDeleteButtons(){
    initializePersonnelDeleteButtons()
    initializeDepartmentlDeleteButtons()
    initializeLocationDeleteButtons()
}

$("#refreshBtn").click(function() {
    if(activeTable == "personnel"){
        getPersonnels()
    } else if (activeTable == "department") {
        getDepartments()
    } else {
        getLocations()
    }
    //refreshAlldatas()
});
$("#filterModalForm").submit(function(event) {
    event.preventDefault();

    filteredDepartment = $("#filterModal #filterDepartment").val()
    filteredLocation = $("#filterModal #filterLocation").val()

    if(activeTable == "personnel"){
        getPersonnels()
    } else if (activeTable == "department") {
        getDepartments()
    }

})
/*
$("#filterModal #filter-btn").on("click", function(event) {
    filteredDepartment = $("#filterModal #filterDepartment").val()
    filteredLocation = $("#filterModal #filterLocation").val()

    if(activeTable == "personnel"){
        getPersonnels()
    } else if (activeTable == "department") {
        getDepartments()
    }
});
*/

$("#filterModal #reset-filter-btn").on("click", function(event) {
    resetFilter()

});

function resetFilter(){
    filteredDepartment = ""
    filteredLocation = ""

    if(activeTable == "personnel"){
        getPersonnels()
    } else if (activeTable == "department") {
        getDepartments()
    }
}

$("#filterBtn").click(function() {
    $("#filterModal").modal('show');

    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location

});



$("#addBtn").click(function() {

    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    if ($("#personnelBtn").hasClass("active")) {
        activeTable = "personnel"

        clearAddModal();
        // Refresh personnel table
        $("#addPersonnelModal").modal('show');
    } else {

        if ($("#departmentsBtn").hasClass("active")) {
            activeTable = "department"

            $("#addDepartmentModal").modal('show');
        } else {
            activeTable = "location"

            $("#addLocationModal").modal('show');

        }

    }
});

$("#personnelBtn").click(function() {

    // Call function to refresh personnel table
    activeTable = "personnel";
    $("#filterBtn").css("display", "block")
    resetFilter()
});

$("#departmentsBtn").click(function() {

    // Call function to refresh department table
    activeTable = "department";
    $("#filterBtn").css("display", "block")
    $("#department-form").css("display", "none")
    resetFilter()

});

$("#locationsBtn").click(function() {

    // Call function to refresh location table
    activeTable = "location";
    $("#filterBtn").css("display", "none")
    resetFilter()
});

//PERSONNEL
$("#editPersonnelModal").on("show.bs.modal", function(e) {

    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            // Retrieve the data-id attribute from the calling button
            // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
            // for the non-jQuery JavaScript alternative
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {

                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted

                $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

                $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
                $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
                $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
                $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

                $("#editPersonnelDepartment").html("");

                $.each(result.data.department, function() {
                    if (this.name != null) {
                        $("#editPersonnelDepartment").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    }
                });

                $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

            } else {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        }
    });
});

$("#addPersonnelModal").on("show.bs.modal", function(e) {
    $.each(departments, function() {
        if (this.name != null) {
            $("#addPersonnelDepartment").append(
                $("<option>", {
                    value: this.id,
                    text: this.name
                })
            );
        }

    });
})

$("#editPersonnelForm").submit(function(event) {

    event.preventDefault();

    var formData = {
        id: $("#editPersonnelEmployeeID").val(),
        firstName: $("#editPersonnelFirstName").val(),
        lastName: $("#editPersonnelLastName").val(),
        jobTitle: $("#editPersonnelJobTitle").val(),
        email: $("#editPersonnelEmailAddress").val(),
        departmentID: $("#editPersonnelDepartment").val()
    };

    $.ajax({
        type: "POST",
        url: "libs/php/updateEmployeeByID.php",
        data: formData,
        dataType: "json",
        encode: true,
        success: function(data) {
            refreshAlldatas()
            $('#editPersonnelModal').modal('hide');

            showWarningModal("WARNING", "Successfully Edited.")
        },
        error: function(error) {
            console.error('Error:', error);
            alert("Error adding employee");
        }
    });
});

$("#addPersonnelForm").submit(function(event) {

    event.preventDefault();

    var formData = {
        firstName: $("#addPersonnelFirstName").val(),
        lastName: $("#addPersonnelLastName").val(),
        jobTitle: $("#addPersonnelJobTitle").val(),
        email: $("#addPersonnelEmailAddress").val(),
        departmentID: $("#addPersonnelDepartment").val()
    };

    $.ajax({
        type: "POST",
        url: "libs/php/insertEmployee.php",
        data: formData,
        dataType: "json",
        encode: true,
        success: function(data) {
 
            $('#addPersonnelModal').modal('hide');

            refreshAlldatas()
        },
        error: function(error) {
            console.error('Error:', error);
            alert("Error adding employee");
        }
    });
});

//DEPARTMENT
$("#addDepartmentModal").on("show.bs.modal", function(e) {
    $("#addDepartmentLocation").empty(); // Clear existing options
    $.each(locations, function() {
        if (this.name != null) {
            $("#addDepartmentLocation").append(
                $("<option>", {
                    value: this.id,
                    text: this.name
                })
            );
        }
    });
})

$("#editDepartmentModal").on("show.bs.modal", function(e) {

    $.ajax({
        url: "libs/php/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            // Retrieve the data-id attribute from the calling button
            // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
            // for the non-jQuery JavaScript alternative
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function(result) {
            var resultCode = result.status.code;
        
            if (resultCode == 200) {

                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted
                $("#editDepartmentID").val(result.data[0].id);

                $("#editDepartmentName").val(result.data[0].name);


                $("#editPersonnelDepartment").html("");

                $.each(locations, function() {
                    $("#editDepartmentLocation").append(
                        $("<option>", {
                            value: this.id,
                            text: this.name
                        })
                    );
                });

                $("#editDepartmentLocation").empty(); // Clear existing options
                $.each(locations, function() {
                    if (this.name != null) {
                        $("#editDepartmentLocation").append(
                            $("<option>", {
                                value: this.id,
                                text: this.name
                            })
                        );
                    }
                });

                $("#editDepartmentLocation").val(result.data[0].locationID);

            } else {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        }
    });
});

$("#addDepartmentModal").on("show.bs.modal", function(e) {
    $("#addDepartmentLocation").empty(); // Clear existing options

    $.each(locations, function() {
        $("#addDepartmentLocation").append(
            $("<option>", {
                value: this.id,
                text: this.name
            })
        );
    });
})

$("#addDepartmentForm").submit(function(event) {

    event.preventDefault();

    var formData = {
        name: $("#addDepartmentName").val(),
        locationID: $("#addDepartmentLocation").val()
    };

    $.ajax({
        type: "POST",
        url: "libs/php/insertDepartment.php",
        data: formData,
        dataType: "json",
        encode: true,
        success: function(data) {
            $('#addDepartmentModal').modal('hide');

            refreshAlldatas()
        },
        error: function(error) {
            console.error('Error:', error);
            alert("Error adding employee");
        }
    });
});

$("#editDepartmentForm").submit(function(event) {

    event.preventDefault();

    var formData = {
        id: $("#editDepartmentID").val(),
        name: $("#editDepartmentName").val(),
        locationID: $("#editDepartmentLocation").val(),
    };

    $.ajax({
        type: "POST",
        url: "libs/php/updateDepartmentByID.php",
        data: formData,
        dataType: "json",
        encode: true,
        success: function(data) {
          
            //alert("Employee Updated successfully");
            refreshAlldatas()
            $('#editDepartmentModal').modal('hide');
            showWarningModal("WARNING", "Successfully Edited.")

        },
        error: function(error) {
            console.error('Error:', error);
            alert("Error adding employee");
        }
    });
})

//Location
$("#addLocationForm").submit(function(event) {
    event.preventDefault();

    var formData = {
        name: $("#addLocationName").val(),
    };

    $.ajax({
        type: "POST",
        url: "libs/php/insertLocation.php",
        data: formData,
        dataType: "json",
        encode: true,
        success: function(data) {
            $('#addLocationModal').modal('hide');
            refreshAlldatas();
        },
        error: function(error) {
            console.error('Error:', error);
            alert("Error adding location");
        }
    });
});

$("#editLocationModal").on("show.bs.modal", function(e) {
    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id")
        },
        success: function(result) {
            var resultCode = result.status.code;
            if (resultCode == 200) {
                $("#editLocationID").val(result.data[0].id);
                $("#editLocationName").val(result.data[0].name);
            } else {
                $("#editLocationModal .modal-title").text("Error retrieving data");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editLocationModal .modal-title").text("Error retrieving data");
        }
    });
});

$("#editLocationForm").submit(function(event) {
    event.preventDefault();

    var formData = {
        id: $("#editLocationID").val(),
        name: $("#editLocationName").val(),
    };

    $.ajax({
        type: "POST",
        url: "libs/php/updateLocationByID.php",
        data: formData,
        dataType: "json",
        encode: true,
        success: function(data) {
            $('#editLocationModal').modal('hide');
            refreshAlldatas();
            showWarningModal("WARNING", "Successfully Edited.")

        },
        error: function(error) {
            console.error('Error:', error);
            alert("Error updating location");
        }
    });
});

//DETECTING changes on input
$('#searchInp').on('input', function() {

    if($(this).val() == ""){
        refreshAlldatas();
    } else {
        $.ajax({
            type: "POST",
            url: "libs/php/searchAll.php",
            data: {
                txt: $(this).val()
            },
            dataType: "json",
            encode: true,
            success: function(res) {
    
                if (res.status.code == "200") {
                    let datas = res.data.found
                    updateView(datas)
                }
            },
            error: function(error) {
                console.error('Error:', error);
                alert("Error updating location");
            }
        });
    }
    
});


function getPersonnels() {
    $("#personnelTableBody").children("tr").remove()
    $.ajax({
        url: "libs/php/getAll.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                var datas = result.data
                datas.forEach(element => {

                    if ((filteredLocation === "" || element.location === filteredLocation) && 
                    (filteredDepartment === "" || element.department === filteredDepartment)) {
            
                        $("#personnelTableBody").append(
                            '<tr>' +
                            '<td class="align-middle text-nowrap">' +
                            element.lastName + ", " + element.firstName + '</td>' +
                            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
                            element.department + '</td>' +
                            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
                            element.location + '</td>' +
                            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
                            element.email + '</td>' +
                            '<td class="text-end text-nowrap">' +
                            '<button type="button" class="btn btn-primary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + element.id + '">' +
                            '<i class="fa-solid fa-pencil fa-fw"></i>' +
                            '</button>' +
                            '<button type="button" class="btn btn-primary btn-sm delete-personnel-btn m-1" data-name="'+ element.lastName + ' ' + element.firstName +'" data-id="' + element.id + '">' +
                            '<i class="fa-solid fa-trash fa-fw"></i>' +
                            '</button>' +
                            '</td>' +
                            '</tr>'
                        )
                    
                    }


                    

                });
                initializePersonnelDeleteButtons()
            } else {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        }
    });
}

function getDepartments() {
    $("#departmentTableBody").children("tr").remove()

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                let datas = result.data
                departments = datas
                $("#filterModal #filterDepartment").children("option").remove();
                $("#filterModal #filterLocation").children("option").remove();

                $("#filterModal #filterDepartment").append(
                    $("<option>", {
                        value: "",
                        text: "Select Department"
                    })
                );

                $("#filterModal #filterLocation").append(
                    $("<option>", {
                        value: "",
                        text: "Select Location"
                    })
                );

                datas.forEach(element => {
                    if (filteredLocation === "" || element.location_name === filteredLocation && element.name != null) {
                     

                            $("#filterModal #filterDepartment").append(
                                $("<option>", {
                                    value: element.name,
                                    text: element.name
                                })
                            );
    
                            $("#filterModal #filterLocation").append(
                                $("<option>", {
                                    value: element.location_name,
                                    text: element.location_name
                                })
                            );
    
                          
    
                            $("#departmentTableBody").append(
                                '<tr>' +
                                '<td class="align-middle text-nowrap">' +
                                element.name +
                                '</td>' +
                                '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
                                element.location_name + '</td>' +
                                '<td class="align-middle text-end text-nowrap">' +
                                '<button type="button" class="btn btn-primary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + element.id + '">' +
                                '<i class="fa-solid fa-pencil fa-fw"></i>' +
                                '</button>' +
                                '<button type="button" class="btn btn-primary btn-sm delete-department-btn m-1" data-name="'+ element.name +'" data-id="' + element.id + '">' +
                                '<i class="fa-solid fa-trash fa-fw"></i>' +
                                '</button>' +
                                '</td>' +
                                '</tr>'
    
                            )
                        
                    }
                    

                });
                initializeDepartmentlDeleteButtons()

            } else {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
            $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        }
    });
}

function getLocations() {
    locations = ""
    $("#locationTableBody").children("tr").remove()
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                let datas = result.data
                locations = datas

                datas.forEach(element => {
                    $("#locationTableBody").append(
                        '<tr>' +
                        '<td class="align-middle text-nowrap">' +
                        element.name +
                        '</td>' +
                        ' <td class="align-middle text-end text-nowrap">' +
                        ' <button type="button" class="btn btn-primary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + element.id + '">' +
                        '<i class="fa-solid fa-pencil fa-fw"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-primary btn-sm delete-location-btn m-1" data-name="'+ element.name +'" data-id="' + element.id + '">' +
                        '<i class="fa-solid fa-trash fa-fw"></i>' +
                        '</button>' +
                        '</td>' +
                        '</tr>'

                    )
                });

                initializeLocationDeleteButtons()

            } else {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
            $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        }
    });
}

function updateView(datas) {
    $("#personnelTableBody").children("tr").remove()
    $("#departmentTableBody").children("tr").remove()
    $("#locationTableBody").children("tr").remove()

    datas.forEach(element => {
        
        //Personnel
        $("#personnelTableBody").append(

            '<tr>' +
            '<td class="align-middle text-nowrap">' +
            element.lastName + ", " + element.firstName + '</td>' +
            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
            element.departmentName + '</td>' +
            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
            element.locationName + '</td>' +
            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
            element.email + '</td>' +
            '<td class="text-end text-nowrap">' +
            '<button type="button" class="btn btn-primary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + element.id + '">' +
            '<i class="fa-solid fa-pencil fa-fw"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-primary btn-sm delete-personnel-btn m-1" data-name="' + element.lastName + ", " + element.firstName + '" data-id="' + element.id + '">' +
            '<i class="fa-solid fa-trash fa-fw"></i>' +
            '</button>' +
            '</td>' +

            '</tr>'
        )

        //Department
        $("#departmentTableBody").append(
            '<tr>' +
            '<td class="align-middle text-nowrap">' +
            element.departmentName +
            '</td>' +
            '<td class="align-middle text-nowrap d-none d-md-table-cell">' +
            element.locationName + '</td>' +
            '<td class="align-middle text-end text-nowrap">' +
            '<button type="button" class="btn btn-primary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + element.departmentID + '">' +
            '<i class="fa-solid fa-pencil fa-fw"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-primary btn-sm delete-department-btn m-1" data-name="'+ element.departmentName +'" data-id="' + element.departmentID + '">' +
            '<i class="fa-solid fa-trash fa-fw"></i>' +
            '</button>' +
            '</td>' +
            '</tr>'
        )

        //Location
        $("#locationTableBody").append(
            '<tr>' +
            '<td class="align-middle text-nowrap">' +
            element.locationName +
            '</td>' +
            ' <td class="align-middle text-end text-nowrap">' +
            ' <button type="button" class="btn btn-primary btn-sm m-1" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + element.locationID + '">' +
            '<i class="fa-solid fa-pencil fa-fw"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-primary btn-sm delete-location-btn m-1" data-name="' + element.locationName + '" data-id="' + element.locationID + '">' +
            '<i class="fa-solid fa-trash fa-fw"></i>' +
            '</button>' +
            '</td>' +
            '</tr>'

        )
    });

    initDeleteButtons()

}

function refreshAlldatas() {
    getPersonnels()
    getDepartments()
    getLocations()
}

function clearEditModal() {
    $("#editPersonnelEmployeeID").val("");
    $("#editPersonnelFirstName").val("");
    $("#editPersonnelLastName").val("");
    $("#editPersonnelJobTitle").val("");
    $("#editPersonnelEmailAddress").val("");
    $("#editPersonnelDepartment").html("");
}

function clearAddModal() {
    $("#addPersonnelEmployeeID").val("");
    $("#addPersonnelFirstName").val("");
    $("#addPersonnelLastName").val("");
    $("#addPersonnelJobTitle").val("");
    $("#addPersonnelEmailAddress").val("");
    $("#addPersonnelDepartment").html("");
}

function initializePersonnelDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-personnel-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const personnelId = parseInt(button.getAttribute('data-id'));
            const btnName = button.getAttribute("data-name")
            showDeleteModal("WARNING!!!", "Are you sure to delete Personnel: " + btnName, deleteType.personnel, personnelId)


            /*
            let formData = {
                id: personnelId
            }

            $.ajax({
                type: "POST",
                url: "libs/php/deleteEmployeeByID.php",
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                    // Successfuly delete
                    showWarningModal("WARNING", "Successfully Delete")
                    refreshAlldatas()
                },
                error: function(error) {
                    console.error('Error:', error);
                    // Delete throws error
                    alert("Error adding employee");
                }
            });
            */
        });
    });
}

function initializeDepartmentlDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-department-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const departmentId = parseInt(button.getAttribute('data-id'));
            const btnName = button.getAttribute("data-name")
            showDeleteModal("WARNING!!!", "Are you sure to delete Department: " + btnName, deleteType.department, departmentId)

            /*
            let formData = {
                id: parseInt(departmentId)
            }

            $.ajax({
                type: "POST",
                url: "libs/php/checkIfDepartmentExists.php?departmentID=" + departmentId,
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                    // Successfuly delete
                    let countOfPersonnel = data.data.personnel_count
                    if(countOfPersonnel == 0){
                        $.ajax({
                            type: "POST",
                            url: "libs/php/deleteDepartmentByID.php",
                            data: formData,
                            dataType: "json",
                            encode: true,
                            success: function(data) {
                                // Successfuly delete
                                refreshAlldatas()
                                showWarningModal("WARNING", "Successfull Deleted!!!")

                            },
                            error: function(error) {
                                console.error('Error:', error);
                                // Delete throws error
                                alert("Error adding employee");
                            }
                        });
                    } else {
                        showWarningModal("WARNING", "Exists Personnel with Department count: " + countOfPersonnel)
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                    // Delete throws error
                    alert("Error adding employee");
                }
            });
            */
        });
    });
}

function initializeLocationDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-location-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const locationID = parseInt(button.getAttribute('data-id'));
            const btnName = button.getAttribute("data-name")
            

            showDeleteModal("WARNING!!!", "Are you sure to delete Location: " + btnName, deleteType.location, locationID)
            /*
            let formData = {
                id: parseInt(locationID)
            }

            $.ajax({
                type: "POST",
                url: "libs/php/checkIfLocationExists.php?locationID=" + locationID,
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                    console.log(data)
                    // Successfuly delete
                    let countOfDepartment = data.data.department_count
                    if(countOfDepartment == 0){
                        $.ajax({
                            type: "POST",
                            url: "libs/php/deleteLocationByID.php",
                            data: formData,
                            dataType: "json",
                            encode: true,
                            success: function(data) {
                                // Successfuly delete
                                refreshAlldatas()
                                showWarningModal("WARNING", "Successfull Deleted!!!")

                            },
                            error: function(error) {
                                console.error('Error:', error);
                                // Delete throws error
                                alert("Error adding employee");
                            }
                        });
                    } else {
                        showWarningModal("WARNING", "Exists Department with Location count: " + countOfDepartment)
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                    // Delete throws error
                    alert("Error adding employee");
                }
            });
            */
        });
    });
}

// WARNING MODAL
function showWarningModal(title, message){
    $("#warningModal").modal('show');
    $('#warningModal .modal-title').html(title)
    $('#warningModal .modal-message').html(message)
}

// DELETE MODAL
function showDeleteModal(title, message, delType, deleteID){
    $("#deleteModal").modal('show');
    $('#deleteModal .modal-title').html(title)
    $('#deleteModal .modal-message').html(message)

    document.getElementById("deleteModalBTN").addEventListener("click", function(){
        if(delType == deleteType.personnel){
            //Personnel
            let formData = {
                id: deleteID
            }

            $.ajax({
                type: "POST",
                url: "libs/php/deleteEmployeeByID.php",
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                    // Successfuly delete
                    showWarningModal("WARNING", "Successfully Delete")
                    refreshAlldatas()
                    $("#deleteModal").modal('hide');
                },
                error: function(error) {
                    console.error('Error:', error);
                    // Delete throws error
                    alert("Error while delete employee");
                }
            });
        } else if (delType == deleteType.department){
            //Department

            let formData = {
                id: parseInt(deleteID)
            }

            $.ajax({
                type: "POST",
                url: "libs/php/checkIfDepartmentExists.php?departmentID=" + deleteID,
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                    // Successfuly delete
                    let countOfPersonnel = data.data.personnel_count
                    if(countOfPersonnel == 0){
                        $.ajax({
                            type: "POST",
                            url: "libs/php/deleteDepartmentByID.php",
                            data: formData,
                            dataType: "json",
                            encode: true,
                            success: function(data) {
                                // Successfuly delete
                                $("#deleteModal").modal('hide');
                                refreshAlldatas()
                                showWarningModal("WARNING", "Successfull Deleted!!!")

                            },
                            error: function(error) {
                                console.error('Error:', error);
                                // Delete throws error
                                alert("Error adding employee");
                            }
                        });
                    } else {
                        showWarningModal("WARNING", "Exists Personnel with Department count: " + countOfPersonnel)
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                    // Delete throws error
                    alert("Error adding employee");
                }
            });
        } else {
            //Location
            let formData = {
                id: parseInt(deleteID)
            }

            $.ajax({
                type: "POST",
                url: "libs/php/checkIfLocationExists.php?locationID=" + deleteID,
                data: formData,
                dataType: "json",
                encode: true,
                success: function(data) {
                  
                    // Successfuly delete
                    let countOfDepartment = data.data.department_count
                    if(countOfDepartment == 0){
                        $.ajax({
                            type: "POST",
                            url: "libs/php/deleteLocationByID.php",
                            data: formData,
                            dataType: "json",
                            encode: true,
                            success: function(data) {
                                // Successfuly delete
                                refreshAlldatas()
                                showWarningModal("WARNING", "Successfull Deleted!!!")
                                $("#deleteModal").modal('hide');
                            },
                            error: function(error) {
                                console.error('Error:', error);
                                // Delete throws error
                                alert("Error adding employee");
                            }
                        });
                    } else {
                        showWarningModal("WARNING", "Exists Department with Location count: " + countOfDepartment)
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                    // Delete throws error
                    alert("Error adding employee");
                }
            });
        }
        

    })
}


