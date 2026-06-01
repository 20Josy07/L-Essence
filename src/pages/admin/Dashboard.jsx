import { Package, ShoppingCart, Tag, DollarSign, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

const statusColors = {
  'Pendiente':  'bg-amber-50 text-amber-600 border border-amber-100',
  'Procesando': 'bg-blue-50 text-blue-600 border border-blue-100',
  'En camino':  'bg-[#B8955A]/10 text-[#B8955A] border border-[#B8955A]/20',
  'Entregado':  'bg-green-50 text-green-600 border border-green-100',
  'Cancelado':  'bg-red-50 text-red-500 border border-red-100',
};

export default function Dashboard() {
  const { inventory, orders, promos } = useAdmin();

  const revenue = orders.filter(o => o.status === 'Entregado').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pendiente' || o.status === 'Procesando');
  const lowStock = inventory.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStock = inventory.filter(p => p.stock === 0);

  const stats = [
    { label: 'Productos', value: inventory.length, icon: Package, color: 'text-[#6B6560]', bg: 'bg-[#F5F0E8]', link: '/admin/inventario' },
    { label: 'Pedidos', value: orders.length, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50', link: '/admin/pedidos' },
    { label: 'Ingresos', value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50', link: '/admin/pedidos' },
    { label: 'Promos activas', value: promos.filter(p => p.active).length, icon: Tag, color: 'text-purple-500', bg: 'bg-purple-50', link: '/admin/promociones' },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>Dashboard</h1>
        <p className="text-sm text-[#6B6560] mt-1">Resumen general</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link
            key={label}
            to={link}
            className="bg-white rounded-2xl p-5 border border-[#1A1714]/6 shadow-sm hover:shadow-md transition-shadow card-lift"
          >
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#1A1714]">{value}</p>
            <p className="text-xs text-[#6B6560] mt-0.5 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Alerts */}
        {(lowStock.length > 0 || outOfStock.length > 0) && (
          <div className="bg-white rounded-2xl p-5 border border-[#1A1714]/6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertTriangle size={14} className="text-amber-500" />
              </div>
              <h2 className="text-sm font-semibold text-[#1A1714]">Alertas de inventario</h2>
            </div>
            <div className="flex flex-col gap-3">
              {outOfStock.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-sm text-[#1A1714]">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">Agotado</span>
                </div>
              ))}
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-sm text-[#1A1714]">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">{p.stock} uds.</span>
                </div>
              ))}
            </div>
            <Link to="/admin/inventario" className="flex items-center gap-1 mt-4 text-xs font-medium text-[#6B6560] hover:text-[#1A1714] transition-colors">
              Gestionar inventario <ArrowRight size={11} />
            </Link>
          </div>
        )}

        {/* Recent orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#1A1714]/6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#B8955A]/10 flex items-center justify-center">
              <ShoppingCart size={14} className="text-[#6B6560]" />
            </div>
            <h2 className="text-sm font-semibold text-[#1A1714]">Pedidos recientes</h2>
          </div>
          <div className="flex flex-col gap-3">
            {orders.slice(0, 4).map(order => (
              <div key={order.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-[#1A1714]">{order.customer}</p>
                  <p className="text-[11px] text-[#6B6560]">{order.id} · {order.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1A1714]">${order.total}</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-[#F5F0E8] text-[#6B6560]'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/pedidos" className="flex items-center gap-1 mt-4 text-xs font-medium text-[#6B6560] hover:text-[#1A1714] transition-colors">
            Ver todos los pedidos <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
