document.addEventListener("DOMContentLoaded", function () {
    const tipoSelect = document.querySelector("#id_tipo");
    const grupoSelect = document.querySelector("#id_grupo");

    tipoSelect.addEventListener("change", function () {
        const tipoId = this.value;
        grupoSelect.innerHTML = '<option value="">---------</option>'; // Reset

        if (tipoId) {
            fetch(`/filtrar_grupos/?tipo_id=${tipoId}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(grupo => {
                        const option = new Option(grupo.grupo, grupo.id);
                        grupoSelect.add(option);
                    });
                });
        }
    });
});