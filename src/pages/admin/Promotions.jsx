import { useState } from 'react';
import { Plus, Trash2, Power, X, Tag } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const emptyPromo = { name: '', code: '', discount: '', type: 'percent', active: true, expiry: '' };

export default function Promotions() {
  const { promos, addPromo, togglePromo, deletePromo } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPromo);

  function handleSave() {
    if (!form.name || !form.code || !form.discount) return;
    addPromo({ ...form, discount: Number(form.discount) });
    setShowForm(false);
    setForm(emptyPromo);
  }

  const fieldCls = 'w-full bg-[#FAF8F5] border border-[#1A1714]/10 rounded-xl px-3 py-2.5 text-sm text-[#1A1714] focus:outline-none focus:border-[#B8955A]/50 focus:ring-2 focus:ring-[#B8955A]/10 transition-all';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>Promociones</h1>
          <p className="text-sm text-[#6B6560] mt-1">{promos.filter(p => p.active).length} activas de {promos.length}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 gold-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-md"
        >
          <Plus size={15} /> Nueva promoción
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {promos.map(promo => (
          <div
            key={promo.id}
            className={`bg-white rounded-2xl p-5 border border-[#1A1714]/6 shadow-sm transition-all duration-300 ${!promo.active ? 'opacity-50 grayscale-[30%]' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-[#1A1714]">{promo.name}</p>
                {promo.expiry && <p className="text-[11px] text-[#6B6560] mt-0.5">Expira: {promo.expiry}</p>}
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${promo.active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-[#F5F0E8] text-[#6B6560]'}`}>
                {promo.active ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="bg-[#F5F0E8] rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-[#1A1714]/35 uppercase font-semibold mb-0.5">Código</p>
                <p className="text-lg font-bold text-[#1A1714] tracking-widest">{promo.code}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#B8955A]">
                  {promo.type === 'percent' ? `${promo.discount}%` : `$${promo.discount}`}
                </p>
                <p className="text-[10px] text-[#6B6560]">{promo.type === 'percent' ? 'descuento' : 'descuento fijo'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => togglePromo(promo.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  promo.active
                    ? 'bg-[#F5F0E8] text-[#6B6560] hover:bg-red-50 hover:text-red-500'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                <Power size={12} /> {promo.active ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => deletePromo(promo.id)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#6B6560] hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#1A1714]/30 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1714]/6">
              <h2 className="text-base font-bold text-[#1A1714]">Nueva promoción</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#6B6560] hover:bg-[#E8E2D9] transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Nombre</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={fieldCls} placeholder="Ej: Oferta de verano" />
              </div>
              <div>
                <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Código</label>
                <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className={fieldCls + ' uppercase tracking-widest font-bold'} placeholder="VERANO20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Tipo</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={fieldCls}>
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Fijo ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Valor</label>
                  <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} className={fieldCls} placeholder="20" />
                </div>
              </div>
              <div>
                <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Fecha de expiración</label>
                <input type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} className={fieldCls} />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-[#1A1714]/10 rounded-xl text-sm text-[#6B6560] hover:bg-[#F5F0E8] transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 gold-gradient text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-md">
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
