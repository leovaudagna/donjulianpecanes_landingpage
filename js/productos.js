//FUNCION FILTRO
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



//FUNCION CARGAR PAGINA CON PRODUCTOS

async function cargarProductos(filtro = "categoria") {
    try {
        const respuesta = await fetch("lista_productos.json");
        const listaDeProductosJSON = await respuesta.json();

        // Limpio los contenedores antes de cargar
        document.querySelectorAll(".container-tipo-producto").forEach(c => c.innerHTML = "");
        document.querySelector("#todos").innerHTML = "";

        listaDeProductosJSON.forEach(producto => {
            let contenedor;
            
            if (filtro === "todos") {
                contenedor = document.querySelector("#todos");
            } else {
                contenedor = document.querySelector(`#${producto.categoria} .container-tipo-producto`);
            }

            if (!contenedor) return;

            // Botones de peso
            const botonesPeso = Object.keys(producto.pesoPrecio).map((peso, id) =>
                `<button class="${id === 0 ? 'boton-seleccionado' : ''}">${peso}</button>`
            ).join("");

            // Precio inicial
            let primerPrecio = Object.values(producto.pesoPrecio)[0];
            let precioMostrar = primerPrecio === 0 ? "--" : `$${primerPrecio.toLocaleString("es-AR")}`;

            // Crear la tarjeta
            const card = document.createElement("article");
            card.classList.add("card-producto");
            card.innerHTML = `
                <div class="card-encabezado">
                    <p>#${producto.categoria}</p>
                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                </div>
                <div class="card-imagen-producto">
                    <img src="${producto.imagen}" alt="${producto.nombreProducto}">
                </div>
                <div class="card-detalles">
                    <span class="card-nombre-producto">${producto.nombreProducto.toUpperCase()}</span>
                    <p>${producto.descripcion ?? ""}</p>
                </div>
                <div class="card-peso-precios">
                    <div class="peso-opcion">
                        <div class="opciones">
                            ${botonesPeso}
                        </div>
                    </div>
                    <div class="precios">
                        <span>${precioMostrar}</span>
                    </div>
                </div>
                <div class="card-boton ${producto.disponible ? "" : "no-disponible"}">
                    <button ${primerPrecio === 0 ? "disabled" : ""}>Agregar al carrito</button>
                </div>        
            `;

            contenedor.appendChild(card);

            // --- Eventos de selección de peso ---
            const botones = card.querySelectorAll(".opciones button");
            const precioSpan = card.querySelector(".precios span");

            botones.forEach(boton => {
                boton.addEventListener("click", () => {
                    // Desmarcar todos
                    botones.forEach(b => b.classList.remove("boton-seleccionado"));
                    // Marcar el clickeado
                    boton.classList.add("boton-seleccionado");

                    // Actualizar precio según el peso
                    const peso = boton.textContent.trim();
                    let precio = producto.pesoPrecio[peso];

                    precioSpan.textContent = precio === 0
                        ? "--"
                        : `$${precio.toLocaleString("es-AR")}`;
                });
            });
        });

    } catch (error) {
        console.error("Error al cargar productos", error);
    }
}

cargarProductos("categoria");

// 🔹 Manejo de filtros
document.querySelectorAll(".categorias button").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".categorias button").forEach(b => b.classList.remove("selected"));
        boton.classList.add("selected");

        if (boton.id === "btn_todos") {
            // Mostrar contenedor de todos y ocultar los otros
            document.getElementById("todos").classList.remove("collapsed");
            document.querySelectorAll(".tipo-producto").forEach(div => div.style.display = "none");
            cargarProductos("todos");
        } else {
            // Mostrar categorías y ocultar "todos"
            document.getElementById("todos").classList.add("collapsed");
            document.querySelectorAll(".tipo-producto").forEach(div => div.style.display = "");
            cargarProductos("categoria");
        }
    });
});


//FUNCION CARRITO

//AGREGAR BOTON CARRITO
