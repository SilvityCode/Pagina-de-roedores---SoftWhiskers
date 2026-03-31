document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // MENU
  // ======================
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      toggle.textContent = isActive ? "✖" : "☰";
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        toggle.textContent = "☰";
      });
    });
  }

  // ======================
  // MODO DIA / NOCHE
  // ======================
  const btnDiurno = document.getElementById('modo-diurno');
  const btnNocturno = document.getElementById('modo-nocturno');

  if (btnDiurno && btnNocturno) {
    btnDiurno.classList.add('active');

    btnDiurno.addEventListener('click', () => {
      document.body.classList.remove('modo-nocturno');
      btnDiurno.classList.add('active');
      btnNocturno.classList.remove('active');
    });

    btnNocturno.addEventListener('click', () => {
      document.body.classList.add('modo-nocturno');
      btnNocturno.classList.add('active');
      btnDiurno.classList.remove('active');
    });
  }

  // ======================
  // ACORDEON
  // ======================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      content.classList.toggle('show');
    });
  });

  // ======================
  // FORMULARIO
  // ======================
  const form = document.getElementById('form-adopcion');

  if (form) {
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorPassword = document.getElementById('error-password');
    const errorConfirm = document.getElementById('error-confirm');

    // REGEX
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'`-]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // VALIDAR CAMPO
    function validarCampo(input, regex, errorElement, mensaje) {
      if (!regex.test(input.value)) {
        errorElement.textContent = mensaje;
        errorElement.classList.add('visible');
        return false;
      } else {
        errorElement.classList.remove('visible');
        return true;
      }
    }

    // VALIDAR CONFIRM PASSWORD
    function validarConfirmPassword() {
      if (confirmPasswordInput.value !== passwordInput.value) {
        errorConfirm.textContent = "Las contraseñas no coinciden";
        errorConfirm.classList.add('visible');
        return false;
      } else {
        errorConfirm.classList.remove('visible');
        return true;
      }
    }

    // ======================
    // VALIDACION EN TIEMPO REAL
    // ======================
    nombreInput.addEventListener('input', () => {
      validarCampo(nombreInput, regexNombre, errorNombre, 'Por favor, introduce un nombre válido (solo letras y espacios).');
    });

    emailInput.addEventListener('input', () => {
      validarCampo(emailInput, regexEmail, errorEmail, 'Por favor, introduce un correo electrónico válido.');
    });

    passwordInput.addEventListener('input', () => {
      validarCampo(passwordInput, regexPassword, errorPassword, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.');
      validarConfirmPassword(); // 🔥 importante
    });

    confirmPasswordInput.addEventListener('input', validarConfirmPassword);

    // ======================
    // VALIDAR AL ENVIAR
    // ======================
    form.addEventListener('submit', (e) => {
      let valido = true;

      if (!validarCampo(nombreInput, regexNombre, errorNombre, 'Por favor, introduce un nombre válido (solo letras y espacios).')) {
        valido = false;
      }

      if (!validarCampo(emailInput, regexEmail, errorEmail, 'Por favor, introduce un correo electrónico válido.')) {
        valido = false;
      }

      if (!validarCampo(passwordInput, regexPassword, errorPassword, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.')) {
        valido = false;
      }

      if (!validarConfirmPassword()) {
        valido = false;
      }

      if (!valido) {
        e.preventDefault();
      }
    });
  }

});