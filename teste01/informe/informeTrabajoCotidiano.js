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

                    // Obtener la cantidad máxima de valores en trabajoCotidiano
const maxValores = Math.max(...estudiantesFiltrados.map(est => est.trabajoCotidiano.length));

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
    estudiantesHTML += `<tr><i class="fa fa-bullhorn" aria-hidden="true"></i> <td>${estudiante.name}</td>`;

    // Agregar valores de trabajo o "?" si faltan
    for (let i = 0; i < maxValores; i++) {
        const valor = estudiante.trabajoCotidiano[i]?.type || '<span style="color: red;">?</span>';
        estudiantesHTML += `<td>${valor}</td>`;
    }

    estudiantesHTML += '</tr>';
});

estudiantesHTML += '</tbody></table>';

/*
                    // Crear el HTML para mostrar los estudiantes filtrados
                    let estudiantesHTML = '<table class="table p-2"';
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

                    */

                    // Mostrar el tercer modal con SweetAlert2 para ver la lista de estudiantes
                    Swal.fire({
                        html: `

                        <div id="footerCopiado" class="p-4 bg-warning text-center" Style="display:none">
                    <h3>Coopiado, pegalo en tu grupo de whatsApp </h3>
<i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
<span class="sr-only">Loading...</span>
                        </div>
                            <div>${estudiantesHTML}</div>
                            <button id="copiarNombresBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;"> Copiar Nombres</button>
                                     <button id="copiarTiposBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar puntuaje</button>
             
                            `,
                            showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        showCancelButton: true,
                    });

                    document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                        const filas = document.querySelectorAll('table tbody tr'); 
                        let textoCopiar = '';
                    
                        filas.forEach(fila => {
                            const nombre = fila.querySelector('td:first-child').innerText; // Extraer la primera columna (nombre)
                            textoCopiar += nombre + '\n'; // Agregar nueva línea por cada nombre
                        });
                    
                        navigator.clipboard.writeText(textoCopiar).then(() => {
                            const footer = document.getElementById('footerCopiado');
                            if (footer) {
                                footer.style.display = 'block'; // Mostrar el footer
                                setTimeout(() => {
                                    footer.style.display = 'none'; // Ocultar el footer después de 4 segundos
                                }, 4000);
                            }
                        }).catch(err => {
                            Swal.fire('Error', 'No se pudieron copiar los nombres', 'error');
                        });
                    });
                    
                    
                    
            

// Copiar los nombres y tipos de trabajo con tabuladores como delimitador de columna
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
        // Mostrar el div con id "footerCopiado"
        const footerCopiado = document.getElementById('footerCopiado');
        footerCopiado.style.display = 'block'; // Mostrarlo

        // Ocultar el footer después de 4 segundos
        setTimeout(() => {
            footerCopiado.style.display = 'none';
        }, 4000);
    }).catch(err => {
        Swal.fire('Error', 'No se pudieron copiar los tipos de trabajo', 'error');
    });
});




                
                
                




                
                }
            });
        }
    });
}
