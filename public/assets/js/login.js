document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("RESPUESTA BACKEND:", data); // 👈 para debug

    if (res.ok) {
      localStorage.setItem("usuario", data.usuario);
      localStorage.setItem("email", email);

      window.location.href = "/pages/adopcion.html";
    } else {
      alert(data.error);
    }

  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor");
  }
});