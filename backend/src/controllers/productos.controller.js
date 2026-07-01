const service = require('../services/productos.service');

const getAll = async (req, res, next) => {
  try {
    res.json(await service.findAll(req.query.restaurant_id));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.json(await service.findById(req.params.id));
  } catch (err) { next(err); }
};

module.exports = { getAll, getById };
