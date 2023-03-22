
/* Valida Campos de Formulario */
var validador = (dato) => {
    var elements = document.getElementById(dato.form).elements;
    var message = '';
    for (var i = 0, element; element = elements[i++];) {
        if(element.dataset.valida != undefined) {
            if (element.value === "" || element.value === null){
                message += `- ${element.dataset.valida}\n`;
                document.getElementById(element.id).classList.add('is-invalid');
                document.querySelector("label[for='" + element.id + "']").classList.add('text-danger');
            }
        }
    }
    if(message == ""){ return false; }
    message += '\n Por favor completar los campos mencionados.';
    return message;
};


/* Plantilla Modal */
var modaLGral = '<div class="modal fade" id="modalGral" role="dialog" tabindex="-1" aria-hidden="true" aria-labelledby="modalGral">';
    modaLGral += '    <div class="modal-dialog">';
    modaLGral += '        <div class="modal-content">';
    modaLGral += '            <div class="shadow"></div>';
    modaLGral += '            <div class="modal-header bg-secondary">';
    modaLGral += '                <h5 class="modal-title" id="mdlTitle"></h5>';
    modaLGral += '                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
    modaLGral += '            </div>';
    modaLGral += '            <div class="modal-body" id="mdlContent">';
    modaLGral += '            </div>';
    modaLGral += '            <div class="modal-footer" id="mdlFooter">';
    modaLGral += '                <button type="button" id="btnAceptar" class="btn btn-secondary">Aceptar</button>';
    modaLGral += '                <button type="button" id="btnCerrar" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>';
    modaLGral += '            </div>';
    modaLGral += '        </div>';
    modaLGral += '    </div>';
    modaLGral += '</div>';


var cleanModal = () => {
    var preModal = document.getElementById("preModal");
    if (preModal != null) { preModal.remove(); }

    var templateModal = document.createElement("div");
    templateModal.id = "preModal";
    templateModal.innerHTML = modaLGral;
    document.body.appendChild(templateModal);
};


var onOverlay = () => {
    document.querySelector('.shadow').classList.add("overlay");

    var shadow = '<div class="d-flex justify-content-center z-index-3">';
        shadow += '    <div class="spinner-border text-light" role="status">';
        shadow += '        <span class="visually-hidden">Loading...</span>';
        shadow += '    </div>';
        shadow += '</div>';

    document.querySelector('.overlay').innerHTML = shadow;

    $(".overlay").resize().each(function() {
        var h = $(this).parent().outerHeight();
        var w = $(this).parent().outerWidth();
        $(this).css("height", h);
        $(this).css("width", w);
    });
};


var offOverlay = () => {
    document.querySelector('.shadow').innerHTML = "";
    document.querySelector('.shadow').removeAttribute("style");
    document.querySelector('.shadow').classList.remove("overlay");
};


var execAjax = (config) => {
    var retorno = "";
    $.ajax({
        url: config.url,
        data: config.params,
        type: config.type,
        async: false,
        beforeSend: function(){
            // Ejecuta Loader
        },
        success: function(e){
            retorno = e;
            if(config.parse != undefined && config.parse == true){ retorno = JSON.parse(e); }
        }
    });

    return retorno;
};


/* window load */
window.addEventListener('DOMContentLoaded', event => {    
    // Toggle the sidebar
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});


/* Eventos */
document.addEventListener('DOMContentLoaded', function () {
});
