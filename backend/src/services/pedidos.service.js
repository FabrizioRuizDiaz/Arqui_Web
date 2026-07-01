const pool = require('../config/database');
const AppError = require('../utils/AppError');

const DELIVERY_FEE = 8000;

const generateId = () => `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

const attachItems = (pedidos, allItems) => {
  const map = {};
  for (const item of allItems) {
    if (!map[item.pedido_id]) map[item.pedido_id] = [];
    map[item.pedido_id].push(item);
  }
  return pedidos.map(p => ({ ...p, items: map[p.id] || [] }));
};

const findAll = async () => {
  const [pedidos] = await pool.query(
    `SELECT p.*, r.name AS restaurant_name
     FROM pedidos p
     JOIN restaurantes r ON r.id = p.restaurant_id
     ORDER BY p.created_at DESC`
  );
  const [items] = await pool.query('SELECT * FROM pedido_items ORDER BY pedido_id');
  return attachItems(pedidos, items);
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, r.name AS restaurant_name
     FROM pedidos p
     JOIN restaurantes r ON r.id = p.restaurant_id
     WHERE p.id = ?`,
    [id]
  );
  if (!rows.length) throw new AppError('Pedido no encontrado', 404);
  const [items] = await pool.query('SELECT * FROM pedido_items WHERE pedido_id = ?', [id]);
  return { ...rows[0], items };
};

const create = async ({ client, restaurant_id, address, notes, items }) => {
  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;
  const id = generateId();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO pedidos (id, client, restaurant_id, status, subtotal, delivery_fee, total, address, notes)
       VALUES (?, ?, ?, 'pendiente', ?, ?, ?, ?, ?)`,
      [id, client, restaurant_id, subtotal, DELIVERY_FEE, total, address ?? '', notes ?? '']
    );

    for (const item of items) {
      await conn.query(
        `INSERT INTO pedido_items (pedido_id, product_id, name, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)`,
        [id, item.product_id, item.name, item.quantity, item.unit_price]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return findById(id);
};

const updateStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE pedidos SET status = ? WHERE id = ?',
    [status, id]
  );
  if (result.affectedRows === 0) throw new AppError('Pedido no encontrado', 404);
  return { id, status };
};

module.exports = { findAll, findById, create, updateStatus };
