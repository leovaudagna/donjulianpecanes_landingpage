
//Precios
const preciosPeladas = {
    "100g": 3500,
    "250g": 7000,
    "500g": 14000,
    "1kg": 25000
};

document.querySelectorAll(".card-producto").forEach(article => {
    const botones = article.querySelectorAll(".opciones button");
    const precioSpan = article.querySelector(".precios span");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            botones.forEach(b => b.classList.remove("boton-seleccionado"));
            boton.classList.add("boton-seleccionado");

            const peso = boton.textContent.trim();
            if(preciosPeladas[peso]) {
                precioSpan.textContent = `$${preciosPeladas[peso].toLocaleString("es-AR")}`;
            }
        });
    });    

});

//FILTRO
// document.querySelectorAll(".categorias").forEach(article => {
//     const botonesCategoria = article.querySelectorAll(".categorias button");
//     const botonPorCategoria = document.getElementById("btn_porCategoria");
//     const botonTodos = document.getElementById("btn_todos");

//     botonesCategoria.forEach(boton => {
//         boton.addEventListener("click", () => {
//             botonesCategoria.forEach(b => b.classList.remove("selected"));
//             boton.classList.add("selected");
//         })
//     })        
// });

//FUNCION PRUEBA
document.addEventListener('DOMContentLoaded', () => {
    const btnPorCategoria = document.getElementById('btn_porCategoria');
    const btnTodos = document.getElementById('btn_todos');
    const grilla = document.getElementById('grilla');
    const todos = document.getElementById('todos');

    btnPorCategoria.addEventListener('click', () => {
    btnPorCategoria.classList.add('selected');
    btnTodos.classList.remove('selected');

    grilla.classList.remove('collapsed'); // mostrar grilla
    todos.classList.add('collapsed');     // ocultar todos
  });

  btnTodos.addEventListener('click', () => {
    btnTodos.classList.add('selected');
    btnPorCategoria.classList.remove('selected');

    todos.classList.remove('collapsed');  // mostrar todos
    grilla.classList.add('collapsed');    // ocultar grilla

    if(todos.innerHTML.trim() === "") {
        const articulos = document.querySelectorAll(".container-tipo-producto article");
        articulos.forEach(art => {
            todos.appendChild(art.cloneNode(true));
        })
    }
  });
});