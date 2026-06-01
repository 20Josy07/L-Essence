import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const statusOptions = ['Pendiente', 'Procesando', 'En camino', 'Entregado', 'Cancelado'];
const statusColors = {
  'Pendiente':  'bg-amber-50 text-amber-600 border border-amber-100',
  'Procesando': 'bg-blue-50 text-blue-600 border border-blue-100',
  'En camino':  'bg-[#B8955A]/10 text-[#B8955A] border border-[#B8955A]/20',
  'Entregado':  'bg-green-50 text-green-600 border border-green-100',
  'Cancelado':  'bg-red-50 text-red-500 border border-red-100',
};

export default function Orders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>Pedidos</h1>
        <p className="text-sm text-[#6B6560] mt-1">
          {filtered.length} pedidos · Ingresos: <span className="text-[#B8955A] font-semibold">${filtered.reduce((s, o) => s + o.total, 0).toLocaleString()}</span>
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['Todos', ...statusOptions].map(s => {
          const count = s === 'Todos' ? orders.length : orders.filter(o => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all btn-press ${
                filterStatus === s
                  ? 'gold-gradient text-white shadow-sm'
                  : 'bg-white border border-[#1A1714]/10 text-[#6B6560] hover:border-[#1A1714]/25 hover:text-[#1A1714]'
              }`}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6560]" />
        <input
          type="text"
          placeholder="Cliente o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-[#1A1714]/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#6B6560]/50 focus:outline-none focus:border-[#B8955A]/40 shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-[#1A1714]/6 shadow-sm overflow-hidden">
            {/* Header row */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#F5F0E8] flex items-center justify-center">
                  <Package size={15} className="text-[#6B6560]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1714]">{order.customer}</p>
                  <p className="text-[11px] text-[#6B6560]">{order.id} · {order.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#1A1714] hidden sm:block">${order.total}</span>
                <select
                  value={order.status}
                  onChange={e => { e.stopPropagation(); updateOrderStatus(order.id, e.target.value); }}
                  onClick={e => e.stopPropagation()}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full focus:outline-none cursor-pointer border appearance-none ${statusColors[order.status] || ''}`}
                >
                  {statusOptions.map(s => <option key={s} value={s} className="bg-white text-[#1A1714]">{s}</option>)}
                </select>
                <span className="text-[#6B6560]">
                  {expandedId === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </div>
            </div>

            {/* Expanded */}
            <div className={`overflow-hidden transition-all duration-300 ${expandedId === order.id ? 'max-h-64' : 'max-h-0'}`}>
              <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#1A1714]/6 pt-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#1A1714]/35 uppercase font-semibold mb-2.5">Productos</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1.5 border-b border-[#1A1714]/4 last:border-0">
                      <span className="text-[#6B6560]">{item.name} ×{item.qty}</span>
                      <span className="font-semibold text-[#1A1714]">${item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold mt-2 pt-2">
                    <span className="text-[#1A1714]">Total</span>
                    <span className="text-[#B8955A]">${order.total}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#1A1714]/35 uppercase font-semibold mb-2.5">Cliente</p>
                  <p className="text-sm font-semibold text-[#1A1714]">{order.customer}</p>
                  <p className="text-sm text-[#6B6560]">{order.email}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl py-16 text-center border border-[#1A1714]/6">
            <p className="text-sm text-[#6B6560]">No se encontraron pedidos</p>
          </div>
        )}
      </div>
    </div>
  );
}
