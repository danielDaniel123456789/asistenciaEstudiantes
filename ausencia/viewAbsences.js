function viewAbsences(index) {
    console.log("inicio "+index);
    const students = JSON.parse(localStorage.getItem('students')) || [];

    console.log(students);

    if (students.length > 0) {
        const student = students[0]; // Accede al primer objeto dentro del array
        console.log("ID:", student.id);
        console.log("Nombre:", student.name);
        console.log("Cédula:", student.cedula);
        console.log("absences:", student.absences);

        console.log("Ausencias del estudiante:");
student.absences.forEach((absence, index) => {
    console.log(`Ausencia ${index + 1}:`);
    console.log("Materia ID:", absence.materiaId);
    console.log("Grupo ID:", absence.grupoId);
    console.log("Tipo:", absence.type);
});
    } else {
        console.log("No hay estudiantes en el array.");
    }
  
    console.log("FIN"); 

    // Obtener todas las materias de las ausencias del estudiante (usando materiaId)
    const materias = [...new Set(student.absences.map(absence => absence.materiaId))];

    // Obtener la lista de todas las materias desde localStorage
    const materiasList = JSON.parse(localStorage.getItem('materias')) || [];

    // Mapear los materiaId a sus nombres correspondientes
    const materiaNames = materias.map(materiaId => {
        const materia = materiasList.find(m => m.id === parseInt(materiaId));
        return materia ? materia.nombre : `Materia desconocida ${materiaId}`;
    });

    // Mostrar Swal para seleccionar la materia con el nombre del estudiante en el título
    Swal.fire({
        title: `Seleccione la Materia de ${student.name} ${student.surname}`,
        html: `
            <select id="materiaSelect" class="swal2-input">
                <option value="">Seleccione una materia</option>
                ${materiaNames.map(materia => `<option value="${materia}">${materia}</option>`).join('')}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const selectedMateria = document.getElementById('materiaSelect').value;
            if (!selectedMateria) {
                Swal.showValidationMessage('Por favor seleccione una materia.');
                return false;
            }
            return selectedMateria;
        }
    }).then(result => {
        if (result.isConfirmed) {
            const selectedMateria = result.value;

            // Filtrar las ausencias por la materia seleccionada
            const filteredAbsences = student.absences.filter(absence => {
                const materia = materiasList.find(m => m.id === parseInt(absence.materiaId));
                return materia ? materia.nombre === selectedMateria : false;
            });

            if (filteredAbsences.length === 0) {
                Swal.fire('No hay ausencias registradas', 'Este estudiante no tiene ausencias registradas para esta materia.', 'info');
            } else {
                let absenceDetails = `
                    <button class="btn btn-info mb-3" onclick="copyStudentData(${index})">Pasar a Excel</button>
                    <button class="btn btn-info mb-3" onclick="copyStudentPadre(${index})">Informe al padre</button>
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

                filteredAbsences.forEach((absence, absenceIndex) => {
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

                Swal.fire({
                    title: `Informe de Ausencias de ${student.name} ${student.surname} - ${selectedMateria}`,
                    html: absenceDetails,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    focusConfirm: false
                });
            }
        }
    });
}
