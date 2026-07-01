const pool = require('../config/database');
const AppError = require('../utils/AppError');

const findAll = async (restaurantId) => {
  const query = restaurantId
    ? 'SELECT * FROM productos WHERE restaurant_id = ? AND available = 1 ORDER BY category, name'
    : 'SELECT * FROM productos WHERE available = 1 ORDER BY restaurant_id, category, name';
  const params = restaurantId ? [restaurantId] : [];
  const [rows] = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  if (!rows.length) throw new AppError('Producto no encontrado', 404);
  return rows[0];
};

module.exports = { findAll, findById };
