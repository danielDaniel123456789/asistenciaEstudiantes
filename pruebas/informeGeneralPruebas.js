function informeGeneralPruebas() {
    // Recuperar los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    if (!grupos || grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

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

            const materias = JSON.parse(localStorage.getItem('materias')) || [];

            if (!materias || materias.length === 0) {
                Swal.fire('Error', 'No se encontraron materias en el almacenamiento local.', 'error');
                return;
            }

            let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
            materias.forEach(materia => {
                selectMateriasHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
            });
            selectMateriasHTML += '</select>';

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

                    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];
                    
                    const estudiantesFiltrados = estudiantes.filter(estudiante => 
                        estudiante.groupId == grupoSeleccionado && estudiante.materiaId == materiaSeleccionada
                    );

                    if (estudiantesFiltrados.length === 0) {
                        Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                        return;
                    }

                    let pruebasUnicas = [];
                    estudiantesFiltrados.forEach(estudiante => {
                        estudiante.pruebas.forEach(prueba => {
                            if (!pruebasUnicas.some(p => p.id === prueba.id)) {
                                pruebasUnicas.push(prueba);
                            }
                        });
                    });

                    let estudiantesHTML = '<table class="table p-2">';
                    estudiantesHTML += '<thead><tr><th>Nombre de estudiantes</th>';

                    pruebasUnicas.forEach(prueba => {
                        estudiantesHTML += `<th>Prueba ${prueba.id} (${prueba.date})</th>`;
                    });

                    estudiantesHTML += '<th>Acciones</th>';
                    estudiantesHTML += '</tr></thead><tbody>';

                    estudiantesFiltrados.forEach(estudiante => {
                        estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                        pruebasUnicas.forEach(prueba => {
                            const pruebaEstudiante = estudiante.pruebas.find(p => p.id === prueba.id);
                            estudiantesHTML += `<td>${pruebaEstudiante ? pruebaEstudiante.puntos : 'Sin puntos'}</td>`;
                        });

                        estudiantesHTML += `
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarPrueba(${estudiante.id})">Editar</button>
                           </td>
                        `;
                        estudiantesHTML += '</tr>';
                    });

                    estudiantesHTML += '</tbody></table>';

                    // Obtener los nombres del grupo y la materia para el título
                    const nombreGrupo = grupos.find(g => g.id == grupoSeleccionado)?.nombre || 'Grupo desconocido';
                    const nombreMateria = materias.find(m => m.id == materiaSeleccionada)?.nombre || 'Materia desconocida';

                    Swal.fire({
                        title: `Informe de Pruebas - ${nombreGrupo} - ${nombreMateria}`,
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
