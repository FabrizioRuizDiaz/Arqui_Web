================================================================================
         ORDERFLOW — GUÍA COMPLETA DEL PROYECTO
         Sistema de Delivery (Arquitectura Web — Universidad)
================================================================================

ÍNDICE
──────
  1.  Descripción del proyecto
  2.  Estructura de carpetas
  3.  Stack tecnológico
  4.  Instalación de requisitos (Node.js y MySQL)
  5.  Configuración de la base de datos
  6.  Configuración del backend
  7.  Levantar el backend
  8.  Configuración del frontend
  9.  Levantar el frontend
  10. Ver la base de datos con MySQL Workbench
  11. Probar el backend SOLO con Postman
  12. Probar el sistema COMPLETO (frontend + backend)
  13. Referencia completa de endpoints
  14. Arquitectura del backend
  15. Solución de problemas frecuentes
  16. Comandos de referencia rápida


================================================================================
1. DESCRIPCIÓN DEL PROYECTO
================================================================================

OrderFlow es un sistema de delivery tipo PedidosYa con:

  - Frontend en React 19 + Vite + Tailwind CSS
  - Backend REST API en Node.js + Express
  - Base de datos MySQL 8.4
  - Google Maps para selección de ubicación de entrega

Vistas disponibles en el frontend:
  • Cliente: Comprar     → elegir productos y hacer un pedido
  • Cliente: Tracking    → seguir el estado del pedido en tiempo real
  • Cocina Monitor       → vista de cocina para aceptar y procesar pedidos
  • Admin Dashboard      → vista de administración con todos los pedidos


================================================================================
2. ESTRUCTURA DE CARPETAS
================================================================================

PEDIDOS/
├── orderflow-front/          ← Aplicación React (frontend)
│   ├── src/
│   │   ├── context/
│   │   │   ├── AppContext.jsx     ← Estado global + llamadas a la API
│   │   │   └── CartContext.jsx    ← Estado del carrito de compras
│   │   ├── views/
│   │   │   ├── ClienteNuevoPedido.jsx
│   │   │   ├── ClienteTracking.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── CocinaMonitor.jsx
│   │   ├── components/cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   ├── hooks/useCart.js
│   │   ├── constants/order.js
│   │   └── App.jsx
│   ├── .env                  ← Variables de entorno del frontend
│   └── package.json
│
└── orderflow-back/           ← API REST (backend)
    ├── src/
    │   ├── server.js             ← Punto de entrada (solo app.listen)
    │   ├── app.js                ← Express: middlewares, rutas, error handler
    │   ├── config/
    │   │   └── database.js       ← Pool de conexiones MySQL
    │   ├── routes/
    │   │   ├── restaurantes.routes.js
    │   │   ├── productos.routes.js
    │   │   └── pedidos.routes.js  ← Incluye validación de entrada
    │   ├── controllers/
    │   │   ├── restaurantes.controller.js
    │   │   ├── productos.controller.js
    │   │   └── pedidos.controller.js
    │   ├── services/
    │   │   ├── restaurantes.service.js   ← SQL de restaurantes
    │   │   ├── productos.service.js      ← SQL de productos
    │   │   └── pedidos.service.js        ← SQL + lógica de negocio
    │   ├── middlewares/
    │   │   ├── errorHandler.js   ← Captura global de errores
    │   │   └── validate.js       ← Factory de validación de body
    │   └── utils/
    │       └── AppError.js       ← Clase de error con statusCode
    ├── database/
    │   ├── schema.sql            ← Crea BD, tablas y datos de ejemplo
    │   └── fix_emojis.sql        ← Corrección de encoding de emojis
    ├── .env                  ← Variables de entorno del backend
    ├── .env.example          ← Plantilla de variables de entorno
    ├── README.md             ← Guía rápida de instalación
    ├── TESTING.md            ← Guía detallada de pruebas
    └── package.json


================================================================================
3. STACK TECNOLÓGICO
================================================================================

FRONTEND
  • React 19
  • Vite 8
  • Tailwind CSS v4
  • lucide-react (íconos)
  • Google Maps API (selección de ubicación)

BACKEND
  • Node.js (LTS 18+)
  • Express 4
  • mysql2 (driver MySQL con soporte de Promises)
  • dotenv (variables de entorno)
  • cors (control de acceso entre dominios)
  • nodemon (reinicio automático en desarrollo)

BASE DE DATOS
  • MySQL 8.4 (servicio de Windows: MySQL84)

HERRAMIENTAS DE DESARROLLO
  • MySQL Workbench (cliente gráfico para la BD)
  • Postman (cliente HTTP para probar la API)


================================================================================
4. INSTALACIÓN DE REQUISITOS
================================================================================

━━━ 4.1 Node.js ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Ir a: https://nodejs.org
  2. Descargar la versión LTS (recomendada)
  3. Ejecutar el instalador .msi con opciones por defecto
  4. Verificar en una terminal nueva:

       node --version      ← debe mostrar v18.x o superior
       npm --version       ← debe mostrar 9.x o superior


━━━ 4.2 MySQL (via winget — Windows) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Ejecutar en PowerShell (ya fue realizado en este proyecto):

       winget install Oracle.MySQL --accept-package-agreements --accept-source-agreements

  MySQL queda instalado en:
       C:\Program Files\MySQL\MySQL Server 8.4\

  El archivo de configuración usado es:
       C:\Users\<tu-usuario>\mysql8.ini

  Contenido del mysql8.ini:
       [mysqld]
       basedir=C:/Program Files/MySQL/MySQL Server 8.4
       datadir=C:/ProgramData/MySQL/MySQL Server 8.4/Data
       port=3306


━━━ 4.3 Servicio de Windows MySQL84 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  El servicio ya está registrado como "MySQL84" con inicio AUTOMÁTICO.
  Arranca solo cuando iniciás Windows — no necesitás hacer nada.

  Para gestionarlo manualmente (requiere abrir PowerShell como Administrador):

       sc.exe start MySQL84      ← iniciar
       sc.exe stop MySQL84       ← detener
       sc.exe query MySQL84      ← ver estado

  Para verificar que está corriendo:

       Get-Service MySQL84       ← en PowerShell normal


━━━ 4.4 MySQL Workbench (cliente gráfico) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Descargar desde: https://dev.mysql.com/downloads/workbench/
  Instalación: siguiente > siguiente > finalizar.
  Ver sección 10 para la configuración de la conexión.


━━━ 4.5 Postman (cliente HTTP) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Descargar desde: https://www.postman.com/downloads/
  Instalación: siguiente > siguiente > finalizar.
  Ver sección 11 para cómo usarlo con esta API.


================================================================================
5. CONFIGURACIÓN DE LA BASE DE DATOS
================================================================================

  IMPORTANTE: Solo se hace UNA VEZ. Si la base de datos ya existe, saltear.

  Paso 1 — Verificar que MySQL está corriendo:
    Abrir PowerShell y ejecutar:
       Get-Service MySQL84
    Debe mostrar Status = Running

  Paso 2 — Crear la base de datos, tablas y datos de ejemplo:
    Abrir PowerShell (o cmd) y ejecutar:

       "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root < "D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-back\database\schema.sql"

    Esto crea:
      • Base de datos: orderflow
      • Tabla: restaurantes   (2 restaurantes de ejemplo)
      • Tabla: productos      (4 productos de ejemplo)
      • Tabla: pedidos        (2 pedidos de ejemplo)
      • Tabla: pedido_items   (items de los pedidos de ejemplo)

  Paso 3 — Verificar que se cargó bien:

       "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root orderflow -e "SHOW TABLES; SELECT COUNT(*) FROM productos;"

    Debe mostrar las 4 tablas y al menos 4 productos.


================================================================================
6. CONFIGURACIÓN DEL BACKEND
================================================================================

  Ubicación: D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-back\

  El archivo .env ya está configurado con los valores correctos:

       PORT=3001
       DB_HOST=localhost
       DB_PORT=3306
       DB_USER=root
       DB_PASSWORD=
       DB_NAME=orderflow

  Si en algún momento MySQL requiere contraseña, editá DB_PASSWORD en ese archivo.

  Instalar dependencias (solo la primera vez):

       cd "D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-back"
       npm install


================================================================================
7. LEVANTAR EL BACKEND
================================================================================

  Abrir una terminal en la carpeta orderflow-back y ejecutar:

       npm run dev

  Salida esperada:
       [nodemon] starting `node src/server.js`
       OrderFlow API corriendo en http://localhost:3001

  Para verificar que está funcionando, abrir en el browser:
       http://localhost:3001/api/health
  Debe responder: {"status":"ok"}

  El servidor se reinicia automáticamente (nodemon) cada vez que
  guardes cambios en cualquier archivo .js del proyecto.


================================================================================
8. CONFIGURACIÓN DEL FRONTEND
================================================================================

  Ubicación: D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-front\

  El archivo .env ya está configurado:

       VITE_GOOGLE_MAPS_API_KEY=AIzaSyCyld6Rq7s7Cs-YjH-2Fx94itx8POlXoEA
       VITE_API_URL=http://localhost:3001/api

  Instalar dependencias (solo la primera vez):

       cd "D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-front"
       npm install


================================================================================
9. LEVANTAR EL FRONTEND
================================================================================

  Abrir UNA SEGUNDA terminal en la carpeta orderflow-front y ejecutar:

       npm run dev

  Salida esperada:
       VITE v8.x  ready in XXX ms
       ➜  Local:   http://localhost:5173/

  Abrir en el browser: http://localhost:5173
  (Si el puerto 5173 está ocupado, Vite usa 5174, 5175, etc.)

  NOTA: El backend DEBE estar corriendo antes de abrir el frontend,
  de lo contrario la pantalla muestra el spinner de carga indefinidamente.


================================================================================
10. VER LA BASE DE DATOS CON MySQL Workbench
================================================================================

━━━ Conectarse ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Abrir MySQL Workbench
  2. Click en el "+" junto a "MySQL Connections"
  3. Completar:
       Connection Name : OrderFlow Local
       Hostname        : 127.0.0.1
       Port            : 3306
       Username        : root
       Password        : (dejar vacío → click "Store in Vault" → OK)
       Default Schema  : orderflow
  4. Click "Test Connection" → debe decir "Successfully made the MySQL connection"
  5. Click OK → doble click en la conexión para abrirla
  6. En el panel izquierdo expandir: orderflow > Tables

━━━ Queries útiles ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Abrir un Query Tab con Ctrl+T y ejecutar con Ctrl+Enter (o el botón ⚡):

  -- Ver todas las tablas
  SHOW TABLES;

  -- Ver restaurantes
  SELECT * FROM restaurantes;

  -- Ver productos
  SELECT * FROM productos;

  -- Ver pedidos (con nombre de restaurante)
  SELECT p.id, p.client, r.name AS restaurante, p.status, p.total, p.created_at
  FROM pedidos p
  JOIN restaurantes r ON r.id = p.restaurant_id
  ORDER BY p.created_at DESC;

  -- Ver pedidos con sus items detallados
  SELECT p.id, p.client, p.status, pi.name AS producto, pi.quantity, pi.unit_price
  FROM pedidos p
  JOIN pedido_items pi ON pi.pedido_id = p.id
  ORDER BY p.created_at DESC;

  -- Items de un pedido específico
  SELECT * FROM pedido_items WHERE pedido_id = 'ORD-9021';

  -- Contar registros por tabla
  SELECT 'restaurantes' AS tabla, COUNT(*) AS total FROM restaurantes
  UNION ALL SELECT 'productos',   COUNT(*) FROM productos
  UNION ALL SELECT 'pedidos',     COUNT(*) FROM pedidos
  UNION ALL SELECT 'pedido_items',COUNT(*) FROM pedido_items;

  -- Pedidos agrupados por estado
  SELECT status, COUNT(*) AS cantidad FROM pedidos GROUP BY status;

  -- Último pedido creado
  SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 1;


================================================================================
11. PROBAR EL BACKEND SOLO CON POSTMAN
================================================================================

  Requisito: el backend debe estar corriendo (npm run dev en orderflow-back)
  El frontend NO necesita estar corriendo para estas pruebas.

━━━ Configuración inicial en Postman ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Abrir Postman
  2. Click en "Collections" (panel izquierdo) → "+" → "Blank Collection"
  3. Nombrarla "OrderFlow API"
  4. Para cada request: click en "Add a request" dentro de la colección

━━━ Request 1: Health Check ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/health

  Respuesta esperada (200 OK):
  {
    "status": "ok"
  }

━━━ Request 2: Listar restaurantes ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/restaurantes

  Respuesta esperada (200 OK):
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
    {
      "id": 2,
      "name": "Cocina Central Norte",
      ...
    }
  ]

━━━ Request 3: Un restaurante por ID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/restaurantes/1

  Probar con ID inexistente:
  URL    : http://localhost:3001/api/restaurantes/999
  Respuesta (404):
  {
    "error": "Restaurante no encontrado"
  }

━━━ Request 4: Listar todos los productos ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/productos

━━━ Request 5: Productos de un restaurante ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/productos?restaurant_id=1

  Respuesta esperada (200 OK):
  [
    {
      "id": 1,
      "restaurant_id": 1,
      "category": "Comida Rápida",
      "name": "Classic Burger Deluxe",
      "description": "Doble carne, queso cheddar, lechuga y tomate",
      "price": 35000,
      "image": "🍔",
      "available": 1
    },
    ...
  ]

━━━ Request 6: Crear un pedido ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : POST
  URL    : http://localhost:3001/api/pedidos

  En Postman:
    Pestaña "Body" → seleccionar "raw" → cambiar el tipo a "JSON"

  Body:
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

  Respuesta esperada (201 Created):
  {
    "id": "ORD-4721",
    "client": "Juan Pérez",
    "restaurant_id": 1,
    "restaurant_name": "Central Gourmet Hub",
    "status": "pendiente",
    "subtotal": 85000,
    "delivery_fee": 8000,
    "total": 93000,
    "address": "Calle San Martín 456, Asunción",
    "notes": "Sin cebolla por favor",
    "items": [
      {
        "id": 5,
        "pedido_id": "ORD-4721",
        "product_id": 1,
        "name": "Classic Burger Deluxe",
        "quantity": 2,
        "unit_price": 35000
      },
      {
        "id": 6,
        "pedido_id": "ORD-4721",
        "product_id": 2,
        "name": "Papas Fritas Grandes",
        "quantity": 1,
        "unit_price": 15000
      }
    ]
  }

  Nota: el total se calcula automáticamente:
    subtotal = (35000 × 2) + (15000 × 1) = 85000
    delivery_fee = 8000 (fijo)
    total = 85000 + 8000 = 93000

  PRUEBAS DE VALIDACIÓN (errores esperados):

  a) Sin campo "client":
     Body: { "restaurant_id": 1, "items": [...] }
     Respuesta (400): { "error": "El campo client es obligatorio" }

  b) Sin campo "restaurant_id":
     Body: { "client": "Juan", "items": [...] }
     Respuesta (400): { "error": "El campo restaurant_id es obligatorio" }

  c) Sin items o items vacío:
     Body: { "client": "Juan", "restaurant_id": 1, "items": [] }
     Respuesta (400): { "error": "Se requiere al menos un item en items[]" }

  d) Item sin campos requeridos:
     Body: { "client": "Juan", "restaurant_id": 1, "items": [{"product_id": 1}] }
     Respuesta (400): { "error": "Cada item debe tener: product_id, name, quantity, unit_price" }

━━━ Request 7: Cambiar estado de un pedido ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : PATCH
  URL    : http://localhost:3001/api/pedidos/ORD-9021/status
  (Reemplazar ORD-9021 por el ID del pedido que creaste)

  Body (raw JSON):
  {
    "status": "preparando"
  }

  Respuesta esperada (200 OK):
  {
    "id": "ORD-9021",
    "status": "preparando"
  }

  Estados válidos (en orden de flujo):
    pendiente → confirmado → preparando → en_camino → entregado
                                                     → cancelado

  PRUEBAS DE VALIDACIÓN:

  a) Estado inválido:
     Body: { "status": "listo" }
     Respuesta (400): { "error": "Estado inválido. Valores aceptados: pendiente, confirmado, ..." }

  b) Pedido inexistente:
     URL: http://localhost:3001/api/pedidos/ORD-9999/status
     Respuesta (404): { "error": "Pedido no encontrado" }

━━━ Request 8: Ver todos los pedidos ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/pedidos

  Devuelve todos los pedidos con el array "items" ya incluido en cada uno.

━━━ Request 9: Ver un pedido por ID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Método : GET
  URL    : http://localhost:3001/api/pedidos/ORD-9021

━━━ Flujo completo de prueba solo con Postman ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Ejecutar en este orden:

  1. GET  /api/restaurantes           → ver los restaurantes disponibles
  2. GET  /api/productos?restaurant_id=1  → ver productos del restaurante 1
  3. POST /api/pedidos                → crear pedido → ANOTAR el "id" devuelto
  4. GET  /api/pedidos/{id}           → verificar que el pedido existe con sus items
  5. PATCH /api/pedidos/{id}/status   con "status": "confirmado"
  6. PATCH /api/pedidos/{id}/status   con "status": "preparando"
  7. PATCH /api/pedidos/{id}/status   con "status": "en_camino"
  8. PATCH /api/pedidos/{id}/status   con "status": "entregado"
  9. GET  /api/pedidos/{id}           → verificar que el status final es "entregado"

  Verificar en MySQL Workbench:
    SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 1;


================================================================================
12. PROBAR EL SISTEMA COMPLETO (FRONTEND + BACKEND)
================================================================================

━━━ Levantar ambos servicios ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Terminal 1 (backend):
    cd "D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-back"
    npm run dev
    → esperar "OrderFlow API corriendo en http://localhost:3001"

  Terminal 2 (frontend):
    cd "D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-front"
    npm run dev
    → abrir en el browser la URL que muestre (http://localhost:5173)

━━━ Flujo 1: Hacer un pedido como cliente ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Abrir http://localhost:5173 en el browser
  2. Click en "Cliente: Comprar" en el navbar
  3. Los productos se cargan desde la base de datos (no son datos de prueba)
  4. Click en "Agregar" en 1 o más productos → aparecen en el panel del carrito
  5. En el panel derecho:
       - Completar dirección (o usar el botón del mapa 📍)
       - Agregar notas opcionales
       - Click en "Confirmar Pedido"
  6. La app navega automáticamente a "Cliente: Tracking"

  Verificar en MySQL Workbench:
    SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 1;
    SELECT * FROM pedido_items ORDER BY id DESC LIMIT 5;

━━━ Flujo 2: Procesar el pedido en la cocina ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Click en "Cocina Monitor" en el navbar
  2. Aparece el pedido recién creado con estado "pendiente"
  3. Click en "Aceptar pedido" → cambia a "preparando"
  4. Click en "Marcar como Listo" → cambia a "en_camino"

  Verificar en MySQL Workbench:
    SELECT id, status, updated_at FROM pedidos ORDER BY updated_at DESC;

━━━ Flujo 3: Gestionar desde el panel de admin ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Click en "Admin Dashboard" en el navbar
  2. Aparecen TODOS los pedidos en una tabla
  3. En la columna "Acciones" podés cambiar el estado de cualquier pedido
     con el dropdown → el cambio se guarda en MySQL instantáneamente
  4. Cambiar el pedido a "entregado"

━━━ Flujo 4: Verificar persistencia de datos ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Para confirmar que los datos viven en MySQL y no en memoria:

  1. Crear un pedido desde el frontend
  2. CERRAR el browser completamente (Ctrl+W o cerrar la ventana)
  3. Volver a abrir http://localhost:5173
  4. Ir a "Admin Dashboard" → el pedido sigue estando

  Esto confirma que los datos persisten en la base de datos.


================================================================================
13. REFERENCIA COMPLETA DE ENDPOINTS
================================================================================

  URL base: http://localhost:3001

  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Endpoint                         │ Método │ Descripción                 │
  ├──────────────────────────────────┼────────┼─────────────────────────────┤
  │ /api/health                      │ GET    │ Verificar estado del server  │
  │ /api/restaurantes                │ GET    │ Listar todos los restaurantes│
  │ /api/restaurantes/:id            │ GET    │ Un restaurante por ID        │
  │ /api/productos                   │ GET    │ Listar todos los productos   │
  │ /api/productos?restaurant_id=N   │ GET    │ Productos de un restaurante  │
  │ /api/productos/:id               │ GET    │ Un producto por ID           │
  │ /api/pedidos                     │ GET    │ Todos los pedidos con items  │
  │ /api/pedidos/:id                 │ GET    │ Un pedido con sus items      │
  │ /api/pedidos                     │ POST   │ Crear nuevo pedido           │
  │ /api/pedidos/:id/status          │ PATCH  │ Cambiar estado del pedido    │
  └─────────────────────────────────────────────────────────────────────────┘

  Códigos de respuesta usados:
    200 → OK (GET y PATCH exitosos)
    201 → Created (POST exitoso)
    400 → Bad Request (validación fallida)
    404 → Not Found (recurso no existe)
    500 → Internal Server Error (error no controlado)


================================================================================
14. ARQUITECTURA DEL BACKEND
================================================================================

  Patrón: Route → Controller → Service → Database

  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
  │   Route    │───▶│ Controller │───▶│  Service   │───▶│   MySQL    │
  │            │    │            │    │            │    │            │
  │ • Define   │    │ • Recibe   │    │ • Contiene │    │ • Pool de  │
  │   verbos   │    │   req/res  │    │   el SQL   │    │   conexión │
  │   HTTP     │    │ • Llama al │    │ • Contiene │    │   (mysql2) │
  │ • Valida   │    │   service  │    │   lógica   │    │            │
  │   el body  │    │ • Reenvía  │    │   de       │    │            │
  │            │    │   errores  │    │   negocio  │    │            │
  │            │    │   con next │    │            │    │            │
  └────────────┘    └────────────┘    └────────────┘    └────────────┘
         │                                                      │
         │                  Si hay error                        │
         ▼                                                      │
  ┌────────────────────────────────────────────────────────────┘
  │   errorHandler middleware
  │   • AppError (operacional) → devuelve el mensaje exacto con su statusCode
  │   • Error inesperado       → devuelve "Error interno del servidor" + log en consola
  └───────────────────────────────────────────────────────────────────────────┘


================================================================================
15. SOLUCIÓN DE PROBLEMAS FRECUENTES
================================================================================

━━━ "Error interno del servidor" en todos los endpoints ━━━━━━━━━━━━━━━━━━━━━━

  Causa: MySQL no está corriendo.
  Solución: Verificar el servicio:
    Get-Service MySQL84
  Si Status = Stopped, iniciarlo (como administrador):
    sc.exe start MySQL84

━━━ Pantalla blanca en el frontend ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Causa: El backend no está corriendo cuando carga el frontend.
  Solución: Levantar el backend primero (npm run dev en orderflow-back),
  luego recargar el browser con F5.

━━━ "Failed to fetch" en la consola del browser ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Causa 1: El backend no está corriendo.
  Causa 2: El frontend está en un puerto distinto al configurado en CORS.
  Solución: El backend acepta cualquier puerto de localhost automáticamente.
  Verificar que el backend esté corriendo y recargar.

━━━ Los emojis se ven como símbolos extraños ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Causa: Problema de encoding al importar el schema.sql.
  Solución: Ejecutar el script de corrección:
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root --default-character-set=utf8mb4 < "D:\Fabri.Facultad\Arqui Web\PEDIDOS\orderflow-back\database\fix_emojis.sql"

━━━ Puerto 5173 ocupado ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Vite usa automáticamente el siguiente disponible (5174, 5175...).
  Usar la URL que muestre en la terminal, no asumir siempre 5173.

━━━ ECONNREFUSED 127.0.0.1:3306 en el log del backend ━━━━━━━━━━━━━━━━━━━━━━━

  Causa: MySQL no estaba listo cuando llegó la primera request.
  Solución: El pool reintenta automáticamente. Recargar la página en el browser.
  Si persiste, verificar el servicio MySQL84.


================================================================================
16. COMANDOS DE REFERENCIA RÁPIDA
================================================================================

  LEVANTAR EL PROYECTO:
  ─────────────────────
  Terminal 1 → cd "...\orderflow-back"  && npm run dev
  Terminal 2 → cd "...\orderflow-front" && npm run dev
  Browser    → http://localhost:5173 (o el puerto que muestre Vite)

  MYSQL (PowerShell como admin para start/stop):
  ──────────────────────────────────────────────
  Ver estado           → Get-Service MySQL84
  Iniciar              → sc.exe start MySQL84
  Detener              → sc.exe stop MySQL84
  Conectar por consola → "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root orderflow

  QUERIES RÁPIDAS (en MySQL Workbench o consola):
  ────────────────────────────────────────────────
  Ver pedidos recientes → SELECT id, client, status, total FROM pedidos ORDER BY created_at DESC;
  Ver items de pedido   → SELECT * FROM pedido_items WHERE pedido_id = 'ORD-XXXX';
  Cambiar estado manual → UPDATE pedidos SET status = 'entregado' WHERE id = 'ORD-XXXX';
  Borrar un pedido      → DELETE FROM pedidos WHERE id = 'ORD-XXXX';
  Resetear datos        → DROP DATABASE orderflow; (y volver a ejecutar schema.sql)

  VERIFICAR QUE TODO FUNCIONA:
  ────────────────────────────
  Backend health  → http://localhost:3001/api/health
  Restaurantes    → http://localhost:3001/api/restaurantes
  Productos       → http://localhost:3001/api/productos
  Pedidos         → http://localhost:3001/api/pedidos

================================================================================
                         FIN DEL DOCUMENTO
================================================================================
