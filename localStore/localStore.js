
function obtenerEstudiantes() {

  return  localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
}


function obtenerNombreMateria(id) {
  // Obtener los datos del localStorage y parsearlos a un array
  let materias = JSON.parse(localStorage.getItem("materias")) || [];

  // Convertir id a número para asegurar una comparación correcta
  let materia = materias.find(m => m.id === Number(id));

  // Retornar el nombre si se encuentra, de lo contrario, un mensaje de error
  return materia ? materia.nombre : "Materia no encontrada";
}

function obtenerGrupos() {
    let grupos = localStorage.getItem('grupos') ? JSON.parse(localStorage.getItem('grupos')) : [];
    return grupos;
  }
  function obtenerMaterias() {
    let materias = localStorage.getItem('materias') ? JSON.parse(localStorage.getItem('materias')) : [];
    return materias;
  }
  

  function studentGroup(){
    let grupos = localStorage.getItem('grupos') ? JSON.parse(localStorage.getItem('grupos')) : [];
    
    // Generar las opciones para el select
    let grupoOptions = grupos.map(grupo => `<option value="${grupo.id}">${grupo.nombre}</option>`).join('');
  
    // Retornar el select con las opciones generadas
    return `
      <select id="studentGroup" class="form-select">
        <option value="" disabled selected>Selecciona un grupo</option>
        ${grupoOptions}
      </select>
    `;
  }
  

 function studentMateria() {
    let materias = obtenerMaterias();

    // Verificar si hay materias disponibles
    if (materias.length === 0) {
        return `<p style="color: red;">No hay materias disponibles. Agregue una materia primero.</p>`;
    }

    // Crear opciones para el selector de materias
    let materiaOptions = materias.map(materia => `<option value="${materia.id}">${materia.nombre}</option>`).join('');

    // Devolver el select de materias
    return `
        <select id="studentMateria" class="form-select">
            <option value="" disabled selected>Selecciona una materia</option>
            ${materiaOptions}
        </select>
    `;
}
