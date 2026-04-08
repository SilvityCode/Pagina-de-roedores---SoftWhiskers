// ======================
// VERIFICACIÓN INMEDIATA
// ======================
(function() {
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  if (!usuario) {
    window.location.replace("/pages/login.html");
  }
})();

// ======================
// RECARGAR SI VIENE DEL HISTORIAL
// ======================
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.replace("/pages/login.html");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');

  // 🔴 NO LOGUEADO → fuera
  if (!usuario) {
    window.location.href = "/pages/login.html";
    return;
  }

  // Si la página fue cargada desde el historial, forzar recarga
  if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
    window.location.reload();
  }

  // ✅ Mostrar usuario
  document.getElementById('bienvenida').textContent =
    "Bienvenid@ " + usuario + " 🐭" + "¿qué te gustaria adoptar?";

  // 🔓 Logout
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('rol');
    window.location.replace("/pages/login.html");
  });

  comprobarNotificaciones();
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
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');

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
// NOTIFICACIONES
// ======================
async function comprobarNotificaciones() {
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  if (!email) return;

  try {
    const res = await fetch(`/api/mis-notificaciones?email=${email}`);
    const data = await res.json();

    if (!data.resultado) return;

    // ID único por roedor y estado para no repetir notificación
    const notiId = `${data.resultado.roedor_id}_${data.resultado.estado}`;
    if (sessionStorage.getItem(notiId)) return;

    // Mostrar notificación según estado
    if (data.resultado.estado === 'aceptada') {
      mostrarNotificacion(
        `🎉 ¡Tu solicitud para adoptar a ${data.resultado.nombre_roedor} ha sido aceptada! Pronto nos pondremos en contacto contigo.`,
        'exito'
      );
    } else if (data.resultado.estado === 'rechazada') {
      mostrarNotificacion(
        `❌ Tu solicitud para adoptar a ${data.resultado.nombre_roedor} ha sido rechazada.`,
        'error'
      );
    }

    // Guardamos en sessionStorage para que no vuelva a mostrarse
    sessionStorage.setItem(notiId, 'true');

  } catch (err) {
    console.error('Error al comprobar notificaciones', err);
  }
}

// Función para mostrar notificación fija con botón de cerrar
function mostrarNotificacion(texto, tipo) {
  const div = document.createElement('div');
  div.className = `notificacion ${tipo}`;
  div.innerHTML = `
    <span class="texto">${texto}</span>
    <button class="cerrar">&times;</button>
  `;

  // Insertarla arriba del todo dentro de .card-adopcion
  const card = document.querySelector('.card-adopcion');
  card.insertBefore(div, card.firstChild);

  // Cerrar manualmente al pulsar la X
  div.querySelector('.cerrar').addEventListener('click', () => {
    div.remove();
  });
}



// ======================
// MENSAJE FEEDBACK
// ======================
function mostrarMensaje(texto, tipo) {
  const div = document.getElementById('mensaje');
  div.textContent = texto;
  div.className = `mensaje ${tipo}`;
  div.classList.remove('oculto');

  setTimeout(() => {
    div.classList.add('oculto');
  }, 3000);
}