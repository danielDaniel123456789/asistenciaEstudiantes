function viewTasks(studentId) {
    console.log("ID recibido:", studentId);
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    let nombreGrupo = "";

    // Buscar el grupo del estudiante
    for (let i = 0; i < grupos.length; i++) {
        if (grupos[i].id == studentId) {
            nombreGrupo = grupos[i].nombre;
            console.log(`Grupo encontrado: ID = ${grupos[i].id}, Nombre = ${grupos[i].nombre}`);
            break;
        }
    }

    // Buscar al estudiante por ID
    const student = students.find(s => s.id == studentId);

    if (!student) {
        console.log("Estudiante no encontrado.");
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    console.log("Estudiante encontrado:", student);

    // Obtener todas las materias desde localStorage
    const materiasList = JSON.parse(localStorage.getItem('materias')) || [];

    // Verificar si el estudiante tiene tareas registradas
    if (!student.tareas || student.tareas.length === 0) {
        Swal.fire('Sin Tareas', 'Este estudiante no tiene tareas asignadas.', 'info');
        return;
    }

    // Mapeamos los datos de tareas con sus respectivas materias
    const tareaDetails = student.tareas.map(tarea => {
        const materia = materiasList.find(m => m.id == tarea.materiaId);
        return {
            materia: materia ? materia.nombre : `Materia desconocida ${tarea.materiaId}`,
            puntos: tarea.puntos || tarea.score || "N/A",
            fechaEntrega: tarea.date
        };
    });

    console.log("Tareas mapeadas:", tareaDetails);

    // Crear el contenido HTML para la tabla de tareas
    let taskDetails = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Materia</th>
                    <th>Puntos</th>
                    <th>Fecha de Entrega</th>
                </tr>
            </thead>
            <tbody>
    `;

    tareaDetails.forEach(tarea => {
        taskDetails += `
            <tr>
                <td>${tarea.materia}</td>
                <td>${tarea.puntos}</td>
                <td>${tarea.fechaEntrega}</td>
            </tr>
        `;
    });

    taskDetails += `</tbody></table>`;

    // Mostrar SweetAlert2 con el resumen de tareas
    Swal.fire({
        html: `
        <br>
        <h5>Resumen de Tareas de ${student.name} - Grupo ${nombreGrupo}:</h5>
        ${taskDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        focusConfirm: false
    });
}
