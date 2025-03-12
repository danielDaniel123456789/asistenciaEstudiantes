// Función para registrar una ausencia con materia
function registerAbsence(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId); // Buscar al estudiante por ID

    console.log('Estudiante encontrado:', student); // Verificar los datos del estudiante

    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    // Obtener las materias almacenadas en localStorage
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    console.log('Materias en localStorage:', materias); // Verificar las materias disponibles

    // Verifica si la materia asociada existe utilizando la propiedad correcta (materiaId)
    const materia = materias.find(m => m.id === student.materiaId); // Usamos student.materiaId
    console.log('Materia encontrada:', materia); // Verificar la materia encontrada

    // Obtener los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    console.log('Grupos en localStorage:', grupos); // Verificar los grupos disponibles

    // Buscar el nombre del grupo en base al groupId del estudiante
    const grupo = grupos.find(g => g.id === student.groupId);
    console.log('Grupo encontrado:', grupo); // Verificar el grupo encontrado

    // Mostrar los datos del estudiante antes de registrar la ausencia
    alert(JSON.stringify(student, null, 2));  // Muestra todo el objeto estudiante en formato legible
}
