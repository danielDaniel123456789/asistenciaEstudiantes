function mostrarModalCaducot() {
    // Seleccionar una clave aleatoria del array
    const claveAleatoria = claves[Math.floor(Math.random() * claves.length)];

    Swal.fire({
        html: `
            <h5>Código de Activación:</h5>
            <h3>${claveAleatoria.slice(0, 3)}</h3> <!-- Muestra los primeros 3 caracteres de la clave aleatoria -->
            <input id="claveInput" class="swal2-input" placeholder="Escribe la clave completa">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Verificar',
        allowOutsideClick: false,
        preConfirm: () => {
            const claveInput = document.getElementById('claveInput').value.trim();

            // Verificar si la clave ingresada coincide con la clave aleatoria seleccionada
            if (claveInput === claveAleatoria) {
                // Si la clave es correcta, mostrar mensaje de éxito y cerrar el modal
                Swal.fire({
                    icon: 'success',
                    title: 'Clave correcta',
                    text: 'Has ingresado la clave correctamente.',
                });

                // Guardar el estado de usuario registrado como 1 en localStorage
                localStorage.setItem('estadoUsuarioRegistrado', JSON.stringify(1));

                return true; // Retorna true para cerrar el modal
            } else {
                Swal.showValidationMessage('La clave ingresada no es correcta.');
                return false; // No cierra el modal si la clave es incorrecta
            }
        },
        footer: `<a href="https://wa.me/50685502748?text=Contacta%20a%20Daniel%20para%20que%20te%20pase%20la%20clave%20de%20acceso." target="_blank">¿No tienes la clave? Contacta a Daniel</a>`
    });
}
