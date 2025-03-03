function usuarioRegistrado() {
    const registroAsistencia = JSON.parse(localStorage.getItem('registroAsistencia'));

    if (registroAsistencia) {
        const fechaRegistro = new Date(registroAsistencia.fechaRegistro);
        console.log("Fecha de registro de asistencia: ", fechaRegistro);

        // Verificar si han pasado más de 2 minutos desde la fecha de registro
        const tiempoTranscurrido = new Date().getTime() - fechaRegistro.getTime();
        const minutosTranscurridos = tiempoTranscurrido / (1000 * 60); // Convertir a minutos

        if (minutosTranscurridos > 2) {
            mostrarModalCaduco(); // Mostrar el modal si han pasado más de 2 minutos
        }
    } else {
        console.log("No se ha registrado ninguna asistencia aún.");
    }
}

function mostrarModalCaducot() {
    // Mostrar el modal con un input para que el usuario ingrese los caracteres restantes
    Swal.fire({
        title: 'Clave parcial',
        html: `
       
            <h5>Codido Activación: ${claves[0].slice(0, 3)}</h5>
            <input id="claveInput" class="swal2-input" placeholder="Escribe los caracteres restantes" value="${claves[0].slice(0, 3)}">
        `,
        focusConfirm: false,
        showCancelButton: false,  // Mostrar botón de cancelar
        cancelButtonText: 'Cancelar',  // Texto del botón de cancelar
        confirmButtonText: 'Verificar',  // Texto del botón de confirmar
        allowOutsideClick: false,  // Evitar que el modal se cierre al hacer clic fuera
        preConfirm: () => {
            const claveInput = document.getElementById('claveInput').value;

            // Verificar que el valor ingresado coincida con los primeros 3 caracteres de alguna clave en el array
            const claveCompleta = claves.find(clave => clave.startsWith(claveInput));

            if (claveCompleta) {
                // Si hay coincidencia, completar el valor con los caracteres restantes
                pedirValorCompleto(claveCompleta);
            } else {
                Swal.showValidationMessage('La clave no coincide con los primeros 3 caracteres de ninguna clave.');
            }
        }
    });
}

// Función para pedir el valor completo de la clave
function pedirValorCompleto(claveCompleta) {
    Swal.fire({
        title: 'Introduzca la clave completa',
        html: `
            <label>Escribe la clave completa</label>
            <input id="claveCompletaInput" class="swal2-input" placeholder="Escribe la clave completa" value="${claveCompleta}">
        `,
        focusConfirm: false,
        showCancelButton: true,  // Mostrar botón de cancelar
        cancelButtonText: 'Cancelar',  // Texto del botón de cancelar
        confirmButtonText: 'Verificar',  // Texto del botón de confirmar
        preConfirm: () => {
            const claveCompletaInput = document.getElementById('claveCompletaInput').value;

            // Verificar si la clave completa coincide
            if (claveCompletaInput === claveCompleta) {
                Swal.fire('Éxito', 'La clave es correcta.', 'success');
            } else {
                Swal.showValidationMessage('La clave completa no es correcta.');
            }
        }
    });
}