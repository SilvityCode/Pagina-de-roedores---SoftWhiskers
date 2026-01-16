// Boton modo oscuro/claro

// Seleccionar los botones con getElementbyid
const btnDiurno = document.getElementById('modo-diurno')
const btnNocturno = document.getElementById('modo-nocturno')

// Marcar "Modo diurno" (el boton se queda marcado)
btnDiurno.classList.add('active')

// Cambiar a modo diurno
btnDiurno.addEventListener('click', () => {
document.body.classList.remove('modo-nocturno')
btnDiurno.classList.add('active')
btnNocturno.classList.remove('active')
})

// Cambiar a modo nocturno
btnNocturno.addEventListener('click', () => {
document.body.classList.add('modo-nocturno')
btnNocturno.classList.add('active')
btnDiurno.classList.remove('active')
})


/* Boton desplegable en contenedores tarjeta */

// Seleccionamos todos los botones
const botones = document.querySelectorAll(".despegable-btn");

// Variable para saber si están abiertas o cerradas
let abiertas = false; /*por defecto cerradas*/ 

botones.forEach((btn) => {
  btn.addEventListener("click", () => {
    const curiosidades = document.querySelectorAll(".curiosidades");

    if (!abiertas) {
      // Mostrar todas las tarjetas
      curiosidades.forEach((curiosidad) => {
        curiosidad.style.maxHeight = "1000px";
        curiosidad.style.padding = "1rem";
      });

      // Cambiar texto de los botones
      botones.forEach((b) => (b.textContent = "Ocultar curiosidades"));
      abiertas = true;
    } else {
      // Ocultar todas
      curiosidades.forEach((curiosidad) => {
        curiosidad.style.maxHeight = "0";
        curiosidad.style.padding = "0 1rem";
      });

      // Volver a texto original
      botones.forEach((b) => (b.textContent = "Ver curiosidades"));
      abiertas = false;
    }
  });
});


// Formulario: regex y validacion para nombre, email y contraseña 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-adopcion');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorPassword = document.getElementById('error-password');

    // Expresiones regulares
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'`-]+$/; // Letras, espacios, apóstrofes, guiones
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato básico de correo
    const regexPassword = /^.{8,}$/; // Al menos 8 caracteres para password

    // Función para validar un campo
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

    // Validar en tiempo real (al cambiar)
    nombreInput.addEventListener('input', () => {
      validarCampo(nombreInput, regexNombre, errorNombre, 'Por favor, introduce un nombre válido (solo letras y espacios).');
    });

    emailInput.addEventListener('input', () => {
      validarCampo(emailInput, regexEmail, errorEmail, 'Por favor, introduce un correo electrónico válido.');
    });

    passwordInput.addEventListener('input', () => {
      validarCampo(passwordInput, regexPassword, errorPassword, 'La contraseña debe tener al menos 8 caracteres.');
    });

    // Validar al enviar el formulario

    form.addEventListener('submit', (e) => {
      let valido = true;

      if (!validarCampo(nombreInput, regexNombre, errorNombre, 'Por favor, introduce un nombre válido (solo letras y espacios).')) {
        valido = false;
      }

      if (!validarCampo(emailInput, regexEmail, errorEmail, 'Por favor, introduce un correo electrónico válido.')) {
        valido = false;
      }

      if (!validarCampo(passwordInput, regexPassword, errorPassword, 'La contraseña debe tener al menos 8 caracteres.')) {
        valido = false;
      }

      if (!valido) {
        e.preventDefault(); // Evitar envío si hay errores
      }
    });
  });