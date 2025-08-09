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

// Ruta para traer todos los paises
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pais');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);

// Al final del archivo, añade:
if (require.main === module) {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Servidor express escuchando en http://localhost:${port}`);
  });
}

// Para hacer pruebas locales
// Se ejecuta `node api/paises.js` para iniciar el servidor en modo local
// Y debe responder a las peticiones en http://localhost:3001