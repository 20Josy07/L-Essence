import { Camera, Share2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const links = [
    ['/', 'Inicio'],
    ['/catalogo', 'Catálogo'],
    ['/catalogo?cat=Oriental', 'Oriental'],
    ['/catalogo?cat=Floral', 'Floral'],
  ];

  return (
    <footer className="bg-[#1A1714] text-[#FAF8F5] mt-20 sm:mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-12 sm:py-14">
        <div className="flex flex-col items-center text-center gap-7">
          {/* Logo */}
          <h3 className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
            L'ESSENCE
          </h3>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {links.map(([to, label]) => (
              <Link
                key={label}
                to={to}
                className="text-sm text-white/50 hover:text-white transition-colors link-underline"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200">
              <Camera size={15} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200">
              <Share2 size={15} />
            </a>
            <a href="mailto:info@lessence.com" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200">
              <Mail size={15} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-white/25 mt-2">
            © 2026 L'Essence. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
