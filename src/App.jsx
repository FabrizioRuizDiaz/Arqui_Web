import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import ClienteNuevoPedido from './views/ClienteNuevoPedido';
import ClienteTracking from './views/ClienteTracking';
import AdminDashboard from './views/AdminDashboard';
import CocinaMonitor from './views/CocinaMonitor';
import { ShoppingCart, Compass, ClipboardList, ChefHat } from 'lucide-react';

function NavigationWrapper() {
  const { activeView, setActiveView } = useContext(AppContext);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar de Control MVP */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-brand">OrderFlow <span className="text-white font-light text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700">MVP Front</span></span>
          </div>
          <nav className="flex gap-2 text-xs font-bold">
            <button onClick={() => setActiveView('cliente-nuevo')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${activeView === 'cliente-nuevo' ? 'bg-brand text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
              <ShoppingCart size={14} /> Cliente: Comprar
            </button>
            <button onClick={() => setActiveView('cliente-tracking')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${activeView === 'cliente-tracking' ? 'bg-brand text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
              <Compass size={14} /> Cliente: Tracking
            </button>
            <button onClick={() => setActiveView('admin')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${activeView === 'admin' ? 'bg-brand text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
              <ClipboardList size={14} /> Admin Dashboard
            </button>
            <button onClick={() => setActiveView('cocina')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${activeView === 'cocina' ? 'bg-brand text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
              <ChefHat size={14} /> Cocina Monitor
            </button>
          </nav>
        </div>
      </header>

      {/* Renderizado de Vistas Dinámicas */}
      <main className="flex-1 bg-slate-50 py-6">
        {activeView === 'cliente-nuevo' && <ClienteNuevoPedido />}
        {activeView === 'cliente-tracking' && <ClienteTracking />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'cocina' && <CocinaMonitor />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
        <NavigationWrapper />
      </CartProvider>
    </AppProvider>
  );
}