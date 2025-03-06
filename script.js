$(document).ready(function() {
    let dictionary = []; // Variable para almacenar los datos cargados

    // Cargar el archivo JSON
    fetch('data.json')
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            dictionary = data; // Asignar los datos a la variable dictionary
            $('#searchInput').trigger('input'); // Disparar la búsqueda inicial
        })
        .catch(error => {
            console.error('Error cargando el archivo JSON:', error);
        });

    // Escuchar el evento 'input' en el campo de búsqueda
    $('#searchInput').on('input', function() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        const selectedType = $('#typeFilter').val();
        
        // Filtrar por término y tipo
        const results = dictionary.filter(item => {
            const matchesTerm = Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            );
            const matchesType = selectedType ? item.type === selectedType : true;
            return matchesTerm && matchesType;
        });

        displayResults(results);
    });

    // Escuchar cambios en el filtro de tipo
    $('#typeFilter').on('change', function() {
        $('#searchInput').trigger('input'); // Disparar la búsqueda automáticamente
    });

    // Función para mostrar los resultados en la tabla
    function displayResults(results) {
        const resultsContainer = $('#results');
        resultsContainer.empty();
    
        if (results.length > 0) {
            results.forEach(item => {
                let detalles = '';
                if (item.type === "Curso") {
                    detalles = `<strong>Plataforma:</strong> ${item.plataforma}`;
                } else if (item.type === "Reporte") {
                    detalles = `<strong>Categoria:</strong> ${item.categoria}`;
                    // Verificar si subcategoria existe y no está vacío
                    if (item.subcategoria && item.subcategoria.trim() !== "") {
                        detalles += `<br><strong>Subcategoria:</strong> ${item.subcategoria}`;
                    }
                    detalles += `<br><strong>Tipo:</strong> ${item.tipo}`;
                } else if (item.type === "Recurso") {
                    detalles = `<strong>Tipo de Archivo:</strong> ${item.tipoArchivo}`;
                }
    
                const row = `<tr>
                    <td>${item.type}</td>
                    <td>${item.nombre}</td>
                    <td>${detalles}</td>
                    <td><a href="${item.link}" target="_blank" class="btn btn-outline-primary btn-sm">ver</a></td>
                </tr>`;
                resultsContainer.append(row);
            });
        } else {
            resultsContainer.append(`<tr>
                <td colspan="4" class="text-center">No se encontraron resultados.</td>
            </tr>`);
        }
    }
});