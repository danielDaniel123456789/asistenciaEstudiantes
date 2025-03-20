function informeTrabajoCotidiano() {
    // Recuperar los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos'));

    // Verificar si los grupos existen en el localStorage
    if (!grupos || grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    // Crear el HTML del select para los grupos
    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

    // Mostrar el primer modal con SweetAlert2 para seleccionar el grupo
    Swal.fire({
        title: 'Selecciona un grupo',
        html: selectGruposHTML,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            if (!grupoSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un grupo');
                return false;
            }
            return grupoSeleccionado;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const grupoSeleccionado = result.value;

            // Ahora, cargar las materias desde localStorage
            const materias = JSON.parse(localStorage.getItem('materias'));

            // Verificar si las materias existen en el localStorage
            if (!materias || materias.length === 0) {
                Swal.fire('Error', 'No se encontraron materias en el almacenamiento local.', 'error');
                return;
            }

            // Crear el HTML del select para las materias
            let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
            materias.forEach(materia => {
                selectMateriasHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
            });
            selectMateriasHTML += '</select>';

            // Mostrar el segundo modal con SweetAlert2 para seleccionar la materia
            Swal.fire({
                title: 'Selecciona una materia',
                html: selectMateriasHTML,
                showCancelButton: true,
                confirmButtonText: 'Siguiente',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const materiaSeleccionada = document.getElementById('materiaSelect').value;
                    if (!materiaSeleccionada) {
                        Swal.showValidationMessage('Por favor selecciona una materia');
                        return false;
                    }
                    return materiaSeleccionada;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const materiaSeleccionada = result.value;

                    // Ahora, cargar los estudiantes desde localStorage
                    const students = JSON.parse(localStorage.getItem('students'));

                    // Filtrar estudiantes por el grupo y la materia seleccionados
                    const estudiantesFiltrados = students.filter(student => 
                        student.groupId == grupoSeleccionado && student.materiaId == materiaSeleccionada
                    );

                    // Verificar si hay estudiantes filtrados
                    if (estudiantesFiltrados.length === 0) {
                        Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                        return;
                    }

                    // Crear el HTML para mostrar los estudiantes filtrados
                    let estudiantesHTML = '<table style="width: 100%; text-align: left; border-collapse: collapse;">';
                    estudiantesHTML += '<thead><tr><th>Nombre</th><th>Puntos</th></tr></thead><tbody>';

                    estudiantesFiltrados.forEach(estudiante => {
                        const tipoTrabajo = estudiante.trabajoCotidiano.length > 0 
                            ? estudiante.trabajoCotidiano.map(trabajo => trabajo.type || 'No disponible').join(', ')
                            : '3';

                        estudiantesHTML += `
                            <tr>
                                <td>${estudiante.name} </td>
                                <td>${tipoTrabajo}</td>
                            </tr>
                        `;
                    });

                    estudiantesHTML += '</tbody></table>';

                    // Mostrar el tercer modal con SweetAlert2 para ver la lista de estudiantes
                    Swal.fire({
                        html: `
                            <div>${estudiantesHTML}</div>
                            <button id="copiarNombresBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;"> copiarNombresBtn</button>
                                     <button id="copiarTiposBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">copiarTiposBtn</button>
             
                            `,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                    });

                    // Lógica para el botón Copiar Informe
                    document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                        const filas = document.querySelectorAll('table tbody tr'); 
                        let textoCopiar = '';
                    
                        filas.forEach(fila => {
                            const nombre = fila.querySelector('td:first-child').innerText; // Solo extraemos la primera columna (nombre)
                            textoCopiar += nombre + '\n'; // Agregamos nueva línea por cada nombre
                        });
                    
                        navigator.clipboard.writeText(textoCopiar).then(() => {
                            Swal.fire('Copiado', 'Los nombres han sido copiados al portapapeles', 'success');
                        }).catch(err => {
                            Swal.fire('Error', 'No se pudieron copiar los nombres', 'error');
                        });
                    });
                    
                    
            

// Copiar los nombres y tipos de trabajo con tabuladores como delimitador de columna
// Copiar solo los tipos de trabajo con tabuladores como delimitador de columna
document.getElementById('copiarTiposBtn').addEventListener('click', () => {
    const tiposTrabajoTexto = estudiantesFiltrados.map(estudiante => {
        // Obtener los tipos de trabajo del estudiante
        const tipoTrabajo = estudiante.trabajoCotidiano.length > 0 
            ? estudiante.trabajoCotidiano.map(trabajo => trabajo.type || 'Ninguno').join('\t') // Usamos \t para separar las columnas
            : '3'; // Si no tiene trabajo, poner 'Ninguno'
        
        // Solo devolver los tipos de trabajo (sin nombre)
        return tipoTrabajo; // Solo los tipos de trabajo
    }).join('\n');  // Cada estudiante en una línea nueva
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(tiposTrabajoTexto).then(() => {
        Swal.fire('Copiado', 'Los tipos de trabajo han sido copiados al portapapeles', 'success');
    }).catch(err => {
        Swal.fire('Error', 'No se pudieron copiar los tipos de trabajo', 'error');
    });
});



                
                
                




                
                }
            });
        }
    });
}
