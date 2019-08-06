import Swal from 'sweetalert2';
export const actualizarAvance = () => {
    //Seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if(tareas.length){
    //Seleccionar Tareas completadas

    const tareasCompletas = document.querySelectorAll('i.completo');
    const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
    //Mostrar el avance
     //Calcular el avance
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';
    if(avance === 100){
        Swal.fire(
            'Completaste el proyecto',
            'Felicidades has terminado tus tareas',
            'success'
        )
    }
    }

}