import React, { createContext, useState, useEffect } from 'react';
import { DELIVERY_FEE } from '../constants/order';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [activeView, setActiveView] = useState('cliente-nuevo');
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/restaurantes`).then(r => r.json()),
      fetch(`${API}/productos`).then(r => r.json()),
      fetch(`${API}/pedidos`).then(r => r.json()),
    ]).then(([rests, prods, peds]) => {
      setRestaurantes(rests);
      setProductos(prods);
      setPedidos(peds);
      if (rests.length) setSelectedRestaurante(rests[0]);
    }).catch(err => {
      console.error('Error cargando datos:', err);
      setApiError('No se pudo conectar con el servidor. Verificá que el backend esté corriendo en http://localhost:3001');
    }).finally(() => setLoading(false));
  }, []);

  const createPedidoSimulado = async (cartItems, address, notes) => {
    if (!selectedRestaurante) return;

    const body = {
      client: 'Cliente MVP Test',
      restaurant_id: selectedRestaurante.id,
      address: address || 'Dirección de Prueba',
      notes: notes || '',
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    };

    try {
      const res = await fetch(`${API}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const nuevoPedido = await res.json();
      if (!res.ok) throw new Error(nuevoPedido.error);
      setPedidos(prev => [nuevoPedido, ...prev]);
      setActiveView('cliente-tracking');
    } catch (err) {
      console.error('Error al crear pedido:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API}/pedidos/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Error actualizando estado');
      setPedidos(prev =>
        prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
      );
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  return (
    <AppContext.Provider value={{
      restaurantes, productos, pedidos, activeView, setActiveView,
      selectedRestaurante, setSelectedRestaurante,
      createPedidoSimulado, updateOrderStatus, loading, apiError,
    }}>
      {children}
    </AppContext.Provider>
  );
};
