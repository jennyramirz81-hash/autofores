document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();

  const message = "Hola, quiero agendar un servicio con AUTO FORES";
  window.open("https://wa.me/573142371493?text=" + encodeURIComponent(message));
});
