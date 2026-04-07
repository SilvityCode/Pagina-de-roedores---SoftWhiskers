document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
      localStorage.setItem("usuario", data.usuario);
      localStorage.setItem("email", email);
      localStorage.setItem("rol", data.rol);
      
      if (data.rol === "admin") {
        window.location.href = "/pages/admin.html";
      }
      else {
        window.location.href = "/pages/adopcion.html";
      }
      
    } else {
      mostrarError(data.error);
    }

  } catch (error) {
    mostrarError("Error al conectar con el servidor");
  }
});

function mostrarError(mensaje) {
  const p = document.getElementById("error-login");
  p.textContent = mensaje;
  p.classList.remove("oculto");
}