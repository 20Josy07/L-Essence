import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Package } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { categories } from '../../data/products';

const emptyProduct = { name: '', brand: "L'Essence", category: 'Floral', price: '', originalPrice: '', stock: '', size: '100ml', description: '', image: '', featured: false, promo: false };

function stockBadge(stock) {
  if (stock === 0) return 'bg-red-50 text-red-500 border border-red-100';
  if (stock <= 10) return 'bg-amber-50 text-amber-600 border border-amber-100';
  return 'bg-green-50 text-green-600 border border-green-100';
}

export default function Inventory() {
  const { inventory, updateProduct, addProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = inventory.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  function startEdit(product) { setEditId(product.id); setForm({ ...product }); setShowForm(true); }
  function startAdd() { setEditId(null); setForm(emptyProduct); setShowForm(true); }
  function handleSave() {
    const data = { ...form, price: Number(form.price), stock: Number(form.stock), originalPrice: form.originalPrice ? Number(form.originalPrice) : null };
    if (editId) updateProduct(editId, data); else addProduct(data);
    setShowForm(false);
  }

  const fieldCls = 'w-full bg-[#FAF8F5] border border-[#1A1714]/10 rounded-xl px-3 py-2.5 text-sm text-[#1A1714] focus:outline-none focus:border-[#B8955A]/50 focus:ring-2 focus:ring-[#B8955A]/10 transition-all';

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>Inventario</h1>
          <p className="text-sm text-[#6B6560] mt-1">{inventory.length} productos</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 gold-gradient text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-md"
        >
          <Plus size={15} /> Nuevo producto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6560]" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-[#1A1714]/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-[#1A1714] placeholder-[#6B6560]/50 focus:outline-none focus:border-[#B8955A]/40 shadow-sm"
        />
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-[#1A1714]/6 shadow-sm p-4 flex items-center gap-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1714] truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-[#1A1714]">${product.price}</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${stockBadge(product.stock)}`}>
                  {product.stock === 0 ? 'Agotado' : `${product.stock}`}
                </span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => startEdit(product)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F5F0E8] transition-all">
                <Edit2 size={13} />
              </button>
              {confirmDelete === product.id ? (
                <>
                  <button onClick={() => { deleteProduct(product.id); setConfirmDelete(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 bg-red-50"><Check size={13} /></button>
                  <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F5F0E8]"><X size={13} /></button>
                </>
              ) : (
                <button onClick={() => setConfirmDelete(product.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-red-50 hover:text-red-400 transition-all">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#1A1714]/6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1A1714]/6 bg-[#FAF8F5]">
                {['Producto', 'Categoría', 'Precio', 'Stock', 'Destacado', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.2em] text-[#6B6560] uppercase font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1714]/4">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-xl flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#1A1714]">{product.name}</p>
                        <p className="text-[11px] text-[#6B6560]">{product.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-[#6B6560] bg-[#F5F0E8] px-2 py-0.5 rounded-full">{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-[#1A1714]">${product.price}</span>
                    {product.originalPrice && <span className="ml-1.5 text-[11px] text-[#6B6560] line-through">${product.originalPrice}</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stockBadge(product.stock)}`}>
                      {product.stock === 0 ? 'Agotado' : `${product.stock} uds.`}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.featured ? 'bg-[#B8955A]/10 text-[#B8955A] border border-[#B8955A]/20' : 'bg-[#F5F0E8] text-[#6B6560]'}`}>
                      {product.featured ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(product)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F5F0E8] hover:text-[#1A1714] transition-all">
                        <Edit2 size={13} />
                      </button>
                      {confirmDelete === product.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => { deleteProduct(product.id); setConfirmDelete(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                            <Check size={13} />
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F5F0E8] transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(product.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-red-50 hover:text-red-400 transition-all">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#1A1714]/30 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#1A1714]/6">
              <h2 className="text-base font-bold text-[#1A1714]">{editId ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#6B6560] hover:bg-[#E8E2D9] transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['name','Nombre','text'],['brand','Marca','text'],['price','Precio ($)','number'],['originalPrice','Precio original ($)','number'],['stock','Stock','number'],['size','Tamaño (ej: 100ml)','text']].map(([field, label, type]) => (
                <div key={field}>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">{label}</label>
                  <input type={type} value={form[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className={fieldCls} />
                </div>
              ))}
              <div>
                <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Categoría</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={fieldCls}>
                  {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-[#B8955A] rounded" />
                  <span className="text-sm text-[#1A1714]">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.promo} onChange={e => setForm(f => ({ ...f, promo: e.target.checked }))} className="w-4 h-4 accent-[#B8955A] rounded" />
                  <span className="text-sm text-[#1A1714]">En promo</span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">URL de imagen</label>
                <input type="text" value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={fieldCls} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Descripción</label>
                <textarea rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={fieldCls + ' resize-none'} />
              </div>
            </div>
            <div className="px-7 pb-7 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-[#1A1714]/10 rounded-xl text-sm text-[#6B6560] hover:bg-[#F5F0E8] transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} className="gold-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-md">
                {editId ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
