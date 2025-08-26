window.addEventListener("load", () => {
    setTimeout(() => {
      const splash = document.getElementById("splash-logo");
      splash.style.opacity = 0;      
      setTimeout(() => splash.style.display = "none", 1900);
    }, 600);
  });