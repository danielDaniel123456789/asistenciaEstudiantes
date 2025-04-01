function usuarioRegistrado() {
    // Asegurar que el valor obtenido de localStorage siempre sea un número válido
    const estadoUsuarioRegistrado = Number(localStorage.getItem('estadoUsuarioRegistrado'));
    console.log("Estado de usuario registrado:", estadoUsuarioRegistrado);

    // Si estadoUsuarioRegistrado es exactamente 1, siempre mostrar el modal
    if (estadoUsuarioRegistrado === 1) {
        console.log("Ya se registro");
        return; // Terminar la ejecución para evitar que siga procesando
    }
    else  {

        console.log("Debe registrase:");
        const registroAsistencia = JSON.parse(localStorage.getItem('registroAsistencia'));

        if (registroAsistencia) {
            const fechaRegistro = new Date(registroAsistencia.fechaRegistro);
            console.log("Fecha de registro de asistencia: ", fechaRegistro);
    
            // Verificar si han pasado más de 10 días desde la fecha de registro
            const tiempoTranscurrido = new Date().getTime() - fechaRegistro.getTime();
            const diasTranscurridos = tiempoTranscurrido / (1000 * 60 * 60 * 24); // Convertir a días
    
            if (diasTranscurridos > 10) {
                mostrarModalCaducot(); // Mostrar el modal si han pasado más de 10 días
            }
        } else {
            console.log("No se ha registrado ninguna asistencia aún.");
        }
    }
}



let intentosRestantes = 10; // Se inicializa el contador de intentos

function mostrarModalCaducot() {
    const claveAleatoria = claves[Math.floor(Math.random() * claves.length)];

    Swal.fire({
        html: `
            <h5>Código de Activación:</h5>
            <h3>${claveAleatoria.slice(0, 3)}</h3> 
            <input id="claveInput" class="swal2-input" placeholder="Escribe la clave completa">
            <p id="intentosRestantes" style="color:red;">Intentos restantes: ${intentosRestantes}</p>
        `,
        focusConfirm: false,
        showCancelButton: intentosRestantes > 0, // Si los intentos llegan a 0, oculta el botón cancelar
        confirmButtonText: 'Verificar',
        allowOutsideClick: false,
        preConfirm: () => {
            const claveInput = document.getElementById('claveInput').value.trim();

            if (claveInput === claveAleatoria) {
                Swal.fire({
                    icon: 'success',
                    title: 'Clave correcta',
                    text: 'Has ingresado la clave correctamente.',
                });

                localStorage.setItem('estadoUsuarioRegistrado', JSON.stringify(1));
                return true;
            } else {
                intentosRestantes--;

                if (intentosRestantes <= 0) {
                    // Si no quedan intentos, ocultar el botón de cancelar
                    return Swal.fire({
                        icon: 'error',
                        title: 'Intentos agotados',
                        text: 'Debes ingresar la clave correcta para continuar.',
                        allowOutsideClick: false,
                        showCancelButton: false, // Deshabilita el botón de cancelar
                        confirmButtonText: 'Intentar de nuevo'
                    }).then(() => mostrarModalCaducot()); // Volver a mostrar el modal
                }

                Swal.showValidationMessage(`Clave incorrecta. Intentos restantes: ${intentosRestantes}`);
                document.getElementById("intentosRestantes").innerHTML = `Intentos restantes: ${intentosRestantes}`;
                return false;
            }
        },
        footer: `<a href="https://wa.me/50685502748?text=Contacta%20a%20Daniel%20para%20que%20te%20pase%20la%20clave%20de%20acceso." target="_blank">¿No tienes la clave? Contacta a Daniel</a>`
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