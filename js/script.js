document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".main-nav a, .nav-actions a");
  const revealItems = document.querySelectorAll(".reveal");
  const comparisons = document.querySelectorAll("[data-comparison]");
  const form = document.getElementById("whatsappForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("currentYear");
  const whatsappNumber = "573142371493";

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader);

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  comparisons.forEach((comparison) => {
    const range = comparison.querySelector(".comparison-range");
    const after = comparison.querySelector(".comparison-after");
    const handle = comparison.querySelector(".comparison-handle");

    const updateComparison = () => {
      const value = Number(range.value);
      after.style.width = `${value}%`;
      handle.style.left = `calc(${value}% - 1px)`;
    };

    range.addEventListener("input", updateComparison);
    updateComparison();
  });

  if (form) {
    const fields = {
      name: {
        input: form.querySelector("#name"),
        validate: (value) => value.trim().length >= 3,
        message: "Introduce un nombre válido."
      },
      phone: {
        input: form.querySelector("#phone"),
        validate: (value) => /^\+?\d[\d\s]{7,15}$/.test(value.trim()),
        message: "Introduce un teléfono válido."
      },
      vehicle: {
        input: form.querySelector("#vehicle"),
        validate: (value) => value.trim().length >= 3,
        message: "Indica el vehículo."
      },
      service: {
        input: form.querySelector("#service"),
        validate: (value) => value.trim() !== "",
        message: "Selecciona un servicio."
      },
      message: {
        input: form.querySelector("#message"),
        validate: (value) => value.trim().length >= 12,
        message: "Describe brevemente tu necesidad."
      }
    };

    const setFieldState = (field, isValid) => {
      const group = field.input.closest(".form-group");
      const error = group.querySelector(".error-message");

      if (isValid) {
        group.classList.remove("error");
        error.textContent = "";
      } else {
        group.classList.add("error");
        error.textContent = field.message;
      }
    };

    const validateField = (key) => {
      const field = fields[key];
      const valid = field.validate(field.input.value);
      setFieldState(field, valid);
      return valid;
    };

    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener("blur", () => validateField(key));
      fields[key].input.addEventListener("input", () => {
        if (fields[key].input.closest(".form-group").classList.contains("error")) {
          validateField(key);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      formStatus.textContent = "";
      formStatus.className = "form-status";

      const isValid = Object.keys(fields).every((key) => validateField(key));

      if (!isValid) {
        formStatus.textContent = "Revisa los campos marcados antes de continuar.";
        formStatus.classList.add("error");
        return;
      }

      const data = {
        name: fields.name.input.value.trim(),
        phone: fields.phone.input.value.trim(),
        vehicle: fields.vehicle.input.value.trim(),
        service