/* get Restaurants */
var restRequest = (params) => {
    $.get('/restaurants/getCurrent').then( (res) => {
        params.success(res)
    });
};


var rowsOptionsRestaurant = (value, row, index) => {
    return [`<div class="btn-group" role="group" aria-label="restaurant_options">
            <a href="/restaurants/details/${row.code}" class="btn btn-sm btn-outline-info"><i class="fa-solid fa-shop"></i></a>
            </div>`].join('');
};

var deleteContent = (id) => {
    const cnfDc = { url: '/restaurants/content', params: {id}, type: 'delete' };
    const delContent = execAjax(cnfDc);
    if(delContent.success == true) { 
        const rowId = document.querySelector(`#c_${id}`);
        const row = rowId.parentNode.parentNode;
        row.remove();
    }
};

/* Events */
document.addEventListener('DOMContentLoaded', function () {

    /* buttons */
    const btnAddMenu = document.getElementById("btnAddMenu");

    // bootstrap-table
    const $table = $('#listRestaurants');

    // Asignar - Editar Servicio
    window.menuEvents = {
        'click .menuContent': (e, value, row, index) => {
            cleanModal();
            var cont = 1;

            // list Tags
            const cnfTg = { url: '/restaurants/tags', params: '', type: 'get' };
            const Tags = execAjax(cnfTg);

            // list Content
            const dataFil = {idMenu: row.IdMenu};
            const cnfCt = { url: '/restaurants/menuContent', params: dataFil, type: 'get' };
            const Content = execAjax(cnfCt);

            var contenido = '<form id="formAddMenuContent" class="row g-3">';
            contenido += '    <input type="hidden" name="idMenu" id="idMenu">';
            contenido += '    <div class="col-4">';
            contenido += '        <label for="field" class="form-label">Tag</label>';
            contenido += '        <select class="form-select" aria-label="Field select" name="idTag" id="idTag">';
            contenido += '            <option value="" disabled selected>Select...</option>';
            Tags.data.map((tag) => {
            contenido += `            <option value="${tag.idTag}">${tag.tag}</option>`;
            });
            contenido += '        </select>';
            contenido += '    </div>';
            contenido += '    <div class="col-6">';
            contenido += '        <label for="field" class="form-label">Observations</label>';
            contenido += '        <input type="text" class="form-control" name="observations" id="observations">';
            contenido += '    </div>';
            contenido += '    <div class="col-1">';
            contenido += '        <label for="field" class="form-label">&nbsp;</label>';
            contenido += '        <button type="button" class="btn btn-success" id="btnAddContent"><i class="fa-solid fa-plus"></i></button>';
            contenido += '    </div>';
            contenido += '</form>';
            contenido += '<div class="col-12 mt-3">';
            contenido += '    <table class="table table-border" id="tableContents">';
            Content.data.map((item) => {
            contenido += '        <tr>';
            contenido += `            <td>${cont}</td>`;
            contenido += `            <td>${item.Tag}</td>`;
            contenido += `            <td>${item.Observations}</td>`;
            contenido += `            <td><i class="fa-regular text-danger fa-square-minus" id="c_${item.Id}" onclick="deleteContent(${item.Id});" style="cursor:pointer;"></i></td>`;
            contenido += '        </tr>';
            cont = cont + 1;
            });
            contenido += '    </table>';
            contenido += '</div>';

            const cls = ["text-white"];
            document.querySelector('.modal-header').classList.add(...cls);
            document.querySelector('.modal-title').innerHTML = "Menu Content";
            document.querySelector('.modal-body').innerHTML = contenido;
            document.getElementById("btnAceptar").remove();

            var myModal = new bootstrap.Modal(document.querySelector('.modal'), { keyboard: false, backdrop: "static" });
            myModal.show();

            // aceptar
            document.getElementById("btnAddContent").addEventListener("click", () => {
                document.getElementById("idMenu").value = row.IdMenu;

                $.ajax({
                    url: "/restaurants/addContent",
                    data: $("#formAddMenuContent").serialize(),
                    type: "post",
                    beforeSend: () => { onOverlay(); },
                    success: (e) => {
                        offOverlay();

                        if(e.success == true){
                            myModal.hide();

                        } else {
                            offOverlay();
                            var notfound = '<div class="alert alert-warning" role="alert">';;
                            notfound += '    <h4 class="alert-heading">Alert!</h4>';
                            notfound += `    <p>${e.message}</p>`
                            notfound += '    <hr><p class="mb-0">check the data and try again</p>';
                            notfound += '</div>';
                            document.getElementById("formAddMenuContent").innerHTML = notfound;
                        }
                    }
                });
            });
        }
    };

    /* add Menu */
    if(btnAddMenu) btnAddMenu.addEventListener("click", () => {
        cleanModal();

        // load Regions
        const cnfCt = { url: '/categories', params: '', type: 'get' };
        const listCateg = execAjax(cnfCt);

        var contenido = '<form id="formAddMenu" class="row g-3">';
        contenido += `    <input type="hidden" class="form-control" name="idRestaurant" id="idRestaurant" value="${document.getElementById('uidl').value}">`;
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">name</label>';
        contenido += '        <input type="text" class="form-control" name="name" id="name">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">Category</label>';
        contenido += '        <select class="form-select" aria-label="category menu" name="idCategory" id="idCategory">';
        contenido += '            <option value="" disabled selected>Select...</option>';
        listCateg.results.map((categ) => {
        contenido += `            <option value="${categ.id}">${categ.text}</option>`;
        });
        contenido += '        </select>';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">price</label>';
        contenido += '        <input type="text" class="form-control" name="price" id="price">';
        contenido += '    </div>';
        contenido += '    <div class="col-6">';
        contenido += '        <label for="field" class="form-label">observations</label>';
        contenido += '        <input type="text" class="form-control" name="observations" id="observations">';
        contenido += '    </div>';
        contenido += '</form>';

        const cls = ["text-white"];
        document.querySelector('.modal-header').classList.add(...cls);
        document.querySelector('.modal-title').innerHTML = "add menu";
        document.querySelector('.modal-body').innerHTML = contenido;

        var myModal = new bootstrap.Modal(document.querySelector('.modal'), { keyboard: false, backdrop: "static" });
        myModal.show();

        // aceptar
        document.getElementById("btnAceptar").addEventListener("click", () => {
            $.ajax({
                url: "/restaurants/addMenu",
                data: $("#formAddMenu").serialize(),
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
                        document.getElementById("formAddMenu").innerHTML = notfound;
                        document.getElementById("btnAceptar").remove();
                    }
                }
            });
        });
    });

});
