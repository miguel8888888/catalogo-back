// api/registros.js
const { Pool } = require('pg');
require('dotenv').config(); // Para usar .env en local

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- Lógica principal ---
async function handler(req, res) {
  // ✅ Cabeceras CORS necesarias
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let result;

    if (req.url === '/simple') {
      // Consulta simple sin JOIN
      result = await pool.query('SELECT * FROM registros');
    } else {
      // Consulta con JOIN
      const consulta = `
        SELECT r.*, p.pais, p.bandera
        FROM registros r
        JOIN pais p ON r.pais = p.id
      `;
      result = await pool.query(consulta);
    }

    res.status(200).json({ registros: result.rows, message: 'Registros obtenidos correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// --- Export para Vercel ---
module.exports = handler;

// --- Servidor Express para modo local ---
if (require.main === module) {
  const express = require('express');
  const cors = require('cors');
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Ruta principal con JOIN
  app.get('/', (req, res) => handler(req, res));

  // Ruta simple sin JOIN
  app.get('/simple', (req, res) => handler(req, res));

  const port = 3002; // diferente del de paises.js
  app.listen(port, () => {
    console.log(`Servidor local escuchando en http://localhost:${port}`);
  });
}
