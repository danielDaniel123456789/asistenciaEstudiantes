// Función para agregar una materia
function addMateria() {
    Swal.fire({
        title: 'Agregar Materia',
        html: `
            <input id="materiaName" class="swal2-input" placeholder="Nombre de la materia">
        `,
        focusConfirm: false,
        showCancelButton: true, // Mostrar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        confirmButtonText: 'Agregar', // Texto del botón de confirmar
        preConfirm: () => {
            const materiaName = document.getElementById('materiaName').value;

            // Verificar que el campo no esté vacío
            if (materiaName) {
                // Obtener la lista de materias del localStorage
                const materias = JSON.parse(localStorage.getItem('materias')) || [];

                // Agregar la nueva materia a la lista
                materias.push(materiaName);

                // Guardar la lista de materias actualizada en localStorage
                localStorage.setItem('materias', JSON.stringify(materias));

                // Verificar si es la primera materia que se agrega
                if (materias.length === 1) {
                    // Crear el registro de asistencia con la fecha de registro
                    const registro = {
                        fechaRegistro: new Date().toISOString() // Guardar la fecha en formato ISO
                    };
                    localStorage.setItem('registroAsistencia', JSON.stringify(registro));
                    console.log("Registro de asistencia creado:", registro); // Solo para depuración
                }

                Swal.fire('Agregada', 'La materia ha sido agregada correctamente.', 'success');
                loadMaterias(); // Recargar la lista de materias
            } else {
                Swal.showValidationMessage('Por favor ingrese el nombre de la materia');
            }
        }
    });
}

function loadMaterias() {
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const materiaList = document.getElementById('materiaList');

    // Verificar que el contenedor existe antes de intentar modificarlo
    if (materiaList) {
        // Limpiar la lista antes de volver a cargar
        materiaList.innerHTML = '';

        materias.forEach((materia, index) => {
            const materiaCard = document.createElement('div');
            materiaCard.classList.add('col-md-4', 'student-card');
            materiaCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${materia}</h5>
                        <button class="btn btn-danger" onclick="deleteMateria(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            materiaList.appendChild(materiaCard);
        });
    } else {
        console.error('El contenedor de materias no existe en el DOM.');
    }
}


// Función para eliminar una materia
function deleteMateria(index) {
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    materias.splice(index, 1); // Eliminar la materia de la lista

    // Actualizar el localStorage
    localStorage.setItem('materias', JSON.stringify(materias));

    // Recargar la lista de materias
    loadMaterias();
}
