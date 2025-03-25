function informeTrabajoCotidiano() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    if (grupos.length === 0) {
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
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            return grupoSeleccionado ? grupoSeleccionado : Swal.showValidationMessage('Por favor selecciona un grupo');
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const grupoSeleccionado = result.value;
            const materias = JSON.parse(localStorage.getItem('materias')) || [];

            if (materias.length === 0) {
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
                confirmButtonText: 'Siguiente',
                preConfirm: () => {
                    const materiaSeleccionada = document.getElementById('materiaSelect').value;
                    return materiaSeleccionada ? materiaSeleccionada : Swal.showValidationMessage('Por favor selecciona una materia');
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const materiaSeleccionada = result.value;

                    const meses = [
                        { nombre: 'Enero', dias: 31 }, { nombre: 'Febrero', dias: 28 }, { nombre: 'Marzo', dias: 31 },
                        { nombre: 'Abril', dias: 30 }, { nombre: 'Mayo', dias: 31 }, { nombre: 'Junio', dias: 30 },
                        { nombre: 'Julio', dias: 31 }, { nombre: 'Agosto', dias: 31 }, { nombre: 'Septiembre', dias: 30 },
                        { nombre: 'Octubre', dias: 31 }, { nombre: 'Noviembre', dias: 30 }, { nombre: 'Diciembre', dias: 31 }
                    ];

                    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
                    meses.forEach((mes, index) => {
                        selectMesHTML += `<option value="${index}">${mes.nombre} (${mes.dias} días)</option>`;
                    });
                    selectMesHTML += '</select>';

                    Swal.fire({
                        title: 'Selecciona el mes',
                        html: selectMesHTML,
                        showCancelButton: true,
                        confirmButtonText: 'Siguiente',
                        preConfirm: () => {
                            const mesIndex = document.getElementById('mesSelect').value;
                            return { 
                                mesIndex: parseInt(mesIndex), 
                                diasDelMes: meses[mesIndex].dias,
                                nombreMes: meses[mesIndex].nombre
                            };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const { mesIndex, diasDelMes, nombreMes } = result.value;
                            const students = JSON.parse(localStorage.getItem('students')) || [];

                            const estudiantesFiltrados = students.filter(student =>
                                student.groupId == grupoSeleccionado && student.materiaId == materiaSeleccionada
                            );

                            if (estudiantesFiltrados.length === 0) {
                                Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                                return;
                            }

                            let estudiantesHTML = `
                                <div class="table-responsive">
                                    <table class="table table-bordered table-sm">
                                        <thead class="thead-dark">
                                            <tr>
                                                <th style="position: sticky; left: 0; background: #343a40; z-index: 10;">Nombre</th>
                            `;

                            // Encabezados de días
                            for (let dia = 1; dia <= diasDelMes; dia++) {
                                estudiantesHTML += `<th class="text-center">${dia}</th>`;
                            }
                            estudiantesHTML += `</tr></thead><tbody>`;

                            estudiantesFiltrados.forEach(estudiante => {
                                estudiantesHTML += `<tr><td style="position: sticky; left: 0; background: white; z-index: 5;">${estudiante.name}</td>`;

                                // Crear mapa de trabajos por día para acceso rápido
                                const trabajosPorDia = {};
                                if (estudiante.trabajoCotidiano && Array.isArray(estudiante.trabajoCotidiano)) {
                                    estudiante.trabajoCotidiano.forEach(trabajo => {
                                        if (trabajo.dia !== undefined) {
                                            trabajosPorDia[trabajo.dia] = trabajo.type || '?';
                                        } else if (trabajo.fecha) {
                                            // Si tiene fecha, extraemos el día
                                            const fecha = new Date(trabajo.fecha);
                                            if (!isNaN(fecha)) {
                                                trabajosPorDia[fecha.getDate()] = trabajo.type || '?';
                                            }
                                        }
                                    });
                                }

                                // Celdas para cada día del mes
                                for (let dia = 1; dia <= diasDelMes; dia++) {
                                    const valor = trabajosPorDia[dia] || '?';
                                    const color = valor === '?' ? 'red' : 'black';
                                    estudiantesHTML += `<td class="text-center" style="color: ${color}">${valor}</td>`;
                                }

                                estudiantesHTML += '</tr>';
                            });

                            estudiantesHTML += `</tbody></table></div>`;

                            Swal.fire({
                                title: `Trabajo Cotidiano - ${nombreMes}`,
                                width: '90%',
                                html: `
                                    <div id="footerCopiado" class="p-2 bg-success text-white text-center mb-2" style="display:none; border-radius: 5px;">
                                        <i class="fas fa-check-circle"></i> Copiado al portapapeles
                                    </div>
                                    ${estudiantesHTML}
                                    <div class="d-flex justify-content-between mt-3">
                                        <button id="copiarNombresBtn" class="btn btn-primary">
                                            <i class="fas fa-copy"></i> Copiar Nombres
                                        </button>
                                        <button id="copiarTodoBtn" class="btn btn-primary">
                                            <i class="fas fa-copy"></i> Copiar Todo
                                        </button>
                                        <button id="copiarTiposBtn" class="btn btn-primary">
                                            <i class="fas fa-copy"></i> Copiar Puntuación
                                        </button>
                                    </div>
                                `,
                                showCloseButton: true,
                                showConfirmButton: false,
                                customClass: {
                                    container: 'swal-wide-container'
                                }
                            });

                            // Función para copiar al portapapeles
                            const copiarAlPortapapeles = (texto) => {
                                navigator.clipboard.writeText(texto).then(() => {
                                    const footer = document.getElementById('footerCopiado');
                                    if (footer) {
                                        footer.style.display = 'block';
                                        setTimeout(() => {
                                            footer.style.display = 'none';
                                        }, 2000);
                                    }
                                }).catch(() => {
                                    Swal.fire('Error', 'No se pudo copiar al portapapeles', 'error');
                                });
                            };

                            // Copiar solo nombres
                            document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                                const nombres = estudiantesFiltrados.map(e => e.name).join('\n');
                                copiarAlPortapapeles(nombres);
                            });

                            // Copiar todo (nombres + datos)
                            document.getElementById('copiarTodoBtn').addEventListener('click', () => {
                                let texto = 'Nombre\t' + Array.from({length: diasDelMes}, (_, i) => i+1).join('\t') + '\n';
                                
                                estudiantesFiltrados.forEach(estudiante => {
                                    const trabajosPorDia = {};
                                    if (estudiante.trabajoCotidiano) {
                                        estudiante.trabajoCotidiano.forEach(t => {
                                            if (t.dia !== undefined) trabajosPorDia[t.dia] = t.type || '?';
                                        });
                                    }
                                    
                                    texto += estudiante.name + '\t';
                                    for (let dia = 1; dia <= diasDelMes; dia++) {
                                        texto += (trabajosPorDia[dia] || '?') + '\t';
                                    }
                                    texto += '\n';
                                });
                                
                                copiarAlPortapapeles(texto);
                            });

                            // Copiar solo puntuaciones
                            document.getElementById('copiarTiposBtn').addEventListener('click', () => {
                                let texto = '';
                                
                                estudiantesFiltrados.forEach(estudiante => {
                                    const trabajosPorDia = {};
                                    if (estudiante.trabajoCotidiano) {
                                        estudiante.trabajoCotidiano.forEach(t => {
                                            if (t.dia !== undefined) trabajosPorDia[t.dia] = t.type || '?';
                                        });
                                    }
                                    
                                    for (let dia = 1; dia <= diasDelMes; dia++) {
                                        texto += (trabajosPorDia[dia] || '?') + '\t';
                                    }
                                    texto += '\n';
                                });
                                
                                copiarAlPortapapeles(texto.trim());
                            });
                        }
                    });
                }
            });
        }
    });
}