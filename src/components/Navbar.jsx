import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartOpen }) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/catalogo?cat=Oriental', label: 'Oriental' },
    { to: '/catalogo?cat=Floral', label: 'Floral' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent py-5'
          : 'blur-nav border-b border-[#1A1714]/8 py-3 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none group">
          <span
            className={`text-xl font-semibold tracking-[0.15em] transition-colors duration-500 ${
              transparent ? 'text-white group-hover:text-[#D4AF7A]' : 'text-[#1A1714] group-hover:text-[#B8955A]'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            L'ESSENCE
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className={`link-underline text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 font-medium ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : 'text-[#6B6560] hover:text-[#1A1714]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className={`p-2 transition-colors ${transparent ? 'text-white/30 hover:text-white/60' : 'text-[#1A1714]/20 hover:text-[#1A1714]/40'}`}
            title="Admin"
          >
            <Shield size={14} />
          </Link>

          <button
            onClick={onCartOpen}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 btn-press ${
              transparent
                ? 'border-white/25 hover:border-white/50 hover:bg-white/10 text-white'
                : 'border-[#1A1714]/12 hover:border-[#1A1714]/25 hover:bg-[#1A1714]/4 text-[#1A1714]'
            }`}
          >
            <ShoppingBag size={15} />
            <span className="text-[11px] tracking-widest hidden sm:block">
              Carrito
            </span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gold-gradient text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>

          <button
            className={`md:hidden p-2 transition-colors ${transparent ? 'text-white/70 hover:text-white' : 'text-[#1A1714]/60 hover:text-[#1A1714]'}`}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="blur-nav border-t border-[#1A1714]/8 px-6 py-6 flex flex-col gap-5">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[11px] tracking-[0.25em] uppercase text-[#6B6560] hover:text-[#1A1714] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
