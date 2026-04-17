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
| Chatbot conversacional | 🔧 En desarrollo — rama local privada |

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

### 🤖 Chatbot conversacional
- Widget de chatbot visual integrado en el frontend
- Validación de mensajes tanto en el cliente como en el servidor
- Sanitización de texto para evitar inyección de código o scripts
- Filtrado de contenido ofensivo usando `backend/core/forbidden_words.json`
- Detección y bloqueo de intentos de jailbreak antes de llamar a la IA
- Segunda capa de seguridad en backend en `backend/chat.js`, para bloquear mensajes prohibidos antes de llamar a la IA
- Respuestas estándar de FAQ cuando se detectan palabras clave
- Uso de la API de Groq solo cuando no hay coincidencia en FAQ
> [!NOTE]
> El chatbot está en desarrollo local. Si quieres verlo en acción o probarlo, puedes contactarme.
👇👇👇
> [!TIP]
> Dejo unas capturas de pantalla para que se vea como es el chatbot:

<img width="600" alt="Widget del chatbot" src="https://github.com/user-attachments/assets/7953690b-5f6c-4e82-b7d1-8092a6b7d0d3" />

*Widget visual del chatbot integrado en la página principal*

<img width="400" alt="chatbot_chat" src="https://github.com/user-attachments/assets/52a35f69-7869-40b5-94d9-69581d68375a" />

*Chat del chatbot*

<img width="400" alt="chatbot_answer" src="https://github.com/user-attachments/assets/a1ee547c-d062-45d5-b8d9-6791b951c18c" />

*Respuesta automática desde el sistema de FAQs*

<img width="400" alt="chatbot_seguridad" src="https://github.com/user-attachments/assets/ce581285-714d-4dad-8a93-06c0af8b2825" />

*Detección y bloqueo de intento de jailbreak y/o contenido ofensivo*

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
│   ├── chat.js          # Lógica del chatbot
│   ├── core/
│   │   ├── system_prompt.md
│   │   ├── faqs.json
│   │   └── forbidden_words.json
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
