let table = new DataTable('#example');
let exampleWrapper = document.getElementById("example_wrapper")
exampleWrapper.classList.add("overflow-auto")

let btnAdd = document.querySelector(".btn-add")
let addUpdateLayout = document.querySelector(".add-update-layout")
let xMark = document.querySelector(".fa-times")
let typeInput = document.querySelector(".typeInput")
let btnUpdate = document.querySelector(".update-btn")
let addUpdateTitle = document.querySelector(".add-update-layout .title")
let id = document.querySelector(".id")
let nameInput = document.querySelector(".name")

xMark.addEventListener("click", function() {
    addUpdateLayout.style.display = "none"
})

btnAdd.addEventListener("click", function() {
    openAddUpdateLayout("save", "", "")
})




function openAddUpdateLayout(type, employeeName, departmentID) {

    if (type == "save") {
        typeInput.value = "save"
        addUpdateTitle.innerHTML = "Save"

    } else {
        typeInput.value = "update"
        addUpdateTitle.innerHTML = "Update"
        nameInput.value = employeeName
        $('.department-select').val(departmentID);
        id.value = type

        $('.department-select').change(function() {
            var selectedDepartmentID = $(this).val();
            if (selectedDepartmentID) {
                var selectedDepartment = $(this).find(':selected').text();
                var locationInfo = "";

                $.ajax({
                    url: '../endpoint/getDepartments.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        $.each(data, function(index, department) {
                            if (department.DepartmentID == selectedDepartmentID) {
                                locationInfo = department.LocationAddress;
                            }
                        });
                        $('.location-info').val(locationInfo);
                    },
                    error: function(xhr) {
                        console.log(xhr)
                    }
                });
            } else {
                $('#location-info').html("");
            }
        });
    }
    addUpdateLayout.style.display = "block"
}


$(document).ready(function() {


    $.ajax({
        url: '/project3/endpoint/getDepartments.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $.each(data, function(index, department) {
                $('.department-select').append('<option value="' + department.DepartmentID + '">' + department.DepartmentName + '</option>');
            });
        },
        error: function(xhr) {
            console.log(xhr)
        }
    });

    $('.department-select').change(function() {
        var selectedDepartmentID = $(this).val();
        if (selectedDepartmentID) {
            var selectedDepartment = $(this).find(':selected').text();
            var locationInfo = "";

            $.ajax({
                url: '/project3/endpoint/getDepartments.php',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    $.each(data, function(index, department) {
                        if (department.DepartmentID == selectedDepartmentID) {
                            locationInfo = department.LocationAddress;
                        }
                    });
                    $('.location-info').val(locationInfo);
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        } else {
            $('#location-info').html("");
        }
    });
});