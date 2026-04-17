document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav a, .header__actions a");
  const revealItems = document.querySelectorAll(".reveal");
  const form = document.getElementById("leadForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("currentYear");
  const whatsappNumber = "573142371493";

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  if (!form) return;

  const fields = {
    name: {
      input: form.querySelector("#name"),
      validate: value => value.trim().length >= 3,
      message: "Introduce un nombre válido."
    },
    phone: {
      input: form.querySelector("#phone"),
      validate: value => /^\+?\d[\d\s-]{7,15}$/.test(value.trim()),
      message: "Introduce un celular válido."
    },
    email: {
      input: form.querySelector("#email"),
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
      message: "Introduce un correo válido."
    },
    city: {
      input: form.querySelector("#city"),
      validate: value => value.trim().length >= 2,
      message: "Indica tu ciudad."
    },
    model: {
      input: form.querySelector("#model"),
      validate: value => value.trim().length >= 3,
      message: "Indica el modelo Land Rover."
    },
    year: {
      input: form.querySelector("#year"),
      validate: value => /^\d{4}$/.test(value.trim()),
      message: "Introduce un año válido de 4 dígitos."
    },
    service: {
      input: form.querySelector("#service"),
      validate: value => value.trim() !== "",
      message: "Selecciona un servicio."
    },
    kms: {
      input: form.querySelector("#kms"),
      validate: value => value.trim().length >= 2,
      message: "Indica el kilometraje."
    },
    message: {
      input: form.querySelector("#message"),
      validate: value => value.trim().length >= 12,
      message: "Describe tu solicitud con más detalle."
    },
    terms: {
      input: form.querySelector("#terms"),
      validate: checked => checked === true,
      message: "Debes aceptar el contacto para continuar."
    }
  };

  const setFieldState = (field, isValid) => {
    const formGroup = field.input.closest(".form-group");
    const isTerms = field.input.id === "terms";
    const errorTarget = isTerms
      ? form.querySelector(".error-message--terms")
      : formGroup?.querySelector(".error-message");

    if (formGroup) {
      formGroup.classList.toggle("error", !isValid);
    }

    if (errorTarget) {
      errorTarget.textContent = isValid ? "" : field.message;
    }
  };

  const validateField = key => {
    const field = fields[key];
    const value = field.input.type === "checkbox" ? field.input.checked : field.input.value;
    const valid = field.validate(value);
    setFieldState(field, valid);
    return valid;
  };

  Object.keys(fields).forEach(key => {
    const field = fields[key];

    field.input.addEventListener("blur", () => validateField(key));
    field.input.addEventListener("input", () => {
      if (field.input.type !== "checkbox") {
        validateField(key);
      }
    });

    if (field.input.type === "checkbox") {
      field.input.addEventListener("change", () => validateField(key));
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    const isValid = Object.keys(fields).every(key => validateField(key));

    if (!isValid) {
      formStatus.textContent = "Revisa los campos marcados antes de continuar.";
      formStatus.classList.add("error");
      return;
    }

    const data = {
      name: fields.name.input.value.trim(),
      phone: fields.phone.input.value.trim(),
      email: fields.email.input.value.trim(),
      city: fields.city.input.value.trim(),
      model: fields.model.input.value.trim(),
      year: fields.year.input.value.trim(),
      service: fields.service.input.value.trim(),
      kms: fields.kms.input.value.trim(),
      message: fields.message.input.value.trim()
    };

    const prefilledMessage =
      `Hola AUTO FORES, quiero agendar un servicio.%0A%0A` +
      `Nombre: ${encodeURIComponent(data.name)}%0A` +
      `Celular: ${encodeURIComponent(data.phone)}%0A` +
      `Correo: ${encodeURIComponent(data.email)}%0A` +
      `Ciudad: ${encodeURIComponent(data.city)}%0A` +
      `Modelo Land Rover: ${encodeURIComponent(data.model)}%0A` +
      `Año: ${encodeURIComponent(data.year)}%0A` +
      `Servicio: ${encodeURIComponent(data.service)}%0A` +
      `Kilometraje: ${encodeURIComponent(data.kms)}%0A` +
      `Detalle: ${encodeURIComponent(data.message)}`;

    formStatus.textContent = "Redirigiendo a WhatsApp...";
    formStatus.classList.add("success");

    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${prefilledMessage}`, "_blank");
      form.reset();
      formStatus.textContent = "Tu mensaje está listo en WhatsApp. Envíalo para completar la solicitud.";
    }, 700);
  });
});
