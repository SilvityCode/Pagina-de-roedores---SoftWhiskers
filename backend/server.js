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

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT,
    comentario TEXT
  )
`);

// ======================
// RUTA PRINCIPAL
// ======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ======================
// REGISTRO
// ======================
app.post('/registro', async (req, res) => {
  const { nombre, email, password, comentario } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO usuarios (nombre, email, password, comentario) VALUES (?, ?, ?, ?)`;

    db.run(sql, [nombre, email, hashedPassword, comentario], function(err) {
      if (err) return res.status(400).json({ error: "El usuario ya existe" });
      res.status(200).json({ message: "Usuario registrado correctamente" });
    });

  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ======================
// LOGIN
// ======================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, usuario) => {
    if (err) return res.status(500).json({ error: "Error del servidor" });
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) return res.status(400).json({ error: "Contraseña incorrecta" });

    res.json({ message: "Login correcto", usuario: usuario.nombre });
  });
});

// ======================
// ROEDORES - Obtener por tipo
// ======================
app.get('/api/roedores/:tipo', (req, res) => {
  const tipo = req.params.tipo;

  db.all(
    'SELECT * FROM roedores WHERE tipo = ? AND disponible = 1',
    [tipo],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al obtener roedores' });
      res.json(rows);
    }
  );
});

// ======================
// ADOPTAR
// ======================
app.post('/adoptar', (req, res) => {
  const { email, roedor_id } = req.body;

  db.get(
    'SELECT * FROM roedores WHERE id = ? AND disponible = 1',
    [roedor_id],
    (err, roedor) => {
      if (err || !roedor) return res.status(400).json({ error: 'Roedor no disponible' });

      const sqlAdopcion = 'INSERT INTO adopciones (usuario_email, roedor_id) VALUES (?, ?)';
      db.run(sqlAdopcion, [email, roedor_id], function(err) {
        if (err) return res.status(500).json({ error: 'Error al adoptar' });

        db.run('UPDATE roedores SET disponible = 0 WHERE id = ?', [roedor_id]);

        res.json({ message: `¡Has adoptado a ${roedor.nombre}! 🐹` });
      });
    }
  );
});

// ======================
// INICIAR SERVIDOR
// ======================
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});