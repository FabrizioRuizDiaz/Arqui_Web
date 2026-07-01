# Guía de Testing — OrderFlow Backend

Cómo verificar la base de datos, probar el backend solo y probar el sistema completo.

---

## 1. Herramientas recomendadas

### Para la base de datos → MySQL Workbench

Descargá e instalá **MySQL Workbench** (gratis, oficial de Oracle):
https://dev.mysql.com/downloads/workbench/

Es el cliente gráfico oficial para MySQL. Permite ver tablas, ejecutar queries,
ver registros y hacer consultas sin escribir código.

### Para la API → Postman

Descargá **Postman** (gratis):
https://www.postman.com/downloads/

Permite enviar requests HTTP (GET, POST, PATCH, etc.) con cuerpo JSON,
ver la respuesta formateada y guardar colecciones de pruebas.

---

## 2. Conectar MySQL Workbench a la base de datos

1. Abrí MySQL Workbench
2. Click en el **+** junto a "MySQL Connections"
3. Completá los campos:

```
Connection Name : OrderFlow Local
Hostname        : 127.0.0.1
Port            : 3306
Username        : root
Password        : (dejar vacío)
Default Schema  : orderflow
```

4. Click en **Test Connection** → debería decir "Successfully made the MySQL connection"
5. Click **OK** y luego doble click en la conexión para abrirla

### Queries útiles para verificar datos

Una vez conectado, abrí un nuevo Query tab (Ctrl+T) y ejecutá con Ctrl+Enter:

```sql
-- Ver todas las tablas de la base de datos
SHOW TABLES;

-- Ver todos los restaurantes
SELECT * FROM restaurantes;

-- Ver todos los productos
SELECT * FROM productos;

-- Ver todos los pedidos con el nombre del restaurante
SELECT p.id, p.client, r.name AS restaurante, p.status, p.total, p.created_at
FROM pedidos p
JOIN restaurantes r ON r.id = p.restaurant_id
ORDER BY p.created_at DESC;

-- Ver los items de un pedido específico
SELECT * FROM pedido_items WHERE pedido_id = 'ORD-9021';

-- Ver pedidos con sus items (todo junto)
SELECT
  p.id,
  p.client,
  p.status,
  p.total,
  pi.name AS producto,
  pi.quantity,
  pi.unit_price
FROM pedidos p
JOIN pedido_items pi ON pi.pedido_id = p.id
ORDER BY p.created_at DESC;

-- Contar registros por tabla
SELECT 'restaurantes' AS tabla, COUNT(*) AS total FROM restaurantes
UNION ALL
SELECT 'productos',              COUNT(*) FROM productos
UNION ALL
SELECT 'pedidos',                COUNT(*) FROM pedidos
UNION ALL
SELECT 'pedido_items',           COUNT(*) FROM pedido_items;

-- Ver pedidos por estado
SELECT status, COUNT(*) AS cantidad FROM pedidos GROUP BY status;
```

---

## 3. Probar el backend SOLO (sin el frontend)

### Requisitos previos

- MySQL corriendo (`MySQL84` como servicio de Windows — arranca automático)
- Backend corriendo: `npm run dev` en la carpeta `orderflow-back`
- El backend queda disponible en `http://localhost:3001`

### En Postman: importar la colección

Creá una nueva Collection llamada **OrderFlow API** y agregá los siguientes requests:

---

#### GET /api/health — Verificar que el servidor está vivo

```
Método : GET
URL    : http://localhost:3001/api/health
```

Respuesta esperada (200):
```json
{ "status": "ok" }
```

---

#### GET /api/restaurantes — Listar restaurantes

```
Método : GET
URL    : http://localhost:3001/api/restaurantes
```

Respuesta esperada (200):
```json
[
  {
    "id": 1,
    "name": "Central Gourmet Hub",
    "description": "Las mejores hamburguesas y papas fritas artesanales.",
    "phone": "+595 981 123 456",
    "address": "Av. Mariscal López 1234, Asunción",
    "is_open": 1,
    "rating": "4.8",
    "distance": "1.2km"
  },
  { ... }
]
```

---

#### GET /api/restaurantes/:id — Un restaurante por ID

```
Método : GET
URL    : http://localhost:3001/api/restaurantes/1
```

Respuesta 404 si no existe:
```json
{ "error": "Restaurante no encontrado" }
```

---

#### GET /api/productos — Listar productos (con filtro opcional)

```
Método : GET
URL    : http://localhost:3001/api/productos
```

Filtrar por restaurante con query param:
```
URL : http://localhost:3001/api/productos?restaurant_id=1
```

---

#### POST /api/pedidos — Crear un pedido

```
Método       : POST
URL          : http://localhost:3001/api/pedidos
Content-Type : application/json
```

Body (pestaña "Body" → "raw" → "JSON"):
```json
{
  "client": "Juan Pérez",
  "restaurant_id": 1,
  "address": "Calle San Martín 456, Asunción",
  "notes": "Sin cebolla por favor",
  "items": [
    {
      "product_id": 1,
      "name": "Classic Burger Deluxe",
      "quantity": 2,
      "unit_price": 35000
    },
    {
      "product_id": 2,
      "name": "Papas Fritas Grandes",
      "quantity": 1,
      "unit_price": 15000
    }
  ]
}
```

Respuesta esperada (201):
```json
{
  "id": "ORD-XXXX",
  "client": "Juan Pérez",
  "status": "pendiente",
  "subtotal": 85000,
  "delivery_fee": 8000,
  "total": 93000,
  "items": [ ... ]
}
```

**Validaciones — qué pasa si mandás datos incorrectos:**

Sin `client`:
```json
{ "error": "El campo client es obligatorio" }   → 400
```

Sin `items`:
```json
{ "error": "Se requiere al menos un item en items[]" }   → 400
```

---

#### PATCH /api/pedidos/:id/status — Cambiar estado de un pedido

```
Método       : PATCH
URL          : http://localhost:3001/api/pedidos/ORD-9021/status
Content-Type : application/json
```

Body:
```json
{ "status": "preparando" }
```

Estados válidos en orden:
```
pendiente → confirmado → preparando → en_camino → entregado
                                                 → cancelado
```

Error si el estado no existe:
```json
{ "error": "Estado inválido. Valores aceptados: pendiente, confirmado, ..." }   → 400
```

Error si el pedido no existe:
```json
{ "error": "Pedido no encontrado" }   → 404
```

---

#### GET /api/pedidos — Listar todos los pedidos

```
Método : GET
URL    : http://localhost:3001/api/pedidos
```

Devuelve array de pedidos, cada uno con su array `items` ya incluido.

---

#### GET /api/pedidos/:id — Un pedido por ID

```
Método : GET
URL    : http://localhost:3001/api/pedidos/ORD-9021
```

---

### Flujo de prueba completo (solo backend)

Ejecutá estos requests en orden para simular un pedido real:

1. `GET /api/restaurantes` → anotá el `id` del restaurante
2. `GET /api/productos?restaurant_id=1` → anotá los `id` y `price` de productos
3. `POST /api/pedidos` → creá el pedido con esos datos → anotá el `id` del pedido devuelto
4. `GET /api/pedidos/{id}` → verificá que se creó bien con sus items
5. `PATCH /api/pedidos/{id}/status` con `"status": "confirmado"` → avanzá el estado
6. `PATCH /api/pedidos/{id}/status` con `"status": "preparando"`
7. `PATCH /api/pedidos/{id}/status` con `"status": "en_camino"`
8. `PATCH /api/pedidos/{id}/status` con `"status": "entregado"`
9. En MySQL Workbench ejecutá `SELECT * FROM pedidos` para ver el registro final

---

## 4. Probar el sistema COMPLETO (frontend + backend)

### Levantar ambos servicios

Terminal 1 — Backend:
```bash
cd orderflow-back
npm run dev
# → "OrderFlow API corriendo en http://localhost:3001"
```

Terminal 2 — Frontend:
```bash
cd orderflow-front
npm run dev
# → "Local: http://localhost:5173"
```

Abrí el browser en la URL que muestre Vite (normalmente `http://localhost:5173`).

### Flujo de prueba en el browser

#### Hacer un pedido (vista Cliente: Comprar)

1. En el navbar clickeá **Cliente: Comprar**
2. Vas a ver los productos del restaurante cargados desde la base de datos real
3. Clickeá **Agregar** en 1 o más productos
4. En el panel derecho (carrito) completá la dirección y notas opcionales
5. Clickeá **Confirmar Pedido**
6. La app navega automáticamente a **Cliente: Tracking**

**Verificar en MySQL Workbench:**
```sql
SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 1;
SELECT * FROM pedido_items WHERE pedido_id = (
  SELECT id FROM pedidos ORDER BY created_at DESC LIMIT 1
);
```

#### Procesar el pedido (vista Cocina Monitor)

1. En el navbar clickeá **Cocina Monitor**
2. El pedido recién creado aparece como "pendiente"
3. Clickeá **Aceptar pedido** → cambia a "preparando"
4. Clickeá **Marcar como Listo** → cambia a "en_camino"

**Verificar en MySQL Workbench:**
```sql
SELECT id, status FROM pedidos ORDER BY created_at DESC LIMIT 3;
```

#### Ver todos los pedidos (vista Admin Dashboard)

1. En el navbar clickeá **Admin Dashboard**
2. Ves todos los pedidos en la tabla con sus estados actuales
3. Podés cambiar el estado de cualquier pedido desde el dropdown
4. El cambio se guarda en MySQL instantáneamente

---

## 5. Verificar que los datos persisten

Para confirmar que el backend está usando la BD real y no datos en memoria:

1. Creá un pedido desde el frontend
2. **Cerrá el browser completamente**
3. Volvé a abrir `http://localhost:5173`
4. Andá a **Admin Dashboard** → el pedido creado sigue estando

Esto confirma que los datos viven en MySQL, no en el estado de React.

---

## 6. Resumen de puertos

| Servicio        | Puerto | URL                          |
|-----------------|--------|------------------------------|
| MySQL           | 3306   | — (solo conexión interna)    |
| Backend API     | 3001   | http://localhost:3001        |
| Frontend (Vite) | 5173   | http://localhost:5173        |
| API Health      | 3001   | http://localhost:3001/api/health |
