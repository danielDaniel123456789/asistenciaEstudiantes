function datosGeneralesEspecificos(materiaId, groupId) {
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    
    if (!materiaId || !groupId) {
        Swal.fire('Error', 'Materia o grupo no definidos.', 'error');
        return;
    }
    
    const selectedStudents = students.filter(s => s.groupId === groupId && s.materiaId === materiaId);
    
    if (selectedStudents.length === 0) {
        Swal.fire('Información', 'No hay estudiantes en este grupo y materia.', 'info');
        return;
    }
    
    Swal.fire({
        title: 'Confirmar Registro de Datos',
        text: `Se registrarán datos para la materia seleccionada en el grupo seleccionado.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarAmbasCalificaciones(groupId, materiaId, selectedStudents);
        }
    });
}
