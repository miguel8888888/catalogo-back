const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Se configura en Vercel
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros'); // o tu tabla real
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
