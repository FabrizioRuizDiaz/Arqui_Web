import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, Phone } from 'lucide-react';

export default function ClienteTracking() {
  const { pedidos } = useContext(AppContext);
  // Tomamos el último pedido creado para el tracking del cliente
  const currentOrder = pedidos[0] || null;

  if (!currentOrder) {
    return <div className="text-center p-8 text-slate-500">No hay ningún pedido activo en este momento.</div>;
  }

  const estados = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado'];
  const indexActual = estados.indexOf(currentOrder.status);

  const getLabelEstado = (est) => {
    if (est === 'pendiente') return 'Creado';
    if (est === 'confirmado') return 'Buscando cocina';
    if (est === 'preparando') return 'Asignado y En preparación';
    if (est === 'en_camino') return 'En camino a tu destino';
    if (est === 'entregado') return 'Entregado con éxito';
    return est;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Encabezado principal */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ESTADO ACTUAL</span>
          <h1 className="text-3xl font-extrabold text-brand capitalize mt-1">En {currentOrder.status}</h1>
          <p className="text-sm text-slate-500 mt-1">Pedido #{currentOrder.id} • Tiempo en estado: 4 min</p>
        </div>
        <div className="bg-amber-500 text-white px-4 py-3 rounded-xl text-center min-w-[110px]">
          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-85">ENTREGA</span>
          <span className="text-xl font-black">12:45</span>
        </div>
      </div>

      {/* Cuerpo de Seguimiento e Información de la Cocina */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline del Estado */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Línea de Tiempo del Pedido</h2>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
            {estados.map((est, index) => {
              const completado = index <= indexActual;
              const esActual = index === indexActual;
              return (
                <div key={est} className="relative flex items-start ml-6">
                  <div className="absolute -left-[35px] mt-0.5 bg-white rounded-full">
                    {completado ? (
                      <CheckCircle2 className="text-green-600 fill-green-50" size={22} />
                    ) : esActual ? (
                      <Clock className="text-brand fill-orange-50 animate-pulse" size={22} />
                    ) : (
                      <Circle className="text-slate-300 bg-white" size={22} />
                    )}
                  </div>
                  <div className={`${esActual ? 'text-slate-900 font-bold' : 'text-slate-500'} text-sm`}>
                    <p className="capitalize font-semibold">{getLabelEstado(est)}</p>
                    {esActual && <span className="text-xs text-brand block mt-0.5 font-medium">Actualizado hace un momento</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen del Pedido y Cocina Asignada */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">COCINA ASIGNADA</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-base">{currentOrder.restaurant_name}</p>
                <p className="text-xs text-slate-500 mt-0.5">⭐ 4.8 • 1.2km de distancia</p>
              </div>
              <button className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200">
                <Phone size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Resumen del pedido</h3>
            <div className="space-y-2">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-600">
                  <span><strong className="text-slate-800">{item.quantity}x</strong> {item.name}</span>
                  <span className="font-semibold text-slate-800">${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
              <span>Total (IVA incl.)</span>
              <span className="text-brand text-base">${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}