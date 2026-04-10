# 🐭 SoftWhiskers: la Madriguera

Aplicación web full stack para la gestión de adopciones de roedores.

> [!IMPORTANT]
> Actualmente en desarrollo activo, con una **demo frontend** disponible en GitHub Pages y el **backend completo** en rama separada.

---

## 🚀 Estado del proyecto

| Capa | Estado |
|------|--------|
| Frontend (demo) | ✅ Disponible en GitHub Pages |
| Backend + Base de datos | ✅ Funcional — rama `Features-backend` |

---

## ✨ Funcionalidades

### 👤 Usuarios
- Registro e inicio de sesión con contraseña encriptada (bcrypt)
- Autenticación mediante JWT con expiración
- Sesión persistente con `localStorage` / `sessionStorage`

### 🐹 Adopciones
- Explorar roedores disponibles por tipo (hámsters, ratones, cobayas...)
- Solicitar la adopción de un roedor
- Mensaje de solicitud pendiente **persistente** entre recargas y cierres de sesión
- Notificación automática al usuario cuando el admin confirma o rechaza (polling cada 5s)
- Notificación cerrable con X una vez leída

### 🛡️ Panel de administración
- Vista de solicitudes pendientes, confirmadas y rechazadas
- Confirmar o rechazar solicitudes de adopción
- Registro automático de todas las adopciones con fecha y estado

> [!TIP]
> Para probar la aplicación puedes registrar tu propio usuario desde la página de registro, o contactarme para solicitar credenciales de prueba.

---

## 🛠️ Tecnologías

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)

**Backend**
- Node.js + Express.js
- JWT (autenticación)
- bcrypt (encriptación de contraseñas)

**Base de datos**
- SQLite
- Tablas: `usuarios`, `roedores`, `adopciones`

---

## ▶️ Cómo ejecutar el proyecto

### 🔹 Frontend — Demo

> [!NOTE]
> Disponible directamente en **GitHub Pages** sin necesidad de instalación ni configuración.

---

### 🔹 Backend — Funcional completo

> [!WARNING]
> El backend se encuentra en la rama `Features-backend`. Asegúrate de cambiar de rama antes de instalar dependencias o arrancar el servidor.

1. Cambiar a la rama correcta:

```bash
git checkout Features-backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Arrancar el servidor:

```bash
cd backend
npm start
```

4. Abrir en el navegador:

```
http://localhost:3000
```

> [!TIP]
> La base de datos `database.db` se genera automáticamente al arrancar el servidor por primera vez.

---

## 📁 Estructura del proyecto

```
├── public/              # Frontend (HTML, CSS, JS)
│   ├── index.html
│   └── pages/
├── backend/
│   ├── server.js        # Servidor Express y rutas API
│   └── database.db      # Base de datos SQLite (autogenerada)
```

---

## 📌 Objetivo del proyecto

Proyecto de aprendizaje full stack enfocado en:

- Arquitectura cliente-servidor real
- Autenticación segura con JWT y bcrypt
- Gestión de base de datos relacional con SQLite
- Comunicación frontend-backend asíncrona
- Buenas prácticas de desarrollo y control de versiones

---

## 👩‍💻 Autora

**SilvityCode** — Desarrolladora Web Junior