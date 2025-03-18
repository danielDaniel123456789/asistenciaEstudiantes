function editStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];
    console.log("ID:", student.id);
    console.log("Nombre:", student.name);   
    console.log("Cédula:", student.cedula);
    console.log("Materia ID:", student.materiaId);
    console.log("Grupo ID:", student.groupId);


    // Cargar los grupos y materias desde localStorage
    const groups = JSON.parse(localStorage.getItem('grupos')) || [];  // Cargamos los grupos
    const materias = JSON.parse(localStorage.getItem('materias')) || [];  // Cargamos las materias

    // Encontrar el nombre del grupo y materia actual del estudiante
    const currentGroup = groups.find(group => group.id === parseInt(student.groupId))?.nombre || 'No asignado';
    const currentMateria = materias.find(materia => materia.id === parseInt(student.materiaId))?.nombre || 'No asignada';

    // Generar las opciones de los grupos
    const groupOptions = groups.map(group => 
        `<option value="${group.id}" ${group.id == parseInt(student.groupId) ? 'selected' : ''}>${group.nombre}</option>`
    ).join('');  // Asegúrate de que el value y el groupId sean comparables

    // Generar las opciones de las materias
    const subjectOptions = materias.map(materia => 
        `<option value="${materia.id}" ${materia.id == parseInt(student.materiaId) ? 'selected' : ''}>${materia.nombre}</option>`
    ).join('');  // Asegúrate de que el value y el materiaId sean comparables

    // Mostrar formulario de edición utilizando Swal
    Swal.fire({
        title: `Editar Estudiante - Grupo: ${currentGroup} | Materia: ${currentMateria}`,  // Mostrar grupo y materia en el título
        html: `
            <br><br><br>
            <label for="studentName">Nombre *</label>
            <input id="studentName" class="swal2-input" value="${student.name}" placeholder="Nombre">
            <br><br><br>
            <label for="studentCedula">Cédula (opcional)</label>
            <input id="studentCedula" class="swal2-input" value="${student.cedula || ''}" placeholder="Cédula" type="text">
            <br><br><br>
            <label for="groupSelect">Grupo *</label>
            <select id="groupSelect" class="swal2-input">
                ${groupOptions}
            </select>
            <br><br><br>
            <label for="materiaselect">Materia *</label>
            <select id="materiaselect" class="swal2-input">
                ${subjectOptions}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();
            const groupId = document.getElementById('groupSelect').value; // Obtener el valor del grupo seleccionado
            const materiaId = document.getElementById('materiaselect').value; // Obtener el valor de la materia seleccionada

            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }

            // Actualizar los datos del estudiante
            student.name = name;
            student.cedula = cedula || '';
            student.groupId = groupId;   // Actualizamos el groupId
            student.materiaId = materiaId; // Actualizamos el materiaId

            // Actualizar el array de estudiantes en localStorage
            students[index] = student;
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Actualizado', 'Los datos del estudiante se han actualizado correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}
