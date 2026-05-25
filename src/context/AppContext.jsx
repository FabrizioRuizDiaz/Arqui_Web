import React, { createContext, useState } from 'react';
import { MOCK_RESTAURANTES, MOCK_PRODUCTOS, INITIAL_ORDERS } from '../data/mockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [restaurantes] = useState(MOCK_RESTAURANTES);
  const [productos] = useState(MOCK_PRODUCTOS);
  const [pedidos, setPedidos] = useState(INITIAL_ORDERS);
  const [activeView, setActiveView] = useState('cliente-nuevo'); // Control de navegación manual MVP
  
  // Estado del Carrito del Cliente
  const [cart, setCart] = useState([]);
  const [selectedRestaurante, setSelectedRestaurante] = useState(MOCK_RESTAURANTES[0]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const createPedidoSimulado = (address, notes) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const delivery_fee = 4.50;
    const nuevoPedido = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      client: "Cliente MVP Test",
      restaurant_id: selectedRestaurante.id,
      restaurant_name: selectedRestaurante.name,
      time_elapsed: "0m 01s",
      status: "pendiente",
      subtotal,
      delivery_fee,
      total: subtotal + delivery_fee,
      address: address || "Dirección de Prueba Detectada",
      notes: notes || "Ninguna",
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price
      }))
    };

    setPedidos([nuevoPedido, ...pedidos]);
    clearCart();
    setActiveView('cliente-tracking');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setPedidos(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <AppContext.Provider value={{
      restaurantes, productos, pedidos, activeView, setActiveView,
      cart, selectedRestaurante, setSelectedRestaurante, addToCart, clearCart,
      createPedidoSimulado, updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};