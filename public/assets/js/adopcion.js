document.addEventListener('DOMContentLoaded', () => {

  const usuario = localStorage.getItem('usuario');

  // 🔴 NO LOGUEADO → fuera
  if (!usuario) {
    window.location.href = "/pages/login.html";
    return;
  }

  // ✅ Mostrar usuario
  document.getElementById('bienvenida').textContent =
    "Bienvenid@ " + usuario + " 🐭" + "¿qué te gustaria adoptar?";

  // 🔓 Logout
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    window.location.href = "/pages/login.html";
  });

});

// ======================
// TOGGLE DESPLEGABLE
// ======================
window.toggle = async (tipo) => {
  const contenedor = document.getElementById(tipo);
  const estaBaAbierto = !contenedor.classList.contains('oculto');

  // Cerrar todos primero
  document.querySelectorAll('.contenedor').forEach(div => {
    div.classList.add('oculto');
    div.innerHTML = '';
  });

  // Si ya estaba abierto, solo lo cerramos
  if (estaBaAbierto) return;

  // Si estaba cerrado, cargamos y abrimos
  try {
    const url = '/api/roedores/' + tipo;
    const res = await fetch(url);
    const roedores = await res.json();

    if (roedores.length === 0) {
      contenedor.innerHTML = `
        <p class="sin-roedores">No hay ${tipo}s disponibles ahora mismo 😊</p>
      `;
    } else {
      contenedor.innerHTML = roedores.map(r => `
        <div class="tarjeta-roedor">
          <h3>${r.nombre}</h3>
          <p>📅 Edad: ${r.edad}</p>
          <button class="btn-adoptar" onclick="adoptar(${r.id}, '${r.nombre}')">
            Adoptar ❤️
          </button>
        </div>
      `).join('');
    }

    contenedor.classList.remove('oculto');

  } catch (err) {
    contenedor.innerHTML = `<p class="error">Error al cargar los roedores 😥</p>`;
    contenedor.classList.remove('oculto');
  }
};

// ======================
// ADOPTAR
// ======================
window.adoptar = async (id, nombre) => {
  const email = localStorage.getItem('email');

  if (!email) {
    mostrarMensaje('No se encontró tu email. Vuelve a iniciar sesión.', 'error');
    return;
  }

  try {
    const res = await fetch('/adoptar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, roedor_id: id })
    });

    const data = await res.json();

    if (res.ok) {
      // Mostrar el mensaje que viene del backend
      mostrarMensaje(data.message, 'exito');

      // Recargar la sección para que desaparezca el roedor adoptado
      const tarjeta = document.querySelector(`[onclick="adoptar(${id}, '${nombre}')"]`)
        ?.closest('.tarjeta-roedor');
      if (tarjeta) tarjeta.remove();
    } else {
      mostrarMensaje(data.error || 'Error al adoptar', 'error');
    }

  } catch (err) {
    mostrarMensaje('Error de conexión', 'error');
  }
};

// ======================
// MENSAJE FEEDBACK
// ======================
function mostrarMensaje(texto, tipo) {
  const div = document.getElementById('mensaje');
  div.textContent = texto;
  div.className = `mensaje ${tipo}`;
  div.classList.remove('oculto');

  // Se oculta solo a los 3 segundos
  setTimeout(() => {
    div.classList.add('oculto');
  }, 3000);
}