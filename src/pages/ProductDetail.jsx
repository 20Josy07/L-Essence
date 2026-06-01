import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, ChevronDown, ChevronUp, Heart, Share2, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { useReveal } from '../hooks/useReveal';

export default function ProductDetail({ onCartOpen }) {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { inventory } = useAdmin();
  const [qty, setQty] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  useReveal();

  const product = inventory.find(p => String(p.id) === id);
  const related = inventory.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 bg-[#FAF8F5] px-5">
        <p className="text-[#6B6560]">Producto no encontrado</p>
        <Link to="/catalogo" className="text-sm font-medium text-[#1A1714]/50 hover:text-[#1A1714] transition-colors">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  function handleAdd() {
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD_ITEM', payload: product });
    setAdded(true);
    setTimeout(() => { setAdded(false); onCartOpen(); }, 400);
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-6 sm:py-10">

        {/* Breadcrumb */}
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-xs text-[#6B6560] hover:text-[#1A1714] transition-colors font-medium mb-6 sm:mb-10 group"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 duration-200" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">

          {/* Image */}
          <div className="animate-scale-in">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F5F0E8] aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {discount && (
                <div className="absolute top-4 left-4 gold-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  -{discount}%
                </div>
              )}
              <button
                onClick={() => setLiked(v => !v)}
                className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform btn-press"
              >
                <Heart size={15} className={liked ? 'fill-red-400 text-red-400' : 'text-[#1A1714]/40'} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col animate-fade-up">
            <p className="text-[10px] tracking-[0.4em] text-[#1A1714]/35 uppercase font-medium mb-2">{product.category} · {product.size}</p>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1714] mb-3 leading-tight"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <div className="flex gap-0.5">
                {Array(5).fill(0).map((_, i) => <Star key={i} size={12} className="text-[#B8955A] fill-[#B8955A]" />)}
              </div>
              <span className="text-xs text-[#6B6560]">4.9 · 32 reseñas</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[#1A1714]/6">
              <span className="text-3xl sm:text-4xl font-bold text-[#1A1714]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-base sm:text-lg text-[#6B6560] line-through">${product.originalPrice}</span>
              )}
              {discount && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-sm text-[#6B6560] leading-relaxed mb-5">{product.description}</p>

            {/* Notes accordion */}
            <button
              onClick={() => setNotesOpen(v => !v)}
              className="flex items-center justify-between w-full bg-[#F5F0E8] rounded-xl px-4 py-3 sm:py-3.5 mb-2 text-sm font-medium text-[#1A1714] hover:bg-[#EDE8DF] transition-colors"
            >
              <span>Pirámide olfativa</span>
              {notesOpen ? <ChevronUp size={15} className="text-[#1A1714]/40" /> : <ChevronDown size={15} className="text-[#1A1714]/40" />}
            </button>
            <div className={`overflow-hidden transition-all duration-400 ease-in-out ${notesOpen ? 'max-h-48 mb-5' : 'max-h-0 mb-2'}`}>
              <div className="bg-white rounded-b-xl border border-[#1A1714]/6 px-4 py-4 grid grid-cols-3 gap-3">
                {[['Salida', product.notes?.top], ['Corazón', product.notes?.middle], ['Fondo', product.notes?.base]].map(([label, notes]) => (
                  <div key={label}>
                    <p className="text-[9px] tracking-[0.3em] text-[#1A1714]/35 uppercase font-semibold mb-2">{label}</p>
                    {(notes || []).map(n => (
                      <p key={n} className="text-xs text-[#6B6560] mb-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#1A1714]/20 flex-shrink-0" /> {n}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {product.stock > 0 ? (
              <>
                {/* Qty + CTA */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <span className="text-xs font-medium text-[#6B6560] uppercase tracking-wide hidden sm:block">Cantidad</span>
                  <div className="flex items-center border border-[#1A1714]/10 rounded-full overflow-hidden bg-white shadow-sm">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-[#6B6560] hover:bg-[#F5F0E8] transition-colors text-lg">−</button>
                    <span className="w-9 text-center text-sm font-semibold text-[#1A1714]">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-[#6B6560] hover:bg-[#F5F0E8] transition-colors text-lg">+</button>
                  </div>
                  <span className="text-xs text-[#6B6560]/50">{product.stock} disponibles</span>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={handleAdd}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 btn-press shadow-md ${
                      added ? 'bg-green-500 text-white' : 'gold-gradient text-white hover:opacity-90'
                    }`}
                  >
                    {added
                      ? <><Check size={15} /> Agregado</>
                      : <><ShoppingBag size={15} /> Agregar — ${(product.price * qty).toFixed(0)}</>
                    }
                  </button>
                  <button className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-[#1A1714]/10 flex items-center justify-center text-[#6B6560] hover:border-[#1A1714]/25 transition-all btn-press flex-shrink-0">
                    <Share2 size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-[#F5F0E8] rounded-2xl py-5 text-center text-sm text-[#6B6560] font-medium">
                Momentáneamente agotado
              </div>
            )}

            {/* Guarantees */}
            <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-[#1A1714]/6 grid grid-cols-3 gap-3 sm:gap-4">
              {[['Envío', 'Gratis +$100'], ['Devolución', '30 días'], ['Autenticidad', '100% original']].map(([label, val]) => (
                <div key={label} className="text-center">
                  <p className="text-[9px] tracking-[0.2em] text-[#1A1714]/35 uppercase font-semibold mb-1">{label}</p>
                  <p className="text-xs text-[#6B6560]">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1714] mb-6 sm:mb-8 reveal" style={{ fontFamily: 'Georgia, serif' }}>
              También te podría gustar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
