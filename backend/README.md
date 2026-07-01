# OrderFlow — Backend API

API REST para el sistema de delivery OrderFlow. Construida con **Node.js + Express + MySQL**.

## Requisitos previos

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|---------|
| Node.js     | 18 LTS        | https://nodejs.org |
| MySQL       | 8.x           | vía XAMPP: https://www.apachefriends.org |

## Instalación

### 1. Clonar / ubicarse en la carpeta

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y editarlo:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # vacío si usás XAMPP con config por defecto
DB_NAME=orderflow
CORS_ORIGIN=http://localhost:5173
```

### 4. Crear la base de datos

Con MySQL corriendo (iniciar MySQL desde el XAMPP Control Panel), ejecutar:

```bash
# En Windows con XAMPP:
"C:\xampp\mysql\bin\mysql.exe" -u root < database/schema.sql

# O desde el shell de XAMPP / cualquier cliente MySQL:
mysql -u root -p < database/schema.sql
```

Esto crea la base de datos `orderflow`, las tablas y carga datos de ejemplo.

### 5. Levantar el servidor

**Desarrollo** (reinicia automáticamente al guardar):

```bash
npm run dev
```

**Producción:**

```bash
npm start
```

El servidor queda disponible en `http://localhost:3001`.

---

## Endpoints

### Health

| Método | Ruta         | Descripción      |
|--------|--------------|-----------------|
| GET    | `/api/health` | Estado del servidor |

### Restaurantes

| Método | Ruta                   | Descripción              |
|--------|------------------------|--------------------------|
| GET    | `/api/restaurantes`     | Lista todos              |
| GET    | `/api/restaurantes/:id` | Obtiene uno por ID       |

### Productos

| Método | Ruta                            | Descripción                         |
|--------|---------------------------------|-------------------------------------|
| GET    | `/api/productos`                | Lista todos los disponibles         |
| GET    | `/api/productos?restaurant_id=1`| Filtra por restaurante              |
| GET    | `/api/productos/:id`            | Obtiene uno por ID                  |

### Pedidos

| Método | Ruta                        | Descripción              | Body requerido |
|--------|-----------------------------|--------------------------|----------------|
| GET    | `/api/pedidos`              | Lista todos con sus items | —             |
| GET    | `/api/pedidos/:id`          | Obtiene uno con sus items | —             |
| POST   | `/api/pedidos`              | Crea un pedido            | Ver abajo     |
| PATCH  | `/api/pedidos/:id/status`   | Cambia el estado          | `{ status }`  |

**Body para `POST /api/pedidos`:**

```json
{
  "client": "Juan Pérez",
  "restaurant_id": 1,
  "address": "Calle Ejemplo 123",
  "notes": "Sin cebolla",
  "items": [
    { "product_id": 1, "name": "Classic Burger", "quantity": 2, "unit_price": 35000 }
  ]
}
```

**Estados válidos para `PATCH /api/pedidos/:id/status`:**

`pendiente` → `confirmado` → `preparando` → `en_camino` → `entregado` | `cancelado`

---

## Arquitectura

```
src/
├── server.js            # Punto de entrada — solo llama a app.listen()
├── app.js               # Express: middlewares globales, rutas, error handler
├── config/
│   └── database.js      # Pool de conexiones MySQL
├── routes/              # Define verbos HTTP y aplica validación
├── controllers/         # Recibe req/res, llama al service, reenvía errores
├── services/            # Lógica de negocio + consultas SQL
├── middlewares/
│   ├── errorHandler.js  # Captura global de errores (AppError o inesperados)
│   └── validate.js      # Factory de middleware de validación
└── utils/
    └── AppError.js      # Error operacional con statusCode
```

Flujo de una request:

```
HTTP Request
  → Route (valida el body)
    → Controller (orquesta, no contiene lógica)
      → Service (SQL + reglas de negocio)
        → MySQL
      ← Service
    ← Controller
  ← HTTP Response
       ↕ (en caso de error)
  errorHandler middleware
```
