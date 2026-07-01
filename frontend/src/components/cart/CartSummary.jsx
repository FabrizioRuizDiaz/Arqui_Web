import React from 'react';
import { ShoppingBag, MapPin } from 'lucide-react';
import CartItem from './CartItem';
import { useCartContext } from '../../context/CartContext';
import { DELIVERY_FEE } from '../../constants/order';
import { formatCurrency } from '../../utils/currency';

export default function CartSummary({ direccion, setDireccion, notas, setNotas, coords, onOpenMap, onConfirm }) {
  const { cart, subtotal } = useCartContext();
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <ShoppingBag className="text-brand" />
        <h2 className="font-bold text-slate-900">Resumen del Carrito</h2>
      </div>

      {cart.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">El carrito está vacío</p>
      ) : (
        <div className="space-y-1">
          {cart.map(item => <CartItem key={item.id} item={item} />)}

          <div className="pt-3 border-t border-slate-100 space-y-1 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Envío</span>
              <span>{formatCurrency(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
          <MapPin size={18} className="text-brand" /> Confirmar Ubicación
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500">DIRECCIÓN DE ENTREGA</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-brand"
          />

          <button
            onClick={onOpenMap}
            className="w-full mt-2 py-2 px-3 border border-brand text-brand rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-brand hover:text-white transition"
          >
            <MapPin size={14} />
            {coords ? 'Cambiar ubicación en mapa' : 'Seleccionar ubicación en mapa'}
          </button>

          {coords && (
            <p className="text-[10px] text-slate-400 mt-1 text-center">
              📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500">INSTRUCCIONES / NOTAS</label>
          <input
            type="text"
            placeholder="Ej. Dejar en portería, sin cebolla..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-brand"
          />
        </div>

        <button
          onClick={onConfirm}
          disabled={cart.length === 0}
          className="w-full bg-brand text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-brand-dark transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Enviar pedido ➔
        </button>

        <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-wider">
          Paso 1 de 2: Selección y Ubicación
        </p>
      </div>
    </div>
  );
}
