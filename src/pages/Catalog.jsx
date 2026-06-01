import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import { useReveal } from '../hooks/useReveal';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const { inventory: products } = useAdmin();
  useReveal();

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && categories.includes(cat)) setActiveCategory(cat);
    else setActiveCategory('Todos');
  }, [searchParams]);

  function handleCategory(cat) {
    setActiveCategory(cat);
    if (cat === 'Todos') searchParams.delete('cat');
    else searchParams.set('cat', cat);
    setSearchParams(searchParams);
  }

  const filtered = products
    .filter(p => activeCategory === 'Todos' || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-16 sm:pt-20">
      {/* Page header */}
      <div className="bg-white border-b border-[#1A1714]/6">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14 md:py-16">
          <p className="text-[10px] tracking-[0.4em] text-[#1A1714]/35 uppercase font-medium mb-2 sm:mb-3 animate-fade-up">Perfumería de Lujo</p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1714] animate-fade-up delay-100"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
          >
            {activeCategory === 'Todos' ? 'Toda la colección' : activeCategory}
          </h1>
          <p className="text-sm text-[#6B6560] mt-2 animate-fade-up delay-200">
            {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'} disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-7 sm:py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-7">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6560]" />
            <input
              type="text"
              placeholder="Buscar fragancias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#1A1714]/10 rounded-full pl-9 pr-9 py-2.5 text-sm text-[#1A1714] placeholder-[#6B6560]/60 focus:outline-none focus:border-[#B8955A]/40 transition-colors shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6560]/50 hover:text-[#1A1714] transition-colors">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal size={14} className="text-[#6B6560] flex-shrink-0" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-[#1A1714]/10 rounded-full px-4 py-2.5 text-sm text-[#6B6560] focus:outline-none transition-colors shadow-sm appearance-none pr-8 cursor-pointer"
            >
              <option value="default">Por defecto</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name">Nombre A–Z</option>
            </select>
          </div>
        </div>

        {/* Category pills — horizontal scroll on mobile */}
        <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-250 btn-press ${
                activeCategory === cat
                  ? 'gold-gradient text-white shadow-md'
                  : 'bg-white border border-[#1A1714]/10 text-[#6B6560] hover:border-[#1A1714]/25 hover:text-[#1A1714] shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto mb-4">
              <Search size={22} className="text-[#1A1714]/20" />
            </div>
            <p className="text-base font-medium text-[#1A1714] mb-1">Sin resultados</p>
            <p className="text-sm text-[#6B6560] mb-6">No encontramos fragancias con esos criterios</p>
            <button onClick={() => { setSearch(''); handleCategory('Todos'); }} className="text-sm font-medium text-[#1A1714]/50 hover:text-[#1A1714] transition-colors">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
