import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, index = 0 }) {
  const { dispatch } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    dispatch({ type: 'ADD_ITEM', payload: product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="surface rounded-2xl overflow-hidden card-lift reveal group"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <Link to={`/producto/${product.id}`} className="relative block overflow-hidden img-zoom bg-[#F5F0E8] aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-[#1A1714]/0 group-hover:bg-[#1A1714]/10 transition-all duration-400 flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100">
          <Link
            to={`/producto/${product.id}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#1A1714] px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide hover:bg-white transition-colors shadow-sm"
          >
            <Eye size={12} /> Ver detalle
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="gold-gradient text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-[#1A1714]/70 text-white/80 text-[9px] px-2 py-0.5 rounded-full tracking-wider">
              Agotado
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setLiked(v => !v); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
        >
          <Heart size={12} className={liked ? 'fill-red-400 text-red-400' : 'text-[#1A1714]/40'} />
        </button>
      </Link>

      {/* Info */}
      <div className="px-4 pt-4 pb-5">
        <p className="text-[9px] tracking-[0.3em] text-[#1A1714]/35 uppercase font-medium mb-1">{product.category}</p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="text-[15px] font-semibold text-[#1A1714] hover:text-[#B8955A] transition-colors leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-[#6B6560] mt-0.5 mb-4">{product.size}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#1A1714]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#6B6560] line-through">${product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 btn-press ${
              added
                ? 'bg-green-50 text-green-600 border border-green-200'
                : product.stock === 0
                  ? 'bg-[#1A1714]/5 text-[#1A1714]/25 cursor-not-allowed'
                  : 'bg-[#1A1714] text-white hover:bg-[#B8955A]'
            }`}
          >
            {added ? (
              <><span>✓</span> Agregado</>
            ) : (
              <><ShoppingBag size={11} /> Agregar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
