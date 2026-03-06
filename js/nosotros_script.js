const imagenes = document.querySelectorAll(".galeria-inner img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const cerrar = document.getElementById("cerrar");

imagenes.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

cerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if(e.target !== modalImg){
    modal.style.display = "none";
  }
});

