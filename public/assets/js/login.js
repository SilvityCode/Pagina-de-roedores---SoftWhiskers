// ======================
// VERIFICACIÓN INMEDIATA
// ======================
(function() {
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  const rol = localStorage.getItem('rol') || sessionStorage.getItem('rol');

  if (usuario && rol) {
    // Redirigir según rol si ya hay sesión activa
    if (rol === "admin") {
      window.location.replace("/pages/admin.html");
    } else {
      window.location.replace("/pages/adopcion.html");
    }
  }
})();

// ======================
// LOGIN FORM
// ======================
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const recuerdame = document.querySelector('input[name="remember"]').checked;

  if (!email || !password) {
    mostrarError("Completa todos los campos");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      const storage = recuerdame ? localStorage : sessionStorage;

      storage.setItem("usuario", data.usuario);
      storage.setItem("email", email);
      storage.setItem("rol", data.rol);

      if (data.rol === "admin") {
        window.location.replace("/pages/admin.html");
      } else {
        window.location.replace("/pages/adopcion.html");
      }

    } else {
      mostrarError(data.error);
    }

  } catch (error) {
    mostrarError("Error al conectar con el servidor");
  }
});

// ======================
// MOSTRAR ERROR
// ======================
function mostrarError(mensaje) {
  const p = document.getElementById("error-login");
  p.textContent = mensaje;
  p.classList.remove("oculto");
}

// ======================
// PREVENIR PÁGINA EN CACHE
// ======================
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.replace("/pages/login.html");
  }
});