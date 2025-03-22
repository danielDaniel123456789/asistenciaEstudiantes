function informeGeneralTareas() {
    // Recuperar los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    // Verificar si los grupos existen en localStorage
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

            // Cargar las materias desde localStorage
            const materias = JSON.parse(localStorage.getItem('materias')) || [];

            // Verificar si las materias existen en localStorage
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
                confirmButtonText: 'Mostrar Informe',
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

                    // Recuperar los estudiantes desde localStorage
                    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

                    // Filtrar estudiantes por grupo y materia seleccionados
                    const estudiantesFiltrados = estudiantes.filter(estudiante => 
                        estudiante.groupId == grupoSeleccionado && estudiante.materiaId == materiaSeleccionada
                    );

                    // Verificar si hay estudiantes filtrados
                    if (estudiantesFiltrados.length === 0) {
                        Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                        return;
                    }

                    // Crear la tabla HTML para las tareas
                    let estudiantesHTML = '<table class="table p-2">';
                    estudiantesHTML += '<thead><tr><th>Nombre de estudiantes</th>';

                    // Obtener todas las tareas únicas para ese grupo y materia
                    let tareasUnicas = [];
                    estudiantesFiltrados.forEach(estudiante => {
                        estudiante.tareas.forEach(tarea => {
                            if (!tareasUnicas.some(t => t.id === tarea.id)) {
                                tareasUnicas.push(tarea);
                            }
                        });
                    });

                    // Crear las cabeceras de las tareas
                    tareasUnicas.forEach(tarea => {
                        estudiantesHTML += `<th>Tarea ${tarea.id}</th>`;
                    });
                    estudiantesHTML += '<th>Acciones</th>'; // Columna para los botones de acción
                    estudiantesHTML += '</tr></thead><tbody>';

                    // Recorrer los estudiantes y sus tareas
                    estudiantesFiltrados.forEach(estudiante => {
                        estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                        // Crear las columnas de tareas para cada estudiante
                        tareasUnicas.forEach(tarea => {
                            const tareaEstudiante = estudiante.tareas.find(t => t.id === tarea.id);
                            estudiantesHTML += `<td>${tareaEstudiante ? tareaEstudiante.puntos || tareaEstudiante.score : 'Sin puntos'}</td>`;
                        });

                        // Botones de Editar y Eliminar
                        estudiantesHTML += `
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarTarea(${estudiante.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${estudiante.id})">Eliminar</button>
                            </td>
                        `;
                        estudiantesHTML += '</tr>';
                    });

                    estudiantesHTML += '</tbody></table>';

                    // Mostrar el informe en un modal
                    Swal.fire({
                        title: 'Informe General de Tareas',
                        html: estudiantesHTML,
                        showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar'
                    });
                }
            });
        }
    });
}




