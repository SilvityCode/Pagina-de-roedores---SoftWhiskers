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

  if (!usuario) {
    window.location.href = "/pages/login.html";
    return;
  }

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

  // Si hay solicitud pendiente guardada, mostrar mensaje fijo y arrancar polling
  const pendiente = localStorage.getItem('solicitudPendiente');
  if (pendiente) {
    const { mensaje } = JSON.parse(pendiente);
    mostrarMensajePendiente(mensaje);
    iniciarPolling();
  }

  comprobarNotificaciones();
});

// ======================
// TOGGLE DESPLEGABLE
// ======================
window.toggle = async (tipo) => {
  const contenedor = document.getElementById(tipo);
  const estaBaAbierto = !contenedor.classList.contains('oculto');

  document.querySelectorAll('.contenedor').forEach(div => {
    div.classList.add('oculto');
    div.innerHTML = '';
  });

  if (estaBaAbierto) return;

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
            Adoptar 🤍
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
      // Guardar en localStorage para que persista entre recargas y cierres de sesión
      localStorage.setItem('solicitudPendiente', JSON.stringify({
        roedor_id: id,
        nombre,
        email,
        mensaje: data.message
      }));

      mostrarMensajePendiente(data.message);

      // Eliminar la tarjeta del roedor
      const tarjeta = document.querySelector(`[onclick="adoptar(${id}, '${nombre}')"]`)
        ?.closest('.tarjeta-roedor');
      if (tarjeta) tarjeta.remove();

      iniciarPolling();

    } else {
      mostrarMensaje(data.error || 'Error al adoptar', 'error');
    }

  } catch (err) {
    mostrarMensaje('Error de conexión', 'error');
  }
};

// ======================
// MENSAJE PENDIENTE — fijo, sin X
// ======================
function mostrarMensajePendiente(texto) {
  const div = document.getElementById('mensaje');
  div.innerHTML = `<span>${texto}</span>`;
  div.className = 'mensaje exito';
  div.classList.remove('oculto');
}

// ======================
// POLLING — espera respuesta del admin
// ======================
let pollingInterval = null;

function iniciarPolling() {
  if (pollingInterval) return;

  pollingInterval = setInterval(async () => {
    const email = localStorage.getItem('email') || sessionStorage.getItem('email');
    if (!email) return;

    try {
      const res = await fetch(`/api/mis-notificaciones?email=${email}`);
      const data = await res.json();

      if (!data.resultado) return;

      const estado = data.resultado.estado;

      if (estado === 'aceptada' || estado === 'rechazada') {
        clearInterval(pollingInterval);
        pollingInterval = null;

        // Limpiar solicitud pendiente del localStorage
        localStorage.removeItem('solicitudPendiente');

        // Ocultar el mensaje de pendiente
        const msgDiv = document.getElementById('mensaje');
        msgDiv.classList.add('oculto');

        // Mostrar notificación con X
        if (estado === 'aceptada') {
          mostrarNotificacion(
            `🎉 ¡Tu solicitud para adoptar a ${data.resultado.nombre_roedor} ha sido aceptada! Pronto nos pondremos en contacto contigo.`,
            'exito',
            email
          );
        } else {
          mostrarNotificacion(
            `❌ Tu solicitud para adoptar a ${data.resultado.nombre_roedor} ha sido rechazada.`,
            'error',
            email
          );
        }
      }
    } catch (err) {
      console.error('Error en polling', err);
    }
  }, 5000);
}

// ======================
// NOTIFICACIONES — resultado del admin, con X
// ======================
async function comprobarNotificaciones() {
  const email = localStorage.getItem('email') || sessionStorage.getItem('email');
  if (!email) return;

  // Si ya hay solicitud pendiente activa, el polling se encarga
  if (localStorage.getItem('solicitudPendiente')) return;

  try {
    const res = await fetch(`/api/mis-notificaciones?email=${email}`);
    const data = await res.json();

    if (!data.resultado) return;

    const estado = data.resultado.estado;

    if (estado === 'aceptada') {
      mostrarNotificacion(
        `🎉 ¡Tu solicitud para adoptar a ${data.resultado.nombre_roedor} ha sido aceptada! Pronto nos pondremos en contacto contigo.`,
        'exito',
        email
      );
    } else if (estado === 'rechazada') {
      mostrarNotificacion(
        `❌ Tu solicitud para adoptar a ${data.resultado.nombre_roedor} ha sido rechazada.`,
        'error',
        email
      );
    }

  } catch (err) {
    console.error('Error al comprobar notificaciones', err);
  }
}

function mostrarNotificacion(texto, tipo, email) {
  const div = document.createElement('div');
  div.className = `notificacion ${tipo}`;
  div.innerHTML = `
    <span class="texto">${texto}</span>
    <button class="cerrar">&times;</button>
  `;

  const card = document.querySelector('.card-adopcion');
  card.insertBefore(div, card.firstChild);

  div.querySelector('.cerrar').addEventListener('click', async () => {
    div.remove();
    if (email) {
      await fetch('/api/marcar-leida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    }
  });
}

// ======================
// MENSAJE FEEDBACK genérico (errores, con X)
// ======================
function mostrarMensaje(texto, tipo) {
  const div = document.getElementById('mensaje');
  div.innerHTML = `
    <span>${texto}</span>
    <button class="cerrar">&times;</button>
  `;
  div.className = `mensaje ${tipo}`;
  div.classList.remove('oculto');

  div.querySelector('.cerrar').addEventListener('click', () => {
    div.classList.add('oculto');
  });
}