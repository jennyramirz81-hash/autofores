document.getElementById("currentYear").textContent = new Date().getFullYear();

const form = document.getElementById("whatsappForm");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const vehicle = document.getElementById("vehicle").value;
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value;

  const text = `Hola, soy ${name}
Teléfono: ${phone}
Vehículo: ${vehicle}
Servicio: ${service}
Mensaje: ${message}`;

  const url = `https://wa.me/573142371493?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});
