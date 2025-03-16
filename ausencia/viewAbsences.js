function viewAbsences(index) {
    console.log("inicio " + index);
    const students = JSON.parse(localStorage.getItem('students')) || [];

    if (students.length > 0) {
        const student = students[0]; // Accede al primer objeto dentro del array
        console.log("ID:", student.id);
        console.log("Nombre:", student.name);
        console.log("Cédula:", student.cedula);
        console.log("absences:", student.absences);

        // Verificar si el apellido (surname) está definido, si no lo está, usar una cadena vacía
        const surname = student.surname || '';

        // Obtener todas las materias desde localStorage
        const materiasList = JSON.parse(localStorage.getItem('materias')) || [];
        console.log("Materias desde localStorage:", materiasList); // Imprime la lista completa de materias

        // Mapeamos los materiaId de las ausencias a sus nombres correspondientes
        const materiaNames = student.absences.map(absence => {
            const materia = materiasList.find(m => m.id === parseInt(absence.materiaId));
            return materia ? materia.nombre : `Materia desconocida ${absence.materiaId}`;
        });

        console.log("Materias mapeadas para las ausencias del estudiante:");
        console.table(materiaNames); // Imprime las materias correspondientes a las ausencias

        // Ahora obtenemos la primera materia (porque el título debe contener el nombre de la materia)
        const selectedMateria = materiaNames[0] || 'Materia no disponible';

        // Crear el contenido HTML para la tabla de ausencias
        let absenceDetails = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Mostrar las ausencias del estudiante en la tabla
        student.absences.forEach((absence, absenceIndex) => {
            absenceDetails += `
                <tr>
                    <td>${absence.date}</td>
                    <td>${absence.type}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="editAbsence(${index}, ${absenceIndex})">
                            ✏️ </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAbsence(${index}, ${absenceIndex})">X</button>
                    </td>
                </tr>
            `;
        });

        absenceDetails += `</tbody></table>`;

        // Mostrar SweetAlert2 con los datos del estudiante, la materia y la tabla de ausencias
        Swal.fire({
            title: `Informe de Ausencias de ${student.name} ${surname} - Materia: ${selectedMateria}`,
            html: absenceDetails,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            focusConfirm: false
        }).then(result => {
            if (result.isConfirmed) {
                // Acción adicional si es necesario (por ejemplo, exportar a Excel)
                Swal.fire('Acción confirmada', 'Has revisado las ausencias del estudiante.', 'success');
            }
        });
    } else {
        console.log("No hay estudiantes en el array.");
    }

    console.log("FIN");
}
