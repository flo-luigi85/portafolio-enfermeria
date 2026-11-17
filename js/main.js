console.log("El archivo JS está conectado correctamente");

const btnMenu = document.getElementById('menu-btn');
const menuNavegacion = document.getElementById('menu');

btnMenu.addEventListener('click', () => {
    menuNavegacion.classList.toggle('hidden');
});

console.log("Boton encontrado ", btnMenu);
console.log("Menú encontrado ", menuNavegacion);

