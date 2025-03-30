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
<div class=" text-center">
 
    <div class="cargarEstudiantes" onclick="opcionesRegistrar('${student.id}', '${obtenerNombreMateria(student.materiaId)}', 
   ' ${obtenerNombreGrupo(student.groupId)}', '${student.cedula}  ')">

         <h5> ${capitalizeWords(student.name)} --${student.id}  
         
            </h5>
        <p class="card-text text-secondary cedula" > ${obtenerNombreMateria(student.materiaId)} ${obtenerNombreGrupo(student.groupId)} </p> <!-- Mostrar cédula -->
    
    </div>
</div>
`;
studentList.appendChild(studentItem);
});
}

