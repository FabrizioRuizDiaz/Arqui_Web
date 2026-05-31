import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, Layers, Utensils, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const { pedidos, updateOrderStatus } = useContext(AppContext);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Monitoreo de Operaciones</h1>
        <p className="text-slate-500 text-sm">Vista en tiempo real de la red logística y cocina central.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pedidos Activos</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{pedidos.filter(p => p.status !== 'entregado' && p.status !== 'cancelado').length}</p>
          </div>
          <span className="bg-orange-100 text-brand font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">EN CURSO</span>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-xl flex flex-col justify-between">
          <p className="text-xs font-bold uppercase opacity-80">EFICIENCIA PROMEDIO</p>
          <p className="text-3xl font-black mt-2">94.2%</p>
          <span className="text-xs mt-1 font-medium">📈 +3.2% vs ayer</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase">Cocinas Activas</p>
          <div className="text-xs space-y-1">
            <p className="flex justify-between font-medium"><span>Kitchen Hub Norte</span> <span className="text-green-600 font-bold">ALTA (85%)</span></p>
            <p className="flex justify-between font-medium"><span>Central Dark Kitchen</span> <span className="text-orange-500 font-bold">ÓPTIMA (40%)</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2"><Layers size={18} /> Cola de Pedidos Globales</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                <th className="p-3">ID PEDIDO</th>
                <th className="p-3">CLIENTE</th>
                <th className="p-3">COCINA ASIGNADA</th>
                <th className="p-3">TIEMPO TRANSURRIDO</th>
                <th className="p-3">ESTADO ACTUAL</th>
                <th className="p-3 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {pedidos.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-brand">{order.id}</td>
                  <td className="p-3 text-slate-800">{order.client}</td>
                  <td className="p-3 text-slate-600">{order.restaurant_name}</td>
                  <td className="p-3 text-slate-500">{order.time_elapsed}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'pendiente' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'preparando' ? 'bg-orange-100 text-brand' :
                      order.status === 'en_camino' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      • {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="bg-slate-50 border border-slate-200 text-xs rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-semibold text-slate-700">
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="preparando">Preparando</option>
                      <option value="en_camino">En Camino</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}