export const MOCK_RESTAURANTES = [
  {
    id: 1,
    name: "Central Gourmet Hub",
    description: "Las mejores hamburguesas y papas fritas artesanales.",
    phone: "+595 981 123 456",
    address: "Av. Mariscal López 1234, Asunción",
    is_open: true,
    rating: 4.8,
    distance: "1.2km"
  },
  {
    id: 2,
    name: "Cocina Central Norte",
    description: "Comida hogareña, guisos y minutas del día.",
    phone: "+595 981 654 321",
    address: "Calle Palma 567, Asunción",
    is_open: true,
    rating: 4.5,
    distance: "2.5km"
  }
];

export const MOCK_PRODUCTOS = [
  { id: 101, restaurant_id: 1, category: "Comida Rápida", name: "Classic Burger Deluxe", description: "Doble carne, queso cheddar, lechuga y tomate", price: 35000, image: "🍔" },
  { id: 102, restaurant_id: 1, category: "Comida Rápida", name: "Papas Fritas Grandes", description: "Papas rústicas con sal de mar", price: 15000, image: "🍟" },
  { id: 103, restaurant_id: 1, category: "Bebidas", name: "Coca-Cola 600ml", description: "Bebida gaseosa refrescante", price: 8000, image: "🥤" },
  { id: 104, restaurant_id: 2, category: "Comida Casera", name: "Guiso de Carne Tradicional", description: "Con papas, zanahorias y arroz", price: 25000, image: "🍲" }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-9021",
    client: "Carlos Mendoza",
    restaurant_id: 1,
    restaurant_name: "Central Gourmet Hub",
    time_elapsed: "12m 45s",
    status: "preparando",
    subtotal: 85000,
    delivery_fee: 8000,
    total: 93000,
    address: "Av. España 2345, Asunción",
    notes: "Sin cebolla en ambas hamburguesas.",
    items: [
      { product_id: 101, name: "Classic Burger Deluxe", quantity: 2, unit_price: 35000 },
      { product_id: 102, name: "Papas Fritas Grandes", quantity: 1, unit_price: 15000 }
    ]
  },
  {
    id: "ORD-9022",
    client: "Elena Rodríguez",
    restaurant_id: 1,
    restaurant_name: "Central Gourmet Hub",
    time_elapsed: "05m 12s",
    status: "en_camino",
    subtotal: 35000,
    delivery_fee: 8000,
    total: 43000,
    address: "Calle Eligio Ayala 890, Asunción",
    notes: "",
    items: [{ product_id: 101, name: "Classic Burger Deluxe", quantity: 1, unit_price: 35000 }]
  }
];
