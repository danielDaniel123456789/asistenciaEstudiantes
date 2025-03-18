function informeTrabajoCotidiano(index) {
    console.log("informeTrabajoCotidiano " + index);

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    let nombreGrupo = "";
    console.log("grupos ", grupos);

    // Filtrar el grupo por ID
    const grupo = grupos.find(gr => gr.id === index);
    if (grupo) {
        nombreGrupo = grupo.nombre;
        console.log(`Grupo encontrado: ID = ${grupo.id}, Nombre = ${grupo.nombre}`);
    } else {
        alert("No encontrado");
        console.log("Grupo no encontrado");
        return;
    }

    // Filtrar el estudiante por ID
    const student = students.find(st => st.id === index);
    if (student) {
        console.log("ID:", student.id);
        console.log("Nombre:", student.name);
        console.log("Cédula:", student.cedula);
        console.log("trabajoCotidiano:", student.trabajoCotidiano);
        console.log("materiaID:", student.materiaId);

        const materia = JSON.parse(localStorage.getItem('materias')) || [];
        const materias = materia.find(m => m.id === student.materiaId);
       
     //   nomBreMateria = materias.nombre;
        console.log("nomBreMateria");

        // Crear el contenido HTML para la tabla de trabajo cotidiano
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

        // Mostrar los registros de trabajo cotidiano del estudiante en la tabla
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

        // Mostrar SweetAlert2 con los datos del estudiante, el grupo, y el trabajo cotidiano
        Swal.fire({
            html: `
                <br>
                  <h5>Trabajo Cotidiano.</h5>
                     <h5>Estudiante: ${student.name}</h5>
                  <h5> Grupo: ${nombreGrupo}</h5>
                 <h5>Materia ${nomBreMateria}</h5>
                ${trabajoCotidianoDetails}
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            focusConfirm: false
        }).then(result => {
            if (result.isConfirmed) {
                // Acción adicional si es necesario
                Swal.fire('Acción confirmada', 'Has revisado el trabajo cotidiano del estudiante.', 'success');
            }
        });
    } else {
        alert("No encontrado");
        console.log("Estudiante no encontrado");
    }
}

