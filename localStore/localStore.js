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
  