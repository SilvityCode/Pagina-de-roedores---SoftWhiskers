document.addEventListener('DOMContentLoaded', () => {

  const usuario = localStorage.getItem('usuario');

  // 🔴 NO LOGUEADO → fuera
  if (!usuario) {
    window.location.href = "/pages/login.html";
    return;
  }

  // ✅ mostrar usuario
  document.getElementById('bienvenida').textContent =
    "Bienvenido " + usuario + " 🐭";

  // 🔓 logout
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = "/pages/login.html";
  });

});

// ======================
// CARGAR ROEDORES
// ======================
async function cargarRoedores() {
  const res = await fetch('/roedores');
  const roedores = await res.json();

  const contenedor = document.getElementById('contenedor-roedores');

  roedores.forEach(r => {
    const card = document.createElement('div');

    card.innerHTML = `
      <h3>${r.nombre}</h3>
      <img src="${r.imagen}" width="150">
      <p>Edad: ${r.edad}</p>
      <button onclick="adoptar(${r.id})">Adoptar ❤️</button>
      <hr>
    `;

    contenedor.appendChild(card);
  });
}

console.log("Cargando roedores...");
cargarRoedores();

// ======================
// ADOPTAR
// ======================
window.adoptar = async (id) => {

  const email = localStorage.getItem('email');

  const res = await fetch('/adoptar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      roedor_id: id
    })
  });

  const data = await res.json();

  alert(data.message);
};
