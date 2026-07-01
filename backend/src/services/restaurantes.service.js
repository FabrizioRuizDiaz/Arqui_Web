const pool = require('../config/database');
const AppError = require('../utils/AppError');

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM restaurantes ORDER BY id');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM restaurantes WHERE id = ?', [id]);
  if (!rows.length) throw new AppError('Restaurante no encontrado', 404);
  return rows[0];
};

module.exports = { findAll, findById };
