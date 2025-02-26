// URL de la API pública para obtener departamentos y ciudades de Colombia
const apiUrl = 'https://www.datos.gov.co/resource/xdk5-pm3f.json';


document.addEventListener('DOMContentLoaded', () => {
    const departamentoSelect = document.getElementById('departamento');
    const ciudadSelect = document.getElementById('ciudad');
    const form = document.getElementById('formularioPago');

    if (form) {
        const inputs = form.querySelectorAll('input, select');
        console.log(inputs); // Comprobar si selecciona correctamente los elementos
    } else {
        console.error("No se encontró el formulario con el ID 'formularioPago'");
    }

    // Cargar departamentos al iniciar la página
    window.onload = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Obtener una lista única de departamentos
            const departamentos = [...new Set(data.map(item => item.departamento))].sort();

            departamentos.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento;
                option.textContent = departamento;
                departamentoSelect.appendChild(option);
            });

            console.log('Departamentos cargados:', departamentos); // Depuración

        } catch (error) {
            console.error('Error al cargar departamentos:', error);
        }
    };

    // Cargar ciudades al seleccionar un departamento
    departamentoSelect.addEventListener('change', async () => {
        ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>'; // Reiniciar opciones
        const selectedDepartment = departamentoSelect.value;

        if (selectedDepartment) {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                // Filtrar ciudades según el departamento seleccionado
                const ciudades = data
                    .filter(item => item.departamento === selectedDepartment)
                    .map(item => item.municipio)
                    .sort();

                console.log('Ciudades encontradas:', ciudades); // Depuración

                // Rellenar el select de ciudades
                ciudades.forEach(ciudad => {
                    const option = document.createElement('option');
                    option.value = ciudad;
                    option.textContent = ciudad;
                    ciudadSelect.appendChild(option);
                });

            } catch (error) {
                console.error('Error al cargar ciudades:', error);
            }
        }
    });
});