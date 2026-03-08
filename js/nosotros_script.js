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

let comienzoX = 0;
let finX = 0;

modal.addEventListener("touchstart", (e) => {
  comienzoX = e.touches[0].clientX;
});

modal.addEventListener("touchend", (e) => {
  finX = e.changedTouches[0].clientX;
  manejarSwipe();
});

function manejarSwipe() {

  if (comienzoX - finX > 50) {
    // swipe izquierda → siguiente
    indiceActual++;
    if (indiceActual >= imagenes.length) {
      indiceActual = 0;
    }
    mostrarImagen();
  }

  if (finX - comienzoX > 50) {
    // swipe derecha → anterior
    indiceActual--;
    if (indiceActual < 0) {
      indiceActual = imagenes.length - 1;
    }
    mostrarImagen();
  }

}

//galeria imagen del medio
window.addEventListener("load", () => {

  const imagenCentro = document.querySelector(".galeria-inner img:nth-child(2)");

  imagenCentro.scrollIntoView({
    behavior: "instant",
    inline: "center",
    block: "nearest"
  });
});

//Slideshow prueba

let slideIndex = 1;
mostrarSlide(slideIndex);

function plusSlides(n){
  mostrarSlide(slideIndex += n);
}

function currentSlide(n){
  mostrarSlide(slideIndex = n);
}


function mostrarSlide(n){

  let i;
  let slides = document.getElementsByClassName('slide');
  let dots = document.getElementsByClassName('dot');

  if ( n > slides.length ) { slideIndex = 1 }
  if ( n < 1 ) { slideIndex = slides.length }
  for ( i = 0; i < slides.length; i++ ){
    slides[i].style.display = 'none';
  }

  for ( i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace('active', '');
  }

  slides[slideIndex - 1].style.display = 'flex';
  dots[slideIndex - 1].className += ' active';

}

//Scrollbar que desaparezca
let lastScrollTop = 0;
const navbarContainer = document.querySelector(".container-navbar");

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scroll hacia abajo - Escondemos la navbar
    navbarContainer.style.transform = "translateY(-100%)";
  } else {
    // Scroll hacia arriba - Mostramos la navbar
    navbarContainer.style.transform = "translateY(0)";
  }
  
  // Opcional: Si estás muy arriba (en el inicio), asegúrate que se vea
  if (scrollTop <= 0) {
    navbarContainer.style.transform = "translateY(0)";
  }
  lastScrollTop = scrollTop;
});