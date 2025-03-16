function viewAbsences(index) {
    console.log("inicio "+index);
    const students = JSON.parse(localStorage.getItem('students')) || [];

    console.log(students);
    //const student = students[index];
    const studentData = students.find(s => s.id === studentId);
    console.log("d2 "+studentData);
    console.log("fin ");
    // Verificar si la propiedad 'absences' existe en el estudiante
    if (!student || !student.absences || student.absences.length === 0) {
        Swal.fire('Error', 'Este estudiante no tiene ausencias registradas.', 'error');
        return; // Salir si no hay información válida
    }

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
