// ==========================================
// 1. MENÚ LATERAL (RESPONSIVE)
// ==========================================
document.getElementById("icon-menu").addEventListener("click", mostrar_menu);

function mostrar_menu(){
    // Mueve el contenido principal y muestra el menú lateral
    document.getElementById("move-content").classList.toggle('move-container-all'); 
    document.getElementById("show-menu").classList.toggle('show-lateral');
}

// ==========================================
// 2. BUSCADOR DE CONTENIDO
// ==========================================

// Ejecutando funciones al hacer clic
document.getElementById("icon-search").addEventListener("click", mostrar_buscador); 
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador);

// Declarando variables (Uso de const para mejor práctica)
const bars_search =       document.getElementById("ctn-bars-search");
const cover_ctn_search =  document.getElementById("cover-ctn-search");
const inputSearch =       document.getElementById("inputSearch");
const box_search =        document.getElementById("box-search");

// Función para mostrar el buscador
function mostrar_buscador(){
    bars_search.style.top = "80px";
    cover_ctn_search.style.display = "block";
    inputSearch.focus();

    if (inputSearch.value === ""){
        box_search.style.display = "none";
    }
}

// Función para ocultar el buscador
function ocultar_buscador(){
    bars_search.style.top = "-10px";
    cover_ctn_search.style.display = "none";
    inputSearch.value = "";
    box_search.style.display = "none";
}

// ==========================================
// 3. FILTRADO DE BÚSQUEDA INTERNA
// ==========================================
document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno(){
    let filter = inputSearch.value.toUpperCase();
    let li = box_search.getElementsByTagName("li");

    // Recorriendo elementos a filtrar (Corregido: length)
    for (let i = 0; i < li.length; i++){
        let a = li[i].getElementsByTagName("a")[0];
        let textValue = a.textContent || a.innerText;

        if(textValue.toUpperCase().indexOf(filter) > -1){
            li[i].style.display = "";
            box_search.style.display = "block";
        } else {
            li[i].style.display = "none";
        }

        // Si el buscador queda vacío tras borrar, ocultar la caja
        if (inputSearch.value === ""){
            box_search.style.display = "none";
        }
    }
}

// ==========================================
// 4. NUEVAS FUNCIONES DE EXPERIENCIA (UX)
// ==========================================

// Cerrar buscador al presionar la tecla ESC
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        ocultar_buscador();
    }
});

// Simulador de envío de Formulario de Contacto (Para Billzen)
// Nota: Asegúrate de que el id del formulario en tu HTML sea "form-contacto"
const contactoForm = document.getElementById('form-contacto');
if (contactoForm) {
    contactoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        alert("¡Gracias " + nombre + "! Mensaje enviado con éxito a Billzen (Simulación).");
        this.reset();
    });
}