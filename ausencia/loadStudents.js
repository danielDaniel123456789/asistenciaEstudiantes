function loadStudents(students = null) {
// Si no se pasan estudiantes, obtenerlos desde localStorage
students = obtenerEstudiantes();

const studentList = document.getElementById('studentList');
studentList.innerHTML = ''; // Limpiar lista antes de cargar

// Si no hay estudiantes, se muestra un mensaje
if (students.length === 0) {
studentList.innerHTML = "<p>No hay estudiantes registrados.</p>";
}

students.forEach((student) => {
const studentItem = document.createElement('div');
studentItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'student-card');
studentItem.innerHTML = `
<div class="card text-center">
    <div class="card-body" onclick="opcionesRegistrar('${student.id}')">
    <h6 class="text-danger"> ${obtenerNombreMateria(student.materiaId)} ${obtenerNombreGrupo(student.groupId)}</h6>
         <h5> ${capitalizeWords(student.name)} --${student.id}  
         
            </h5>
        <p class="card-text text-secondary cedula" >Cédula: ${student.cedula || 'No disponible'}</p> <!-- Mostrar cédula -->
    
    </div>
</div>
`;
studentList.appendChild(studentItem);
});
}

