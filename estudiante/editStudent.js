function editStudent(studentId) {
    // Obtener lista de estudiantes desde localStorage
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Buscar el estudiante por ID
    const student = students.find(s => Number(s.id) === Number(studentId));

    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    console.log("ID:", student.id);
    console.log("Nombre:", student.name);   
    console.log("Cédula:", student.cedula);
    console.log("Materia ID:", student.materiaId);
    console.log("Grupo ID:", student.groupId);
    
    // Obtener grupos y materias desde localStorage
    const groups = JSON.parse(localStorage.getItem('grupos')) || [];  
    const materias = JSON.parse(localStorage.getItem('materias')) || [];  

    // Convertir IDs a número para evitar problemas de comparación
    const studentGroupId = Number(student.groupId);
    const studentMateriaId = Number(student.materiaId);

    // Encontrar el nombre del grupo y materia actual del estudiante
    const currentGroup = groups.find(group => Number(group.id) === studentGroupId)?.nombre || 'No asignado';
    const currentMateria = materias.find(materia => Number(materia.id) === studentMateriaId)?.nombre || 'No asignada';

    // Generar las opciones de los grupos
    const groupOptions = groups.map(group => 
        `<option value="${group.id}" ${Number(group.id) === studentGroupId ? 'selected' : ''}>${group.nombre}</option>`
    ).join('');

    // Generar las opciones de las materias
    const subjectOptions = materias.map(materia => 
        `<option value="${materia.id}" ${Number(materia.id) === studentMateriaId ? 'selected' : ''}>${materia.nombre}</option>`
    ).join('');

    // Mostrar formulario de edición con Swal
    Swal.fire({
        title: `Editar Estudiante - Grupo: ${currentGroup} | Materia: ${currentMateria}`,  
        html: `   

        <div class="p-2">
         <label for="studentName">Nombre *</label>
            <input id="studentName" class="swal2-input" value="${student.name}" placeholder="Nombre">
        </div>

         <div class="p-2">

             <label for="studentCedula">Cédula (opcional)</label>
            <input id="studentCedula" class="swal2-input" value="${student.cedula || ''}" placeholder="Cédula" type="text">
     
        </div>


         <div class="p-2">
          <label for="groupSelect">Grupo *</label>
            <select id="groupSelect" class="form-select">
                ${groupOptions}
            </select>
        </div>

         <div class="p-2">
           <label for="materiaSelect">Materia *</label>
            <select id="materiaSelect" class="form-select">
                ${subjectOptions}
            </select>
        </div>
           
           <div class="p-2">
                <button class="swal2-confirm swal2-styled" onclick="deleteStudent(${studentId})">Eliminar Estudiante</button>
     
                </div>
        
          
       `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();
            const groupId = Number(document.getElementById('groupSelect').value); 
            const materiaId = Number(document.getElementById('materiaSelect').value);

            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }

            // Actualizar los datos del estudiante
            student.name = name;
            student.cedula = cedula || '';
            student.groupId = groupId;   
            student.materiaId = materiaId; 

            // Guardar cambios en localStorage
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Actualizado', 'Los datos del estudiante se han actualizado correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}
