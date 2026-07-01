import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartContext } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCartContext();

  return (
    <div className="flex items-center gap-2 text-sm py-1">
      <span className="flex-1 text-slate-700 truncate">
        {item.image && <span className="mr-1">{item.image}</span>}
        {item.name}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="p-1 rounded hover:bg-slate-100 text-slate-500 transition"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center font-bold text-slate-900">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="p-1 rounded hover:bg-slate-100 text-slate-500 transition"
        >
          <Plus size={12} />
        </button>
      </div>

      <span className="font-semibold text-slate-800 text-right shrink-0">
        {formatCurrency(item.price * item.quantity)}
      </span>

      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-400 hover:text-red-600 p-1 transition shrink-0"
        aria-label="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
