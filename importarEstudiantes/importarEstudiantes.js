function importarEstudiantes() {
    // Obtener los grupos y materias desde localStorage
    const grupos = JSON.parse(localStorage.getItem("grupos")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];

    // Generar las opciones del select de grupos
    const selectGrupoOptions = grupos.map(grupo => 
        `<option value="${grupo.id}">${grupo.nombre}</option>`
    ).join("");

    // Generar las opciones del select de materias
    const selectMateriaOptions = materias.map(materia => 
        `<option value="${materia.id}">${materia.nombre}</option>`
    ).join("");

    Swal.fire({
        title: "Importar Estudiantes",
        html: `
        <div class="p-2">
            <label for="grupoSelect"><strong>Selecciona un grupo:</strong></label>
            <select id="grupoSelect" class="form-select">
                ${selectGrupoOptions}
            </select>
        </div>

        <div class="p-2">
            <label for="materiaSelect"><strong>Selecciona una materia:</strong></label>
            <select id="materiaSelect" class="form-select">
                ${selectMateriaOptions}
            </select>
        </div>

        <p>Pega los nombres y cédulas de los estudiantes:</p>
        <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
                <label for="studentTextarea"><strong>Nombres:</strong></label>
                <textarea id="studentTextarea" rows="6" style="width:100%;"></textarea>
            </div>
            <div style="flex: 1;">
                <label for="cedulaTextarea"><strong>Cédulas:</strong></label>
                <textarea id="cedulaTextarea" rows="6" style="width:100%;"></textarea>
            </div>
        </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Importar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedGroup = document.getElementById("grupoSelect").value;
            const selectedMateria = document.getElementById("materiaSelect").value;
            const namesText = document.getElementById("studentTextarea").value.trim();
            const cedulasText = document.getElementById("cedulaTextarea").value.trim();

            let names = namesText.split("\n")
                .map(name => capitalizeWords(name.trim())) // Convierte cada palabra a "Capitalizada"
                .filter(name => name !== "");

            const cedulas = cedulasText.split("\n").map(cedula => cedula.trim()).filter(cedula => cedula !== "");

            if (!selectedGroup) {
                Swal.fire("Error", "Debes seleccionar un grupo.", "error");
                return;
            }

            if (!selectedMateria) {
                Swal.fire("Error", "Debes seleccionar una materia.", "error");
                return;
            }

            if (names.length === 0) {
                Swal.fire("Error", "No se ingresaron nombres.", "error");
                return;
            }

            if (cedulas.length === 0) {
                Swal.fire("Error", "No se ingresaron cédulas.", "error");
                return;
            }

            if (names.length !== cedulas.length) {
                Swal.fire("Error", "El número de nombres y cédulas no coincide.", "error");
                return;
            }

            // Obtener los estudiantes almacenados para generar el siguiente ID
            const existingStudents = JSON.parse(localStorage.getItem("students")) || [];
            const lastStudent = existingStudents.length > 0 ? existingStudents[existingStudents.length - 1] : null;
            const nextId = lastStudent ? lastStudent.id + 1 : 1; // Asigna el siguiente ID autoincremental

            // Convertimos cada nombre y cédula en un objeto con la estructura esperada
            const newStudents = names.map((name, index) => ({
                id: nextId + index, // Asignar el ID incrementado
                name,
                cedula: cedulas[index],
                absences: [],
                materiaId: selectedMateria, // Asociamos la materia seleccionada
                trabajoCotidiano: [],
                groupId: selectedGroup // Asociamos el estudiante con el grupo seleccionado
            }));

            // Fusionar los estudiantes existentes con los nuevos
            const updatedStudents = [...existingStudents, ...newStudents];

            localStorage.setItem("students", JSON.stringify(updatedStudents));
            Swal.fire("Éxito", "Estudiantes importados correctamente.", "success");
            loadStudents(); // Recargar la lista
        }
    });
}
