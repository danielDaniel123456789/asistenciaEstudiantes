function calificarAsistenciaDelMes() {
    // Cargar los grupos, materias y estudiantes desde el localStorage de forma segura
    let grupos = localStorage.getItem('grupos') ? JSON.parse(localStorage.getItem('grupos')) : [];
    let materias = localStorage.getItem('materias') ? JSON.parse(localStorage.getItem('materias')) : [];
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    // Verificar si hay grupos, materias y estudiantes disponibles
    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos disponibles. Por favor, agregue un grupo primero.', 'info');
        return;
    }

    if (materias.length === 0) {
        Swal.fire('Información', 'No hay materias disponibles. Por favor, agregue una materia primero.', 'info');
        return;
    }

    if (students.length === 0) {
        Swal.fire('Información', 'No hay estudiantes disponibles. Por favor, agregue estudiantes primero.', 'info');
        return;
    }

    // Crear las opciones del selector de grupos
    let grupoOptions = grupos.map(grupo => `<option value="${grupo.id}">${grupo.nombre}</option>`).join('');

    // Crear las opciones del selector de materias
    let materiaOptions = materias.map(materia => `<option value="${materia.id}">${materia.nombre}</option>`).join('');

    // Crear las opciones del selector de meses
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let monthOptions = monthNames.map((month, index) => `<option value="${index}">${month}</option>`).join('');

    // Abrir SweetAlert para calificar asistencia del mes
    Swal.fire({
        title: 'Calificar Asistencia del Mes',
        html: ` 
            <select id="asistenciaGrupo" class="form-select">
                <option value="" disabled selected>Selecciona un grupo</option>
                ${grupoOptions}
            </select>
            <br>
            <select id="asistenciaMateria" class="form-select">
                <option value="" disabled selected>Selecciona una materia</option>
                ${materiaOptions}
            </select>
            <br>
            <select id="asistenciaMes" class="form-select">
                <option value="" disabled selected>Selecciona un mes</option>
                ${monthOptions}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Calificar',
        preConfirm: () => {
            const groupId = document.getElementById('asistenciaGrupo').value;
            const materiaId = document.getElementById('asistenciaMateria').value;
            const month = document.getElementById('asistenciaMes').value;

            // Verificar que se haya seleccionado un grupo, materia y mes
            if (!groupId || !materiaId || month === null) {
                Swal.showValidationMessage('Debe seleccionar un grupo, una materia y un mes');
                return false;
            }

            // Obtener los estudiantes en el grupo y materia seleccionados
            const selectedStudents = students.filter(s => s.groupId === groupId && s.materiaId === materiaId);

            // Obtener el número de días del mes seleccionado (incluyendo años bisiestos para febrero)
            const currentYear = new Date().getFullYear();
            let daysInMonth = new Date(currentYear, parseInt(month) + 1, 0).getDate();

            // Si es febrero (mes 1) y es un año bisiesto, ajustar los días
            if (parseInt(month) === 1) { // Febrero es el mes 1 (Índice 1)
                if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)) {
                    daysInMonth = 29; // Año bisiesto, 29 días
                } else {
                    daysInMonth = 28; // Año no bisiesto, 28 días
                }
            }

            // Crear las fechas del mes
            const datesInMonth = [];
            for (let day = 1; day <= daysInMonth; day++) {
                datesInMonth.push(`${currentYear}-${(parseInt(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
            }

            // Asignar el valor "4" (presente) a todas las fechas de asistencia de los estudiantes seleccionados
            selectedStudents.forEach(student => {
                // Inicializar la propiedad de ausencias si no existe
                student.absences = student.absences || [];

                datesInMonth.forEach(date => {
                    // Verificar si la fecha ya existe para evitar duplicados
                    if (!student.absences.some(a => a.date === date)) {
                        student.absences.push({
                            id: student.absences.length + 1, // Nuevo ID autoincrementado
                            type: "4", // Valor para "presente"
                            materiaId: materiaId,
                            grupoId: groupId,
                            date: date
                        });
                    }
                });
            });

            // Guardar los cambios en el localStorage
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Guardado', 'Asistencia del mes registrada correctamente para todos los estudiantes', 'success');
        }
    });
}
