function informeMesAsistencia() {
    // Crear el array con los meses y los días que tienen
    const meses = [
        { id: 1, nombre: 'Enero', dias: 31 },
        { id: 2, nombre: 'Febrero', dias: 28 }, // Febrero con 28 días (se ajustará más adelante)
        { id: 3, nombre: 'Marzo', dias: 31 },
        { id: 4, nombre: 'Abril', dias: 30 },
        { id: 5, nombre: 'Mayo', dias: 31 },
        { id: 6, nombre: 'Junio', dias: 30 },
        { id: 7, nombre: 'Julio', dias: 31 },
        { id: 8, nombre: 'Agosto', dias: 31 },
        { id: 9, nombre: 'Septiembre', dias: 30 },
        { id: 10, nombre: 'Octubre', dias: 31 },
        { id: 11, nombre: 'Noviembre', dias: 30 },
        { id: 12, nombre: 'Diciembre', dias: 31 }
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
            const mesSeleccionado = parseInt(result.value);

            // Obtener el número de días del mes seleccionado
            const mes = meses.find(m => m.id == mesSeleccionado);
            let diasMes = mes.dias;

            // Ajustar días para febrero en años bisiestos
            if (mesSeleccionado == 2) { // Febrero
                const añoActual = new Date().getFullYear();
                if ((añoActual % 4 === 0 && añoActual % 100 !== 0) || (añoActual % 400 === 0)) {
                    diasMes = 29; // Año bisiesto, 29 días en febrero
                }
            }

            // Cargar los estudiantes desde localStorage
            const students = JSON.parse(localStorage.getItem('students')) || [];

            // Filtrar estudiantes que tienen ausencias en el mes seleccionado
            const estudiantesFiltrados = students.filter(student => {
                const ausencias = student.absences || [];
                return ausencias.some(absence => {
                    // Parsear la fecha correctamente (asegurarse de que el formato sea válido)
                    const dateParts = absence.date.split('-');
                    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    return date.getMonth() + 1 === mesSeleccionado;
                });
            });

            // Verificar si hay estudiantes filtrados
            if (estudiantesFiltrados.length === 0) {
                Swal.fire('No hay estudiantes', 'No se encontraron estudiantes con ausencias en este mes.', 'info');
                return;
            }

            // Crear la tabla de asistencia
            let estudiantesHTML = '<table class="table p-2">';
            estudiantesHTML += '<thead><tr><th>Nombre</th><th>Ausencias</th><th>Fechas</th></tr></thead><tbody>';

            // Generar filas con las ausencias de los estudiantes
            estudiantesFiltrados.forEach(estudiante => {
                estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                // Filtrar las ausencias del estudiante para el mes seleccionado
                const ausenciasMes = (estudiante.absences || []).filter(absence => {
                    const dateParts = absence.date.split('-');
                    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    return date.getMonth() + 1 === mesSeleccionado;
                });

                // Preparar los datos para mostrar
                const tiposAusencia = ausenciasMes.length > 0
                    ? ausenciasMes.map(absence => absence.type).join(', ')
                    : 'No hay ausencias';
                
                const fechasAusencia = ausenciasMes.length > 0
                    ? ausenciasMes.map(absence => {
                        const dateParts = absence.date.split('-');
                        return `${dateParts[2]}/${dateParts[1]}`; // Formato día/mes
                    }).join(', ')
                    : 'N/A';

                estudiantesHTML += `<td>${tiposAusencia}</td><td>${fechasAusencia}</td></tr>`;
            });

            estudiantesHTML += '</tbody></table>';

            // Mostrar el modal con la lista de estudiantes y sus ausencias
            Swal.fire({
                html: `
                    <div>${estudiantesHTML}</div>
                    <button id="copiarNombresBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Nombres</button>
                    <button id="copiarTiposBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Tipos de Ausencias</button>
                    <button id="copiarFechasBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Fechas de Ausencias</button>
                `,
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            });
        }
    });
}