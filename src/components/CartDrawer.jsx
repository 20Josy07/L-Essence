import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer({ open, onClose }) {
  const { items, total, dispatch } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          open ? 'bg-[#1A1714]/20 backdrop-blur-sm pointer-events-auto' : 'bg-transparent pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-50 bg-[#FAF8F5] flex flex-col transition-transform duration-500 cubic-bezier(0.16,1,0.3,1) shadow-2xl ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#1A1714]/6">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>
              Mi selección
            </h2>
            <p className="text-[11px] text-[#6B6560] mt-0.5">{items.length} {items.length === 1 ? 'fragancia' : 'fragancias'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1A1714]/5 hover:bg-[#1A1714]/10 text-[#1A1714]/60 hover:text-[#1A1714] transition-all duration-200"
          >
            <X size={14} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F5F0E8] flex items-center justify-center">
              <ShoppingBag size={28} strokeWidth={1.2} className="text-[#B8955A]/60" />
            </div>
            <div>
              <p className="text-base font-medium text-[#1A1714] mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-[#6B6560]">Explora nuestra colección y encuentra tu fragancia perfecta</p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#B8955A] hover:text-[#8B6B3D] transition-colors"
            >
              Ver catálogo <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-5">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="flex gap-4 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-[#F5F0E8]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A1714] truncate">{item.name}</h3>
                        <p className="text-[11px] text-[#6B6560] mt-0.5">{item.size}</p>
                      </div>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                        className="text-[#1A1714]/20 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 border border-[#1A1714]/10 rounded-full px-1 py-0.5">
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.quantity - 1 } })}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#1A1714]/5 transition-colors text-[#6B6560]"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-semibold w-5 text-center text-[#1A1714]">{item.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.quantity + 1 } })}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#1A1714]/5 transition-colors text-[#6B6560]"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#B8955A]">${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-7 py-6 border-t border-[#1A1714]/6 bg-white">
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm text-[#6B6560]">Total estimado</span>
                <span className="text-xl font-bold text-[#1A1714]">${total.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full gold-gradient text-white py-4 rounded-xl text-sm font-semibold tracking-wide hover:opacity-95 transition-opacity btn-press shadow-md"
              >
                Finalizar compra <ArrowRight size={15} />
              </Link>
              <button
                onClick={() => dispatch({ type: 'CLEAR' })}
                className="block w-full text-center mt-3 text-xs text-[#1A1714]/30 hover:text-[#1A1714]/60 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
