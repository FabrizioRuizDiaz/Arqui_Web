import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useCartContext } from '../context/CartContext';
import CartSummary from '../components/cart/CartSummary';
import { formatCurrency } from '../utils/currency';
import { Plus } from 'lucide-react';

export default function ClienteNuevoPedido() {
  const { productos, selectedRestaurante, createPedidoSimulado } = useContext(AppContext);
  const { cart, addToCart, clearCart } = useCartContext();

  const [direccion, setDireccion] = useState('Calle de la Victoria, 12, 28012 Madrid, España');
  const [notas, setNotas] = useState('');

  const restauranteProductos = productos.filter(p => p.restaurant_id === selectedRestaurante.id);

  const handleConfirm = () => {
    createPedidoSimulado(cart, direccion, notas);
    clearCart();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-extrabold text-slate-900">Nuevo Pedido</h1>
        <p className="text-slate-500 text-sm">
          Selecciona los productos de {selectedRestaurante.name} para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Catálogo de Productos */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Menú Disponible</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restauranteProductos.map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-2">{prod.image}</div>
                  <h3 className="font-bold text-slate-900">{prod.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{prod.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-brand">{formatCurrency(prod.price)}</span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-brand text-white p-2 rounded-lg hover:bg-brand-dark transition flex items-center gap-1 text-xs font-semibold"
                  >
                    <Plus size={16} /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel del Carrito */}
        <CartSummary
          direccion={direccion}
          setDireccion={setDireccion}
          notas={notas}
          setNotas={setNotas}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
