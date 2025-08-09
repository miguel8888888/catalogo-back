const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para traer todos los registros con datos de pais (JOIN)
app.get('/', async (req, res) => {
  try {
    const consulta = `
      SELECT r.*, p.pais, p.bandera
      FROM registros r
      JOIN pais p ON r.pais = p.id
    `;
    const result = await pool.query(consulta);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para traer solo registros sin JOIN
app.get('/simple', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
