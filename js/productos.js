//Modificaciones:

//Elementos de la pagina
let body = document.querySelector('body');

let listaProductosCategoriaHTML = document.getElementById("grilla");
let listaProductosHTML = document.getElementById("todos")


let listaCarritoHTML = document.querySelector(".lista");
let iconoCarritoSpan = document.querySelector(".carrito-cantidad");

let listaProductos = [];
let carrito = [];


//Elegir filtro
let botonCategoria = document.getElementById("btn_porCategoria");
let botonTodos = document.getElementById("btn_todos");

botonCategoria.addEventListener("click", ()=> {
    listaProductosHTML.classList.remove("selected");
    listaProductosCategoriaHTML.classList.add("selected");
})

botonTodos.addEventListener("click", ()=> {
    listaProductosHTML.classList.add("selected");
    listaProductosCategoriaHTML.classList.remove("selected");
})


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
}

listaProductosHTML.addEventListener('click', (event) => {
    let posicionClick = event.target;
    if(posicionClick.classList.contains('agregarCarrito')){
        let producto_id = posicionClick.parentElement.parentElement.dataset.id;
        console.log(producto_id);
        agregarProductoCarrito(producto_id);
    }
    }
)

const agregarProductoCarrito = (producto_id) => {
    let posicionProductoEnCarrito = carrito.findIndex((valor) => valor.producto_id == producto_id);
    if(carrito.length <= 0){
        carrito = [{
            producto_id: producto_id,
            cantidad: 1
        }]
    } else if(posicionProductoEnCarrito < 0){
        carrito.push({
            producto_id: producto_id,
            cantidad: 1
        });
    } else {
        carrito[posicionProductoEnCarrito].cantidad = carrito[posicionProductoEnCarrito].cantidad + 1;
    }
    console.log(carrito);
    agregarCarritoHTML();
    agregarCarritoMemoria();
} 

const agregarCarritoHTML = () => {
    listaCarritoHTML.innerHTML = '';
    let cantidadTotal = 0;
    if(carrito.length > 0){
        carrito.forEach(item => {
            cantidadTotal = cantidadTotal + item.cantidad;
            let productoEnCarrito = document.createElement("div");
            productoEnCarrito.classList.add("item");
            
            let posicionProducto = listaProductos.findIndex(valor => valor.id == item.producto_id);
            let info = listaProductos[posicionProducto];

            let precio = Object.values(info.pesoPrecio)[0];
            let peso = Object.keys(info.pesoPrecio)[0];

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
                $${precio * item.cantidad}
            </div>
            <div class="cantidad">
                <span class="menos"><</span>
                <span>${item.cantidad}</span>
                <span class="mas">></span>
            </div>            
            `;
        listaCarritoHTML.appendChild(productoEnCarrito);
        })
    }
    iconoCarritoSpan.innerText = cantidadTotal;
}

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
}

const cargarListaProductos = () => {
    fetch("lista_productos.json")
    .then(response => response.json())
    .then(data => {
        listaProductos = data;
        console.log(listaProductos);
        renderizarProductosHTML();
        
        // cargar acarrito de mmemoraua
        if(localStorage.getItem('carritoMemoria')){
            carrito = JSON.parse(localStorage.getItem('carritoMemoria'));
            agregarCarritoHTML();
        }
    })
}

const agregarCarritoMemoria = () => {
    localStorage.setItem('carritoMemoria', JSON.stringify(carrito));
}

cargarListaProductos();










