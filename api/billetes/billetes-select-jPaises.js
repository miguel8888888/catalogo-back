const { Pool } = require('pg');
require('dotenv').config(); // Para usar .env en local

// --- Conexión a la base de datos ---
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
    console.log('Consulta de registros con JOIN');
    const consulta = `
      SELECT r.*, p.pais, p.bandera
      FROM registros r
      JOIN pais p ON r.pais = p.id
    `;
    const result = await pool.query(consulta);
    res.status(200).json({ registros: result.rows, message: 'Registros obtenidos exitosamente' });
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

  const port = 3001;
  app.listen(port, () => {
    console.log(`Servidor local escuchando en http://localhost:${port}`);
  });
}

// Ejecutar 'node api/billetes/billetes-select-jPaises.js' para iniciar el servidor local y hacer pruebas
