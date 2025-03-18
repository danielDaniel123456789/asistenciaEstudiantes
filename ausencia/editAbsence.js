function editAbsence(studentIndex, absenceIndex, absenceID) {
    console.log('studentIndex:', studentIndex);
    console.log('absenceIndex:', absenceIndex);
    console.log('absenceID:', absenceID);
    const students = JSON.parse(localStorage.getItem('students')) || [];

    // Filtra el estudiante por ID
    const student = students.find(student => student.id === studentIndex);

    if (student) {
        console.log(`Estudiante encontrado:`, student);

        if (student.absences && student.absences.length > 0) {
            // Buscar la ausencia con el ID proporcionado
            const absence = student.absences.find(absence => absence.id === absenceID);

            if (absence) {
                console.log(`Ausencia encontrada:`, absence);

                // Mostrar el cuadro de SweetAlert2 con el select para modificar el tipo
                Swal.fire({
                    title: `Modificar tipo de ausencia`,
                    html: `
                        <strong>Fecha:</strong> ${absence.date} <br>
                        <strong>Tipo actual:</strong> ${absence.type || 'No especificado'} <br>
                        <label for="absenceType">Selecciona el nuevo tipo de ausencia:</label>
                        <select id="absenceType" class="form-select">
                            <option value="justificada" ${absence.type === 'justificada' ? 'selected' : ''}>Ausencia Justificada</option>
                            <option value="injustificada" ${absence.type === 'injustificada' ? 'selected' : ''}>Ausencia Injustificada</option>
                            <option value="tardía" ${absence.type === 'tardía' ? 'selected' : ''}>Llegó tarde a clases</option>
                        </select>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancelar',
                    preConfirm: () => {
                        // Obtener el valor seleccionado del select
                        const newType = document.getElementById('absenceType').value;

                        // Actualizar el tipo de la ausencia
                        absence.type = newType;

                        // Guardar los cambios en localStorage
                        students[students.indexOf(student)] = student; // Asegurarse de actualizar el estudiante en el array
                        localStorage.setItem('students', JSON.stringify(students));

                        // Confirmar que el tipo se ha actualizado
                        Swal.fire({
                            title: 'Tipo de ausencia actualizado',
                            text: `El tipo de ausencia ha sido cambiado a: ${newType}`,
                            icon: 'success'
                        });
                    }
                });
            } else {
                console.log(`No se encontró la ausencia con ID ${absenceID}`);
                Swal.fire({
                    title: 'Error',
                    text: `No se encontró la ausencia con ID ${absenceID}`,
                    icon: 'error'
                });
            }
        } else {
            console.log(`El estudiante no tiene ausencias registradas.`);
            Swal.fire({
                title: 'Sin ausencias',
                text: `El estudiante ${student.name} no tiene ausencias registradas.`,
                icon: 'info'
            });
        }
    } else {
        console.log(`No se encontró el estudiante con ID ${studentIndex}`);
        Swal.fire({
            title: 'Error',
            text: `No se encontró el estudiante con ID ${studentIndex}`,
            icon: 'error'
        });
    }
}
