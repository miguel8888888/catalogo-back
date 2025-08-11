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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido, usa POST' });
  }

  try {
    const { pais, bandera } = req.body;

    if (!pais || !bandera) {
      return res.status(400).json({ error: 'Faltan campos requeridos: pais y bandera' });
    }

    const result = await pool.query(
      `INSERT INTO pais (pais, bandera) VALUES ($1, $2) RETURNING *`,
      [pais, bandera]
    );

    res.status(201).json({ pais: result.rows[0], message: 'País insertado correctamente' });

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

  app.all('/', (req, res) => handler(req, res));

  const port = 3002; // Puerto distinto para evitar conflicto con paises.js
  app.listen(port, () => {
    console.log(`Servidor local escuchando en http://localhost:${port}`);
  });
}
// ejecutar 'node api/paises-insert.js' para iniciar el servidor local y hacer pruebas