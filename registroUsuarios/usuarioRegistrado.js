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
