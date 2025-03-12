function addStudent() {
    // Cargar los grupos desde el localStorage
    let grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    // Verificar si hay grupos para mostrar
    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos disponibles. Por favor, agregue un grupo primero.', 'info');
        return;
    }

    // Crear las opciones del selector de grupos
    let grupoOptions = grupos.map(grupo => `<option value="${grupo.id}">${grupo.nombre}</option>`).join('');

    // Abrir SweetAlert para agregar un estudiante
    Swal.fire({
        title: 'Agregar Estudiante',
        html: `
            <input id="studentName" class="swal2-input" placeholder="Nombre">
            <input id="studentCedula" class="swal2-input" placeholder="Cédula (opcional)" type="text">
            <select id="studentGroup" class="swal2-input">
                <option value="" disabled selected>Selecciona un grupo</option>
                ${grupoOptions}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();
            const groupId = document.getElementById('studentGroup').value;

            // Verificar que al menos el nombre y el grupo estén seleccionados
            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }
            if (!groupId) {
                Swal.showValidationMessage('Debe seleccionar un grupo');
                return false;
            }

            // Crear objeto del estudiante
            const student = {
                name: name,
                cedula: cedula || '', // Si no se ingresa, se guarda como cadena vacía
                groupId: groupId, // Guardamos solo el ID del grupo
                absences: []
            };

            saveStudent(student);
        }
    });
}