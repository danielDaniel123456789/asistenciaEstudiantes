function generarInforme() {
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

                    // Crear el texto para mostrar los estudiantes filtrados
                    let estudiantesTexto = '';

                    estudiantesFiltrados.forEach(estudiante => {
                        estudiantesTexto += `\n\n${estudiante.name} (Cédula: ${estudiante.cedula})\n`;

                        // Ausencias
                        estudiantesTexto += 'Ausencias:\n';
                        if (estudiante.absences.length > 0) {
                            estudiante.absences.forEach(absence => {
                                estudiantesTexto += `${absence.type} - ${absence.date}\n`;
                            });
                        } else {
                            estudiantesTexto += 'Ninguna\n';
                        }

                        // Trabajo Cotidiano
                        estudiantesTexto += 'Trabajo Cotidiano:\n';
                        if (estudiante.trabajoCotidiano.length > 0) {
                            estudiante.trabajoCotidiano.forEach(trabajo => {
                                const tipoTrabajo = trabajo.type || 'No disponible';  // Reemplaza null o undefined por un valor por defecto
                                const detalleTrabajo = trabajo.detail || 'No disponible';  // Lo mismo para el detalle
                            
                                estudiantesTexto += `${tipoTrabajo} - ${detalleTrabajo} - ${trabajo.date}\n`;
                            });
                            
                        } else {
                            estudiantesTexto += 'Ninguno\n';
                        }
                    });

                    // Mostrar el tercer modal con SweetAlert2 para ver la lista de estudiantes
                    Swal.fire({
                        html: `
                            <pre>${estudiantesTexto}</pre>
                            <button id="copiarBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Informe</button>
                        `,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                    });

                    // Lógica para el botón Copiar Informe
                    document.getElementById('copiarBtn').addEventListener('click', () => {
                        // Copiar solo el texto al portapapeles
                        navigator.clipboard.writeText(estudiantesTexto).then(() => {
                            Swal.fire('Copiado', 'El informe ha sido copiado al portapapeles', 'success');
                        }).catch(err => {
                            Swal.fire('Error', 'No se pudo copiar el informe', 'error');
                        });
                    });
                }
            });
        }
    });
}

