const service = require('../services/restaurantes.service');

const getAll = async (req, res, next) => {
  try {
    res.json(await service.findAll());
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.json(await service.findById(req.params.id));
  } catch (err) { next(err); }
};

module.exports = { getAll, getById };
