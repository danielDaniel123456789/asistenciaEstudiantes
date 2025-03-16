function registerAbsence(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const student = students.find(s => s.id === studentId); // Buscar al estudiante por ID

    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    console.log('student:', student);
    
    const idEstudiante = student.id;
    const idMateria = Number(student.materiaId); // Convertir a número
    const idGrupo = Number(student.groupId); // Convertir a número

    console.log('idMateria:', idMateria);
    console.log('idGrupo:', idGrupo);

    // Buscar la materia correspondiente
    const materia = materias.find(m => m.id === idMateria);
    // Buscar el grupo correspondiente
    const grupo = grupos.find(g => g.id === idGrupo);

    console.log('materias:', materias);
    console.log('materia encontrada:', materia);
    console.log('grupos:', grupos);
    console.log('grupo encontrado:', grupo);

    if (!materia) {
        Swal.fire('Error', 'Materia no encontrada', 'error');
        return;
    }

    if (!grupo) {
        Swal.fire('Error', 'Grupo no encontrado', 'error');
        return;
    }

    // Obtener la fecha actual en formato YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

    // Mostrar la alerta con opciones de ausencia
    Swal.fire({
        html: `
        <h5>Registrar Ausencia:</h5>
            <strong>Estudiante:</strong><br>
            Nombre: ${student.name}<br>
            ID: ${student.id}<br>
            Grupo: ${grupo.nombre}<br>
            Materia: ${materia.nombre}<br><br>
            <label for="absenceType">Seleccionar tipo de ausencia:</label>
            <br>
            <select id="absenceType" class="form-select">
                <option value="justificada">Ausencia Justificada</option>
                <option value="injustificada">Ausencia Injustificada</option>
                <option value="tardía">Llegó tarde a clases</option>
            </select>
        `,
      
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            const absenceType = document.getElementById('absenceType').value;
            console.log('Tipo de ausencia seleccionada:', absenceType);

            // Buscar al estudiante y agregar la ausencia con materiaId, grupoId y la fecha
            const updatedStudents = students.map(s => {
                if (s.id === studentId) {
                    s.absences.push({
                        type: absenceType,
                        materiaId: materia.id,   // Guardar el materiaId
                        grupoId: grupo.id,       // Guardar el grupoId
                        date: currentDate        // Agregar la fecha de la ausencia
                    });
                }
                return s;
            });

            // Actualizar el localStorage con los estudiantes modificados
            localStorage.setItem('students', JSON.stringify(updatedStudents));

            Swal.fire('Guardado', 'Ausencia registrada correctamente', 'success');
        }
    });
}
