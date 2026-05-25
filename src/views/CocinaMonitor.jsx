import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ChefHat, Check, AlertCircle } from 'lucide-react';

export default function CocinaMonitor() {
  const { pedidos, updateOrderStatus } = useContext(AppContext);
  
  // Filtramos pedidos en preparación o pendientes asignados a la cocina ID: 1
  const pedidosCocina = pedidos.filter(p => p.status === 'preparando' || p.status === 'pendiente');

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Monitor de Cocina</h1>
          <p className="text-slate-500 text-sm">Gestión de pedidos en tiempo real y flujo de preparación.</p>
        </div>
        <span className="bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white"></span> SISTEMA ONLINE
        </span>
      </div>

      {pedidosCocina.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
          <ChefHat size={48} className="mx-auto mb-2 opacity-50" /> No hay órdenes pendientes en la cola de producción.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pedidosCocina.map(order => (
            <div key={order.id} className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-brand uppercase tracking-wider">NUEVO PEDIDO {order.id}</span>
                  <p className="text-xs text-slate-400 mt-0.5">⏱️ Recibido hace: {order.time_elapsed}</p>
                </div>
                <span className="text-sm font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg capitalize">{order.status}</span>
              </div>

              {/* Items Detail */}
              <div className="p-4 flex-1 space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">DETALLE DEL PEDIDO</p>
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-bold text-slate-800 text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-slate-400 text-xs font-mono">PT-0{idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex gap-2 items-start text-orange-800 text-xs">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p><strong>Nota:</strong> {order.notes}</p>
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Ubicación Cliente:</p>
                  <p className="mt-0.5 italic">{order.address}</p>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                {order.status === 'pendiente' ? (
                  <button onClick={() => updateOrderStatus(order.id, 'preparando')} className="w-full bg-brand text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-dark transition">
                    Aceptar pedido
                  </button>
                ) : (
                  <button onClick={() => updateOrderStatus(order.id, 'en_camino')} className="w-full bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition flex items-center justify-center gap-1.5">
                    <Check size={16} /> Marcar como Listo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}