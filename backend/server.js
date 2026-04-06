import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

// ======================
// RUTAS
// ======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '../public')));

// ======================
// BASE DE DATOS
// ======================
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Error al conectar DB", err);
  } else {
    console.log("Conectado a SQLite");
  }
});

// Crear tabla
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// ======================
// RUTA PRINCIPAL
// ======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ======================
// REGISTRO (CON HASH)
// ======================
app.post('/registro', async (req, res) => {
  console.log("📩 Petición recibida en /registro");

  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    // HASH CONTRASEÑA
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO usuarios (nombre, email, password)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [nombre, email, hashedPassword], function(err) {
      if (err) {
        console.log("❌ Error al registrar:", err.message);
        return res.status(400).json({ error: "El usuario ya existe" });
      }

      console.log("✅ Usuario registrado");

      res.status(200).json({ message: "Usuario registrado correctamente" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ======================
// LOGIN (CON BCRYPT)
// ======================
app.post('/login', (req, res) => {
  console.log("🔐 Intento de login");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = `SELECT * FROM usuarios WHERE email = ?`;

  db.get(sql, [email], async (err, usuario) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // 🔐 COMPARAR CONTRASEÑA
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    console.log("✅ Login correcto");

    res.json({ message: "Login correcto", usuario: usuario.nombre });
  });
});

// ======================
// ROEDORES
// ======================
app.get('/roedores', (req, res) => {
  res.json([
    {
      id: 1,
      nombre: "Hámster Sirio",
      edad: "6 meses",
      imagen: "/assets/img/Hamster.jpg"
    },
    {
      id: 2,
      nombre: "Cobaya",
      edad: "1 año",
      imagen: "/assets/img/Cobaya.jpg"
    },
    {
      id: 3,
      nombre: "Hamster Ruso",
      edad: "1 año",
    }
  ]);
});

// ======================
// ADOPCIONES
// ======================
app.post('/adoptar', (req, res) => {
  const { email, roedor_id } = req.body;

  const sql = `
    INSERT INTO adopciones (usuario_email, roedor_id)
    VALUES (?, ?)
  `;

  db.run(sql, [email, roedor_id], function(err) {
    if (err) {
      return res.status(500).json({ error: "Error al adoptar" });
    }

    res.json({ message: "Adopción realizada 🐹" });
  });
});

// ======================
// INICIAR SERVIDOR
// ======================
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});