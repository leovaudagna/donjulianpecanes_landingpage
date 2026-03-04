//Inicio

//Modificaciones:

//Variables globales
let listaProductos = [];
let carrito = [];

//Elementos de la pagina
let body = document.querySelector("body");
let listaProductosCategoriaHTML = document.getElementById("grilla");
let listaProductosHTML = document.getElementById("todos");
let listaCarritoHTML = document.querySelector(".lista-pestaña");
let iconoCarritoSpan = document.querySelector(".carrito-cantidad");
let iconoCarrito = document.querySelector(".icono-carrito");
let precioFinalTotalCarrito = document.getElementById("carritoTotalFinal");
let encabezadoLista = document.querySelector(".encabezado-lista");
let carritoTotal = document.querySelector(".carritoTotal");
let listaCarritoPestaña = document.querySelector(".lista-pestaña");

//Elegir filtro
let botonCategoria = document.getElementById("btn_porCategoria");
let botonTodos = document.getElementById("btn_todos");

let precioFinalGlobal = 0;

//NAVBAR
let hamburger = document.querySelector(".hamburger");
let navbar = document.querySelector(".navbar-elementos");
let overlayCarrito = document.querySelector(".overlay-carrito");
let overlayNav = document.querySelector(".overlay");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navbar.classList.toggle("active");
  overlayNav.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navbar.classList.remove("active");
    overlayNav.classList.remove("active");
  }),
);

overlayNav.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navbar.classList.remove("active");
  overlayNav.classList.remove("active");
});

//CARRITO LATERAL
let limpiarBoton = document.getElementById("limpiar");
let realizarPedidoBoton = document.getElementById("realizar_pedido");
let cerrarCarrito = document.getElementById("cerrar_carrito");
let pedidoFinalizado = [];

//Prueba
const crearCardProducto = (producto) => {
  const botonesPeso = Object.keys(producto.pesoPrecio)
    .map(
      (peso, id) =>
        `<button class="${id === 0 ? "boton-seleccionado" : ""}">${peso}</button>`,
    )
    .join("");

  const primerPrecio = Object.values(producto.pesoPrecio)[0];
  const precioMostrar =
    primerPrecio === 0 ? "--" : `$${primerPrecio.toLocaleString("es-AR")}`;

  let proximamenteHTML = "";
  if (!producto.disponible) {
    proximamenteHTML = `
            <div class="proximamente">
                <p>próximamente</p>
            </div>`;
  }

  const nuevoProducto = document.createElement("article");
  nuevoProducto.classList.add("card-producto");
  nuevoProducto.dataset.id = producto.id;

  nuevoProducto.innerHTML = `
        ${proximamenteHTML}
        <div class="card-encabezado">
            <p class="categoria-hashtag">#${producto.categoria}</p>            
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
            <div class="precios"><span>${precioMostrar}</span></div>
        </div>
        <div class="card-boton ${producto.disponible ? "" : "no-disponible"}">
            <button class="agregarCarrito" ${primerPrecio === 0 ? "disabled" : ""}>
                Agregar al carrito
            </button>
        </div>
    `;

  const categoriaHashtag = nuevoProducto.querySelector(".categoria-hashtag");
  if (producto.categoria && categoriaHashtag) {
    categoriaHashtag.classList.add(
      `categoria-${producto.categoria.toLowerCase()}`,
    );
  }

  return nuevoProducto;
};

// Renderizar TODOS
const renderizarProductosHTML = () => {
  listaProductosHTML.innerHTML = "";
  listaProductos.forEach((producto) => {
    const card = crearCardProducto(producto);
    listaProductosHTML.appendChild(card);
  });
};

// Renderizar en CATEGORIAS
const renderizarPorCategoria = () => {
  botonCategoria.classList.add("selected");
  botonTodos.classList.remove("selected");

  document.getElementById("todos").style.display = "none";
  document.querySelector(".grilla").classList.remove("collapsed");

  document.querySelectorAll(".tipo-producto").forEach((div) => {
    div.style.display = "flex";
    const contenedor = div.querySelector(".container-tipo-producto");
    contenedor.innerHTML = "";
  });

  listaProductos.forEach((producto) => {
    const card = crearCardProducto(producto);
    const categoriaDiv = document.querySelector(
      `#${producto.categoria.toLowerCase()} .container-tipo-producto`,
    );
    if (categoriaDiv) categoriaDiv.appendChild(card);
  });
};

//FUNCION ELECCION PESO
document.body.addEventListener("click", (event) => {
  const btn = event.target;

  // --- CAMBIAR PESO ---
  if (btn.closest(".peso-opcion button")) {
    const card = btn.closest(".card-producto");
    const producto_id = card.dataset.id;
    const producto = listaProductos.find((p) => p.id == producto_id);
    if (!producto) return;

    const botones = card.querySelectorAll(".peso-opcion button");
    botones.forEach((b) => b.classList.remove("boton-seleccionado"));
    btn.classList.add("boton-seleccionado");

    const pesoSeleccionado = btn.textContent.trim();
    const precio = producto.pesoPrecio[pesoSeleccionado];
    const spanPrecio = card.querySelector(".precios span");
    spanPrecio.textContent =
      precio === 0 ? "--" : `$${precio.toLocaleString("es-AR")}`;
  }

  // --- AGREGAR AL CARRITO ---
  if (btn.classList.contains("agregarCarrito")) {
    const card = btn.closest(".card-producto");
    const producto_id = card.dataset.id;
    const producto = listaProductos.find((p) => p.id == producto_id);
    if (!producto) return;

    const pesoSeleccionado = card
      .querySelector(".boton-seleccionado")
      ?.textContent.trim();

    if (!pesoSeleccionado) {
      pesoSeleccionado = Object.keys(producto.pesoPrecio)[0];
      const primerBoton = card.querySelector(".peso-opcion button");
      if (primerBoton) primerBoton.classList.add("boton-seleccionado");
    }

    const precio = producto.pesoPrecio[pesoSeleccionado];

    agregarProductoCarrito(producto_id, pesoSeleccionado, precio);
  }
});

//Agregar productos al carrito
const agregarProductoCarrito = (producto_id, peso, precio) => {
  let posicion = carrito.findIndex(
    (item) => item.producto_id == producto_id && item.peso == peso,
  );

  if (posicion >= 0) {
    carrito[posicion].cantidad += 1;
  } else {
    carrito.push({
      producto_id: producto_id,
      cantidad: 1,
      peso: peso,
      precio: precio,
    });
  }

  agregarCarritoHTML();
  agregarCarritoMemoria();
};

const agregarCarritoHTML = () => {
  listaCarritoHTML.innerHTML = "";
  listaCarritoPestaña.innerHTML = "";
  let cantidadTotal = 0;
  let precioFinalTotal = 0;
  if (carrito.length > 0) {
    carrito.forEach((item) => {
      cantidadTotal = cantidadTotal + item.cantidad;
      let productoEnCarrito = document.createElement("div");
      productoEnCarrito.classList.add("item");

      let posicionProducto = listaProductos.findIndex(
        (valor) => valor.id == item.producto_id,
      );
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
            <div class="cantidad">
                <span class="menos"><</span>
                <span id="item-cantidad">${item.cantidad}</span>
                <span class="mas">></span>
            </div>  
            <div class="precio">
                $ ${precioTotalPorProducto}
            </div>
                      
            `;

      precioFinalTotal += precioTotalPorProducto;

      listaCarritoPestaña.appendChild(productoEnCarrito);
    });
  } else {
    productoEnCarrito.innerHTML = `
            <div>
                <p>El carrito esta vacio</p>
            </div>
        `;
  }

  if (carrito == 0) {
    carritoTotal.style.display = "none";
    encabezadoLista.style.display = "none";
  } else {
    carritoTotal.style.display = "flex";
    encabezadoLista.style.display = "grid";
  }

  console.log(precioFinalTotal);
  iconoCarritoSpan.innerText = cantidadTotal;
  precioFinalTotalCarrito.innerText = `$ ${precioFinalTotal}`;
  precioFinalGlobal = precioFinalTotal;

  animarIconoCarrito();
};

function animarIconoCarrito() {
  const iconoSpan = document.querySelector(".carrito-cantidad");

  iconoSpan.classList.add("sacudir");

  setTimeout(() => {
    iconoSpan.classList.remove("sacudir");
  }, 500);
}

const overlay = document.querySelector(".overlay-carrito");

//Abrir pestaña carrito
iconoCarrito.addEventListener("click", () => {
  body.classList.toggle("mostrarCarrito");
});

cerrarCarrito.addEventListener("click", () => {
  body.classList.toggle("mostrarCarrito");
});

overlay.addEventListener("click", () => {
  document.body.classList.remove("mostrarCarrito");
});

listaCarritoPestaña.addEventListener("click", (event) => {
  let posicionClick = event.target;
  if (
    posicionClick.classList.contains("menos") ||
    posicionClick.classList.contains("mas")
  ) {
    let producto_id = posicionClick.closest("[data-id]").dataset.id;
    let tipo = "menos";
    if (posicionClick.classList.contains("mas")) {
      tipo = "mas";
    }
    cambiarCantidad(producto_id, tipo);
  }
});

const cambiarCantidad = (producto_id, tipo) => {
  let posicionProductoEnCarrito = carrito.findIndex(
    (valor) => valor.producto_id == producto_id,
  );
  if (posicionProductoEnCarrito >= 0) {
    switch (tipo) {
      case "mas":
        carrito[posicionProductoEnCarrito].cantidad =
          carrito[posicionProductoEnCarrito].cantidad + 1;
        break;
      case "menos":
        let cambioValor = carrito[posicionProductoEnCarrito].cantidad - 1;
        if (cambioValor > 0) {
          carrito[posicionProductoEnCarrito].cantidad = cambioValor;
        } else {
          carrito.splice(posicionProductoEnCarrito, 1);
        }
        break;
    }
  }
  agregarCarritoMemoria();
  agregarCarritoHTML();
};

const agregarCarritoMemoria = () => {
  localStorage.setItem("carritoMemoria", JSON.stringify(carrito));
};

// FUNCION FILTROS
botonTodos.addEventListener("click", () => {
  botonTodos.classList.add("selected");
  botonCategoria.classList.remove("selected");

  // Mostrar contenedor de todos
  listaProductosHTML.style.display = "grid";
  document.getElementById("todos").classList.remove("collapsed");

  // Ocultar las categorías
  document.querySelector(".grilla").classList.add("collapsed");

  renderizarProductosHTML();
});

botonCategoria.addEventListener("click", () => {
  renderizarPorCategoria();
});

//LIMPIAR CARRITO
limpiarBoton.addEventListener("click", () => {
  carrito = [];
  iconoCarritoSpan.innerHTML = "0";
  precioFinalTotalCarrito.innerHTML = "$0";
  agregarCarritoMemoria();
  agregarCarritoHTML();
});

//CHECKOUT
realizarPedidoBoton.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  let textoCarritoFinal = "🛒 *Pedido - Don Julián Pecanes*:%0A%0A";
  carrito.forEach((item) => {
    const producto = listaProductos.find((p) => p.id == item.producto_id);
    if (producto) {
      const peso = Object.keys(producto.pesoPrecio)[0];
      const precio = Object.values(producto.pesoPrecio)[0];

      textoCarritoFinal += `• ${item.cantidad} x ${producto.nombreProducto} (${peso}) - $${(precio * item.cantidad).toLocaleString("es-AR")}%0A`;
    }
  });

  textoCarritoFinal += `*TOTAL: $${precioFinalGlobal}*%0A`;

  textoCarritoFinal.replace(/\n/g, "%0A");
  console.log(textoCarritoFinal);

  // Abrir WhatsApp
  const telefono = "+5493404505444";
  const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${textoCarritoFinal}`;
  window.open(urlWhatsApp, "_blank");
});

//AL CARGAR
const cargarListaProductos = () => {
  fetch("lista_productos.json")
    .then((response) => response.json())
    .then((data) => {
      listaProductos = data;
      console.log(listaProductos);
      renderizarProductosHTML();

      botonCategoria.classList.add("selected");
      botonTodos.classList.remove("selected");
      document.getElementById("todos").style.display = "none";

      renderizarPorCategoria();
      if (localStorage.getItem("carritoMemoria")) {
        carrito = JSON.parse(localStorage.getItem("carritoMemoria"));
        agregarCarritoHTML();
      }
    });
};

//PARA MOVIL
document.querySelectorAll(".tipo-producto").forEach((el) => {
  el.addEventListener("click", () => {
    el.classList.toggle("expandido");
  });
});

cargarListaProductos();
