// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const isOperational = err.isOperational === true;
  const status  = err.statusCode || 500;
  const message = isOperational ? err.message : 'Error interno del servidor';

  if (!isOperational) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
