
/* get Clients */
var restRequest = (params) => {
    $.get('/clients/getClients').then( (res) => {
        params.success(res)
    });
};


var rowsOptionsClients = (value, row, index) => {
    return [`<div class="btn-group" role="group" aria-label="client options">
            <a href="/clients/details/${row.code}" class="btn btn-sm btn-outline-warning"><i class="fa-solid fa-person-walking-arrow-right"></i></a>
            </div>`].join('');
};


var openNow = (data) => {
    var check = data.open == 1 ? "Open" : "Close";
    var dialog = confirm(`${check} restaurant?`);
    if (dialog) {
        const cnfOp = { url: '/restaurants/open', params: data, type: 'put' };
        const openExe = execAjax(cnfOp);
        if(openExe.success == true) { 
            location.reload();
        }
    }
};

/* Events */
document.addEventListener('DOMContentLoaded', function () {

    /* buttons */
    const btnAddRestaurant = document.getElementById("btnAddRestaurant");
    const btnAddClient = document.getElementById("btnAddClient");
    let btnOpenNow = document.querySelectorAll(".open-check");

    // bootstrap-table
    const $table = $('#listClients');

    /* add Client */
    if(btnAddClient) btnAddClient.addEventListener("click", () => {
        cleanModal();

        // load Regions
        const cnfRg = { url: '/regions', params: '', type: 'get' };
        const listRegion = execAjax(cnfRg);

        var contenido = '<form id="formAddClient" class="row g-3">';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">id</label>';
        contenido += '        <input type="text" class="form-control" name="uid" id="uid">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">region</label>';
        contenido += '        <select class="form-select select2" aria-label="region client" name="idRegion" id="idRegion">';
        contenido += '            <option value="" disabled selected>Select...</option>';
        listRegion.map((region) => {
        contenido += `            <option value="${region.IdRegion}" data-reg="${JSON.stringify(region)}">${region.City} - ${region.State}</option>`;
        });
        contenido += '        </select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">access level</label>';
        contenido += '        <select class="form-select" aria-label="access client" name="accessLevel" id="accessLevel">';
        contenido += '            <option value="" disabled selected>Select...</option>';
        contenido += '            <option value="1">All</option>';
        contenido += '            <option value="2">Web</option>';
        contenido += '            <option value="3" selected>App</option>';
        contenido += '        </select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">user type</label>';
        contenido += '        <select class="form-select" aria-label="usertype client" name="userType" id="userType">';
        contenido += '            <option value="1" disabled selected>Admin</option>';
        contenido += '            <option value="2">Client</option>';
        contenido += '            <option value="3" selected>Customer</option>';
        contenido += '        </select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">first Name</label>';
        contenido += '        <input type="text" class="form-control" name="firstName" id="firstName">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">last Name</label>';
        contenido += '        <input type="text" class="form-control" name="lastName" id="lastName">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">email</label>';
        contenido += '        <input type="text" class="form-control" name="email" id="email">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">phone Number</label>';
        contenido += '        <input type="text" class="form-control" name="phoneNumber" id="phoneNumber">';
        contenido += '    </div>';
        contenido += '</form>';

        const cls = ["text-white"];
        document.querySelector('.modal-header').classList.add(...cls);
        document.querySelector('.modal-title').innerHTML = "add client";
        document.querySelector('.modal-body').innerHTML = contenido;

        // select2
        $('.select2').select2({ dropdownParent: $('#modalGral') });

        var myModal = new bootstrap.Modal(document.querySelector('.modal'), { keyboard: false, backdrop: "static" });
        myModal.show();

        // aceptar
        document.getElementById("btnAceptar").addEventListener("click", () => {
            $.ajax({
                url: "/clients/add",
                data: $("#formAddClient").serialize(),
                type: "post",
                beforeSend: () => { onOverlay(); },
                success: (e) => {
                    if(e.success == true){
                        myModal.hide();
                        $table.bootstrapTable('refresh');
                    } else {
                        offOverlay();
                        var notfound = '<div class="alert alert-warning" role="alert">';;
                        notfound += '    <h4 class="alert-heading">Alert!</h4>';
                        notfound += `    <p>${e.message}</p>`
                        notfound += '    <hr><p class="mb-0">check the data and try again</p>';
                        notfound += '</div>';
                        document.getElementById("formAddClient").innerHTML = notfound;
                        document.getElementById("btnAceptar").remove();
                    }
                }
            });
        });
    });


    /* add restaurant */
    if(btnAddRestaurant) btnAddRestaurant.addEventListener("click", () => {
        cleanModal();

        // load Regions
        const cnfRg = { url: '/regions', params: '', type: 'get' };
        const listRegion = execAjax(cnfRg);

        var contenido = '<form id="formAddRestaurant" class="row g-3">';
        contenido += `    <input type="hidden" name="uid" id="uid" value="${document.getElementById('uidl').value}">`;
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">Name</label>';
        contenido += '        <input type="text" class="form-control" name="name" id="name">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">open Now</label>';
        contenido += '        <select class="form-select" aria-label="region client" name="openNow" id="openNow">';
        contenido += '            <option value="1" selected>Si</option>';
        contenido += '            <option value="0">No</option>';
        contenido += '        </select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">Address</label>';
        contenido += '        <input type="text" class="form-control" name="address" id="address">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">Zone</label>';
        contenido += '        <input type="text" class="form-control" name="zone" id="zone">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">region</label>';
        contenido += '        <select class="form-select" aria-label="region client" name="region" id="region">';
        contenido += '            <option value="" disabled selected>Select...</option>';
        listRegion.map((region) => {
        contenido += `            <option value="${region.IdRegion}">${region.City} - ${region.State}</option>`;
        });
        contenido += '        </select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">location Map</label>';
        contenido += '        <div class="input-group">';
        contenido += '            <input type="text" class="form-control" name="locationMap" id="locationMap">';
        contenido += '            <a href="https://maps.google.com/" target="_blank" class="btn btn-outline-secondary" id="btnMaps"><i class="fa-solid fa-map-location-dot"></i></a>';
        contenido += '        </div>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">payment Method</label>';
        contenido += '        <select class="form-select form-control" multiple="multiple" aria-label="pay restaurant" name="paymentMethod[]" id="paymentMethod"></select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">service Options</label>';
        contenido += '        <select class="form-select form-control" multiple="multiple" aria-label="options restaurant" name="serviceOptions[]" id="serviceOptions"></select>';
        contenido += '    </div>';
        contenido += '</form>';

        const cls = ["text-white"];
        document.querySelector('.modal-header').classList.add(...cls);
        document.querySelector('.modal-dialog').classList.add("modal-lg");
        document.querySelector('.modal-title').innerHTML = "add restaurant";
        document.querySelector('.modal-body').innerHTML = contenido;

        // load Service Options
        $("#serviceOptions").select2({
            ajax: { url: '/serviceopt', dataType: 'json' },
            dropdownParent: $('#modalGral')
        });

        // load Payment
        $("#paymentMethod").select2({
            ajax: { url: '/paymethods', dataType: 'json' },
            dropdownParent: $('#modalGral')
        });

        // select2
        $('#region').select2({ dropdownParent: $('#modalGral') });

        var myModal = new bootstrap.Modal(document.querySelector('.modal'), { keyboard: false, backdrop: "static" });
        myModal.show();

        // aceptar
        document.getElementById("btnAceptar").addEventListener("click", () => {

            // validate
            if(document.getElementById("serviceOptions").value == ""){ alert("select serviceOptions"); return false; }
            if(document.getElementById("paymentMethod").value == ""){ alert("select paymentMethod"); return false; }

            $.ajax({
                url: "/restaurants/add",
                data: $("#formAddRestaurant").serialize(),
                type: "post",
                beforeSend: () => { onOverlay(); },
                success: (e) => {
                    if(e.success == true){
                        location.reload();
                    } else {
                        offOverlay();
                        var notfound = '<div class="alert alert-warning" role="alert">';;
                        notfound += '    <h4 class="alert-heading">Alert!</h4>';
                        notfound += `    <p>${e.message}</p>`
                        notfound += '    <hr><p class="mb-0">check the data and try again</p>';
                        notfound += '</div>';
                        document.getElementById("formAddRestaurant").innerHTML = notfound;
                        document.getElementById("btnAceptar").remove();
                    }
                }
            });
        });
    });


    /* open now change */
    if(btnOpenNow) {
        btnOpenNow.forEach((item) => {
        item.setAttribute("onclick", `openNow(${item.dataset.open})`);
      });
    }
});
