function usuarioRegistrado() {
    // Asegurar que el valor obtenido de localStorage siempre sea un número válido
    const estadoUsuarioRegistrado = Number(localStorage.getItem('estadoUsuarioRegistrado'));
    console.log("obtenerFechaRegistro:", obtenerFechaRegistro());

    // Si estadoUsuarioRegistrado es exactamente 1, siempre mostrar el modal
    if (estadoUsuarioRegistrado === 1) {
        console.log("Ya se registró");
        return; // Terminar la ejecución para evitar que siga procesando
    }
    else {
        // Verificar si la fecha de registro existe, si no existe, crearla
        let registroAsistencia = obtenerFechaRegistro();
        if (!registroAsistencia) {
            console.log("Fecha de registro no encontrada. Creando fecha de registro...");
            fechaRegistroCrear(); // Crear la fecha de registro
            registroAsistencia = obtenerFechaRegistro(); // Obtener la fecha creada
        }

        console.log("Debe registrarse:");
        if (registroAsistencia) {
            // Obtener la fecha de registro en formato "año-mes-día"
            const [año, mes, dia] = registroAsistencia.split('-').map(Number);
            const fechaRegistro = new Date(año, mes - 1, dia); // El mes comienza desde 0 en JavaScript
            console.log("Fecha de registro de asistencia:", fechaRegistro);
    
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
