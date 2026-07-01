const { Router } = require('express');
const ctrl     = require('../controllers/pedidos.controller');
const validate = require('../middlewares/validate');

const VALID_STATUSES = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'];

const validateCreate = (body) => {
  if (!body.client)       return 'El campo client es obligatorio';
  if (!body.restaurant_id) return 'El campo restaurant_id es obligatorio';
  if (!Array.isArray(body.items) || body.items.length === 0)
    return 'Se requiere al menos un item en items[]';
  for (const item of body.items) {
    if (!item.product_id || !item.name || !item.quantity || !item.unit_price)
      return 'Cada item debe tener: product_id, name, quantity, unit_price';
  }
  return null;
};

const validateStatus = (body) => {
  if (!body.status) return 'El campo status es obligatorio';
  if (!VALID_STATUSES.includes(body.status))
    return `Estado inválido. Valores aceptados: ${VALID_STATUSES.join(', ')}`;
  return null;
};

const router = Router();

router.get('/',                ctrl.getAll);
router.get('/:id',             ctrl.getById);
router.post('/',               validate(validateCreate),  ctrl.create);
router.patch('/:id/status',    validate(validateStatus),  ctrl.updateStatus);

module.exports = router;
