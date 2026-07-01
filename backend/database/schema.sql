-- OrderFlow Database Schema
-- Ejecutar este archivo una sola vez para crear la base de datos

CREATE DATABASE IF NOT EXISTS orderflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE orderflow;

-- ─── Restaurantes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurantes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  description TEXT,
  phone      VARCHAR(30),
  address    VARCHAR(255),
  is_open    TINYINT(1) NOT NULL DEFAULT 1,
  rating     DECIMAL(3,1) DEFAULT 0.0,
  distance   VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Productos ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  category      VARCHAR(80),
  name          VARCHAR(150) NOT NULL,
  description   TEXT,
  price         INT NOT NULL,
  image         VARCHAR(10) DEFAULT '🍽️',
  available     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- ─── Pedidos ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id            VARCHAR(20) PRIMARY KEY,
  client        VARCHAR(100) NOT NULL,
  restaurant_id INT NOT NULL,
  status        ENUM('pendiente','confirmado','preparando','en_camino','entregado','cancelado')
                NOT NULL DEFAULT 'pendiente',
  subtotal      INT NOT NULL DEFAULT 0,
  delivery_fee  INT NOT NULL DEFAULT 8000,
  total         INT NOT NULL DEFAULT 0,
  address       VARCHAR(255),
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurantes(id)
);

-- ─── Items de Pedido ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedido_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   VARCHAR(20) NOT NULL,
  product_id  INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  INT NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES productos(id)
);

-- ─── Datos de Ejemplo ─────────────────────────────────────────────────────────
INSERT INTO restaurantes (name, description, phone, address, is_open, rating, distance) VALUES
('Central Gourmet Hub',  'Las mejores hamburguesas y papas fritas artesanales.', '+595 981 123 456', 'Av. Mariscal López 1234, Asunción', 1, 4.8, '1.2km'),
('Cocina Central Norte', 'Comida hogareña, guisos y minutas del día.',            '+595 981 654 321', 'Calle Palma 567, Asunción',          1, 4.5, '2.5km');

INSERT INTO productos (restaurant_id, category, name, description, price, image) VALUES
(1, 'Comida Rápida', 'Classic Burger Deluxe',     'Doble carne, queso cheddar, lechuga y tomate', 35000, CONVERT(UNHEX('F09F8D94') USING utf8mb4)), -- 🍔
(1, 'Comida Rápida', 'Papas Fritas Grandes',       'Papas rústicas con sal de mar',                15000, CONVERT(UNHEX('F09F8D9F') USING utf8mb4)), -- 🍟
(1, 'Bebidas',       'Coca-Cola 600ml',             'Bebida gaseosa refrescante',                    8000, CONVERT(UNHEX('F09FA5A4') USING utf8mb4)), -- 🥤
(2, 'Comida Casera', 'Guiso de Carne Tradicional', 'Con papas, zanahorias y arroz',                25000, CONVERT(UNHEX('F09F8DB2') USING utf8mb4)); -- 🍲

-- Pedidos iniciales de ejemplo
INSERT INTO pedidos (id, client, restaurant_id, status, subtotal, delivery_fee, total, address, notes) VALUES
('ORD-9021', 'Carlos Mendoza', 1, 'preparando', 85000, 8000, 93000, 'Av. España 2345, Asunción', 'Sin cebolla en ambas hamburguesas.'),
('ORD-9022', 'Elena Rodríguez', 1, 'en_camino',  35000, 8000, 43000, 'Calle Eligio Ayala 890, Asunción', '');

INSERT INTO pedido_items (pedido_id, product_id, name, quantity, unit_price) VALUES
('ORD-9021', 1, 'Classic Burger Deluxe', 2, 35000),
('ORD-9021', 2, 'Papas Fritas Grandes',  1, 15000),
('ORD-9022', 1, 'Classic Burger Deluxe', 1, 35000);
