// ======================
// SEGURIDAD — VERIFICACIÓN INMEDIATA
(function() {
  const rol = localStorage.getItem('rol') || sessionStorage.getItem('rol');
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  if (!usuario || rol !== 'admin') window.location.replace('/pages/login.html');
})();

window.addEventListener('pageshow', event => {
  if (event.persisted) {
    const rol = localStorage.getItem('rol') || sessionStorage.getItem('rol');
    if (rol !== 'admin') window.location.replace('/pages/login.html');
  }
});

// ======================
// AUTH HEADERS
function authHeaders() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

// ======================
// INIT
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/pages/login.html');
  });
  cargarSolicitudes();
});

// ======================
// CARGAR SOLICITUDES
async function cargarSolicitudes() {
  const lista = document.getElementById('lista-solicitudes');
  try {
    const res = await fetch('/api/solicitudes', { headers: authHeaders() });
    if (res.status === 401 || res.status === 403) return window.location.replace('/pages/login.html');
    const data = await res.json();

    const pendientes = data.filter(s => s.estado === 'pendiente');
    const aceptadas = data.filter(s => s.estado === 'aceptada');
    const rechazadas = data.filter(s => s.estado === 'rechazada');

    document.getElementById('stat-pendientes').textContent  = pendientes.length;
    document.getElementById('stat-confirmadas').textContent = aceptadas.length;
    document.getElementById('stat-rechazadas').textContent  = rechazadas.length;

    if (pendientes.length === 0) {
      lista.innerHTML = `<div class="vacio"><div class="icono">🎉</div><p>No hay solicitudes pendientes ahora mismo.</p></div>`;
      return;
    }

    lista.innerHTML = pendientes.map(r => `
      <div class="solicitud-card" id="card-${r.id}">
        <div class="solicitud-info">
          <div class="solicitud-nombre">${r.nombre_roedor}</div>
          <div class="solicitud-meta">
            <span><span class="badge-tipo">${r.tipo_roedor}</span></span>
            <span>✉️ ${r.usuario_email}</span>
          </div>
        </div>
        <div class="solicitud-acciones">
          <button type="button" class="btn-confirmar" onclick="confirmar(${r.id})">✅ Confirmar</button>
          <button type="button" class="btn-rechazar"  onclick="rechazar(${r.id})">❌ Rechazar</button>
        </div>
      </div>
    `).join('');

  } catch (err) {
    lista.innerHTML = `<div class="vacio"><div class="icono">⚠️</div><p>Error al cargar las solicitudes.</p></div>`;
  }
}

// ======================
// CONFIRMAR ADOPCIÓN
window.confirmar = async id => {
  const btns = document.querySelectorAll(`#card-${id} button`);
  btns.forEach(b => b.disabled = true);

  try {
    const res = await fetch('/admin/confirmar', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ roedor_id: id }) });
    const data = await res.json();
    if (res.ok) {
      eliminarCard(id);
      mostrarToast('Adopción confirmada ✅', 'exito');
      cargarSolicitudes();
    } else {
      mostrarToast(data.error || 'Error al confirmar', 'error');
      btns.forEach(b => b.disabled = false);
    }
  } catch (err) {
    mostrarToast('Error de conexión', 'error');
    btns.forEach(b => b.disabled = false);
  }
};

// ======================
// RECHAZAR SOLICITUD
window.rechazar = async id => {
  const btns = document.querySelectorAll(`#card-${id} button`);
  btns.forEach(b => b.disabled = true);

  try {
    const res = await fetch('/admin/rechazar', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ roedor_id: id }) });
    const data = await res.json();
    if (res.ok) {
      eliminarCard(id);
      mostrarToast('Solicitud rechazada ❌', 'error');
      cargarSolicitudes();
    } else {
      btns.forEach(b => b.disabled = false);
      mostrarToast(data.error || 'Error al rechazar', 'error');
    }
  } catch (err) {
    mostrarToast('Error de conexión', 'error');
    btns.forEach(b => b.disabled = false);
  }
};

// ======================
// ELIMINAR CARD
function eliminarCard(id) {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  card.style.transition = 'opacity 0.3s, transform 0.3s';
  card.style.opacity = '0';
  card.style.transform = 'translateX(20px)';
  setTimeout(() => card.remove(), 300);
}

// ======================
// TOAST
function mostrarToast(texto, tipo) {
  const toast = document.getElementById('toast');
  toast.textContent = texto;
  toast.className = `show ${tipo}`;
  setTimeout(() => { toast.className = ''; }, 3000);
}