console.log("HOLIS")

//precios
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