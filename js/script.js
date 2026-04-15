document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("whatsappForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const text = `
Nombre: ${name.value}
Teléfono: ${phone.value}
Vehículo: ${vehicle.value}
Servicio: ${service.value}
Mensaje: ${message.value}
`;

  window.open(`https://wa.me/573142371493?text=${encodeURIComponent(text)}`);
});
