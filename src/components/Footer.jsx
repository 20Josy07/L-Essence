import { Camera, Share2, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1A1714] text-[#FAF8F5] mt-24">
      {/* CTA band */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-2">¿Lista para tu fragancia?</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              Encuentra tu aroma perfecto
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="flex items-center gap-3 gold-gradient text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity btn-press shadow-lg whitespace-nowrap"
          >
            Ver colección <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 md:col-span-2">
          <h3 className="text-xl font-bold tracking-widest mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            L'ESSENCE
          </h3>
          <p className="text-sm text-white/45 leading-relaxed max-w-xs">
            Perfumería de lujo donde cada fragancia cuenta una historia. Seleccionamos los mejores aromas del mundo para quienes viven la elegancia.
          </p>
          <div className="flex gap-3 mt-7">
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-200">
              <Camera size={15} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-200">
              <Share2 size={15} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.3em] text-white/35 uppercase mb-5">Navegar</h4>
          <ul className="flex flex-col gap-3">
            {[['/', 'Inicio'], ['/catalogo', 'Catálogo'], ['/catalogo?cat=Oriental', 'Oriental'], ['/catalogo?cat=Floral', 'Floral']].map(([to, label]) => (
              <li key={label}>
                <Link to={to} className="text-sm text-white/40 hover:text-white transition-colors link-underline">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.3em] text-white/35 uppercase mb-5">Contacto</h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-2 text-sm text-white/40"><Phone size={13} className="text-white/25" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2 text-sm text-white/40"><Mail size={13} className="text-white/25" /> info@lessence.com</li>
            <li className="flex items-start gap-2 text-sm text-white/40"><MapPin size={13} className="text-[#B8955A]/50 mt-0.5" /><span>Av. del Lujo 123,<br />Ciudad, País</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/6 py-5 sm:py-6 px-5 sm:px-6 lg:px-10 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[11px] text-white/20">© 2026 L'Essence. Todos los derechos reservados.</p>
        <p className="text-[11px] text-white/15">Privacidad · Términos</p>
      </div>
    </footer>
  );
}
