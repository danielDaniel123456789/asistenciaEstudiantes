function informeTrabajoCotidiano(index) {
    console.log("informeTrabajoCotidiano " + index);

    // Obtener los datos de localStorage
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    // Buscar al estudiante por ID
    const student = students.find(st => Number(st.id) === Number(index));
    if (!student) {
        Swal.fire({
            title: "No hay datos",
            text: "No se encontró el estudiante.",
            icon: "error",
        });
        console.log("No hay datos");
        return;
    }

    console.log("ID:", student.id);
    console.log("Nombre:", student.name);
    console.log("Cédula:", student.cedula);
    console.log("Trabajo cotidiano:", student.trabajoCotidiano);
    console.log("Materia ID:", student.materiaId);
    console.log("Grupo ID:", student.groupId);

    // Buscar la materia
    const materia = materias.find(m => Number(m.id) === Number(student.materiaId));
    const nomBreMateria = materia ? materia.nombre : "Materia no encontrada";

    // Buscar el grupo
    console.log("Grupos en localStorage:", grupos);
    let nombreGrupo = "Grupo no encontrado";
    const grupo = grupos.find(gr => Number(gr.id) === Number(student.groupId));
    if (grupo) {
        nombreGrupo = grupo.nombre;
        console.log(`Grupo encontrado: ID = ${grupo.id}, Nombre = ${grupo.nombre}`);
    } else {
        console.log("No se encontró el grupo para el estudiante.");
    }

    console.log("Materia:", nomBreMateria);

    // Crear la tabla de trabajo cotidiano
    let trabajoCotidianoDetails = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Mostrar los registros de trabajo cotidiano del estudiante
    student.trabajoCotidiano.forEach((trabajo, trabajoIndex) => {
        trabajoCotidianoDetails += `
            <tr>
                <td>${trabajo.date}</td>
                <td>${trabajo.type}</td>
                <td>${trabajo.detail ? trabajo.detail : 'No disponible'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarTrabajoCotidiano(${trabajoIndex}, ${student.id})">X</button>
                </td>
            </tr>
        `;
    });

    trabajoCotidianoDetails += `</tbody></table>`;

    // Mostrar SweetAlert2 con los datos del estudiante, grupo y materia
    Swal.fire({
        html: `
            <br>
            <h5>Trabajo Cotidiano</h5>
            <h5>Estudiante: ${student.name}</h5>
            <h5>Grupo: ${nombreGrupo}</h5>
            <h5>Materia: ${nomBreMateria}</h5>
            ${trabajoCotidianoDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire('Acción confirmada', 'Has revisado el trabajo cotidiano del estudiante.', 'success');
        }
    });
}
