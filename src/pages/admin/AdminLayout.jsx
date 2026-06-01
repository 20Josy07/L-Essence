import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/inventario', icon: Package, label: 'Inventario' },
  { to: '/admin/promociones', icon: Tag, label: 'Promociones' },
  { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
];

export default function AdminLayout() {
  const { logout, inventory, orders, promos } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrders = orders.filter(o => o.status === 'Pendiente' || o.status === 'Procesando').length;
  const lowStock = inventory.filter(p => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="min-h-screen flex bg-[#F5F0E8]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-[#1A1714]/6 flex flex-col shadow-sm transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#1A1714]/6">
          <p className="text-base font-bold text-[#1A1714] tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            L'ESSENCE
          </p>
          <p className="text-[9px] tracking-[0.35em] text-[#1A1714]/30 uppercase mt-0.5">Panel Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'gold-gradient text-white shadow-sm'
                    : 'text-[#6B6560] hover:text-[#1A1714] hover:bg-[#F5F0E8]'
                }`}
              >
                <Icon size={16} />
                {label}
                {label === 'Pedidos' && pendingOrders > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#B8955A] text-white text-[9px] font-bold flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[#1A1714]/6 flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6B6560] hover:text-[#1A1714] hover:bg-[#F5F0E8] transition-all"
          >
            <ExternalLink size={13} /> Ver tienda
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6B6560] hover:text-red-500 hover:bg-red-50 transition-all w-full"
          >
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#1A1714]/20 z-30 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#1A1714]/6 px-6 py-3 flex items-center gap-4">
          <button
            className="lg:hidden text-[#6B6560] hover:text-[#1A1714] transition-colors"
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4 ml-auto text-xs text-[#6B6560]">
            <span className="hidden sm:block">{inventory.length} productos</span>
            {lowStock > 0 && <span className="text-amber-500 font-medium">{lowStock} stock bajo</span>}
            {pendingOrders > 0 && (
              <span className="bg-[#B8955A]/10 text-[#B8955A] font-semibold px-2.5 py-1 rounded-full">
                {pendingOrders} pendiente{pendingOrders > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
