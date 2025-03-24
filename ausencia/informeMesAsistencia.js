function informeMesAsistencia() {
    // Crear el HTML del select para los meses
    const meses = [
        { id: 1, nombre: 'Enero' },
        { id: 2, nombre: 'Febrero' },
        { id: 3, nombre: 'Marzo' },
        { id: 4, nombre: 'Abril' },
        { id: 5, nombre: 'Mayo' },
        { id: 6, nombre: 'Junio' },
        { id: 7, nombre: 'Julio' },
        { id: 8, nombre: 'Agosto' },
        { id: 9, nombre: 'Septiembre' },
        { id: 10, nombre: 'Octubre' },
        { id: 11, nombre: 'Noviembre' },
        { id: 12, nombre: 'Diciembre' }
    ];

    // Crear el HTML del select para los meses
    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(mes => {
        selectMesHTML += `<option value="${mes.id}">${mes.nombre}</option>`;
    });
    selectMesHTML += '</select>';

    // Mostrar el modal para seleccionar el mes
    Swal.fire({
        title: 'Selecciona un mes',
        html: selectMesHTML,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const mesSeleccionado = document.getElementById('mesSelect').value;
            if (!mesSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un mes');
                return false;
            }
            return mesSeleccionado;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const mesSeleccionado = result.value;

            // Cargar los estudiantes desde localStorage
            const students = JSON.parse(localStorage.getItem('students')) || [];

            // Filtrar estudiantes por el mes seleccionado
            const estudiantesFiltrados = students.filter(student => {
                const ausencias = student.absences || [];
                return ausencias.some(absence => {
                    const date = new Date(absence.date);
                    return date.getMonth() + 1 === parseInt(mesSeleccionado); // Comparar el mes
                });
            });

            // Verificar si hay estudiantes filtrados
            if (estudiantesFiltrados.length === 0) {
                Swal.fire('No hay estudiantes', 'No se encontraron estudiantes con ausencias en este mes.', 'info');
                return;
            }

            // Crear la tabla de asistencia
            let estudiantesHTML = '<table class="table p-2">';
            estudiantesHTML += '<thead><tr><th>Nombre</th><th>Ausencias</th></tr></thead><tbody>';

            // Generar filas con las ausencias de los estudiantes
            estudiantesFiltrados.forEach(estudiante => {
                estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                // Filtrar las ausencias del estudiante para el mes seleccionado
                const ausenciasMes = estudiante.absences.filter(absence => {
                    const date = new Date(absence.date);
                    return date.getMonth() + 1 === parseInt(mesSeleccionado); // Comparar el mes
                });

                // Mostrar las fechas de las ausencias
                const fechasAusencia = ausenciasMes.map(absence => {
                    const date = new Date(absence.date);
                    return date.toLocaleDateString(); // Convertir fecha a formato legible
                }).join(', ');

                estudiantesHTML += `<td>${fechasAusencia}</td></tr>`;
            });

            estudiantesHTML += '</tbody></table>';

            // Mostrar el modal con la lista de estudiantes y sus ausencias
            Swal.fire({
                html: `
                    <div>${estudiantesHTML}</div>
                    <button id="copiarAsistenciaBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Ausencias</button>
                `,
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            });

            // Copiar la asistencia al portapapeles
            document.getElementById('copiarAsistenciaBtn').addEventListener('click', () => {
                const filas = document.querySelectorAll('table tbody tr');
                let textoCopiar = '';

                filas.forEach(fila => {
                    const nombre = fila.querySelector('td:first-child').innerText;
                    const ausencias = fila.querySelector('td:nth-child(2)').innerText;
                    textoCopiar += `${nombre}: ${ausencias}\n`;
                });

                navigator.clipboard.writeText(textoCopiar).then(() => {
                    Swal.fire('Éxito', 'Las ausencias fueron copiadas al portapapeles.', 'success');
                }).catch(() => {
                    Swal.fire('Error', 'No se pudo copiar las ausencias al portapapeles.', 'error');
                });
            });
        }
    });
}
