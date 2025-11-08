//Inicio


//Modificaciones:

//Variables globales
let listaProductos = [];
let carrito = [];

//Elementos de la pagina
let body = document.querySelector('body');
let listaProductosCategoriaHTML = document.getElementById("grilla");
let listaProductosHTML = document.getElementById("todos")
let listaCarritoHTML = document.querySelector(".lista");
let iconoCarritoSpan = document.querySelector(".carrito-cantidad");

let precioFinalTotalCarrito = document.getElementById("carritoTotalFinal");
let encabezadoLista = document.querySelector(".encabezado-lista");
let carritoTotal = document.querySelector(".carritoTotal");


//Elegir filtro
let botonCategoria = document.getElementById("btn_porCategoria");
let botonTodos = document.getElementById("btn_todos");

let precioFinalGlobal = 0;
//Prueba


const renderizarProductosHTML = () => {

    listaProductosHTML.innerHTML = '';
    if(listaProductos.length > 0){
        listaProductos.forEach(producto => {

            const botonesPeso = Object.keys(producto.pesoPrecio).map((peso, id) =>
                `<button class="${id === 0 ? 'boton-seleccionado' : ''}">${peso}</button>`
            ).join("");

            // Precio inicial
            let primerPrecio = Object.values(producto.pesoPrecio)[0];
            let precioMostrar = primerPrecio === 0 ? "--" : `$${primerPrecio.toLocaleString("es-AR")}`;

            //Creacion de productos
            let nuevoProducto = document.createElement('article');
            nuevoProducto.classList.add("card-producto");
            nuevoProducto.dataset.id = producto.id;

            let proximamenteHTML = "";
            
            if (producto.categoria.toLowerCase() === "derivados") {
            proximamenteHTML = `
                <div class="proximamente">
                    <p>próximamente</p>
                </div>
            `;
            }

            nuevoProducto.innerHTML = `
            ${proximamenteHTML}
            <div class="card-encabezado">
                    <p>#${producto.categoria}</p>
                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                    <span class="contador-card"></span>
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
                    <button class="agregarCarrito" ${primerPrecio === 0 ? "disabled" : ""}>Agregar al carrito</button>
                </div> 
            `;
            
            listaProductosHTML.appendChild(nuevoProducto);
        })
    }
    actualizarContadoresCards();
}

//CONFIRMAR QUE NO SIRVE y BORRAR
// listaProductosHTML.addEventListener('click', (event) => {
//     let posicionClick = event.target;
//     if(posicionClick.classList.contains('agregarCarrito')){
//         let producto_id = posicionClick.parentElement.parentElement.dataset.id;
//         console.log(producto_id);
//         agregarProductoCarrito(producto_id);
//     }
//     }
// )

document.body.addEventListener("click", (event) => {
    const btn = event.target;

    // --- CAMBIAR PESO ---
    if (btn.closest(".peso-opcion button")) {
        const card = btn.closest(".card-producto");
        const producto_id = card.dataset.id;
        const producto = listaProductos.find(p => p.id == producto_id);
        if (!producto) return;

        // Quitar selección previa y marcar nuevo peso
        const botones = card.querySelectorAll(".peso-opcion button");
        botones.forEach(b => b.classList.remove("boton-seleccionado"));
        btn.classList.add("boton-seleccionado");

        // Actualizar precio mostrado
        const pesoSeleccionado = btn.textContent.trim();
        const precio = producto.pesoPrecio[pesoSeleccionado];
        const spanPrecio = card.querySelector(".precios span");
        spanPrecio.textContent = precio === 0 ? "--" : `$${precio.toLocaleString("es-AR")}`;
    }

    // --- AGREGAR AL CARRITO ---
    if (btn.classList.contains("agregarCarrito")) {
        const card = btn.closest(".card-producto");
        const producto_id = card.dataset.id;
        const producto = listaProductos.find(p => p.id == producto_id);
        if (!producto) return;

        // Obtener el peso actualmente seleccionado
        const pesoSeleccionado = card.querySelector(".boton-seleccionado")?.textContent.trim();

        if (!pesoSeleccionado) {
            pesoSeleccionado = Object.keys(producto.pesoPrecio)[0];
         // y opcionalmente marcarlo visualmente
            const primerBoton = card.querySelector(".peso-opcion button");
            if (primerBoton) primerBoton.classList.add("boton-seleccionado");
        }



        const precio = producto.pesoPrecio[pesoSeleccionado];

        agregarProductoCarrito(producto_id, pesoSeleccionado, precio);
    }
});

const agregarProductoCarrito = (producto_id, peso, precio) => {
    let posicion = carrito.findIndex(item => item.producto_id == producto_id && item.peso == peso);

    if (posicion >= 0) {
        carrito[posicion].cantidad += 1;
    } else {
        carrito.push({
            producto_id: producto_id,
            cantidad: 1,
            peso: peso,
            precio: precio
        });
    }

    agregarCarritoHTML();
    agregarCarritoMemoria();
};

const agregarCarritoHTML = () => {
    listaCarritoHTML.innerHTML = '';
    let cantidadTotal = 0;
    let precioFinalTotal = 0;
    if(carrito.length > 0){
        carrito.forEach(item => {
            cantidadTotal = cantidadTotal + item.cantidad;
            let productoEnCarrito = document.createElement("div");
            productoEnCarrito.classList.add("item");
            
            let posicionProducto = listaProductos.findIndex(valor => valor.id == item.producto_id);
            let info = listaProductos[posicionProducto];

            let peso = item.peso;
            let precio = item.precio;
            let precioTotalPorProducto = precio * item.cantidad;
            

            productoEnCarrito.dataset.id = item.producto_id;

            productoEnCarrito.innerHTML = `
            <div class="imagen">
                <img src="${info.imagen}" alt="">
            </div>
            <div class="nombre">
                ${info.nombreProducto}
            </div>
            <div class="peso">
                ${peso}
            </div>
            <div class="precio">
                $${precioTotalPorProducto}
            </div>
            <div class="cantidad">
                <span class="menos"><</span>
                <span id="item-cantidad">${item.cantidad}</span>
                <span class="mas">></span>
            </div>            
            `;

            precioFinalTotal += precioTotalPorProducto;
            

        listaCarritoHTML.appendChild(productoEnCarrito);
        })
    }
    

    if(carrito == 0){
        carritoTotal.style.display = "none";        
        encabezadoLista.style.display = "none";
    } else {
        carritoTotal.style.display = "flex";
        encabezadoLista.style.display = "grid";
    }

    console.log(precioFinalTotal);
    iconoCarritoSpan.innerText = cantidadTotal;
    precioFinalTotalCarrito.innerText = precioFinalTotal;
    precioFinalGlobal = precioFinalTotal;
    

    actualizarContadoresCards();
}

const actualizarContadoresCards = () => {
    // Reiniciar todos los contadores a vacío
    document.querySelectorAll(".contador-card").forEach(span => {
        span.textContent = "";
        span.style.display = "none";
    });

    // Recorrer el carrito y actualizar el contador de cada producto
    carrito.forEach(item => {
        const card = document.querySelector(`.card-producto[data-id='${item.producto_id}']`);
        if (card) {
            const contador = card.querySelector(".contador-card");
            if (contador) {
                contador.textContent = item.cantidad;
                contador.style.display = "flex";
            }
        }
    });
};

listaCarritoHTML.addEventListener('click', (event) => {
    let posicionClick = event.target;
    if(posicionClick.classList.contains('menos') || posicionClick.classList.contains('mas')){
        let producto_id = posicionClick.closest('[data-id]').dataset.id;
        let tipo = 'menos';
        if(posicionClick.classList.contains('mas')){
            tipo = 'mas';
        } cambiarCantidad(producto_id, tipo);
    }
})

const cambiarCantidad = (producto_id, tipo) => { 
    let posicionProductoEnCarrito = carrito.findIndex((valor) => valor.producto_id == producto_id);
    if(posicionProductoEnCarrito >= 0){
        switch(tipo){
            case 'mas':
                carrito[posicionProductoEnCarrito].cantidad = carrito[posicionProductoEnCarrito].cantidad + 1;
                break;
            case 'menos':
                let cambioValor = carrito[posicionProductoEnCarrito].cantidad - 1;
                if(cambioValor > 0) {
                    carrito[posicionProductoEnCarrito].cantidad = cambioValor;
                } else {
                    carrito.splice(posicionProductoEnCarrito, 1);
                }
                break;
            }            
    }
    agregarCarritoMemoria();
    agregarCarritoHTML();

    actualizarContadoresCards();
}



const agregarCarritoMemoria = () => {
    localStorage.setItem('carritoMemoria', JSON.stringify(carrito));
}

// FUNCION FILTROS
botonTodos.addEventListener("click", () => {
    botonTodos.classList.add("selected");
    botonCategoria.classList.remove("selected");

    // Mostrar contenedor de todos
    listaProductosHTML.style.display = "grid";
    document.getElementById("todos").classList.remove("collapsed");

    // Ocultar las categorías


    document.querySelector(".grilla").classList.add("collapsed");

    renderizarProductosHTML(); // vuelve a renderizar todos juntos
});

botonCategoria.addEventListener("click", () => {
    renderizarPorCategoria();
});

let renderizarPorCategoria = () => {
    botonCategoria.classList.add("selected");
    botonTodos.classList.remove("selected");

    // Ocultar el contenedor de todos
    document.getElementById("todos").style.display = "none";

    document.querySelector(".grilla").classList.remove("collapsed");

    // Mostrar cada categoría y vaciar sus contenedores
    document.querySelectorAll(".tipo-producto").forEach(div => {
        div.style.display = "flex";
        let contenedor = div.querySelector(".container-tipo-producto");
        contenedor.innerHTML = ""; // limpiar para no duplicar
    });

    // Renderizar productos en sus categorías
    listaProductos.forEach(producto => {
        const botonesPeso = Object.keys(producto.pesoPrecio).map((peso, id) =>
            `<button class="${id === 0 ? 'boton-seleccionado' : ''}">${peso}</button>`
        ).join("");

        let primerPrecio = Object.values(producto.pesoPrecio)[0];
        let precioMostrar = primerPrecio === 0 ? "--" : `$${primerPrecio.toLocaleString("es-AR")}`;

        let nuevoProducto = document.createElement("article");
        nuevoProducto.classList.add("card-producto");
        nuevoProducto.dataset.id = producto.id;

        let proximamenteHTML = "";
        if (producto.categoria.toLowerCase() === "derivados") {
            proximamenteHTML = `
                <div class="proximamente">
                    <p>próximamente</p>
                </div>`;
        }

        nuevoProducto.innerHTML = `
            ${proximamenteHTML}
            <div class="card-encabezado">
                <p>#${producto.categoria}</p>
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                <span class="contador-card"></span>
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
                    <div class="opciones">${botonesPeso}</div>
                </div>
                <div class="precios">
                    <span>${precioMostrar}</span>
                </div>
            </div>
            <div class="card-boton ${producto.disponible ? "" : "no-disponible"}">
                <button class="agregarCarrito" ${primerPrecio === 0 ? "disabled" : ""}>Agregar al carrito</button>
            </div> 
        `;

        // Insertar en su categoría correspondiente
        const categoriaDiv = document.querySelector(`#${producto.categoria.toLowerCase()} .container-tipo-producto`);
        if (categoriaDiv) {
            categoriaDiv.appendChild(nuevoProducto);
        }
    });
}


//SECCION FINAL
let limpiarBoton = document.getElementById("limpiar");
let realizarPedidoBoton = document.getElementById("realizar_pedido");
let pedidoFinalizado = [];

//LIMPIAR CARRITO
limpiarBoton.addEventListener("click", () => {
    carrito = [];
    agregarCarritoMemoria();
    agregarCarritoHTML();
    actualizarContadoresCards();
} )

//CHECKOUT
realizarPedidoBoton.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    let textoCarritoFinal = "🛒 *Pedido - Don Julián Pecanes*:%0A%0A"; 
    carrito.forEach(item => {
        // Buscar el producto en la lista por su id
        const producto = listaProductos.find(p => p.id == item.producto_id);
        if (producto) {
            // Tomar el primer peso y precio del producto
            const peso = Object.keys(producto.pesoPrecio)[0];
            const precio = Object.values(producto.pesoPrecio)[0];
            
            textoCarritoFinal += `• ${item.cantidad} x ${producto.nombreProducto} (${peso}) - $${(precio * item.cantidad).toLocaleString("es-AR")}%0A`;
        }

        
    });

    textoCarritoFinal += `*TOTAL: $${precioFinalGlobal}*%0A`

    textoCarritoFinal += "%0A 👉 En breve nos comunicaremos para coordinar la entrega.";

    textoCarritoFinal.replace(/\n/g,'%0A');
    console.log(textoCarritoFinal);

    // Abrir WhatsApp con el mensaje
    const telefono = "+5493404505444"; // número sin el +, con código país
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${textoCarritoFinal}`;
    window.open(urlWhatsApp, "_blank");


})

//PARA MOVIL
document.querySelectorAll('.tipo-producto').forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('expandido');
  });
});

//AL CARGAR
const cargarListaProductos = () => {
    fetch("lista_productos.json")
    .then(response => response.json())
    .then(data => {
        listaProductos = data;
        console.log(listaProductos);
        renderizarProductosHTML();

        botonCategoria.classList.add("selected");
        botonTodos.classList.remove("selected");
        document.getElementById("todos").style.display = "none";

        renderizarPorCategoria();
        
        // cargar acarrito de mmemoraua
        if(localStorage.getItem('carritoMemoria')){
            carrito = JSON.parse(localStorage.getItem('carritoMemoria'));
            agregarCarritoHTML();
            actualizarContadoresCards();
        }
    })
}

cargarListaProductos();



