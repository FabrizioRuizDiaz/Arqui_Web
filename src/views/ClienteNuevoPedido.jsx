import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, ShoppingBag, Plus } from 'lucide-react';

export default function ClienteNuevoPedido() {
  const { productos, selectedRestaurante, addToCart, cart, createPedidoSimulado } = useContext(AppContext);
  const [direccion, setDireccion] = useState('Calle de la Victoria, 12, 28012 Madrid, España');
  const [notas, setNotas] = useState('');

  const restauranteProductos = productos.filter(p => p.restaurant_id === selectedRestaurante.id);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-extrabold text-slate-900">Nuevo Pedido</h1>
        <p className="text-slate-500 text-sm">Selecciona los productos de {selectedRestaurante.name} para comenzar</p>
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
                  <span className="font-bold text-brand">${prod.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(prod)} className="bg-brand text-white p-2 rounded-lg hover:bg-brand-dark transition flex items-center gap-1 text-xs font-semibold">
                    <Plus size={16} /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito y Confirmación de Ubicación */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShoppingBag className="text-brand" />
            <h2 className="font-bold text-slate-900">Resumen del Carrito</h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">El carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600"><strong className="text-slate-900">{item.quantity}x</strong> {item.name}</span>
                  <span className="font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Formulario de Ubicación */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
              <MapPin size={18} className="text-brand" /> Confirmar Ubicación
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">DIRECCIÓN ACTUAL DETECTADA</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">INSTRUCCIONES / NOTAS</label>
              <input type="text" placeholder="Ej. Dejar en portería, sin cebolla..." value={notas} onChange={(e) => setNotas(e.target.value)} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-brand" />
            </div>

            <button onClick={() => createPedidoSimulado(direccion, notas)} disabled={cart.length === 0} className="w-full bg-brand text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-brand-dark transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed">
              Enviar pedido ➔
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-wider">Paso 1 de 2: Selección y Ubicación</p>
          </div>
        </div>
      </div>
    </div>
  );
}