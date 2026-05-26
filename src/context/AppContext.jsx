import React, { createContext, useState } from 'react';
import { MOCK_RESTAURANTES, MOCK_PRODUCTOS, INITIAL_ORDERS } from '../data/mockData';
import { DELIVERY_FEE } from '../constants/order';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [restaurantes] = useState(MOCK_RESTAURANTES);
  const [productos] = useState(MOCK_PRODUCTOS);
  const [pedidos, setPedidos] = useState(INITIAL_ORDERS);
  const [activeView, setActiveView] = useState('cliente-nuevo');
  const [selectedRestaurante, setSelectedRestaurante] = useState(MOCK_RESTAURANTES[0]);

  // Recibe cartItems desde el componente para no acoplar AppContext con CartContext
  const createPedidoSimulado = (cartItems, address, notes) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const nuevoPedido = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      client: "Cliente MVP Test",
      restaurant_id: selectedRestaurante.id,
      restaurant_name: selectedRestaurante.name,
      time_elapsed: "0m 01s",
      status: "pendiente",
      subtotal,
      delivery_fee: DELIVERY_FEE,
      total: subtotal + DELIVERY_FEE,
      address: address || "Dirección de Prueba",
      notes: notes || "Ninguna",
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    };

    setPedidos(prev => [nuevoPedido, ...prev]);
    setActiveView('cliente-tracking');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setPedidos(prev =>
      prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
    );
  };

  return (
    <AppContext.Provider value={{
      restaurantes, productos, pedidos, activeView, setActiveView,
      selectedRestaurante, setSelectedRestaurante,
      createPedidoSimulado, updateOrderStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};
