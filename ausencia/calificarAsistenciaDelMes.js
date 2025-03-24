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

            if (selectedStudents.length === 0) {
                Swal.showValidationMessage('No hay estudiantes en este grupo y materia');
                return false;
            }

            // Verificar si ya existe asistencia registrada para este mes
            const monthNumber = parseInt(month) + 1; // Convertir a número de mes (1-12)
            const currentYear = new Date().getFullYear();
            
            const hasExistingRecords = selectedStudents.some(student => {
                return (student.absences || []).some(absence => {
                    const absenceDate = new Date(absence.date);
                    return absenceDate.getFullYear() === currentYear && 
                           absenceDate.getMonth() + 1 === monthNumber &&
                           absence.grupoId === groupId &&
                           absence.materiaId === materiaId;
                });
            });

            if (hasExistingRecords) {
                Swal.showValidationMessage('Ya existe asistencia registrada para este mes, grupo y materia');
                return false;
            }

            // Obtener el número de días del mes seleccionado
            let daysInMonth = new Date(currentYear, monthNumber, 0).getDate();

            // Crear las fechas del mes
            const datesInMonth = [];
            for (let day = 1; day <= daysInMonth; day++) {
                datesInMonth.push(`${currentYear}-${monthNumber.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
            }

            // Asignar el valor "4" (presente) a todas las fechas de asistencia de los estudiantes seleccionados
            selectedStudents.forEach(student => {
                student.absences = student.absences || [];
                
                datesInMonth.forEach(date => {
                    student.absences.push({
                        id: Date.now() + Math.floor(Math.random() * 1000), // ID único
                        type: "4", // Valor para "presente"
                        materiaId: materiaId,
                        grupoId: groupId,
                        date: date
                    });
                });
            });

            // Guardar los cambios en el localStorage
            localStorage.setItem('students', JSON.stringify(students));

            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Guardado', 'Asistencia del mes registrada correctamente para todos los estudiantes', 'success');
        }
    });
}