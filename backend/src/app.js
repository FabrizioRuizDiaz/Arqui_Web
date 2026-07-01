require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const AppError     = require('./utils/AppError');

const restaurantesRoutes = require('./routes/restaurantes.routes');
const productosRoutes    = require('./routes/productos.routes');
const pedidosRoutes      = require('./routes/pedidos.routes');

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    // Permite cualquier puerto de localhost (útil cuando Vite cambia de puerto)
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido — ${origin}`));
  },
}));
app.use(express.json());

app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/productos',    productosRoutes);
app.use('/api/pedidos',      pedidosRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res, next) => next(new AppError('Ruta no encontrada', 404)));

app.use(errorHandler);

module.exports = app;
