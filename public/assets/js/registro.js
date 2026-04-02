document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('form-adopcion');
  if (!form) return;

  form.noValidate = true;

  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  const errorNombre = document.getElementById('error-nombre');
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  const errorConfirm = document.getElementById('error-confirm');

  const mensaje = document.getElementById("mensaje-exito");

  let timeoutMensaje;

  // ======================
  // REGEX
  // ======================
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'`-]+$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  function validarCampo(input, regex, errorElement, mensajeTexto) {
    if (!regex.test(input.value)) {
      errorElement.textContent = mensajeTexto;
      errorElement.classList.add('visible');
      return false;
    } else {
      errorElement.classList.remove('visible');
      return true;
    }
  }

  function validarConfirmPassword() {
    if (confirmPasswordInput.value === "") {
      errorConfirm.classList.remove('visible');
      return false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
      errorConfirm.textContent = "Las contraseñas no coinciden";
      errorConfirm.classList.add('visible');
      return false;
    }

    errorConfirm.classList.remove('visible');
    return true;
  }

  nombreInput.addEventListener('input', () => {
    if (nombreInput.value.length >= 3) {
      validarCampo(nombreInput, regexNombre, errorNombre, 'Por favor, introduce un nombre válido.');
    } else {
      errorNombre.classList.remove('visible');
    }
  });

  emailInput.addEventListener('blur', () => {
    validarCampo(emailInput, regexEmail, errorEmail, 'Por favor, introduce un correo electrónico válido.');
  });

  passwordInput.addEventListener('blur', () => {
    validarCampo(passwordInput, regexPassword, errorPassword, 'La contraseña debe tener al menos 8 caracteres.');
    validarConfirmPassword();
  });

  confirmPasswordInput.addEventListener('blur', validarConfirmPassword);

  // ======================
  // MOSTRAR MENSAJE
  // ======================
  function mostrarMensaje(texto, esError = false) {
    clearTimeout(timeoutMensaje);

    mensaje.textContent = texto;
    mensaje.style.display = "block";
    mensaje.style.opacity = "1";
    mensaje.style.transition = "opacity 0.5s";
    mensaje.style.color = esError ? "red" : "green";

    timeoutMensaje = setTimeout(() => {
      mensaje.style.opacity = "0";

      setTimeout(() => {
        mensaje.style.display = "none";
      }, 500);
    }, 3000);
  }

  // ======================
  // CLICK BOTÓN
  // ======================
  const boton = document.getElementById('btn-registrar');

  boton.addEventListener('click', async () => {

    let valido = true;

    if (!validarCampo(nombreInput, regexNombre, errorNombre, 'Por favor, introduce un nombre válido.')) valido = false;
    if (!validarCampo(emailInput, regexEmail, errorEmail, 'Por favor, introduce un correo electrónico válido.')) valido = false;
    if (!validarCampo(passwordInput, regexPassword, errorPassword, 'La contraseña debe tener al menos 8 caracteres.')) valido = false;
    if (!validarConfirmPassword()) valido = false;

    if (!valido) {
      mostrarMensaje("Completa el formulario", true);
      return;
    }

    try {
      const res = await fetch('/registro', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombreInput.value,
          email: emailInput.value,
          password: passwordInput.value
        })
      });

      const data = await res.json();

      if (res.ok) {
        form.reset();
        mostrarMensaje("Usuario creado correctamente 🎉");
      } else {
        mostrarMensaje(data.error || "Error en el registro", true);
      }

    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al conectar con el servidor", true);
    }
  });

});