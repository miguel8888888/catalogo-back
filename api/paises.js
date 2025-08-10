const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  // ✅ Cabeceras CORS necesarias
  res.setHeader("Access-Control-Allow-Origin", "*"); // O tu dominio frontend específico
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Manejo de preflight (cuando el navegador envía una petición OPTIONS antes de la real)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 💡 Lógica real
  try {
    const result = await pool.query('SELECT * FROM pais');
    res.status(200).json({ paises: result.rows, message: 'Paises obtenidos exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};