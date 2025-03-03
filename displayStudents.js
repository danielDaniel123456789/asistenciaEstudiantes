function displayStudents(students) {
    const studentList = document.getElementById('studentList');
    
    // Limpiar lista actual
    studentList.innerHTML = ''; 

    // Verificar si el array de estudiantes está vacío
    if (students.length === 0) {
        studentList.innerHTML = "<p>No se encontraron estudiantes con ese criterio.</p>";
        return;  // Terminar la ejecución si no hay estudiantes para mostrar
    }

    // Recorrer los estudiantes y mostrarlos
    students.forEach((student, index) => {  // Aquí agregamos 'index' como segundo parámetro
        const studentCard = document.createElement('div');
        studentCard.classList.add('col-md-4', 'student-card');
        
        studentCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${student.name} ${student.surname} ${student.secondSurname}</h5>
                    <p class="card-text">Cédula: ${student.id}</p>
                    <button class="btn btn-info" onclick="viewAbsences(${index})">Informe</button> <!-- Pasar el índice aquí -->
                </div>
            </div>
        `;
        
        studentList.appendChild(studentCard); // Agregar la tarjeta al contenedor
    });
}

