function informesPresentar() {
    Swal.fire({
        title: '📊 Selecciona un informe',
        html: `
            <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <button onclick="informeTrabajoCotidiano()" class="swal-btn">📌 Cálculo Trabajo Cotidiano</button>
                <button onclick="informeGeneralTareas()" class="swal-btn">📌 Informe General Tareas</button>
                <button onclick="informeGeneralPruebas()" class="swal-btn">📌 Informe General Pruebas</button>
                <button onclick="informeMesAsistencia()" class="swal-btn">📌 Informe Mes Asistencia</button>
            </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom'
        }
    });
}

// Agregamos estilos para mejorar la apariencia de los botones
const style = document.createElement('style');
style.innerHTML = `
    .swal-btn {
        background-color: #007bff;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-align: left;
        font-size: 14px;
        width: 100%;
    }
    .swal-btn:hover {
        background-color: #0056b3;
    }
    .swal-custom {
        width: 320px;
        border-radius: 10px;
    }
`;
document.head.appendChild(style);
