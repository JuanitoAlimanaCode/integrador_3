document.addEventListener("DOMContentLoaded", function () {
    let inputFiltro = document.getElementById("filtroTabla");

    if (!inputFiltro) {
        console.error("❌ No se encontró el input de filtro.");
        return;
    }

    inputFiltro.addEventListener("input", function () {
        let valorBusqueda = this.value.trim().toLowerCase();
        let filas = document.querySelectorAll("table tbody tr");

        filas.forEach(fila => {
            let textoFila = fila.textContent.toLowerCase();
            fila.style.display = textoFila.includes(valorBusqueda) ? "" : "none";
        });
    });
});