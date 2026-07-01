const AppError = require('../utils/AppError');

/**
 * Recibe una función validadora (body, params, query) => string|null.
 * Si devuelve un string lanza un 400 con ese mensaje.
 */
const validate = (validatorFn) => (req, res, next) => {
  const error = validatorFn(req.body, req.params, req.query);
  if (error) return next(new AppError(error, 400));
  next();
};

module.exports = validate;
