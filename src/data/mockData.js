export const MOCK_RESTAURANTES = [
  {
    id: 1,
    name: "Central Gourmet Hub",
    description: "Las mejores hamburguesas y papas fritas artesanales.",
    phone: "+595981123456",
    address: "Av. Reforma 124, Int 402",
    is_open: true,
    rating: 4.8,
    distance: "1.2km"
  },
  {
    id: 2,
    name: "Cocina Central Norte",
    description: "Comida hogareña, guisos y minutas del día.",
    phone: "+595981654321",
    address: "Calle de la Victoria, 12",
    is_open: true,
    rating: 4.5,
    distance: "2.5km"
  }
];

export const MOCK_PRODUCTOS = [
  { id: 101, restaurant_id: 1, category: "Comida Rápida", name: "Classic Burger Deluxe", description: "Doble carne, queso cheddar, lechuga y tomate", price: 12.00, image: "🍔" },
  { id: 102, restaurant_id: 1, category: "Comida Rápida", name: "Papas Fritas Grandes", description: "Papas rústicas con sal de mar", price: 4.50, image: "🍟" },
  { id: 103, restaurant_id: 1, category: "Bebidas", name: "Coca-Cola 600ml", description: "Bebida gaseosa refrescante", price: 2.00, image: "🥤" },
  { id: 104, restaurant_id: 2, category: "Comida Casera", name: "Guiso de Carne Tradicional", description: "Con papas, zanahorias y arroz arrozado", price: 15.00, image: "🍲" }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9021",
    client: "Carlos Mendoza",
    restaurant_id: 1,
    restaurant_name: "Central Gourmet Hub",
    time_elapsed: "12m 45s",
    status: "preparando", // pendiente, confirmado, preparando, en_camino, entregado, cancelado
    subtotal: 24.00,
    delivery_fee: 4.50,
    total: 28.50,
    address: "Av. Reforma 124, Int 402",
    notes: "Sin cebolla en ambas hamburguesas.",
    items: [
      { product_id: 101, name: "Classic Burger Deluxe", quantity: 2, unit_price: 12.00 },
      { product_id: 102, name: "Papas Fritas Grandes", quantity: 1, unit_price: 4.50 }
    ]
  },
  {
    id: "ORD-9022",
    client: "Elena Rodriguez",
    restaurant_id: 1,
    restaurant_name: "Central Gourmet Hub",
    time_elapsed: "05m 12s",
    status: "en_camino",
    subtotal: 14.00,
    delivery_fee: 3.00,
    total: 17.00,
    address: "Calle de la Victoria, 12, Madrid",
    notes: "",
    items: [{ product_id: 101, name: "Classic Burger Deluxe", quantity: 1, unit_price: 14.00 }]
  }
];