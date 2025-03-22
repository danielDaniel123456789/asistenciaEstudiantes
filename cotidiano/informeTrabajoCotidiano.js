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

            // Cargar las materias desde localStorage
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

                    // Cargar los estudiantes desde localStorage
                    const students = JSON.parse(localStorage.getItem('students')) || [];

                    // Filtrar estudiantes por grupo y materia seleccionados
                    const estudiantesFiltrados = students.filter(student => 
                        student.groupId == grupoSeleccionado && student.materiaId == materiaSeleccionada
                    );

                    // Verificar si hay estudiantes filtrados
                    if (estudiantesFiltrados.length === 0) {
                        Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                        return;
                    }

                    // Obtener la cantidad máxima de valores en trabajoCotidiano
                    const maxValores = Math.max(...estudiantesFiltrados.map(est => (est.trabajoCotidiano || []).length), 0);

                    // Crear la tabla
                    let estudiantesHTML = '<table class="table p-2">';
                    estudiantesHTML += '<thead><tr><th>Nombre</th>';

                    // Agregar columnas según la cantidad máxima de valores
                    for (let i = 0; i < maxValores; i++) {
                        estudiantesHTML += `<th>✔️</th>`;
                    }
                    estudiantesHTML += '</tr></thead><tbody>';

                    // Generar filas con los valores o colocar "?" en rojo si faltan valores
                    estudiantesFiltrados.forEach(estudiante => {
                        estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                        for (let i = 0; i < maxValores; i++) {
                            const valor = estudiante.trabajoCotidiano?.[i]?.type || '<span style="color: red;">?</span>';
                            estudiantesHTML += `<td>${valor}</td>`;
                        }

                        estudiantesHTML += '</tr>';
                    });

                    estudiantesHTML += '</tbody></table>';

                    // Mostrar el modal con la lista de estudiantes
                    Swal.fire({
                        html: `
                            <div id="footerCopiado" class="p-4 bg-warning text-center" style="display:none">
                                <h3>Copiado, pégalo en tu grupo de WhatsApp</h3>
                                <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div>${estudiantesHTML}</div>
                            <button id="copiarNombresBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Nombres</button>
                            <button id="copiarTiposBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Puntuación</button>
                        `,
                        showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar'
                    });

                    document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                        const filas = document.querySelectorAll('table tbody tr');
                        let textoCopiar = '';

                        filas.forEach(fila => {
                            const nombre = fila.querySelector('td:first-child').innerText;
                            textoCopiar += nombre + '\n';
                        });

                        navigator.clipboard.writeText(textoCopiar).then(() => {
                            const footer = document.getElementById('footerCopiado');
                            if (footer) {
                                footer.style.display = 'block';
                                setTimeout(() => {
                                    footer.style.display = 'none';
                                }, 4000);
                            }
                        }).catch(() => {
                            Swal.fire('Error', 'No se pudieron copiar los nombres', 'error');
                        });
                    });

                    document.getElementById('copiarTiposBtn').addEventListener('click', () => {
                        const tiposTrabajoTexto = estudiantesFiltrados.map(estudiante => {
                            const tipoTrabajo = (estudiante.trabajoCotidiano || []).map(trabajo => trabajo.type || 'Ninguno').join('\t') || 'Ninguno';
                            return tipoTrabajo;
                        }).join('\n');

                        navigator.clipboard.writeText(tiposTrabajoTexto).then(() => {
                            const footerCopiado = document.getElementById('footerCopiado');
                            footerCopiado.style.display = 'block';

                            setTimeout(() => {
                                footerCopiado.style.display = 'none';
                            }, 4000);
                        }).catch(() => {
                            Swal.fire('Error', 'No se pudieron copiar los tipos de trabajo', 'error');
                        });
                    });
                }
            });
        }
    });
}
