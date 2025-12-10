import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { RoutePlanner } from './components/RoutePlanner';
import { Login } from './components/Login';
import { LayoutDashboard, Map, Settings, Users, LogOut, Fish } from 'lucide-react';

// View State Management
type View = 'dashboard' | 'planner' | 'customers' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
        currentView === view
          ? 'bg-blue-800 text-cyan-400 border-r-4 border-cyan-400'
          : 'text-gray-300 hover:bg-blue-800/50 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className={`${!isSidebarOpen && 'hidden'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 flex flex-col transition-all duration-300 shadow-xl z-20`}
      >
        <div className="h-20 flex items-center justify-center border-b border-blue-800">
          <div className="flex items-center gap-2 font-bold text-white">
            <Fish className="text-cyan-400" size={28} />
            {isSidebarOpen && <span className="tracking-wide">HIBRYDA</span>}
          </div>
        </div>

        <nav className="flex-1 mt-6 space-y-1">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Visão Geral" />
          <NavItem view="planner" icon={Map} label="Planejador de Rotas" />
          <NavItem view="customers" icon={Users} label="Clientes" />
          <NavItem view="settings" icon={Settings} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-2"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>
             <h1 className="text-lg font-semibold text-gray-700">
                {currentView === 'dashboard' && 'Visão Geral'}
                {currentView === 'planner' && 'Planejamento de Rotas'}
                {currentView === 'customers' && 'Gestão de Clientes'}
                {currentView === 'settings' && 'Configurações do Sistema'}
             </h1>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-800">Admin Silva</div>
                  <div className="text-xs text-gray-500">Gerente Logístico</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold border-2 border-white shadow-sm">
                  AS
              </div>
           </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50 relative">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'planner' && <RoutePlanner />}
            
            {/* Placeholder views for non-implemented sections */}
            {(currentView === 'customers' || currentView === 'settings') && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Settings size={48} className="mb-4 opacity-50" />
                    <p className="text-lg">Módulo em desenvolvimento</p>
                    <p className="text-sm">Disponível na versão completa conectada ao Docker/Backend.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
