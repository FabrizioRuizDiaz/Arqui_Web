const service = require('../services/pedidos.service');

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

const create = async (req, res, next) => {
  try {
    const pedido = await service.create(req.body);
    res.status(201).json(pedido);
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    res.json(await service.updateStatus(req.params.id, req.body.status));
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, updateStatus };
