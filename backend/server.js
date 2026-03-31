import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos
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

// Ruta prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Registro
app.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = `
    INSERT INTO usuarios (nombre, email, password)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [nombre, email, password], function(err) {
    if (err) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    res.json({ message: "Usuario registrado correctamente" });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});